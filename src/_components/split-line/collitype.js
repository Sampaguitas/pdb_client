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
import {
    arrayRemove,
    doesMatch,
    copyObject
} from '../../_functions';
import _ from 'lodash';

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
            creatingNewRow: false,
            newRowColor: 'inherit',
            sort: {
                name: '',
                isAscending: true,
            },
            alert: {
                type:'',
                message:''
            },
            settingsColWidth: {}
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
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.filterName = this.filterName.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
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
                deleting: true
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedIds: selectedRows})
                };
                return fetch(`${config.apiUrl}/collitype/delete`, requestOptions)
                .then( () => {
                    this.setState({
                        deleting: false
                    }, refreshColliTypes);
                })
                .catch( err => {
                    this.setState({
                        deleting: false
                    }, refreshColliTypes);
                });
            });
        }
    }

    cerateNewRow(event) {
        event.preventDefault();
        const { refreshColliTypes } = this.props;
        const { creatingNewRow, fieldName } = this.state;
        if(!creatingNewRow) {
            this.setState({
                creatingNewRow: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify(fieldName)
                };
                return fetch(`${config.apiUrl}/collitype/create`, requestOptions)
                .then( () => {
                    this.setState({
                        creatingNewRow: false,
                        newRowColor: 'green'
                    }, () => {
                        setTimeout( () => {
                            this.setState({
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
                        creatingNewRow: false,
                        newRowColor: 'red'
                    }, () => {
                        setTimeout(() => {
                            this.setState({
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
        const { type, length, width, height, pkWeight, selectAllRows, sort, settingsColWidth } = this.state;
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
                    index="0"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />
                <HeaderInput
                    type="number"
                    title="Length"
                    name="length"
                    value={length}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                    index="1"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />                                
                <HeaderInput
                    type="number"
                    title="Width"
                    name="width"
                    value={width}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                    index="2"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}

                />                                    
                <HeaderInput
                    type="number"
                    title="Height"
                    name="height"
                    value={height}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                    index="3"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />
                <HeaderInput
                    type="number"
                    title="pkWeight"
                    name="pkWeight"
                    value={pkWeight}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                    index="4"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />                            
            </tr>
        );
    }

    generateBody(collitypes) {
        const { refreshColliTypes } = this.props;
        const { selectedRows, selectAllRows, newRow, fieldName, newRowColor, creatingNewRow, settingsColWidth } = this.state;
        let tempRows = [];
        
        if (newRow) {
            tempRows.push(
                <tr data-type="newrow">
                    <NewRowCreate
                        onClick={event => this.cerateNewRow(event)}
                        creatingNewRow={creatingNewRow}
                    />
                    <NewRowInput
                        fieldType="text"
                        fieldName="type"
                        fieldValue={fieldName.type}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                        index="0"
                        settingsColWidth={settingsColWidth}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="length"
                        fieldValue={fieldName.length}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                        index="1"
                        settingsColWidth={settingsColWidth}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="width"
                        fieldValue={fieldName.width}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                        index="2"
                        settingsColWidth={settingsColWidth}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="height"
                        fieldValue={fieldName.height}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                        index="3"
                        settingsColWidth={settingsColWidth}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="pkWeight"
                        fieldValue={fieldName.pkWeight}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                        index="4"
                        settingsColWidth={settingsColWidth}
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
                            selectedRows={selectedRows}
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
                            index="0"
                            settingsColWidth={settingsColWidth}
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
                            index="1"
                            settingsColWidth={settingsColWidth}
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
                            index="2"
                            settingsColWidth={settingsColWidth}
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
                            index="3"
                            settingsColWidth={settingsColWidth}
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
                            index="4"
                            settingsColWidth={settingsColWidth}
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

    colDoubleClick(event, index) {
        event.preventDefault();
        const { settingsColWidth } = this.state;
        if (settingsColWidth.hasOwnProperty(index)) {
            let tempArray = copyObject(settingsColWidth);
            delete tempArray[index];
            this.setState({ settingsColWidth: tempArray });
        } else {
            this.setState({
                settingsColWidth: {
                    ...settingsColWidth,
                    [index]: 0
                }
            });
        }
    }

    setColWidth(index, width) {
        const { settingsColWidth } = this.state;
        this.setState({
            settingsColWidth: {
                ...settingsColWidth,
                [index]: width
            }
        });
    }

    render() {
        const { selectedRows, deleting, creatingNewRow } = this.state;
        const { collitypes, assigning } = this.props;
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
                            <button title="Add Collitype"className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleNewRow}>
                                <span><FontAwesomeIcon icon={creatingNewRow ? "spinner" : "plus"} className={creatingNewRow ? "fa-pulse fa fa-fw mr-2" : "fa mr-2"}/>Add</span>
                            </button>
                            <button title="Delete Collitype(s)"className="btn btn-leeuwen btn-lg" onClick={event => this.handleDelete(event, selectedRows)}>
                                <span><FontAwesomeIcon icon={deleting ? "spinner" : "trash-alt"} className={deleting ? "fa-pulse fa fa-fw mr-2" : "fa mr-2"}/>Delete</span>
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
                            <span><FontAwesomeIcon icon={assigning ? "spinner" : "hand-point-right"} className={assigning ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Assign</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default ColliType;