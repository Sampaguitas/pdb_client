import React, { Component } from 'react';
import HeaderInput from '../project-table/header-input';
import TableSelectionRow from '../project-table/table-selection-row';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import SplitInput from './split-input';
import moment from 'moment';
import _ from 'lodash';

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
            sortWh: {
                name: '',
                isAscending: true,
            },
            sortArea: {
                name: '',
                isAscending: true,
            },
            alert: {
                type: '',
                message: ''
            }
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleSelectAllWh = this.toggleSelectAllWh.bind(this);
        this.filterWarehouses = this.filterWarehouses.bind(this);
        this.toggleSortWh = this.toggleSortWh.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
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
        this.setState({
            ...this.state,
            [name]: value
        });
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
                    selectedWh: this.filterWarehouses(warehouses.items).map(s => s._id),
                    selectAllWh: true
                });
            }         
        }
    }

    filterWarehouses(array){
        const { whName, sortWh } = this.state
        if (array) {
            return warehouseSorted(array, sortWh).filter(function (object) {
                return (doesMatch(whName, object.name, 'String', false));
            });
        }
    }

    render() {

        const { toggleWarehouse, warehouses } = this.props;
        const { selectAllWh, whName, sortWh } = this.state;
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;

        return (
            <div id='warehouse'>
                <div className="ml-2 mr-2">
                    <div className="row mb-2">
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
                        <div className="table-responsive custom-table-container">
                            <table className="table table-bordered table-sm table-hover text-nowrap" id="forSelect">
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
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="forShow">
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