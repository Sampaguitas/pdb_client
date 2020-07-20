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
    sidemenuActions,
    warehouseActions,
} from '../../../_actions';
import {
    arrayRemove,
    leadingChar,
    doesMatch,
    copyObject
} from '../../../_functions';
import Layout from '../../../_components/layout';
import HeaderInput from '../../../_components/project-table/header-input';
import HeaderSelect from '../../../_components/project-table/header-select';
import TableInput from '../../../_components/project-table/table-input';
import TableSelectionRow from '../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../_components/project-table/table-selection-all-row';
import Modal from '../../../_components/modal';
import Warehouse from '../../../_components/split-line/warehouse';

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
                        location: `${area.areaNr}/${location.hall}${location.row}-${leadingChar(location.col, '0', 3)}${!!location.height ? '-' + location.height : ''}`,
                        warehouse: warehouse.warehouse,
                        area: `${area.area} (${area.areaNr})`,
                        hall: location.hall,
                        row: location.row,
                        col: leadingChar(location.col, '0', 3),
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
            header: {
                warehouse: '',
                location: '',
                area: '',
                hall: '',
                row: '',
                col: '',
                height: '',
                tc: '',
                type: ''
            },
            newLocation: {
                hall: '',
                row: '',
                col: '',
                height: '',
                tc: 'C',
                type: '',
                areaId: '',
                warehouseId: ''
            },
            showWarehouse: false,
            showDuf: false,
            showLocation: false,
            deletingLocations: false,
            creatingLocation: false,
            
            //duf
            fileName: '',
            inputKey: Date.now(),
            uploading: false,
            downloading: false,
            responce:{},
            sort: {
                name: '',
                isAscending: true,
            },
            alert: {
                type: '',
                message: ''
            },
            menuItem: 'Warehouse',
            colsWidth: {}
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
        this.toggleDuf = this.toggleDuf.bind(this);
        this.toggleLocation = this.toggleLocation.bind(this);
        this.handleDeleteLocations = this.handleDeleteLocations.bind(this);
        this.filterName = this.filterName.bind(this);
        //duf
        this.onKeyPress = this.onKeyPress.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.generateRejectionRows = this.generateRejectionRows.bind(this);
        this.handleDownloadFile = this.handleDownloadFile.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.dufInput = React.createRef();
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const { menuItem } = this.state;
        const { 
            dispatch,
            loadingAccesses,
            loadingSelection,
            loadingWarehouses, 
            location 
        } = this.props;

        var qs = queryString.parse(location.search);
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const locationTable = document.getElementById('locationTable');
        dispatch(sidemenuActions.select(menuItem));
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

        locationTable.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { newLocation, areas } = this.state;
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

        if (areas != prevState.areas) {
            this.setState({
                newLocation: {
                    ...newLocation,
                    areaId: !_.isEmpty(areas) ? areas[0]._id : ''
                }
            });
        }

        if (warehouses != prevProps.warehouses) {
            this.setState({ locations: getLocations(warehouses) });
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
                if(colIndex > 0 && !target.parentElement.classList.contains('isEditing')) {
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
        const { header } = this.state;
        this.setState({
            header: {
                ...header,
                [name]: value
            }
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
        const { newLocation, areas } = this.state;
        const { warehouses } = this.props;
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
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);;
                    } else {
                        this.setState({
                            creatingLocation: false,
                            showLocation: false,
                            selectedRows: [],
                            selectAllRows: false,
                            newLocation: {
                                hall: '',
                                row: '',
                                col: '',
                                height: '',
                                tc: 'C',
                                type: '',
                                areaId: !_.isEmpty(areas) ? areas[0]._id : '',
                                warehouseId: warehouses.items ? warehouses.items[0]._id : ''
                            },
                            alert: {
                                type: responce.status === 200 ? '' : 'alert-danger',
                                message: responce.status === 200 ? '' : data.message
                            }
                        }, this.refreshStore);
                    }
                }));
            });
        }
    }

    toggleSelectAllRow() {
        const { selectAllRows, locations } = this.state;
        // const { warehouses } = this.props;
        if (locations) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(locations).map(s => s._id),
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

    toggleDuf(event) {
        event.preventDefault();
        const { showDuf } = this.state;
        this.setState({
            showDuf: !showDuf,
            inputKey: Date.now(),
            fileName: '',
            responce:{},
        });
    }

    toggleLocation(event) {
        event.preventDefault();
        const { showLocation, areas } = this.state;
        const { warehouses } = this.props;
        this.setState({
            showLocation: !showLocation,
            newLocation: {
                hall: '',
                row: '',
                col: '',
                height: '',
                tc: 'C',
                type: '',
                areaId: !_.isEmpty(areas) ? areas[0]._id : '',
                warehouseId: warehouses.items ? warehouses.items[0]._id : ''
            }
        });
    }

    handleDeleteLocations(event) {
        event.preventDefault();
        const { selectedRows } = this.state;
        if(_.isEmpty(selectedRows)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select location(s) to be deleted.'
                }
            });
        } else {
            this.setState({
                deletingLocations: true
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({ selectedIds: selectedRows })
                };
                return fetch(`${config.apiUrl}/location/delete`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            deletingLocations: false,
                            selectedRows: [],
                            selectAllRows: false,
                            alert: {
                                type: responce.status === 200 ? '' : 'alert-danger',
                                message: responce.status === 200 ? '' : data.message
                            }
                        }, this.refreshStore);
                    }
                }));
            });
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
          event.preventDefault();
        }
    }

    handleUploadFile(event){
        event.preventDefault();
        const { projectId, fileName } = this.state
        if(this.dufInput.current.files[0] && projectId && fileName) {
            this.setState({uploading: true});
            var data = new FormData()
            data.append('file', this.dufInput.current.files[0]);
            data.append('projectId', projectId);
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader()}, //, 'Content-Type': 'application/json'
                body: data
            }
            return fetch(`${config.apiUrl}/location/upload`, requestOptions)
            .then(responce => responce.text().then(text => {
                const data = text && JSON.parse(text);
                if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                } else {
                    this.setState({
                        uploading: false,
                        responce: {
                            rejections: data.rejections,
                            nProcessed: data.nProcessed,
                            nRejected: data.nRejected,
                            nAdded: data.nAdded,
                            nEdited: data.nEdited
                        },
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshStore);
                }
            }));            
        }       
    }

    handleDownloadFile(event){
        event.preventDefault();
        this.setState({downloading: true});
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json'},
        }
        return fetch(`${config.apiUrl}/location/download`, requestOptions)
        .then(responce => {
            if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
            } else if (responce.status === 400) {
                this.setState({
                    downloading: false,
                    alert: {
                        type: 'alert-danger',
                        message: 'an error has occured'  
                    }
                });
            } else {
                this.setState({
                    downloading: false
                }, () => responce.blob().then(blob => saveAs(blob, 'Duf.xlsx')));
            }
        });      
    }

    handleFileChange(event){
        if(event.target.files.length > 0) {
            this.setState({
                ...this.state,
                fileName: event.target.files[0].name
            });
        }
    }

    generateRejectionRows(responce){
        let temp =[]
        if (!_.isEmpty(responce.rejections)) {
            responce.rejections.map(function(r, index) {
                temp.push(
                    <tr key={index}>
                        <td>{r.row}</td>
                        <td>{r.reason}</td>
                    </tr>
                );
            });
            return (temp);
        } else {
            return (
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            );
        }
    }

    filterName(array){
        const { header, sort } = this.state
        if (array) {
            return locationSorted(array, sort).filter(function (object) {
                return (doesMatch(header.warehouse, object.warehouse, 'String', false) 
                && doesMatch(header.location, object.location, 'String', false) 
                && doesMatch(header.area, object.area, 'String', false) 
                && doesMatch(header.hall, object.hall, 'String', false)
                && doesMatch(header.row, object.row, 'String', false)
                && doesMatch(header.col, object.col, 'String', false)
                && doesMatch(header.height, object.height, 'String', false)
                && doesMatch(header.tc, object.tc, 'Select', false)
                && doesMatch(header.type, object.type, 'String', false));
            });
        }
    }

    toggleCollapse() {
        const { dispatch } = this.props;
        dispatch(sidemenuActions.toggle());
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
        const { accesses, selection, warehouses, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        const {
            menuItem,
            projectId,
            areas,
            selectedRows,
            selectAllRows,
            header,
            sort,
            newLocation,
            //show modals
            showWarehouse,
            showDuf,
            showLocation,
            locations,
            //duf
            fileName,
            inputKey,
            uploading,
            downloading,
            responce,
            creatingLocation,
            deletingLocations,
            colsWidth
        } = this.state;

        const arrTc = [
            { _id: 'T', name: 'T' },
            { _id: 'C', name: 'C' },
        ]

        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showWarehouse && !showDuf && !showLocation &&
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
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="locations" className={ (alert.message && !showWarehouse && !showDuf && !showLocation) ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Show WH / Areas" onClick={this.toggleWarehouse}>
                            <span><FontAwesomeIcon icon="warehouse" className="fa mr-2"/>WH / Areas</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="DUF File" onClick={this.toggleDuf}>
                            <span><FontAwesomeIcon icon="upload" className="fa mr-2"/>DUF File</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Add Location" onClick={this.toggleLocation}>
                            <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Add Location</span>
                        </button>
                        <button className="btn btn-leeuwen btn-lg mr-2" title="Delete Location(s)" onClick={this.handleDeleteLocations}>
                            <span>
                                {deletingLocations ?
                                    <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw mr-2"/>
                                :
                                    <FontAwesomeIcon icon="trash-alt" className="fa mr-2"/>
                                }
                                Delete Location(s)
                            </span>
                        </button>
                    </div>
                    <div className="body-section">
                        <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                            <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                <table className="table table-bordered table-sm text-nowrap table-striped" id="locationTable">
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
                                                value={header.location}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="0"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Warehouse"
                                                name="warehouse"
                                                value={header.warehouse}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="1"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Area"
                                                name="area"
                                                value={header.area}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="2"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Sub Area/Hall"
                                                name="hall"
                                                value={header.hall}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="3"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Row"
                                                name="row"
                                                value={header.row}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="4"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Location/Column"
                                                name="col"
                                                value={header.col}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="5"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Depth/Height"
                                                name="height"
                                                value={header.height}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="6"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            />
                                            <HeaderSelect
                                                title="TC"
                                                name="tc"
                                                value={header.tc}
                                                options={arrTc}
                                                optionText="name"
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="7"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            /> 
                                            <HeaderInput
                                                type="text"
                                                title="Loc Type"
                                                name="type"
                                                value={header.type}
                                                onChange={this.handleChangeHeader}
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                                index="8"
                                                colDoubleClick={this.colDoubleClick}
                                                setColWidth={this.setColWidth}
                                                colsWidth={colsWidth}
                                            />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locations && this.filterName(locations).map((l, index) =>
                                            <tr key={index}>
                                                <TableSelectionRow
                                                    id={l._id}
                                                    selectAllRows={selectAllRows}
                                                    selectedRows={selectedRows}
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
                                                    index="0"
                                                    colsWidth={colsWidth}
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
                                                    index="1"
                                                    colsWidth={colsWidth}
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
                                                    index="2"
                                                    colsWidth={colsWidth}
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
                                                    index="3"
                                                    colsWidth={colsWidth}
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
                                                    index="4"
                                                    colsWidth={colsWidth}
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
                                                    index="5"
                                                    colsWidth={colsWidth}
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
                                                    index="6"
                                                    colsWidth={colsWidth}
                                                />
                                                <TableInput 
                                                    collection="virtual"
                                                    objectId={l._id}
                                                    fieldName="tc"
                                                    fieldValue={l.tc}
                                                    fieldType="text"
                                                    refreshStore={this.refreshStore}
                                                    align="center"
                                                    disabled={true}
                                                    index="7"
                                                    colsWidth={colsWidth}
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
                                                    index="8"
                                                    colsWidth={colsWidth}
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
                    show={showDuf}
                    hideModal={this.toggleDuf}
                    title="Download Upload File"
                    size="modal-xl"
                >
                    <div className="col-12">
                        {alert.message && 
                            <div className={`alert ${alert.type} mb-2`}>{alert.message}
                                <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                    <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                                </button>
                            </div>
                        }
                        <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                            <form
                                className="col-12"
                                encType="multipart/form-data"
                                onSubmit={this.handleUploadFile}
                                onKeyPress={this.onKeyPress}
                                style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                            >
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" style={{width: '95px'}}>Select Template</span>
                                        <input
                                            type="file"
                                            name="dufInput"
                                            id="dufInput"
                                            ref={this.dufInput}
                                            className="custom-file-input"
                                            style={{opacity: 0, position: 'absolute', pointerEvents: 'none', width: '1px'}}
                                            onChange={this.handleFileChange}
                                            key={inputKey}
                                        />
                                    </div>
                                    <label type="text" className="form-control text-left" htmlFor="dufInput" style={{display:'inline-block', padding: '7px'}}>{fileName ? fileName : 'Choose file...'}</label>
                                    <div className="input-group-append">
                                        <button type="submit" className="btn btn-outline-leeuwen-blue btn-lg">
                                            <span><FontAwesomeIcon icon={uploading ? "spinner" : "upload"} className={uploading ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Upload</span>
                                        </button>
                                        <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={this.handleDownloadFile}>
                                            <span><FontAwesomeIcon icon={downloading ? "spinner" : "download"} className={downloading ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Download</span>
                                        </button> 
                                    </div>       
                                </div>
                            </form>                    
                        </div>
                            {!_.isEmpty(responce) &&
                                <div className="ml-1 mr-1">
                                    <div className="form-group table-resonsive">
                                        <strong>Total Processed:</strong> {responce.nProcessed}<br />
                                        <strong>Total Records Added:</strong> {responce.nAdded}<br />
                                        <strong>Total Records Edited:</strong> {responce.nEdited}<br />
                                        <strong>Total Records Rejected:</strong> {responce.nRejected}<br />
                                        <hr />
                                    </div>
                                    {!_.isEmpty(responce.rejections) &&
                                        <div className="rejections">
                                            <h3>Rejections</h3>
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th style={{width: '10%'}}>Row</th>
                                                            <th style={{width: '90%'}}>Reason</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.generateRejectionRows(responce)}
                                                    </tbody>
                                                </table>
                                        </div>
                                    }
                                </div>
                            }
                    </div>
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
                                    {warehouses.items && warehouses.items.map((element, index) => <option key={index} value={element._id}>{element.warehouse}</option>)}
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
                                    {areas && areas.map((element, index) => <option key={index} value={element._id}>{`${element.area} (${element.areaNr})`}</option>)}
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
                                    {/* <option key="0" value="">Select...</option> */}
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
                                    <span>
                                        {creatingLocation ?
                                            <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw mr-2"/>
                                            :
                                            <FontAwesomeIcon icon="plus" className="fa mr-2"/>
                                        }
                                        Create
                                    </span>
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
    const { accesses, alert, selection, sidemenu, warehouses } = state;
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
        sidemenu,
        warehouses
    };
}

const connectedLocations = connect(mapStateToProps)(Locations);
export { connectedLocations as Locations };