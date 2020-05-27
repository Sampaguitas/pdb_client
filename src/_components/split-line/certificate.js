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
        
        // this.handleAssign = this.handleAssign.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.setAlert = this.setAlert.bind(this);
        this.handleChangeNewRow = this.handleChangeNewRow.bind(this);
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.cerateNewRow = this.cerateNewRow.bind(this);
        // this.onFocusRow = this.onFocusRow.bind(this);
        // this.onBlurRow = this.onBlurRow.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);

        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.filterName = this.filterName.bind(this);
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
        // event.preventDefault();
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
                // ...this.state,
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
        const { newCif } = this.state;
        this.setState({
            // ...this.state,
            creating: true
        }, () => {
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify(newCif)
            };
            return fetch(`${config.apiUrl}/certificate/create`, requestOptions)
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
                            newCif:{},
                            newRowFocus: false
                        }, refreshCifs);
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
                            newCif:{},
                            newRowFocus: false                                    
                        }, refreshCifs);
                    }, 1000);                                                      
                });
            });
        });
    }

    // onFocusRow(event) {
    //     event.preventDefault();
    //     const { newRowFocus } = this.state;
    //     if (event.currentTarget.dataset['type'] == undefined && newRowFocus == true){
    //         this.cerateNewRow(event);
    //     }
    // }

    // onBlurRow(event){
    //     event.preventDefault()
    //     if (event.currentTarget.dataset['type'] == 'newrow'){
    //         this.setState({ newRowFocus: true });
    //     }
    // }

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
        const { cif, selectAllRows, sort } = this.state;
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
                />                         
            </tr>
        );
    }

    generateBody(certificates) {
        const { refreshCifs } = this.props;
        const { selectedIds, selectAllRows, newRow, newCif, newRowColor } = this.state;
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

    render() {
        const { selectedIds, deleting, creating } = this.state;
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
                                <span><FontAwesomeIcon icon={creating ? "spinner" : "plus"} className={creating ? "fa-pulse fa-lg fa-fw mr-2" : "fa-lg mr-2"}/>Add</span>
                            </button>
                            <button title="Delete Certificate(s)"className="btn btn-leeuwen btn-lg" onClick={event => this.handleDelete(event, selectedIds)}>
                                <span><FontAwesomeIcon icon={deleting ? "spinner" : "trash-alt"} className={deleting ? "fa-pulse fa-lg fa-fw mr-2" : "fa-lg mr-2"}/>Delete</span>
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
                            <span><FontAwesomeIcon icon="times" className="fa-lg mr-2"/>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Certificate;