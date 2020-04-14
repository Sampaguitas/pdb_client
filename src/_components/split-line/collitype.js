import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../project-table/header-input';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import TableInput from '../project-table/table-input';
import TableSelectionRow from '../project-table/table-selection-row';
import NewRowCreate from '../project-table/new-row-create';
import NewRowInput from '../project-table/new-row-input';

import moment from 'moment';
import _ from 'lodash';

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

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

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
}

function colliTypeSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'type':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'length':
        case 'width':
        case 'height':
        case 'pkWeight':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let valueA = a[sort.name] || 0;
                    let valueB = b[sort.name] || 0;
                    return valueA - valueB;
                });
            } else {
                return tempArray.sort(function (a, b){
                    let valueA = a[sort.name] || 0;
                    let valueB = b[sort.name] || 0;
                    return valueB - valueA
                });
            }
        default: return array;
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

class ColliType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            length: '',
            width: '',
            height: '',
            pkWeight: '',
            selectedRows: [],
            selectAllRows: false,
            newRow: false,
            fieldName:{
                type: '',
                length: '',
                width: '',
                height: '',
                pkWeight: ''
            },
            newRowFocus:false,
            creating: false,
            newRowColor: 'inherit',
            sort: {
                name: '',
                isAscending: true,
            },
            alert: {
                type:'',
                message:''
            }
        }
        this.toggleSort = this.toggleSort.bind(this);
        this.toggleNewRow = this.toggleNewRow.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        
        this.handleAssign = this.handleAssign.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.handleChangeNewRow = this.handleChangeNewRow.bind(this);
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.cerateNewRow = this.cerateNewRow.bind(this);
        this.onFocusRow = this.onFocusRow.bind(this);
        this.onBlurRow = this.onBlurRow.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);

        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.filterName = this.filterName.bind(this);
    }

    componentDidMount() {
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const tableCollitype = document.getElementById('collitype');
        tableCollitype.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandlerCollitype(e);
            }
        });
    }

    keyHandlerCollitype(e) {

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

    toggleNewRow(event) {
        event.preventDefault()
        const { newRow } = this.state;
        this.setState({
            newRow: !newRow,
            fieldName:{
                type: '',
                length: '',
                width: '',
                height: '',
                pkWeight: ''
            }
        });
    }

    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { collitypes } = this.props;
        if (collitypes.items) {
            if (selectAllRows) {
                this.setState({
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    selectedRows: this.filterName(collitypes.items).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
    }

    handleAssign(event) {
        event.preventDefault();
        const { selectedRows } = this.state;
        const { assignColliType } = this.props;
        if (selectedRows.length != 1) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select one line.'
                }
            });
        } else {
            assignColliType(selectedRows[0]);
        }
    }

    handleChangeHeader(event) {
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [name]: value });
    }

    handleChangeNewRow(event){
        const { projectId } = this.props;
        const { fieldName } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (projectId) {
            this.setState({
                ...this.state,
                fieldName: {
                    ...fieldName,
                    [name]: value,
                    projectId: projectId
                }
            });
        } 
    }
    
    handleClearAlert(event){
        const { handleClearAlert } = this.props;
        event.preventDefault;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            }
        }, handleClearAlert(event));
    }

    handleDelete(event, selectedRows) {
        event.preventDefault();
        const { refreshColliTypes } = this.props;
        if(_.isEmpty(selectedRows)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select line(s) to be deleted.'
                }
            });
        } else {
            this.setState({
                // ...this.state,
                deleting: true
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader()},
                };
                return fetch(`${config.apiUrl}/collitype/delete?id=${JSON.stringify(selectedRows)}`, requestOptions)
                .then( () => {
                    this.setState({
                        // ...this.state,
                        deleting: false
                    }, refreshColliTypes);
                })
                .catch( err => {
                    this.setState({
                        // ...this.state,
                        deleting: false
                    }, refreshColliTypes);
                });
            });
        }
    }

    cerateNewRow(event) {
        event.preventDefault();
        const { refreshColliTypes } = this.props;
        const { fieldName } = this.state;
        this.setState({
            // ...this.state,
            creating: true
        }, () => {
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify(fieldName)
            };
            return fetch(`${config.apiUrl}/collitype/create`, requestOptions)
            .then( () => {
                this.setState({
                    // ...this.state,
                    creating: false,
                    newRowColor: 'green'
                }, () => {
                    setTimeout( () => {
                        this.setState({
                            // ...this.state,
                            newRowColor: 'inherit',
                            newRow:false,
                            fieldName:{},
                            newRowFocus: false
                        }, refreshColliTypes);
                    }, 1000);                                
                });
            })
            .catch( () => {
                this.setState({
                    // ...this.state,
                    creating: false,
                    newRowColor: 'red'
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            // ...this.state,
                            newRowColor: 'inherit',
                            newRow:false,
                            fieldName:{},
                            newRowFocus: false                                    
                        }, refreshColliTypes);
                    }, 1000);                                                      
                });
            });
        });
    }

    onFocusRow(event) {
        event.preventDefault();
        const { newRowFocus } = this.state;
        if (event.currentTarget.dataset['type'] == undefined && newRowFocus == true){
            this.cerateNewRow(event);
        }
    }

    onBlurRow(event){
        event.preventDefault()
        if (event.currentTarget.dataset['type'] == 'newrow'){
            this.setState({ newRowFocus: true });
        }
    }

    updateSelectedRows(id) {
        const { selectedRows } = this.state;
        if (selectedRows.includes(id)) {
            this.setState({
                selectedRows: arrayRemove(selectedRows, id)
            });
        } else {
            this.setState({
                selectedRows: [...selectedRows, id]
            });
        }       
    }



    generateHeader() {
        const { type, length, width, height, pkWeight, selectAllRows, sort } = this.state;
        return (
            <tr>
                <TableSelectionAllRow
                    checked={selectAllRows}
                    onChange={this.toggleSelectAllRow}
                />
                <HeaderInput
                    type="text"
                    title="Type"
                    name="type"
                    value={type}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />
                <HeaderInput
                    type="number"
                    title="Length"
                    name="length"
                    value={length}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />                                
                <HeaderInput
                    type="number"
                    title="Width"
                    name="width"
                    value={width}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}

                />                                    
                <HeaderInput
                    type="number"
                    title="Height"
                    name="height"
                    value={height}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />
                <HeaderInput
                    type="number"
                    title="pkWeight"
                    name="pkWeight"
                    value={pkWeight}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />                            
            </tr>
        );
    }

    generateBody(collitypes) {
        const { refreshColliTypes } = this.props;
        const { selectAllRows, newRow, fieldName, newRowColor } = this.state;
        let tempRows = [];
        
        if (newRow) {
            tempRows.push(
                <tr
                    onBlur={this.onBlurRow}
                    onFocus={this.onFocusRow}
                    data-type="newrow"
                >
                    <NewRowCreate
                        onClick={event => this.cerateNewRow(event)}
                    />
                    <NewRowInput
                        fieldType="text"
                        fieldName="type"
                        fieldValue={fieldName.type}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="length"
                        fieldValue={fieldName.length}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="width"
                        fieldValue={fieldName.width}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="height"
                        fieldValue={fieldName.height}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="pkWeight"
                        fieldValue={fieldName.pkWeight}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                    />
                </tr>
            );
            
        }

        if (collitypes.items) {
            this.filterName(collitypes.items).map(collitype => {
                tempRows.push(
                    <tr key={collitype._id}>
                        <TableSelectionRow
                            id={collitype._id}
                            selectAllRows={selectAllRows}
                            callback={this.updateSelectedRows}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="type"
                            fieldValue={collitype.type}
                            disabled={false}
                            align="left"
                            fieldType="text"
                            refreshStore={refreshColliTypes}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="length"
                            fieldValue={collitype.length}
                            disabled={false}
                            align="left"
                            fieldType="number"
                            refreshStore={refreshColliTypes}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="width"
                            fieldValue={collitype.width}
                            disabled={false}
                            align="left"
                            fieldType="number"
                            refreshStore={refreshColliTypes}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="height"
                            fieldValue={collitype.height}
                            disabled={false}
                            align="left"
                            fieldType="number"
                            refreshStore={refreshColliTypes}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="pkWeight"
                            fieldValue={collitype.pkWeight}
                            disabled={false}
                            align="left"
                            fieldType="number"
                            refreshStore={refreshColliTypes}
                        />
                    </tr>
                );
            });
            return tempRows;
        }
    }

    filterName(array){
        const { 
            type,
            length,
            width,
            height,
            pkWeight,
            sort
        } = this.state;

        if (array) {
            return colliTypeSorted(array, sort).filter(function (element) {
                return (doesMatch(type, element.type, 'String', false)
                    && doesMatch(length, element.length, 'Number', false)
                    && doesMatch(width, element.width, 'Number', false)
                    && doesMatch(height, element.height, 'Number', false)
                    && doesMatch(pkWeight, element.pkWeight, 'Number', false)
                );
            });
        } else {
            return [];
        }
    }

    render() {
        const { selectedRows, deleting, creating } = this.state;
        const { collitypes } = this.props;
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;
        return (
            <div>
                <div className="ml-2 mr-2">
                    {alert.message && 
                        <div className={`alert ${alert.type} mt-3`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className={`row ${alert.message ? "mt-1" : "mt-5"} mb-2`}>
                        <div className="col"> 
                            <h3>Select Colli Type</h3>
                        </div>
                        <div className="col text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleNewRow}>
                                <span>
                                    { creating ? 
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw mr-2"/> 
                                    :
                                        <FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>
                                    }
                                    Create
                                </span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleDelete(event, selectedRows)}>
                                <span>
                                    { deleting ? 
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw mr-2"/> 
                                    :
                                        <FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>
                                    }
                                    Delete
                                </span>
                            </button>
                        </div>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '400px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row" >
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="collitype">
                                <thead>
                                    {this.generateHeader()}
                                </thead>
                                <tbody>
                                    {this.generateBody(collitypes)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => this.handleAssign(event)}>
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa-lg mr-2"/>Assign</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default ColliType;