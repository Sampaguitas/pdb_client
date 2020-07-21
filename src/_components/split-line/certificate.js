import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../project-table/header-input';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import CifInput from '../project-table/cif-input';
import TableSelectionRow from '../project-table/table-selection-row';
import NewRowCreate from '../project-table/new-row-create';
import CifNewRowInput from '../project-table/cif-new-row-input';
import {
    arrayRemove,
    doesMatch,
    copyObject
} from '../../_functions';
import _ from 'lodash';

function certificateSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'cif':
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
        default: return array;
    }
}

class Certificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cif: '',
            selectedIds: [],
            selectAllRows: false,
            newRow: false,
            newCif:{
                cif: ''
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
        this.filterName = this.filterName.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const tableCertificate = document.getElementById('certificateTable');
        tableCertificate.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
    }

    keyHandler(e) {

        let target = e.target;
        let colIndex = target.parentElement.parentElement.cellIndex;               
        let rowIndex = target.parentElement.parentElement.parentElement.rowIndex;
        var nRows = target.parentElement.parentElement.parentElement.parentElement.childNodes.length;
        
        switch(e.keyCode) {
            case 9:// tab
                if(target.parentElement.nextSibling) {
                    target.parentElement.nextSibling.click(); 
                }
                break;
            case 13: //enter
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.parentElement.nextSibling.childNodes[colIndex].firstChild.firstChild.click();
                }
                break;
            case 37: //left
                if(colIndex > 1 && !target.parentElement.parentElement.classList.contains('isEditing')) {
                    target.parentElement.parentElement.previousSibling.click();
                } 
                break;
            case 38: //up
                if(rowIndex > 1) {
                    target.parentElement.parentElement.parentElement.previousSibling.childNodes[colIndex].firstChild.firstChild.click() 
                }
                break;
            case 39: //right
                if(target.parentElement.parentElement.nextSibling && !target.parentElement.parentElement.classList.contains('isEditing')) {
                    target.parentElement.parentElement.nextSibling.click();
                }
                break;
            case 40: //down
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.parentElement.nextSibling.childNodes[colIndex].firstChild.firstChild.click();
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
            newCif:{
                cif: ''
            }
        });
    }

    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { certificates } = this.props;
        if (certificates.items) {
            if (selectAllRows) {
                this.setState({
                    selectedIds: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    selectedIds: this.filterName(certificates.items).map(s => s._id),
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
        const { projectId } = this.props;
        const { newCif } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (projectId) {
            this.setState({
                ...this.state,
                newCif: {
                    ...newCif,
                    [name]: value,
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
        const { refreshCifs } = this.props;
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
                return fetch(`${config.apiUrl}/certificate/delete`, requestOptions)
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
                    }, refreshCifs);
                }));
            });
        }
    }

    cerateNewRow(event) {
        event.preventDefault();
        const { refreshCifs } = this.props;
        const { creatingNewRow, newCif } = this.state;
        if (!creatingNewRow) {
            this.setState({
                creatingNewRow: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCif)
                };
                return fetch(`${config.apiUrl}/certificate/create`, requestOptions)
                .then( () => {
                    this.setState({
                        creatingNewRow: false,
                        newRowColor: 'green'
                    }, () => {
                        setTimeout( () => {
                            this.setState({
                                newRowColor: 'inherit',
                                newRow:false,
                                newCif:{},
                                newRowFocus: false
                            }, refreshCifs);
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
                                newCif:{},
                                newRowFocus: false                                    
                            }, refreshCifs);
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
        const { cif, selectAllRows, sort, settingsColWidth } = this.state;
        return (
            <tr>
                <TableSelectionAllRow
                    checked={selectAllRows}
                    onChange={this.toggleSelectAllRow}
                />
                <HeaderInput
                    type="text"
                    title="Certificate"
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
            </tr>
        );
    }

    generateBody(certificates) {
        const { refreshCifs } = this.props;
        const { creatingNewRow, selectedIds, selectAllRows, newRow, newCif, newRowColor } = this.state;
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
                    <CifNewRowInput
                        fieldType="text"
                        fieldName="cif"
                        fieldValue={newCif.cif}
                        onChange={event => this.handleChangeNewRow(event)}
                        color={newRowColor}
                    />
                </tr>
            );
            
        }

        if (certificates.items) {
            this.filterName(certificates.items).map(certificate => {
                tempRows.push(
                    <tr key={certificate._id}>
                        <TableSelectionRow
                            id={certificate._id}
                            selectAllRows={selectAllRows}
                            selectedRows={selectedIds}
                            callback={this.updateSelectedIds}
                        />
                        <CifInput
                            collection="certificate"
                            objectId={certificate._id}
                            fieldName="cif"
                            fieldValue={certificate.cif}
                            hasFile={certificate.hasFile}
                            disabled={false}
                            align="left"
                            fieldType="text"
                            refreshStore={refreshCifs}
                            setAlert={this.setAlert}
                        />
                    </tr>
                );
            });
            return tempRows;
        }
    }

    filterName(array){
        const { 
            cif,
            sort
        } = this.state;

        if (array) {
            return certificateSorted(array, sort).filter(function (element) {
                return (doesMatch(cif, element.cif, 'String', false)
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
                    [index]: 10
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
        const { certificates, toggleCif } = this.props;
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
                            <button title="Add Certificate"className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleNewRow}>
                                <span><FontAwesomeIcon icon={creatingNewRow ? "spinner" : "plus"} className={creatingNewRow ? "fa-pulse fa fa-fw mr-2" : "fa mr-2"}/>Add</span>
                            </button>
                            <button title="Delete Certificate(s)"className="btn btn-leeuwen btn-lg" onClick={event => this.handleDelete(event, selectedIds)}>
                                <span><FontAwesomeIcon icon={deleting ? "spinner" : "trash-alt"} className={deleting ? "fa-pulse fa fa-fw mr-2" : "fa mr-2"}/>Delete</span>
                            </button>
                        </div>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '400px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row" >
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="certificateTable">
                                <thead>
                                    {this.generateHeader()}
                                </thead>
                                <tbody>
                                    {this.generateBody(certificates)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => toggleCif(event)}>
                            <span><FontAwesomeIcon icon="times" className="fa mr-2"/>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Certificate;