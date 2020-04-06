import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
import Modal from "../../../../_components/modal";
import HeaderInput from '../../../../_components/project-table/header-input';
// import Input from '../../../../_components/input';
import NewRowCreate from '../../../../_components/project-table/new-row-create';
import NewRowInput from '../../../../_components/project-table/new-row-input';
import NewRowSelect from '../../../../_components/project-table/new-row-select';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelectionRow from '../../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import _ from 'lodash';

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function getDateFormat(myLocale) {
    let tempDateFormat = ''
    myLocale.formatToParts().map(function (element) {
        switch(element.type) {
            case 'month': 
                tempDateFormat = tempDateFormat + 'MM';
                break;
            case 'literal': 
                tempDateFormat = tempDateFormat + element.value;
                break;
            case 'day': 
                tempDateFormat = tempDateFormat + 'DD';
                break;
            case 'year': 
                tempDateFormat = tempDateFormat + 'YYYY';
                break;
        }
    });
    return tempDateFormat;
}

function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
}

function resolve(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

function sortCustom(array, headersForShow, sort) {
    let found = headersForShow.find(element => element._id === sort.name);
    if (!found) {
        return array;
    } else {
        let tempArray = array.slice(0);
        let fieldName = found.fields.name
        switch(found.fields.type) {
            case 'String':
                if (sort.isAscending) {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = !_.isUndefined(fieldA.fieldValue) && !_.isNull(fieldA.fieldValue) ? fieldA.fieldValue.toUpperCase() : '';
                            let valueB = !_.isUndefined(fieldB.fieldValue) && !_.isNull(fieldB.fieldValue) ?  fieldB.fieldValue.toUpperCase() : '';
                            if (valueA < valueB) {
                                return -1;
                            } else if (valueA > valueB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                } else {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = !_.isUndefined(fieldA.fieldValue) && !_.isNull(fieldA.fieldValue) ? fieldA.fieldValue.toUpperCase() : '';
                            let valueB = !_.isUndefined(fieldB.fieldValue) && !_.isNull(fieldB.fieldValue) ?  fieldB.fieldValue.toUpperCase() : '';
                            if (valueA > valueB) {
                                return -1;
                            } else if (valueA < valueB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                }
            case 'Number':
                if (sort.isAscending) {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = fieldA.fieldValue || 0;
                            let valueB = fieldB.fieldValue || 0;
                            return valueA - valueB;
                        }
                    });
                } else {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = fieldA.fieldValue || 0;
                            let valueB = fieldB.fieldValue || 0;
                            return valueB - valueA;
                        }
                    });
                }
            default: return array;
        }
    }   
}



function doesMatch(search, value, type, isEqual) {
    
    if (!search) {
        return true;
    } else if (!value && search != 'any' && search != 'false' && search != '-1' && String(search).toUpperCase() != '=BLANK') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, value);
            case 'String':
                if (String(search).toUpperCase() === '=BLANK') {
                    return !value;
                } else if (String(search).toUpperCase() === '=NOTBLANK') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual(String(value).toUpperCase(), String(search).toUpperCase());
                } else {
                    return String(value).toUpperCase().includes(String(search).toUpperCase());
                }
            case 'Date':
                if (String(search).toUpperCase() === '=BLANK') {
                    return !value;
                } else if (String(search).toUpperCase() === '=NOTBLANK') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual(TypeToString(value, 'date', getDateFormat(myLocale)), search);
                } else {
                    return TypeToString(value, 'date', getDateFormat(myLocale)).includes(search);
                }
            case 'Number':
                if (search === '-1') {
                    return !value;
                } else if (search === '-2') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual( Intl.NumberFormat().format(value).toString(), Intl.NumberFormat().format(search).toString());
                } else {
                    return Intl.NumberFormat().format(value).toString().includes(Intl.NumberFormat().format(search).toString());
                }
            case 'Boolean':
                if(search == 'any') {
                    return true; //any or equal
                } else if (search == 'true' && !!value) {
                    return true; //true
                } else if (search == 'false' && !value) {
                    return true; //true
                }else {
                    return false;
                }
            case 'Select':
                if(search == 'any' || _.isEqual(search, value)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
    }
}

function getHeaders(fieldnames, screenId, forWhat) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        let tempArray = fieldnames.items.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element[forWhat]); 
        });
        if (!tempArray) {
            return [];
        } else {
            return tempArray.sort(function(a,b) {
                return a[forWhat] - b[forWhat];
            });
        }
    } else {
        return [];
    }
}


