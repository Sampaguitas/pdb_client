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
import { throws } from 'assert';

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

function arraySorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'warehouse':
        case 'area':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.name) && !_.isNull(a.name) ? String(a.name).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.name) && !_.isNull(b.name) ? String(b.name).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.name) && !_.isNull(a.name) ? String(a.name).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.name) && !_.isNull(b.name) ? String(b.name).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.number) && !_.isNull(a.number) ? String(a.number).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.number) && !_.isNull(b.number) ? String(b.number).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.number) && !_.isNull(a.number) ? String(a.number).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.number) && !_.isNull(b.number) ? String(b.number).toUpperCase() : '';
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

class Warehouse extends Component {
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
            //newRows
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
        this.toggleSelectAllArea = this.toggleSelectAllArea.bind(this);
        this.toggleSortWh = this.toggleSortWh.bind(this);
        this.toggleSortArea = this.toggleSortArea.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        //newWh
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
        //selected wh
        this.updateSelectedWh = this.updateSelectedWh.bind(this);
        this.updateSelectedArea = this.updateSelectedArea.bind(this);
        this.filterName = this.filterName.bind(this);
        // this.filterAreas = this.filterAreas.bind(this);
        
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

    createNewArea(event) {
        event.preventDefault();
        const { refreshStore } = this.props;
        const { area } = this.state;
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

    // filterAreas(array) {
    //     const { header, sortArea } = this.state;
    //     if (array) {
    //         return arraySorted(array, sortArea).filter(function (object) {
    //             return (doesMatch(header.areaNr, object.number, 'String', false)
    //             && doesMatch(header.area, object.name, 'String', false));
    //         });
    //     } else {
    //         return [];
    //     }
    // }

    render() {

        const { toggleWarehouse, warehouses, refreshStore } = this.props;
        const { 
            selectAllWh,
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
            creatingNewWh
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
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa-lg fa-fw mr-2"/>
                                    :
                                        <FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>
                                    }
                                    Add
                                </span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={this.handleDeleteWh}>
                                <span>
                                    {deletingWh ?
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa-lg fa-fw mr-2"/>
                                    :
                                        <FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>
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
                                                fieldName="warehouse"
                                                fieldValue={warehouse.warehouse}
                                                onChange={event => this.handleChangeNewWh(event)}
                                                color={newWhColor}
                                            />
                                        </tr>
                                    }
                                    {warehouses.items && this.filterName(warehouses.items, true).map((w) =>
                                        <tr key={w._id} onBlur={this.onBlurWh} onFocus={this.onFocusWh}>
                                            <TableSelectionRow
                                                id={w._id}
                                                selectAllRows={selectAllWh}
                                                callback={this.updateSelectedWh}
                                            />
                                            <TableInput 
                                                collection="warehouse"
                                                objectId={w._id}
                                                fieldName="warehouse"
                                                fieldValue={w.warehouse}
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
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleNewArea}>
                                <span>
                                    {creatingNewArea ?
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa-lg fa-fw mr-2"/>
                                    :
                                        <FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>
                                    }
                                    Add
                                </span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={this.handleDeleteAreas}>
                                <span>
                                    {deletingAreas ?
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa-lg fa-fw mr-2"/>
                                    :
                                        <FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>
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
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {newArea && 
                                        <tr
                                            onBlur={this.onBlurArea}
                                            onFocus={this.onFocusWh}
                                            data-type="newArea"
                                        >
                                            <NewRowCreate
                                                onClick={ event => this.createNewArea(event)}
                                            />
                                            <NewRowInput
                                                fieldType="text"
                                                fieldName="areaNr"
                                                fieldValue={area.areaNr}
                                                onChange={event => this.handleChangeNewArea(event)}
                                                color={newAreaColor}
                                                maxLength={1}
                                            />
                                            <NewRowInput
                                                fieldType="text"
                                                fieldName="area"
                                                fieldValue={area.area}
                                                onChange={event => this.handleChangeNewArea(event)}
                                                color={newAreaColor}
                                            />
                                        </tr>
                                    }
                                    {areas && this.filterName(areas, false).map((a) =>
                                        <tr key={a._id} onBlur={this.onBlurArea} onFocus={this.onFocusArea}>
                                            <TableSelectionRow
                                                id={a._id}
                                                selectAllRows={selectAllAreas}
                                                callback={this.updateSelectedArea}
                                            />
                                            <TableInput 
                                                collection="area"
                                                objectId={a._id}
                                                fieldName="areaNr"
                                                fieldValue={a.areaNr}
                                                fieldType="text"
                                                refreshStore={refreshStore}
                                            />
                                            <TableInput 
                                                collection="area"
                                                objectId={a._id}
                                                fieldName="area"
                                                fieldValue={a.area}
                                                fieldType="text"
                                                refreshStore={refreshStore}
                                            />
                                        </tr>
                                    )}
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