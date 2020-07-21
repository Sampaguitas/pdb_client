import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../project-table/header-input';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import TableInput from '../project-table/table-input';
import TableSelect from '../project-table/table-select';
import TableSelectionRow from '../project-table/table-selection-row';
import NewRowCreate from '../project-table/new-row-create';
import NewRowInput from '../project-table/new-row-input';
import NewRowSelect from '../project-table/new-row-select';
import {
    arrayRemove,
    doesMatch,
    copyObject
} from '../../_functions';
import _ from 'lodash';

function heatSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'heatNr':
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
        case 'cif':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.certificate.cif) && !_.isNull(a.certificate.cif) ? String(a.certificate.cif).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.certificate.cif) && !_.isNull(b.certificate.cif) ? String(b.certificate.cif).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.certificate.cif) && !_.isNull(a.certificate.cif) ? String(a.certificate.cif).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.certificate.cif) && !_.isNull(b.certificate.cif) ? String(b.certificate.cif).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        default: return array;
    }
}

class Heat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cif: '',
            heatNr: '',
            inspQty: '',
            selectedIds: [],
            selectAllRows: false,
            newRow: false,
            newHeat:{
                heatNr: '',
                inspQty: '',
                certificateId: '',
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
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.setAlert = this.setAlert.bind(this);
        this.handleChangeNewRow = this.handleChangeNewRow.bind(this);
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.cerateNewRow = this.cerateNewRow.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.filterHeat = this.filterHeat.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const tableHeat = document.getElementById('heatTable');
        tableHeat.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
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

    toggleNewRow(event) {
        event.preventDefault()
        const { newRow } = this.state;
        this.setState({
            newRow: !newRow,
            newHeat:{
                heatNr: '',
                certificateId: ''
            }
        });
    }

    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { heats } = this.props;
        if (heats) {
            if (selectAllRows) {
                this.setState({
                    selectedIds: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    selectedIds: this.filterHeat(heats).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [name]: value });
    }

    handleChangeNewRow(event){
        const { projectId, poId, subId, returnId } = this.props;
        const { newHeat } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (projectId) {
            this.setState({
                ...this.state,
                newHeat: {
                    ...newHeat,
                    [name]: value,
                    poId: poId,
                    subId: subId,
                    returnId: returnId,
                    projectId: projectId
                }
            });
        } 
    }

    setAlert(type, message) {
        this.setState({
            alert: {
                type: type,
                message: message
            }
        })

    }
    
    handleClearAlert(event){
        const { handleClearAlert } = this.props;
        event.preventDefault();
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            }
        }, handleClearAlert(event));
    }

    handleDelete(event, selectedIds) {
        event.preventDefault();
        const { refreshPos } = this.props;
        if(_.isEmpty(selectedIds)) {
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
                    body: JSON.stringify({selectedIds: selectedIds})
                };
                return fetch(`${config.apiUrl}/heat/delete`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    this.setState({
                        ...this.state,
                        deleting: false,
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, refreshPos);
                }));
            });
        }
    }

    cerateNewRow(event) {
        event.preventDefault();
        const { refreshPos } = this.props;
        const { creatingNewRow, newHeat } = this.state;
        if (!creatingNewRow) {
            this.setState({
                creatingNewRow: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify(newHeat)
                };
                return fetch(`${config.apiUrl}/heat/create`, requestOptions)
                .then( () => {
                    this.setState({
                        creatingNewRow: false,
                        newRowColor: 'green'
                    }, () => {
                        setTimeout( () => {
                            this.setState({
                                newRowColor: 'inherit',
                                newRow:false,
                                newHeat:{},
                                newRowFocus: false
                            }, refreshPos);
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
                                newHeat:{},
                                newRowFocus: false                                    
                            }, refreshPos);
                        }, 1000);                                                      
                    });
                });
            });
        } 
    }

    updateSelectedIds(id) {
        const { selectedIds } = this.state;
        if (selectedIds.includes(id)) {
            this.setState({
                selectedIds: arrayRemove(selectedIds, id)
            });
        } else {
            this.setState({
                selectedIds: [...selectedIds, id]
            });
        }       
    }

    generateHeader() {
        const { cif, heatNr, inspQty, selectAllRows, sort, settingsColWidth } = this.state;
        return (
            <tr>
                <TableSelectionAllRow
                    checked={selectAllRows}
                    onChange={this.toggleSelectAllRow}
                />
                <HeaderInput
                    type="text"
                    title="CIF"
                    name="cif"
                    value={cif}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                    index="0"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                /> 
                <HeaderInput
                    type="text"
                    title="Heat Nr"
                    name="heatNr"
                    value={heatNr}
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
                    title="Insp Qty"
                    name="inspQty"
                    value={inspQty}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                    index="2"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />                         
            </tr>
        );
    }

    generateBody(heats) {
        const { refreshPos, certificates } = this.props;
        const { selectedIds, selectAllRows, newRow, newHeat, newRowColor, creatingNewRow, settingsColWidth } = this.state;
        let tempRows = [];
        
        if (newRow) {
            tempRows.push(
                <tr
                    // onBlur={this.onBlurRow}
                    // onFocus={this.onFocusRow}
                    data-type="newrow"
                >
                    <NewRowCreate
                        onClick={event => this.cerateNewRow(event)}
                        creatingNewRow={creatingNewRow}
                    />
                    <NewRowSelect
                        fieldName="certificateId"
                        fieldValue={newHeat.certificateId}
                        options={certificates.items}
                        optionText="cif"
                        fromTbls={[]}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                        index="0"
                        settingsColWidth={settingsColWidth}
                    />
                    <NewRowInput
                        fieldType="text"
                        fieldName="heatNr"
                        fieldValue={newHeat.heatNr}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                        index="1"
                        settingsColWidth={settingsColWidth}
                    />
                    <NewRowInput
                        fieldType="number"
                        fieldName="inspQty"
                        fieldValue={newHeat.inspQty}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                        index="2"
                        settingsColWidth={settingsColWidth}
                    />
                </tr>
            );
        }

        if (heats) {
            this.filterHeat(heats).map(heat => {
                tempRows.push(
                    <tr key={heat._id}>
                        <TableSelectionRow
                            id={heat._id}
                            selectAllRows={selectAllRows}
                            selectedRows={selectedIds}
                            callback={this.updateSelectedIds}
                        />
                        <TableSelect
                            collection="heat"
                            objectId={heat._id}
                            fieldName="certificateId"
                            fieldValue={heat.certificateId}
                            options={certificates.items}
                            optionText="cif"
                            fromTbls={[]}
                            refreshStore={refreshPos}
                            index="0"
                            settingsColWidth={settingsColWidth}
                        />
                        <TableInput
                            collection="heat"
                            objectId={heat._id}
                            fieldName="heatNr"
                            fieldValue={heat.heatNr}
                            fieldType="text"
                            refreshStore={refreshPos}
                            index="1"
                            settingsColWidth={settingsColWidth}
                        />
                        <TableInput
                            collection="heat"
                            objectId={heat._id}
                            fieldName="inspQty"
                            fieldValue={heat.inspQty}
                            fieldType="number"
                            refreshStore={refreshPos}
                            index="2"
                            settingsColWidth={settingsColWidth}
                        />
                    </tr>
                );
            });
            return tempRows;
        }
    }

    filterHeat(array){
        const { 
            cif,
            heatNr,
            sort
        } = this.state;

        if (array) {
            return heatSorted(array, sort).filter(function (element) {
                return (doesMatch(cif, element.certificate.cif, 'String', false)
                && doesMatch(heatNr, element.heatNr, 'String', false));
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
        const { selectedIds, deleting, creatingNewRow } = this.state;
        const { heats, toggleHeat } = this.props;
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;
        return (
            <div>
                <div className="ml-2 mr-2">
                    {alert.message && 
                        <div className={`alert ${alert.type} mt-2`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className={`row ${alert.message ? "mt-1" : "mt-2"} mb-2`}>
                        <div className="col text-right">
                            <button title="Add Heat Nr"className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleNewRow}>
                                <span><FontAwesomeIcon icon={creatingNewRow ? "spinner" : "plus"} className={creatingNewRow ? "fa-pulse fa fa-fw mr-2" : "fa mr-2"}/>Add</span>
                            </button>
                            <button title="Delete Heat(s)"className="btn btn-leeuwen btn-lg" onClick={event => this.handleDelete(event, selectedIds)}>
                                <span><FontAwesomeIcon icon={deleting ? "spinner" : "trash-alt"} className={deleting ? "fa-pulse fa fa-fw mr-2" : "fa mr-2"}/>Delete</span>
                            </button>
                        </div>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '400px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row" >
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="heatTable">
                                <thead>
                                    {this.generateHeader()}
                                </thead>
                                <tbody>
                                    {this.generateBody(heats)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => toggleHeat(event)}>
                            <span><FontAwesomeIcon icon="times" className="fa mr-2"/>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Heat;