function getBodys(suppliers, headersForShow){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    
    let i = 1;
    if (!_.isUndefined(suppliers) && suppliers.hasOwnProperty('items') && !_.isEmpty(suppliers.items)) {
        suppliers.items.map(supplier => {
            arrayRow = [];
            screenHeaders.map(screenHeader => {
                switch(screenHeader.fields.fromTbl) {
                    case 'supplier':
                        arrayRow.push({
                            collection: 'supplier',
                            objectId: supplier._id,
                            fieldName: screenHeader.fields.name,
                            fieldValue: supplier[screenHeader.fields.name],
                            disabled: screenHeader.edit,
                            align: screenHeader.align,
                            fieldType: getInputType(screenHeader.fields.type),
                        });
                        break;
                    default: arrayRow.push({
                        collection: 'virtual',
                            objectId: '0',
                            fieldName: screenHeader.fields.name,
                            fieldValue: '',
                            disabled: screenHeader.edit,
                            align: screenHeader.align,
                            fieldType: getInputType(screenHeader.fields.type),
                    });
                }
            });
            objectRow  = {
                _id: supplier._id,
                // tablesId: {
                //     supplierId: ,
                // },
                fields: arrayRow
            };
            arrayBody.push(objectRow);
            i++;
        });
        return arrayBody;
    } else {
        return [];
    }
}

