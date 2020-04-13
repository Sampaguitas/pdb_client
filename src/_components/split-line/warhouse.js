import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import HeaderInput from '../project-table/header-input';
import NewRowCreate from '../project-table/new-row-create';
import NewRowInput from '../project-table/new-row-input';
import TableSelectionRow from '../project-table/table-selection-row';
import TableInput from '../project-table/table-input';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import SplitInput from './split-input';
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

function warehouseSorted(array, sortWh) {
    let tempArray = array.slice(0);
    switch(sortWh.name) {
        case 'whName':
            if (sortWh.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.name) && !_.isNull(a.name) ? a.name.toUpperCase() : '';
                    let nameB = !_.isUndefined(b.name) && !_.isNull(b.name) ? b.name.toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.name) && !_.isNull(a.name) ? a.name.toUpperCase() : '';
                    let nameB = !_.isUndefined(b.name) && !_.isNull(b.name) ? b.name.toUpperCase() : '';
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

class Warehouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedWh: [],
            selectedAreas: [],
            selectAllWh: false,
            selectAllAreas: false,
            whName: '',
            areaName: '',
            areaNumber: '',
            //newRows
            newWh: false,
            newWhColor: 'inherit',
            warehouse: {},
            newWhFocus:false,
            creatingNewWh: false,
            deletingWh: false,
            //sorts
            sortWh: {
                name: '',
                isAscending: true,
            },
            sortArea: {
                name: '',
                isAscending: true,
            },
            //alerts
            alert: {
                type: '',
                message: ''
            }
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        //Wh header
        this.toggleSelectAllWh = this.toggleSelectAllWh.bind(this);
        this.toggleSortWh = this.toggleSortWh.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        //newWh
        this.createNewWh = this.createNewWh.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onFocusWh = this.onFocusWh.bind(this);
        this.onBlurWh = this.onBlurWh.bind(this);
        this.toggleNewWh = this.toggleNewWh.bind(this);
        this.handleChangeNewWh = this.handleChangeNewWh.bind(this);
        //selected wh
        this.updateSelectedWh = this.updateSelectedWh.bind(this);
        this.filterWarehouses = this.filterWarehouses.bind(this);
        
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

    toggleSelectAllWh() {
        const { selectAllWh } = this.state;
        const { warehouses } = this.props;
        if (warehouses.items) {
            if (selectAllWh) {
                this.setState({
                    ...this.state,
                    selectedWh: [],
                    selectAllWh: false
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedWh: this.filterWarehouses(warehouses.items).map(w => w._id),
                    selectAllWh: true
                });
            }         
        }
    }

    toggleSortWh(event, name) {
        event.preventDefault();
        const { sortWh } = this.state;
        if (sortWh.name != name) {
            this.setState({
                sortWh: {
                    name: name,
                    isAscending: true
                }
            });
        } else if (!!sortWh.isAscending) {
            this.setState({
                sortWh: {
                    name: name,
                    isAscending: false
                }
            });
        } else {
            this.setState({
                sortWh: {
                    name: '',
                    isAscending: true
                }
            });
        }
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [name]: value });
    }

    
    createNewWh(event) {
        event.preventDefault();
        const { refreshStore } = this.props;
        const { warehouse } = this.state;
        this.setState({
            ...this.state,
            creatingNewWh: true
        }, () => {
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify(warehouse)
            };
            return fetch(`${config.apiUrl}/warehouse/create`, requestOptions)
            .then( () => {
                this.setState({
                    creatingNewWh: false,
                    newWhColor: 'green'
                }, () => {
                    setTimeout( () => {
                        this.setState({
                            newWhColor: 'inherit',
                            newWh:false,
                            warehouse:{},
                            newWhFocus: false
                        }, refreshStore);
                    }, 1000);                                
                });
            })
            .catch( () => {
                this.setState({
                    creatingNewWh: false,
                    newWhColor: 'red'
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            newWhColor: 'inherit',
                            newWh:false,
                            warehouse:{},
                            newWhFocus: false                                    
                        }, refreshStore);
                    }, 1000);                                                      
                });
            });
        });
    }

    handleDelete(event) {
        event.preventDefault();
        const { refreshStore } = this.props;
        const { selectedWh } = this.state;
        if(!_.isEmpty(selectedWh)) {
            this.setState({
                ...this.state,
                deletingWh: true
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({ selectedIds: selectedWh })
                };
                return fetch(`${config.apiUrl}/warehouse/delete`, requestOptions)
                .then( () => {
                    this.setState({
                        deletingWh: false
                    }, refreshStore);
                })
                .catch( err => {
                    this.setState({
                        deletingWh: false
                    }, refreshStore);
                });
            });
        }
    }

    onFocusWh(event) {
        event.preventDefault();
        const { newWhFocus } = this.state;
        if (event.currentTarget.dataset['type'] == undefined && newWhFocus == true){
            this.createNewWh(event);
        }
    }

    onBlurWh(event){
        event.preventDefault()
        if (event.currentTarget.dataset['type'] == 'newWh'){
            this.setState({ newWhFocus: true });
        }
    }

    toggleNewWh(event) {
        event.preventDefault()
        const { newWh } = this.state;
        this.setState({ newWh: !newWh });
    }

    handleChangeNewWh(event){
        const { projectId } = this.props;
        const { warehouse } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (projectId) {
            this.setState({
                warehouse: {
                    ...warehouse,
                    [name]: value,
                    projectId: projectId
                }
            });
        } 
    }

    updateSelectedWh(id) {
        const { selectedWh } = this.state;
        if (selectedWh.includes(id)) {
            this.setState({ selectedWh: arrayRemove(selectedWh, id) });
        } else {
            this.setState({ selectedWh: [...selectedWh, id] });
        }
    }

    filterWarehouses(array){
        const { whName, sortWh } = this.state;
        if (array) {
            return warehouseSorted(array, sortWh).filter(function (object) {
                return (doesMatch(whName, object.name, 'String', false));
            });
        } else {
            return [];
        }
    }

    render() {

        const { toggleWarehouse, warehouses, refreshStore } = this.props;
        const { selectAllWh, whName, sortWh, newWh, newWhColor, warehouse } = this.state;
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;

        return (
            <div id='warehouseModal'>
                <div className="ml-2 mr-2">
                    <div className="row mb-2">
                        <div className="col text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleNewWh}>
                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={this.handleDelete}>
                                <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete</span>
                            </button>
                        </div>
                    </div> 
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '200px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                            <table className="table table-bordered table-sm table-hover text-nowrap" id="warehouse">
                                <thead>
                                    <tr>
                                        <TableSelectionAllRow
                                            checked={selectAllWh}
                                            onChange={this.toggleSelectAllWh}
                                        />
                                        <HeaderInput
                                            type="text"
                                            title="Warehouse"
                                            name="whName"
                                            value={whName}
                                            onChange={this.handleChangeHeader}
                                            sort={sortWh}
                                            toggleSort={this.toggleSortWh}
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {newWh && 
                                        <tr
                                            onBlur={this.onBlurWh}
                                            onFocus={this.onFocusWh}
                                            data-type="newWh"
                                        >
                                            <NewRowCreate
                                                onClick={ event => this.createNewWh(event)}
                                            />
                                            <NewRowInput
                                                fieldType="text"
                                                fieldName="name"
                                                fieldValue={warehouse.name}
                                                onChange={event => this.handleChangeNewWh(event)}
                                                color={newWhColor}
                                            />
                                        </tr>
                                    }
                                    {warehouses.items && this.filterWarehouses(warehouses.items).map((w) =>
                                        <tr key={w._id} onBlur={this.onBlurWh} onFocus={this.onFocusWh}>
                                            <TableSelectionRow
                                                id={w._id}
                                                selectAllRows={selectAllWh}
                                                callback={this.updateSelectedWh}
                                            />
                                            <TableInput 
                                                collection="warehouse"
                                                objectId={w._id}
                                                fieldName="name"
                                                fieldValue={w.name}
                                                fieldType="text"
                                                refreshStore={refreshStore}
                                            />
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {alert.message && 
                        <div className={`alert ${alert.type} mt-3`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className={`row ${alert.message ? "mt-1" : "mt-5"} mb-2`}>
                        <div className="col text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2">
                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg">
                                <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete</span>
                            </button>
                        </div>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '200px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="area">
                                <thead>
                                    <tr>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={toggleWarehouse}>
                            <span><FontAwesomeIcon icon="times" className="fa-lg mr-2"/>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Warehouse;