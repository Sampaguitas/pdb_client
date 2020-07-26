import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { authHeader } from '../../_helpers';
import {
    arrayRemove,
    doesMatch,
    copyObject
} from '../../_functions';
import {
    HeaderInput,
    NewRowCreate,
    NewRowInput,
    TableInput,
    TableSelectionAllRow,
    TableSelectionRow
} from '../project-table';
import _ from 'lodash';

function arraySorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'area':
        case 'warehouse':
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
        case 'areaNr':
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

function getAreas(warehouses, selectedWh) {
    let arrayBody = [];
    if (warehouses.hasOwnProperty('items') && !_.isEmpty(warehouses.items) && selectedWh.length === 1) {
        let warehouse = warehouses.items.find(element => element._id === selectedWh[0]);
        if (!_.isUndefined(warehouse)) {
            arrayBody = warehouse.areas;
        }
    }
    return arrayBody;
}

export class SplitWarehouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedWh: [],
            areas: [],
            selectedAreas: [],
            selectAllWh: false,
            selectAllAreas: false,
            header: {
                warehouse: '',
                area: '',
                areaNr: '',
            },
            newWh: false,
            newArea: false,
            newWhColor: 'inherit',
            newAreaColor: 'inherit',
            warehouse: {},
            area: {},
            newWhFocus:false,
            newAreaFocus: false,
            creatingNewWh: false,
            creatingNewArea: false,
            deletingWh: false,
            deletingAreas: false,
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
            },
            settingsColWidth: {}
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleSelectAllWh = this.toggleSelectAllWh.bind(this);
        this.toggleSelectAllArea = this.toggleSelectAllArea.bind(this);
        this.toggleSortWh = this.toggleSortWh.bind(this);
        this.toggleSortArea = this.toggleSortArea.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.createNewWh = this.createNewWh.bind(this);
        this.createNewArea = this.createNewArea.bind(this);
        this.handleDeleteWh = this.handleDeleteWh.bind(this);
        this.handleDeleteAreas = this.handleDeleteAreas.bind(this);
        this.onFocusWh = this.onFocusWh.bind(this);
        this.onFocusArea = this.onFocusArea.bind(this);
        this.onBlurWh = this.onBlurWh.bind(this);
        this.onBlurArea = this.onBlurArea.bind(this);
        this.toggleNewWh = this.toggleNewWh.bind(this);
        this.toggleNewArea = this.toggleNewArea.bind(this);
        this.handleChangeNewWh = this.handleChangeNewWh.bind(this);
        this.updateSelectedWh = this.updateSelectedWh.bind(this);
        this.updateSelectedArea = this.updateSelectedArea.bind(this);
        this.filterName = this.filterName.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const warehouseTable = document.getElementById('warehouseTable');
        const areaTable = document.getElementById('areaTable');
        warehouseTable.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
        areaTable.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { selectedWh, sortArea } = this.state;
        const { warehouses } = this.props;
        if (selectedWh != prevState.selectedWh || warehouses != prevProps.warehouses) {
            this.setState({
                areas: getAreas(warehouses, selectedWh),
                selectedAreas: [],
                selectAllAreas: false
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
                    selectedWh: this.filterName(warehouses.items, true).map(w => w._id),
                    selectAllWh: true
                });
            }         
        }
    }

    toggleSelectAllArea() {
        const { selectAllAreas, areas } = this.state;
        if (areas) {
            if (selectAllAreas) {
                this.setState({
                    ...this.state,
                    selectedAreas: [],
                    selectAllAreas: false
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedAreas: this.filterName(areas, false).map(w => w._id),
                    selectAllAreas: true
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

    toggleSortArea(event, name) {
        event.preventDefault();
        const { sortArea } = this.state;
        if (sortArea.name != name) {
            this.setState({
                sortArea: {
                    name: name,
                    isAscending: true
                }
            });
        } else if (!!sortArea.isAscending) {
            this.setState({
                sortArea: {
                    name: name,
                    isAscending: false
                }
            });
        } else {
            this.setState({
                sortArea: {
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

    createNewWh(event) {
        event.preventDefault();
        const { refreshStore } = this.props;
        const { creatingNewWh, warehouse } = this.state;
        if(!creatingNewWh) {
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
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            creatingNewWh: false,
                            newWhColor: responce.status === 200 ? 'green' : 'red',
                            alert: {
                                type: responce.status === 200 ? '' : 'alert-danger',
                                message: responce.status === 200 ? '' : data.message
                            }
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
                    }
                }));
            });
        }
    }

    createNewArea(event) {
        event.preventDefault();
        const { refreshStore } = this.props;
        const { creatingNewArea, area } = this.state;
        if (!creatingNewArea) {
            this.setState({
                creatingNewArea: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify(area)
                };
                return fetch(`${config.apiUrl}/area/create`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            creatingNewArea: false,
                            newAreaColor: responce.status === 200 ? 'green' : 'red',
                            alert: {
                                type: responce.status === 200 ? '' : 'alert-danger',
                                message: responce.status === 200 ? '' : data.message
                            }
                        }, () => {
                            setTimeout( () => {
                                this.setState({
                                    newAreaColor: 'inherit',
                                    newArea:false,
                                    area:{},
                                    newAreaFocus: false
                                }, refreshStore);
                            }, 1000);                                
                        });
                    }
                }));
            });
        }
    }

    handleDeleteWh(event) {
        event.preventDefault();
        const { refreshStore, warehouses } = this.props;
        const { selectedWh } = this.state;
        if(_.isEmpty(selectedWh)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select warehouse(s) to be deleted.'
                }
            });
        } else {
            
            let hasAreas = warehouses.items.reduce(function (acc, cur) {
                if (!acc && selectedWh.includes(cur._id) && !_.isEmpty(cur.areas)) {
                    acc = true;
                }
                return acc;
            }, false);

            if (hasAreas) {
                this.setState({
                    alert: {
                        type: 'alert-danger',
                        message: 'Selection contains area(s), remove those before deleting warehouse(s).'
                    }
                });
            } else {
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
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        } else {
                            this.setState({
                                deletingWh: false,
                                selectedWh: [],
                                selectAllWh: false,
                                alert: {
                                    type: responce.status === 200 ? '' : 'alert-danger',
                                    message: responce.status === 200 ? '' : data.message
                                }
                            }, refreshStore);
                        }
                    }));
                });
            }
        }
    }

    handleDeleteAreas(event) {
        event.preventDefault();
        const { refreshStore } = this.props;
        const { selectedAreas, areas } = this.state;
        if(_.isEmpty(selectedAreas)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select area(s) to be deleted.'
                }
            });
        } else {
            let hasLocations = areas.reduce(function (acc, cur) {
                if (!acc && selectedAreas.includes(cur._id) && !_.isEmpty(cur.locations)) {
                    acc = true;
                }
                return acc;
            }, false);

            if (hasLocations) {
                this.setState({
                    alert: {
                        type: 'alert-danger',
                        message: 'Selection contains location(s), remove those before deleting area(s).'
                    }
                });
            } else {
                this.setState({
                    deletingAreas: true
                }, () => {
                    const requestOptions = {
                        method: 'DELETE',
                        headers: { ...authHeader(), 'Content-Type': 'application/json'},
                        body: JSON.stringify({ selectedIds: selectedAreas })
                    };
                    return fetch(`${config.apiUrl}/area/delete`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        } else {
                            this.setState({
                                deletingAreas: false,
                                selectedAreas: [],
                                selectAllAreas: false,
                                alert: {
                                    type: responce.status === 200 ? '' : 'alert-danger',
                                    message: responce.status === 200 ? '' : data.message
                                }
                            }, refreshStore);
                        }
                    }));
                });
            }
        }
    }

    onFocusWh(event) {
        event.preventDefault();
        const { newWhFocus } = this.state;
        if (event.currentTarget.dataset['type'] == undefined && newWhFocus == true){
            this.createNewWh(event);
        }
    }

    onFocusArea(event) {
        event.preventDefault();
        const { newAreaFocus } = this.state;
        if (event.currentTarget.dataset['type'] == undefined && newAreaFocus == true){
            this.createNewArea(event);
        }
    }

    onBlurWh(event){
        event.preventDefault()
        if (event.currentTarget.dataset['type'] == 'newWh'){
            this.setState({ newWhFocus: true });
        }
    }

    onBlurArea(event){
        event.preventDefault()
        if (event.currentTarget.dataset['type'] == 'newArea'){
            this.setState({ newAreaFocus: true });
        }
    }

    toggleNewWh(event) {
        event.preventDefault()
        const { newWh } = this.state;
        this.setState({
            newWh: !newWh,
            warehouse: {}
        });
    }

    toggleNewArea(event) {
        event.preventDefault();
        const { selectedWh, newArea } = this.state;
        if (selectedWh.length != 1) {
            this.setState({ 
                alert: {
                    type: 'alert-danger',
                    message: 'Select one warehouse.'
                }
            });
        } else {
            this.setState({ 
                newArea: !newArea,
                area: {}
            });
        }
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

    handleChangeNewArea(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { selectedWh, area } = this.state;
        let regexp = /(^$|^[0-9]*$)/
        if (['area'].includes(name) || regexp.test(value)) {
            this.setState({
                area: {
                    ...area,
                    [name]: value,
                    warehouseId: selectedWh.length === 1 ? selectedWh[0] : ''
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

    updateSelectedArea(id) {
        const { selectedAreas } = this.state;
        if (selectedAreas.includes(id)) {
            this.setState({ selectedAreas: arrayRemove(selectedAreas, id) });
        } else {
            this.setState({ selectedAreas: [...selectedAreas, id] });
        }
    }

    filterName(array, isWh){
        const { header, sortWh, sortArea } = this.state;
        if (!array) {
            return [];
        } else if(isWh) {
            return arraySorted(array, sortWh).filter(function (object) {
                return (doesMatch(header.warehouse, object.warehouse, 'String', false));
            });
        } else {
            return arraySorted(array, sortArea).filter(function (object) {
                return (doesMatch(header.areaNr, object.areaNr, 'String', false)
                && doesMatch(header.area, object.area, 'String', false));
            });
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

        const { toggleWarehouse, warehouses, refreshStore } = this.props;
        
        const { 
            selectedWh,
            selectAllWh,
            selectedAreas,
            selectAllAreas,
            header,
            // warehouse,
            // areaNr,
            // area,
            sortWh, 
            sortArea,
            newWh,
            newArea,
            newWhColor,
            newAreaColor,
            warehouse,
            area,
            areas,
            deletingWh,
            deletingAreas,
            creatingNewArea,
            creatingNewWh,
            settingsColWidth
        } = this.state;

        const alert = this.state.alert.message ? this.state.alert : this.props.alert;

        return (
            <div id='warehouseModal'>
                <div className="ml-2 mr-2">
                    <div className="row mb-2">
                        <div className="col text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleNewWh}>
                                <span>
                                    {creatingNewWh ?
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw mr-2"/>
                                    :
                                        <FontAwesomeIcon icon="plus" className="fa mr-2"/>
                                    }
                                    Add
                                </span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={this.handleDeleteWh}>
                                <span>
                                    {deletingWh ?
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw mr-2"/>
                                    :
                                        <FontAwesomeIcon icon="trash-alt" className="fa mr-2"/>
                                    }
                                    Delete
                                </span>
                            </button>
                        </div>
                    </div> 
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '200px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                            <table className="table table-bordered table-sm table-hover text-nowrap" id="warehouseTable">
                                <thead>
                                    <tr>
                                        <TableSelectionAllRow
                                            checked={selectAllWh}
                                            onChange={this.toggleSelectAllWh}
                                        />
                                        <HeaderInput
                                            type="text"
                                            title="Warehouse"
                                            name="warehouse"
                                            value={header.warehouse}
                                            onChange={this.handleChangeHeader}
                                            sort={sortWh}
                                            toggleSort={this.toggleSortWh}
                                            index="0"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            settingsColWidth={settingsColWidth}
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {newWh && 
                                        <tr
                                            // onBlur={this.onBlurWh}
                                            // onFocus={this.onFocusWh}
                                            data-type="newWh"
                                        >
                                            <NewRowCreate
                                                onClick={ event => this.createNewWh(event)}
                                                creatingNewRow={creatingNewWh}
                                            />
                                            <NewRowInput
                                                fieldType="text"
                                                fieldName="warehouse"
                                                fieldValue={warehouse.warehouse}
                                                onChange={event => this.handleChangeNewWh(event)}
                                                color={newWhColor}
                                                index="0"
                                                settingsColWidth={settingsColWidth}
                                            />
                                        </tr>
                                    }
                                    {warehouses.items && this.filterName(warehouses.items, true).map((w) =>
                                        <tr key={w._id} onBlur={this.onBlurWh} onFocus={this.onFocusWh}>
                                            <TableSelectionRow
                                                id={w._id}
                                                selectAllRows={selectAllWh}
                                                selectedRows={selectedWh}
                                                callback={this.updateSelectedWh}
                                            />
                                            <TableInput 
                                                collection="warehouse"
                                                objectId={w._id}
                                                fieldName="warehouse"
                                                fieldValue={w.warehouse}
                                                fieldType="text"
                                                refreshStore={refreshStore}
                                                index="0"
                                                settingsColWidth={settingsColWidth}
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
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleNewArea}>
                                <span>
                                    {creatingNewArea ?
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw mr-2"/>
                                    :
                                        <FontAwesomeIcon icon="plus" className="fa mr-2"/>
                                    }
                                    Add
                                </span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={this.handleDeleteAreas}>
                                <span>
                                    {deletingAreas ?
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw mr-2"/>
                                    :
                                        <FontAwesomeIcon icon="trash-alt" className="fa mr-2"/>
                                    }
                                    Delete
                                </span>
                            </button>
                        </div>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '200px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="areaTable">
                                <thead>
                                    <tr>
                                        <TableSelectionAllRow
                                            checked={selectAllAreas}
                                            onChange={this.toggleSelectAllArea}
                                        />
                                        <HeaderInput
                                            type="text"
                                            title="Nr"
                                            name="areaNr"
                                            value={header.areaNr}
                                            onChange={this.handleChangeHeader}
                                            sort={sortArea}
                                            toggleSort={this.toggleSortArea}
                                            width='20%'
                                            index="1"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            settingsColWidth={settingsColWidth}
                                        />
                                        <HeaderInput
                                            type="text"
                                            title="Area"
                                            name="area"
                                            value={header.area}
                                            onChange={this.handleChangeHeader}
                                            sort={sortArea}
                                            toggleSort={this.toggleSortArea}
                                            width='calc(30px - 20%)'
                                            index="2"
                                            colDoubleClick={this.colDoubleClick}
                                            setColWidth={this.setColWidth}
                                            settingsColWidth={settingsColWidth}
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {newArea && 
                                        <tr
                                            // onBlur={this.onBlurArea}
                                            // onFocus={this.onFocusWh}
                                            data-type="newArea"
                                        >
                                            <NewRowCreate
                                                onClick={ event => this.createNewArea(event)}
                                                creatingNewRow={creatingNewArea}
                                            />
                                            <NewRowInput
                                                fieldType="text"
                                                fieldName="areaNr"
                                                fieldValue={area.areaNr}
                                                onChange={event => this.handleChangeNewArea(event)}
                                                color={newAreaColor}
                                                maxLength={1}
                                                index="1"
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <NewRowInput
                                                fieldType="text"
                                                fieldName="area"
                                                fieldValue={area.area}
                                                onChange={event => this.handleChangeNewArea(event)}
                                                color={newAreaColor}
                                                index="2"
                                                settingsColWidth={settingsColWidth}
                                            />
                                        </tr>
                                    }
                                    {areas && this.filterName(areas, false).map((a) =>
                                        <tr key={a._id} onBlur={this.onBlurArea} onFocus={this.onFocusArea}>
                                            <TableSelectionRow
                                                id={a._id}
                                                selectAllRows={selectAllAreas}
                                                selectedRows={selectedAreas}
                                                callback={this.updateSelectedArea}
                                            />
                                            <TableInput 
                                                collection="area"
                                                objectId={a._id}
                                                fieldName="areaNr"
                                                fieldValue={a.areaNr}
                                                fieldType="text"
                                                refreshStore={refreshStore}
                                                index="1"
                                                settingsColWidth={settingsColWidth}
                                            />
                                            <TableInput 
                                                collection="area"
                                                objectId={a._id}
                                                fieldName="area"
                                                fieldValue={a.area}
                                                fieldType="text"
                                                refreshStore={refreshStore}
                                                index="2"
                                                settingsColWidth={settingsColWidth}
                                            />
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={toggleWarehouse}>
                            <span><FontAwesomeIcon icon="times" className="fa mr-2"/>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
// export default SplitWarehouse;