import React from 'react';
import config from 'config';
import { authHeader } from '../../../_helpers';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    accessActions,
    alertActions,
    projectActions,
    warehouseActions
} from '../../../_actions';
import Layout from '../../../_components/layout';
import HeaderInput from '../../../_components/project-table/header-input';
import HeaderCheckBox from '../../../_components/project-table/header-check-box';
import HeaderSelect from '../../../_components/project-table/header-select';
import TableInput from '../../../_components/project-table/table-input';
import TableSelect from '../../../_components/project-table/table-select';
import TableCheckBox from '../../../_components/project-table/table-check-box';
import TableSelectionRow from '../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../_components/project-table/table-selection-all-row';
import Modal from '../../../_components/modal';
import Warehouse from '../../../_components/split-line/warehouse';
import { warehouseService } from '../../../_services';

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
}

function leadingChar(string, char, length) {
    return string.toString().length > length ? string : char.repeat(length - string.toString().length) + string;
}

function locationSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'warehouse':
        case 'location':
        case 'hall':
        case 'row':
        case 'col':
        case 'height':
        case 'tc':
        case 'type':
        case 'area':
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

function getAreas(warehouseId, warehouses) {
    if (!!warehouseId && warehouses.hasOwnProperty('items')) {
        return warehouses.items.reduce(function(acc, cur) {
            if(cur._id === warehouseId) {
                acc = cur.areas
            }
            return acc;
        }, []);
    } else  {
        return [];
    }
}

function getLocations(warehouses) {
    let arrayBody = [];
    if (warehouses.hasOwnProperty('items') && !_.isUndefined(warehouses.items)) {
        warehouses.items.map(warehouse => {
            warehouse.areas.map(area => {
                area.locations.map(location => {
                    arrayBody.push({
                        _id: location._id,
                        location: `${area.number}/${location.hall}${location.row}-${leadingChar(location.col, '0', 3)}${!!location.height ? '-' + location.height : ''}`,
                        warehouse: warehouse.name,
                        area: `${area.name} (${area.number})`,
                        hall: location.hall,
                        row: location.row,
                        col: location.col,
                        height: location.height || '',
                        tc: location.tc || '',
                        type: location.type || ''
                    });
                });
            });
        });
    }
    return arrayBody;
}


