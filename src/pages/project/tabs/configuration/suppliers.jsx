import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
import {
    doesMatch,
    arrayRemove,
    sortCustom,
    getInputType,
    getHeaders,
    copyObject
} from '../../../../_functions';
import HeaderInput from '../../../../_components/project-table/header-input';
import NewRowCreate from '../../../../_components/project-table/new-row-create';
import NewRowInput from '../../../../_components/project-table/new-row-input';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelectionRow from '../../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

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
            colsWidth: {}
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
        this.toggleNewRow = this.toggleNewRow.bind(this);
        this.filterName = this.filterName.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    };
    
    componentDidMount() {
        const { fieldnames, suppliers, refreshFieldnames, refreshSuppliers } = this.props;
        const { screenId, headersForShow } = this.state;
        //refreshStore
        refreshFieldnames;
        refreshSuppliers;

        this.setState({
            headersForShow: getHeaders([], fieldnames, screenId, 'forShow'),
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
                headersForShow: getHeaders([], fieldnames, screenId, 'forShow'),
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

    handleDelete(event, selectedRows) {
        event.preventDefault();
        const { refreshSuppliers } = this.props;
        if(selectedRows) {
            this.setState({
                ...this.state,
                deleting: true 
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedIds: selectedRows})
                };
                return fetch(`${config.apiUrl}/supplier/delete`, requestOptions)
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
        const {header, selectAllRows, sort, colsWidth} = this.state;
        if (!_.isEmpty(screenHeaders)) {
            const tempInputArray = [];
            screenHeaders.map((screenHeader, screenHeaderIndex) => {
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
                        index={screenHeaderIndex}
                        colDoubleClick={this.colDoubleClick}
                        setColWidth={this.setColWidth}
                        colsWidth={colsWidth}
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
        const { supplier, newRow, newRowColor, creatingNewRow } = this.state;
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
                <tr data-type="newrow">
                    <NewRowCreate
                        onClick={ event => this.cerateNewRow(event)}
                        creatingNewRow={creatingNewRow}
                    />
                    {tempInputArray}
                </tr>
            );
        }
    }

    cerateNewRow(event) {
        event.preventDefault();
        const { refreshSuppliers } = this.props;
        const { creatingNewRow, supplier } = this.state;
        if(!creatingNewRow && supplier.hasOwnProperty('projectId')) {
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

    toggleNewRow(event) {
        event.preventDefault()
        const { newRow } = this.state;
        this.setState({newRow: !newRow});
    }

    generateBody(screenBodys) {
        const { refreshSuppliers } = this.props;
        const { selectedRows, selectAllRows, unlocked, headersForShow, colsWidth } = this.state;
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
                                index={index}
                                colsWidth={colsWidth}
                            />
                        );                        
                    } else {
                        tempCol.push(<td key={index}></td>) 
                    }
                });
                tempRows.push(
                    <tr
                        key={screenBody._id}
                        // onBlur={this.onBlurRow}
                        // onFocus={this.onFocusRow}
                    >
                        <TableSelectionRow
                            id={screenBody._id}
                            selectAllRows={selectAllRows}
                            selectedRows={selectedRows}
                            callback={this.updateSelectedRows}
                        />
                        {tempCol}
                    </tr>
                );
            });
            return tempRows;
        }
    }

    colDoubleClick(event, index) {
        event.preventDefault();
        const { colsWidth } = this.state;
        if (colsWidth.hasOwnProperty(index)) {
            let tempArray = copyObject(colsWidth);
            delete tempArray[index];
            this.setState({ colsWidth: tempArray });
        } else {
            this.setState({
                colsWidth: {
                    [index]: 0
                }
            });
        }
    }

    setColWidth(index, width) {
        const { colsWidth } = this.state;
        this.setState({
            colsWidth: {
                ...colsWidth,
                [index]: width
            }
        });
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
            selectedRows,
            deleting, 
            headersForShow,
            supplier,
            bodysForShow,
            newRow,
            creatingNewRow
        } = this.state;

        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="action-row row">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Add Supplier" onClick={event => this.toggleNewRow(event)}> {/* style={{height: '34px'}} */}
                            <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Add</span>
                        </button>
                        <button className="btn btn-leeuwen btn-lg" title="Delete Supplier(s)" onClick={event => this.handleDelete(event, selectedRows)}> {/* style={{height: '34px'}} */}
                            <span><FontAwesomeIcon icon={deleting ? "spinner" : "trash-alt"} className={deleting ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Delete</span>
                        </button>
                </div>
                <div className="body-section">
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