class Suppliers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //overview
            headersForShow: [],
            bodysForShow: [],
            screenId: '5cd2b644fd333616dc360b69',
            unlocked: false,
            screen: 'supplier',
            // selectedIds: [],
            //project-table
            header: {},
            sort: {
                name: '',
                isAscending: true,
            },
            selectedRows: [],
            selectAllRows: false,
            isEqual: false,
            deleting: false,
            //create new row
            newRow: false,
            supplier: {},
            newRowFocus:false,
            creatingNewRow: false,
            newRowColor: 'inherit',
        }
        // this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.handleChangeRow = this.handleChangeRow.bind(this);

        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        
        this.generateHeader = this.generateHeader.bind(this);
        this.generateNewRow = this.generateNewRow.bind(this);
        this.generateBody = this.generateBody.bind(this);

        this.cerateNewRow = this.cerateNewRow.bind(this);
        this.onFocusRow = this.onFocusRow.bind(this);
        this.onBlurRow = this.onBlurRow.bind(this);
        
        this.toggleNewRow = this.toggleNewRow.bind(this);
        
        this.filterName = this.filterName.bind(this);
    };
    
    componentDidMount() {
        const { fieldnames, suppliers, refreshFieldnames, refreshSuppliers } = this.props;
        const { screenId, headersForShow } = this.state;
        //refreshStore
        refreshFieldnames;
        refreshSuppliers;

        this.setState({
            headersForShow: getHeaders(fieldnames, screenId, 'forShow'),
            bodysForShow: getBodys(suppliers, headersForShow),
        });

        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const table = document.getElementById('supTable');
        table.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, screenId } = this.state;
        const { fieldnames, suppliers } = this.props;

        if ( fieldnames != prevProps.fieldnames){
            this.setState({
                headersForShow: getHeaders(fieldnames, screenId, 'forShow'),
            }); 
        }

        if (suppliers != prevProps.suppliers || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodys(suppliers, headersForShow),
            });
        }
    }

    keyHandler(e) {

        let target = e.target;
        let colIndex = target.parentElement.cellIndex;               
        let rowIndex = target.parentElement.parentElement.rowIndex;
        var nRows = target.parentElement.parentElement.parentElement.childNodes.length;
        
        switch(e.keyCode) {
            case 9:// tab
                if(target.parentElement.nextSibling) {
                    target.parentElement.nextSibling.click();
                }
                break;
            case 13: //enter
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                }
                break;
            case 37: //left
                if(colIndex > 1 && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.previousSibling.click();
                } 
                break;
            case 38: //up
                if(rowIndex > 1) {
                    target.parentElement.parentElement.previousSibling.childNodes[colIndex].click();
                }
                break;
            case 39: //right
                if(target.parentElement.nextSibling && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.nextSibling.click();
                }
                break;
            case 40: //down
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                }
                break;
        }
    }

    toggleSort(event, name) {
        event.preventDefault();
        const { sort } = this.state;
        if (sort.name != name) {
            this.setState({
                sort: {
                    name: name,
                    isAscending: true
                }
            });
        } else if (!!sort.isAscending) {
            this.setState({
                sort: {
                    name: name,
                    isAscending: false
                }
            });
        } else {
            this.setState({
                sort: {
                    name: '',
                    isAscending: true
                }
            });
        }
    }

    handleChangeHeader(event) {
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const { header } = this.state;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            header:{
                ...header,
                [name]: value
            }
        });
    }

    handleChangeRow(event){
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const { supplier } = this.state;
        const { projectId } = this.props;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            supplier:{
                ...supplier,
                projectId: projectId,
                [name]: value,
            }
        }); 
    }

    updateSelectedRows(id) {
        const { selectedRows } = this.state;
        if (selectedRows.includes(id)) {
            this.setState({
                ...this.state,
                selectedRows: arrayRemove(selectedRows, id)
            });
        } else {
            this.setState({
                ...this.state,
                selectedRows: [...selectedRows, id]
            });
        }       
    }

    toggleSelectAllRow() {
        const { selectAllRows, bodysForShow } = this.state;
        // const { screenBodys } = this.props;
        if (!_.isEmpty(bodysForShow)) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(bodysForShow).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
    }

    handleDelete(event, id) {
        event.preventDefault();
        const { refreshSuppliers } = this.props;
        if(id) {
            this.setState({
                ...this.state,
                deleting: true 
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader()},
                };
                return fetch(`${config.apiUrl}/supplier/delete?id=${JSON.stringify(id)}`, requestOptions)
                .then( () => {
                    this.setState({deleting: false}, refreshSuppliers);
                })
                .catch( err => {
                    this.setState({deleting: false}, refreshSuppliers);
                });
            });
        }
    }

    

    filterName(array){
        const {header, isEqual, headersForShow, sort} = this.state;
        // const { screenHeaders } = this.props
        if (array) {
            return sortCustom(array, headersForShow, sort).filter(function (object) {
            // return array.filter(function (object) {
                let conditionMet = true;
                for (const prop in header) {
                    var fieldName =  headersForShow.find(function (el) {
                        return _.isEqual(el._id, prop)
                    });
                    let matchingCol = object.fields.find(function (col) {
                        return _.isEqual(col.fieldName, fieldName.fields.name);
                    });
                    if (!doesMatch(header[prop], matchingCol.fieldValue, fieldName.fields.type, isEqual)) {
                        conditionMet = false;
                    }
                }
                return conditionMet;
            });
        } else {
            return [];
        }
    }

    generateHeader(screenHeaders) {
        const {header, selectAllRows, sort} = this.state;
        if (!_.isEmpty(screenHeaders)) {
            const tempInputArray = [];
            screenHeaders.map(screenHeader => {
                tempInputArray.push(
                    <HeaderInput
                        type={screenHeader.fields.type === 'Number' ? 'number' : 'text' }
                        title={screenHeader.fields.custom}
                        name={screenHeader._id}
                        value={header[screenHeader._id]}
                        onChange={this.handleChangeHeader}
                        key={screenHeader._id}
                        sort={sort}
                        toggleSort={this.toggleSort}
                    />
                );
            });
    
            return (
                <tr>
                    <TableSelectionAllRow
                        checked={selectAllRows}
                        onChange={this.toggleSelectAllRow}
                    />
                    {tempInputArray}
                </tr>
            );
        }
    }

    generateNewRow(screenHeaders) {
        const { supplier, newRow, newRowColor } = this.state;
        if (!_.isEmpty(screenHeaders) && newRow) {
            const tempInputArray = [];
            screenHeaders.map(screenHeader => {
                tempInputArray.push(
                    <NewRowInput
                        fieldType={getInputType(screenHeader.fields.type)}
                        fieldName={screenHeader.fields.name}
                        fieldValue={supplier[screenHeader.fields.name] || ''}
                        onChange={this.handleChangeRow}
                        color={newRowColor}
                        key={screenHeader._id}
                    />
                );
            });
            return (
                <tr
                    onBlur={this.onBlurRow}
                    onFocus={this.onFocusRow}
                    data-type="newrow"
                >
                    <NewRowCreate
                        onClick={ event => this.cerateNewRow(event)}
                    />
                    {tempInputArray}
                </tr>
            );
        }
    }

    cerateNewRow(event) {
        event.preventDefault();
        const { refreshSuppliers } = this.props;
        const { supplier } = this.state;
        if(supplier.hasOwnProperty('projectId')) {
            this.setState({
                ...this.state,
                creatingNewRow: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify(supplier)
                };
                return fetch(`${config.apiUrl}/supplier/create`, requestOptions)
                .then( () => {
                    this.setState({
                        ...this.state,
                        creatingNewRow: false,
                        newRowColor: 'green'
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ...this.state,
                                newRowColor: 'inherit',
                                newRow:false,
                                supplier:{},
                                newRowFocus: false
                            }, refreshSuppliers);
                        }, 1000);                                
                    });
                })
                .catch( () => {
                    this.setState({
                        ...this.state,
                        creatingNewRow: false,
                        newRowColor: 'red'
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ...this.state,
                                newRowColor: 'inherit',
                                newRow:false,
                                supplier:{},
                                newRowFocus: false                                    
                            }, refreshSuppliers);
                        }, 1000);                                                       
                    });
                });
            });
        } else {
            this.setState({
                ...this.state,
                creatingNewRow: false,
                newRowColor: 'red'
            }, () => {
                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        newRowColor: 'inherit',
                        newRow:false,
                        supplier:{},
                        newRowFocus: false                                    
                    }, refreshSuppliers);
                }, 1000);                                                       
            });
        }          
    }

    onFocusRow(event) {
        event.preventDefault();
        console.log('onFocus');
        console.log('data-type:', event.currentTarget.dataset['type']);
        const { newRowFocus } = this.state;
        if (event.currentTarget.dataset['type'] == undefined && newRowFocus == true){
            this.cerateNewRow(event);
        }
    }

    onBlurRow(event){
        event.preventDefault()
        console.log('onBlurRow');
        console.log('data-type:', event.currentTarget.dataset['type']);
        if (event.currentTarget.dataset['type'] == 'newrow'){
            this.setState({
                ...this.state,
                newRowFocus: true
            });
        }
    }



    toggleNewRow(event) {
        event.preventDefault()
        const { newRow } = this.state;
        this.setState({newRow: !newRow});
    }

    generateBody(screenBodys) {
        const { refreshSuppliers } = this.props;
        const { selectAllRows, unlocked, headersForShow } = this.state;
        if (!_.isEmpty(screenBodys) && !_.isEmpty(headersForShow)) {
            let tempRows = [];
            this.filterName(screenBodys).map(screenBody => {
                let tempCol = [];
                screenBody.fields.map(function (field, index) {
                    if (field.objectId) {
                        tempCol.push(
                            <TableInput
                                collection={field.collection}
                                objectId={field.objectId}
                                fieldName={field.fieldName}
                                fieldValue={field.fieldValue}
                                disabled={field.disabled}
                                unlocked={unlocked}
                                align={field.align}
                                fieldType={field.fieldType}
                                textNoWrap={true}
                                key={index}
                                refreshStore={refreshSuppliers}
                            />
                        );                        
                    } else {
                        tempCol.push(<td key={index}></td>) 
                    }
                });
                tempRows.push(
                    <tr
                        key={screenBody._id}
                        onBlur={this.onBlurRow}
                        onFocus={this.onFocusRow}
                    >
                        <TableSelectionRow
                            id={screenBody._id}
                            selectAllRows={selectAllRows}
                            callback={this.updateSelectedRows}
                        />
                        {tempCol}
                    </tr>
                );
            });
            return tempRows;
        }
    }

    render() {

        const { 
            tab,
            //Functions
            handleSubmitSupplier,
            handleDeleteSupplier,
            //Props
            selection,
            suppliers,
            //State
            supplierUpdating,
            supplierDeleting,                
        } = this.props

        const { 
            // supplier, 
            // name, 
            // registeredName, 
            // contact, 
            // position,
            // city,
            // country,
            // show,
            // submitted,
            // loading,
            selectedRows,
            deleting, 
            headersForShow,
            supplier,
            bodysForShow,
            newRow,
        } = this.state;

        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                    <div className="ml-auto pull-right">
                        {/* <button
                            className="btn btn-leeuwen-blue btn-lg"
                            onClick={this.showModal}
                            style={{height: '34px'}}
                        >
                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Create Supplier</span>
                        </button> */}
                        <button
                            className="btn btn-leeuwen-blue btn-lg mr-2"
                            onClick={event => this.toggleNewRow(event)}
                            style={{height: '34px'}}
                        >
                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add Supplier</span>
                        </button>
                        <button
                            className="btn btn-leeuwen btn-lg"
                            onClick={ (event) => this.handleDelete(event, selectedRows)}
                            style={{height: '34px'}}
                        >
                            <span>
                                { deleting ? 
                                    <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw mr-2"/> 
                                :
                                    <FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>
                                }
                                Delete Supplier(s)
                            </span>
                        </button>
                    </div>
                </div>
                <div className="" style={{height: 'calc(100% - 44px)'}}>
                    <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                        <div className="table-responsive custom-table-container">
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="supTable">
                                <thead>
                                    {this.generateHeader(headersForShow)}
                                </thead>
                                <tbody className="full-height">
                                    {this.generateNewRow(headersForShow)}
                                    {this.generateBody(bodysForShow)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Suppliers;