class Locations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            areas: [],
            locations: [],
            selectedRows: [],
            selectAllRows: false,
            warehouse: '',
            location: '',
            area: '',
            hall: '',
            row: '',
            col: '',
            height: '',
            type: '',
            tc: '',
            showWarehouse: false,
            showLocation: false,
            newLocation: {
                hall: '',
                row: '',
                col: '',
                height: '',
                tc: '',
                type: '',
                areaId: '',
                warehouseId: ''
            },
            sort: {
                name: '',
                isAscending: true,
            },
            alert: {
                type: '',
                message: ''
            }
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.handleChangeNewLocation = this.handleChangeNewLocation.bind(this);
        this.createNewLocation = this.createNewLocation.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.toggleWarehouse = this.toggleWarehouse.bind(this);
        this.toggleLocation = this.toggleLocation.bind(this);
        this.filterName = this.filterName.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingSelection,
            loadingWarehouses, 
            location 
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
            if (!loadingWarehouses) {
                dispatch(warehouseActions.getAll(qs.id));
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { newLocation } = this.state;
        const { warehouses } = this.props;
        if (newLocation.warehouseId != prevState.newLocation.warehouseId) {
            this.setState({
                newLocation: {
                    ...newLocation,
                    areaId: ''
                },
                areas: getAreas(newLocation.warehouseId, warehouses),
            })
        }

        if (warehouses != prevProps.warehouses) {
            this.setState({ locations: getLocations(warehouses) });
        }
    }

    refreshStore() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(warehouseActions.getAll(projectId));
        }
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            } 
        });
        dispatch(alertActions.clear());
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
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }

    handleChangeNewLocation(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { newLocation } = this.state;
        let regexp = /(^$|^[0-9]*$)/
        if (['warehouseId', 'areaId', 'tc', 'type'].includes(name) || regexp.test(value)) {
            this.setState({
                newLocation: {
                    ...newLocation,
                    [name]: value
                }
            });
        }
    }

    createNewLocation(event) {
        event.preventDefault();
        const { newLocation } = this.state;
        const { hall, row, col, tc, type, areaId, warehouseId } = newLocation;
        if (!!hall && !!row && !!col && !!tc && !!type && !!areaId && !!warehouseId) {
            this.setState({
                ...this.state,
                creatingLocation: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify(newLocation)
                };
                return fetch(`${config.apiUrl}/location/create`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (!responce.ok) {
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        }
                        this.setState({
                            creatingLocation: false,
                            showLocation: false,
                            newLocation: {},
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    } else {
                        this.setState({
                            creatingLocation: false,
                            showLocation: false,
                            newLocation: {},
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    }
                }));
            });
        }
    }

    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { warehouses } = this.props;
        if (warehouses.items) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(warehouses.items).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
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

    toggleWarehouse(event) {
        event.preventDefault();
        const { showWarehouse } = this.state;
        this.setState({ showWarehouse: !showWarehouse });
    }

    toggleLocation(event) {
        event.preventDefault();
        const { showLocation } = this.state;
        this.setState({ showLocation: !showLocation });
    }
    
    filterName(array){
        const { warehouse, location, area, hall, row, col, height, tc, type, sort } = this.state
        if (array) {
            return locationSorted(array, sort).filter(function (object) {
                return (doesMatch(warehouse, object.warehouse, 'String', false) 
                && doesMatch(location, object.location, 'String', false) 
                && doesMatch(area, object.area, 'String', false) 
                && doesMatch(hall, object.hall, 'String', false)
                && doesMatch(row, object.row, 'String', false)
                && doesMatch(col, object.col, 'String', false)
                && doesMatch(height, object.height, 'String', false)
                && doesMatch(tc, object.tc, 'Select', false)
                && doesMatch(type, object.type, 'String', false));
            });
        }
    }

    render() {
        const { accesses, selection, warehouses } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        const {
            projectId,
            areas,
            selectedRows,
            selectAllRows,
            warehouse,
            location,
            area,
            hall,
            row,
            col,
            height,
            type,
            tc,
            sort,
            newLocation,
            //show modals
            showWarehouse,
            showLocation,
            locations
        } = this.state;

        const arrTc = [
            { _id: 'T', name: 'T' },
            { _id: 'C', name: 'C' },
        ]

        return (
            <Layout alert={showWarehouse || showLocation ? {type:'', message:''} : alert} accesses={accesses}>
                {alert.message && !showWarehouse && !showLocation &&
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/dashboard', search: '?id=' + projectId }} tag="a">Dashboard</NavLink>
                        </li>
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/warehouse', search: '?id=' + projectId }} tag="a">Warehouse</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Locations:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</span>
                    </ol>
                </nav>
                <hr />
                <div id="locations" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Show WH / Areas" onClick={this.toggleWarehouse}>
                            <span><FontAwesomeIcon icon="warehouse" className="fa-lg mr-2"/>WH / Areas</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="DUF File"> {/* onClick={event => this.toggleWarhouses(event)} */}
                            <span><FontAwesomeIcon icon="upload" className="fa-lg mr-2"/>DUF File</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Add Location" onClick={this.toggleLocation}>
                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add Location</span>
                        </button>
                        <button className="btn btn-leeuwen btn-lg mr-2" style={{height: '34px'}} title="Delete Location(s)"> {/* onClick={event => this.toggleGenerate(event)} */}
                            <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete Location(s)</span>
                        </button>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                            <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                <table className="table table-bordered table-sm text-nowrap table-striped" id="locationsTable">
                                    <thead>
                                        <tr>
                                            <TableSelectionAllRow
                                                checked={selectAllRows}
                                                onChange={this.toggleSelectAllRow}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="WH Location"
                                                name="location"
                                                value={location}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Warehouse"
                                                name="warehouse"
                                                value={warehouse}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Area"
                                                name="area"
                                                value={area}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Sub Area/Hall"
                                                name="hall"
                                                value={hall}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Row"
                                                name="row"
                                                value={row}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Location/Column"
                                                name="col"
                                                value={col}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Depth/Height"
                                                name="height"
                                                value={height}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderSelect
                                                title="TC"
                                                name="tc"
                                                value={tc}
                                                options={arrTc}
                                                optionText="name"
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            /> 
                                            <HeaderInput
                                                type="text"
                                                title="Loc Type"
                                                name="type"
                                                value={type}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locations && this.filterName(locations).map((l, index) =>
                                            <tr key={index}>
                                                <TableSelectionRow
                                                    id={l._id}
                                                    selectAllRows={selectAllRows}
                                                    callback={this.updateSelectedRows}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="location"
                                                    fieldValue={l.location}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="left"
                                                    disabled={true}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="warehouse"
                                                    fieldValue={l.warehouse}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="left"
                                                    disabled={true}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="area"
                                                    fieldValue={l.area}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="left"
                                                    disabled={true}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="hall"
                                                    fieldValue={l.hall}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="right"
                                                    disabled={true}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="row"
                                                    fieldValue={l.row}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="right"
                                                    disabled={true}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="col"
                                                    fieldValue={l.col}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="right"
                                                    disabled={true}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="height"
                                                    fieldValue={l.height}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="right"
                                                    disabled={true}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="tc"
                                                    fieldValue={l.tc}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="left"
                                                    disabled={true}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="type"
                                                    fieldValue={l.type}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="left"
                                                    disabled={true}
                                                />
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    show={showWarehouse}
                    hideModal={this.toggleWarehouse}
                    title="Add Warehouses"
                    size="modal-lg"
                >
                    <Warehouse 
                        alert={alert}
                        projectId={projectId}
                        warehouses={warehouses}
                        handleClearAlert={this.handleClearAlert}
                        refreshStore={this.refreshStore}
                        toggleWarehouse={this.toggleWarehouse}
                    />
                </Modal>
                <Modal
                    show={showLocation}
                    hideModal={this.toggleLocation}
                    title="Add Locations"
                    // size="modal-xl"
                >
                    <div className="col-12">
                        {alert.message && 
                            <div className={`alert ${alert.type} mb-2`}>{alert.message}
                                <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                    <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                                </button>
                            </div>
                        }
                        <form onSubmit={event => this.createNewLocation(event)}>
                            <div className="form-group">
                                <label htmlFor="warehouseId">Warehouse</label>
                                <select
                                    className="form-control"
                                    name="warehouseId"
                                    value={newLocation.warehouseId}
                                    placeholder="Select warehouse..."
                                    onChange={this.handleChangeNewLocation}
                                    required
                                >
                                    <option key="0" value="">Select...</option>
                                    {warehouses.items && warehouses.items.map((element, index) => <option key={index} value={element._id}>{element.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="areaId">Area</label>
                                <select
                                    className="form-control"
                                    name="areaId"
                                    value={newLocation.areaId}
                                    placeholder="Select area..."
                                    onChange={this.handleChangeNewLocation}
                                    required
                                >
                                    <option key="0" value="">Select...</option>
                                    {areas && areas.map((element, index) => <option key={index} value={element._id}>{`${element.name} (${element.number})`}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="hall">Sub Area/Hall</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="hall"
                                    value={newLocation.hall}
                                    onChange={this.handleChangeNewLocation}
                                    placeholder="[1-9]"
                                    maxLength="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="row">Row</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="row"
                                    value={newLocation.row}
                                    onChange={this.handleChangeNewLocation}
                                    placeholder="[1-9]"
                                    maxLength="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="col">Location/Column</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="col"
                                    value={newLocation.col}
                                    onChange={this.handleChangeNewLocation}
                                    placeholder="[001-999]"
                                    maxLength="3"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="height">Depth/Height</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="height"
                                    value={newLocation.height}
                                    onChange={this.handleChangeNewLocation}
                                    placeholder="[1-9] (optional)"
                                    maxLength="1"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tc">TC</label>
                                <select
                                    className="form-control"
                                    name="tc"
                                    value={newLocation.tc}
                                    placeholder="Select TC..."
                                    onChange={this.handleChangeNewLocation}
                                    required
                                >
                                    <option key="0" value="">Select...</option>
                                    <option key="1" value="C">C</option>
                                    <option key="2" value="T">T</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Loc Type</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="type"
                                    value={newLocation.type}
                                    onChange={this.handleChangeNewLocation}
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-leeuwen-blue btn-lg mr-2">
                                    <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Create</span>
                                </button>
                            </div> 
                        </form>                  
                    </div>
                </Modal>
                
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, selection, warehouses } = state;
    const { loadingAccesses } = accesses;
    const { loadingSelection } = selection;
    const { loadingWarehouses } = warehouses;
    
    return {
        accesses,
        alert,
        loadingAccesses,
        loadingSelection,
        loadingWarehouses,
        selection,
        warehouses
    };
}

const connectedLocations = connect(mapStateToProps)(Locations);
export { connectedLocations as Locations };