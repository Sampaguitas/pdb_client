import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../../_helpers';
import { history } from '../../../_helpers';
import { 
    accessActions, 
    alertActions,  
    fieldnameActions,
    fieldActions,
    mirActions, 
    projectActions,
    settingActions,
    sidemenuActions,
    warehouseActions,
} from '../../../_actions';
import {
    getDateFormat,
    StringToDate,
    isValidFormat,
    baseTen,
    arrayRemove,
    getInputType,
    getHeaders,
    initSettingsFilter,
    initSettingsDisplay,
    initSettingsColWidth,
    copyObject
} from '../../../_functions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import TabFilter from '../../../_components/setting/tab-filter';
import TabDisplay from '../../../_components/setting/tab-display';
import TabWidth from '../../../_components/setting/tab-width';
import WarehouseCheck from '../../../_components/warehouse-check';
import Modal from '../../../_components/modal';
import _ from 'lodash';
import { __promisify__ } from 'glob';

function getBodys(mirs, headersForShow) {
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    let i = 1;
    if (!_.isUndefined(mirs) && mirs.hasOwnProperty('items') && !_.isEmpty(mirs.items)) {
        mirs.items.map(mir => {
            let itemCount = !_.isEmpty(mir.miritems) ? mir.miritems.length : '';
            let mirWeight = 0;
            if (!_.isEmpty(mir.miritems)) {
                mirWeight = mir.miritems.reduce(function (acc, cur) {
                    if (!!cur.totWeight) {
                        acc += cur.totWeight;
                    }
                    return acc;
                }, 0);
            }
            arrayRow = [];
            screenHeaders.map(screenHeader => {
                switch(screenHeader.fields.fromTbl) {
                    case 'mir':
                        if (['itemCount', 'mirWeight'].includes(screenHeader.fields.name)) {
                            arrayRow.push({
                                collection: 'virtual',
                                objectId: mir._id,
                                fieldName: screenHeader.fields.name,
                                fieldValue: screenHeader.fields.name === 'itemCount' ? itemCount : mirWeight,
                                disabled: screenHeader.edit,
                                align: screenHeader.align,
                                fieldType: getInputType(screenHeader.fields.type),
                                screenheaderId: screenHeader._id
                            });
                        } else {
                            arrayRow.push({
                                collection: 'mir',
                                objectId: mir._id,
                                fieldName: screenHeader.fields.name,
                                fieldValue: mir[screenHeader.fields.name],
                                disabled: screenHeader.edit,
                                align: screenHeader.align,
                                fieldType: getInputType(screenHeader.fields.type),
                                screenheaderId: screenHeader._id
                            });
                        }
                        break;
                    default: arrayRow.push({
                        collection: 'virtual',
                        objectId: '0',
                        fieldName: screenHeader.fields.name,
                        fieldValue: '',
                        disabled: screenHeader.edit,
                        align: screenHeader.align,
                        fieldType: getInputType(screenHeader.fields.type),
                        screenheaderId: screenHeader._id
                    }); 
                }
            });
            objectRow  = {
                _id: i,
                tablesId: {
                    poId: '',
                    subId: '',
                    certificateId: '',
                    packitemId: '',
                    collipackId: '',
                    mirId: mir._id,
                },
                fields: arrayRow
            };
            arrayBody.push(objectRow);
            i++;
        });
        return arrayBody;
    } else {
        return [];
    }
}

function generateWarehouseLayout(warehouses, warehouseIds, handleCheckWarehouse) {
    let tempArray = [];
    if (warehouses.hasOwnProperty('items') && !_.isEmpty(warehouses.items)) {
        warehouses.items.map(function (element, index){
            tempArray.push(
                <WarehouseCheck
                    key={index}
                    id={element._id}
                    title={element.warehouse}
                    isChecked={warehouseIds.includes(element._id)}
                    handleCheck={handleCheckWarehouse}
                />
            );
        });
    }
    return (
        <div style={{borderStyle: 'none', borderWidth: '1px', borderColor: '#ddd', maxHeight: '60px', overflowY: 'auto'}}>
            <div className="row ml-2 mr-2 mt-2">
                
                {tempArray}
            </div>
        </div>
    );
}

class MaterialIssueRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headersForShow: [],
            bodysForShow: [],
            settingsFilter: [],
            settingsDisplay: [],
            settingsColWidth: {},
            tabs: [
                {
                    index: 0, 
                    id: 'filter',
                    label: 'Filter',
                    component: TabFilter, 
                    active: true, 
                    isLoaded: false
                },
                {
                    index: 1, 
                    id: 'display',
                    label: 'Display',
                    component: TabDisplay, 
                    active: false, 
                    isLoaded: false
                },
                {
                    index: 2,
                    id: 'width',
                    label: 'Width',
                    component: TabWidth,
                    active: false,
                    isLoaded: false
                }
            ],
            projectId:'',
            screenId: '5ed1e76e7c213e044cc01884', //Material Issue Record
            unlocked: false,
            screen: 'Material issue record',
            selectedIds: [],
            warehouseIds: [],
            newMir: {},
            creatingMir: false,
            creatingPt: false,
            logs: [],
            alert: {
                type:'',
                message:''
            },
            showSettings: false,
            showCreateMir: false,
            showCreatePt: false,
            menuItem: 'Warehouse',
            downloadingTable: false,
            settingSaving: false
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNewMir = this.handleChangeNewMir.bind(this);
        this.handleCheckWarehouse = this.handleCheckWarehouse.bind(this);

        this.refreshStore = this.refreshStore.bind(this);
        this.refreshMir = this.refreshMir.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.createNewMir = this.createNewMir.bind(this);
        this.handlePrepare = this.handlePrepare.bind(this);
        this.handleCreatePT = this.handleCreatePT.bind(this);
        //Toggle Modals
        this.toggleSettings = this.toggleSettings.bind(this);
        this.toggleCreateMir = this.toggleCreateMir.bind(this);
        this.toggleCreatePt = this.toggleCreatePt.bind(this);
        //Settings
        this.handleInputSettings = this.handleInputSettings.bind(this);
        this.handleIsEqualSettings = this.handleIsEqualSettings.bind(this);
        this.handleClearInputSettings = this.handleClearInputSettings.bind(this);
        this.handleCheckSettings = this.handleCheckSettings.bind(this);
        this.handleCheckSettingsAll = this.handleCheckSettingsAll.bind(this);
        this.handleRestoreSettings = this.handleRestoreSettings.bind(this);
        this.handleSaveSettings = this.handleSaveSettings.bind(this);
        this.generateLogRows = this.generateLogRows.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
        this.clearWidth = this.clearWidth.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingFieldnames,
            loadingFields,
            loadingMirs,
            loadingSelection,
            loadingSettings,
            loadingWarehouses,
            location,
            //---------
            fieldnames,
            mirs,
            selection,
            settings 
        } = this.props;

        const { menuItem, screenId, headersForShow, settingsDisplay } = this.state; //splitScreenId
        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;
        dispatch(sidemenuActions.select(menuItem));
        if (qs.id) {
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingMirs) {
                dispatch(mirActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
            if (!loadingSettings) {
                dispatch(settingActions.getAll(qs.id, userId));
            }
            if (!loadingWarehouses) {
                dispatch(warehouseActions.getAll(qs.id));
            }
        }

        this.setState({
            headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            bodysForShow: getBodys(mirs, headersForShow),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, screenId, settingsDisplay } = this.state; //splitScreenId,
        const { fields, fieldnames, selection, settings, mirs } = this.props;

        if (fieldnames != prevProps.fieldnames){
            this.setState({
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            });
        }

        if (settings != prevProps.settings){
            this.setState({
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
                settingsColWidth: initSettingsColWidth(settings, screenId)
            });
        }

        if (settingsDisplay != prevState.settingsDisplay) {
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow')
            });
        }

        if (mirs != prevProps.mirs || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodys(mirs, headersForShow)
            });
        }

    }

    handleClearAlert(event){
        event.preventDefault();
        const { dispatch } = this.props;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            } 
        });
        dispatch(alertActions.clear());
    }

    handleInputSettings(id, value) {
        const { settingsFilter } = this.state;
        let tempArray = settingsFilter;
        let found = tempArray.find(element => element._id === id);
        if(!!found) {
            found.value = value;
            this.setState({ settingsFilter: tempArray });
        } 
    }

    handleIsEqualSettings(event, id) {
        event.preventDefault();
        const { settingsFilter } = this.state;
        let tempArray = settingsFilter;
        let found = tempArray.find(element => element._id === id);
        if(!!found) {
            found.isEqual = !found.isEqual;
            this.setState({ settingsFilter: tempArray });
        } 
    }

    handleClearInputSettings() {
        const { settingsFilter } = this.state;
        let tempArray = settingsFilter;
        tempArray.map(function (element) {
            element.value = '';
            element.isEqual = false;
        });
        this.setState({ settingsFilter: tempArray });
    }

    handleCheckSettings(id) {
        const { fieldnames } = this.props;
        const { settingsDisplay, screenId } = this.state;
        let tempArray = settingsDisplay;
        let found = tempArray.find(element => element._id === id);
        if(!!found) {
            found.isChecked = !found.isChecked;
            this.setState({
                settingsDisplay: tempArray,
                headersForShow: getHeaders(tempArray, fieldnames, screenId, 'forShow')
            });
        }
    }

    handleCheckSettingsAll(bool) {
        const { fieldnames } = this.props;
        const { settingsDisplay, screenId } = this.state;
        let tempArray = settingsDisplay;
        tempArray.map(element => element.isChecked = bool);
        this.setState({
            settingsDisplay: tempArray,
            headersForShow: getHeaders(tempArray, fieldnames, screenId, 'forShow')
        });
    }

    handleRestoreSettings(event) {
        event.preventDefault();
        const { fieldnames, settings } = this.props;
        const { screenId } = this.state;
        this.setState({
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
        });
    }

    handleSaveSettings(event) {
        event.preventDefault();
        const { projectId, screenId, settingsFilter, settingsDisplay, settingsColWidth  } = this.state;
        let userId = JSON.parse(localStorage.getItem('user')).id;
        this.setState({settingSaving: true}, () => {
            let params = {
                filter: settingsFilter.reduce(function(acc, cur) {
                    if (!!cur.value) {
                        acc.push({
                            _id: cur._id,
                            value: cur.value,
                            isEqual: cur.isEqual
                        });
                    }
                    return acc;
                }, []),
                display: settingsDisplay.reduce(function(acc, cur) {
                    if (!cur.isChecked) {
                        acc.push(cur._id);
                    }
                    return acc;
                }, []),
                colWidth: settingsColWidth
            }
            const requestOptions = {
                method: 'PUT',
                headers: { ...authHeader(), 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    projectId: projectId,
                    screenId: screenId,
                    userId: userId,
                    params: params
                })
            };
            return fetch(`${config.apiUrl}/setting/upsert`, requestOptions)
            .then(responce => responce.text().then(text => {
                const data = text && JSON.parse(text);
                if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                } else {
                    this.setState({
                        settingSaving: false,
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshStore);
                }
            }));
        });
    }

    refreshStore() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        let userId = JSON.parse(localStorage.getItem('user')).id;

        if (projectId) {
            dispatch(mirActions.getAll(projectId));
            dispatch(settingActions.getAll(projectId, userId));
        }
    }

    refreshMir() {
        const { dispatch } = this.props;
        const { projectId } = this.state;

        if (projectId) {
            dispatch(mirActions.getAll(projectId));
        }
    }

    toggleUnlock(event) {
        event.preventDefault()
        const { unlocked } = this.state;
        this.setState({
            unlocked: !unlocked
        }, () => {
        });
    }

    downloadTable(event){
        event.preventDefault();
        const { projectId, screenId, screen, selectedIds, unlocked } = this.state;
        if (_.isEmpty(selectedIds)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select line(s) to be downloaded.'
                }
            });
        } else if (projectId && screenId && screen) {
            this.setState({
                downloadingTable: true
            }, () => {
                var currentDate = new Date();
                var date = currentDate.getDate();
                var month = currentDate.getMonth();
                var year = currentDate.getFullYear();
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedIds: selectedIds})
                };
                return fetch(`${config.apiUrl}/extract/download?projectId=${projectId}&screenId=${screenId}&unlocked=${unlocked}`, requestOptions)
                // .then(res => res.blob()).then(blob => saveAs(blob, `DOWNLOAD_${screen}_${year}_${baseTen(month+1)}_${date}.xlsx`));
                .then(responce => {
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    } else if (responce.status === 400) {
                        this.setState({
                            downloadingTable: false,
                            alert: {
                                type: 'alert-danger',
                                message: 'an error has occured'  
                            }
                        });
                    } else {
                        this.setState({
                            downloadingTable: false
                        }, () => responce.blob().then(blob => saveAs(blob, `DOWNLOAD_${screen}_${year}_${baseTen(month+1)}_${date}.xlsx`)));
                    }
                });
            });
        }
    }

    handleChange(event) {
        event.preventDefault();
        const name =  event.target.name;
        const value =  event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleChangeNewMir(event) {
        event.preventDefault();
        const { projectId, newMir } = this.state;
        const name =  event.target.name;
        const value =  event.target.value;
        this.setState({
            newMir: {
                ...newMir,
                [name]: value,
                projectId
            }
        });
    }

    handleCheckWarehouse(id) {
        const { warehouseIds } = this.state;
        if (warehouseIds.includes(id)) {
            this.setState({
                warehouseIds: arrayRemove(warehouseIds, id)
            });
        } else {
            this.setState({
                warehouseIds: [...warehouseIds, id]
            });
        }
    }

    updateSelectedIds(selectedIds) {
        this.setState({
            selectedIds: selectedIds
        });
    }

    handleDeleteRows(event) {
        event.preventDefault();
        const { selectedIds } = this.state;
        if (_.isEmpty(selectedIds)) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be deleted.'
                }
            });
        } else if (confirm('For the Selected line(s) all MIR details, MIR Items and picking lists shall be deleted. Are you sure you want to proceed?')){
            this.setState({
                ...this.state,
                deleting: true
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedIds: selectedIds })
                };
                return fetch(`${config.apiUrl}/mir/delete`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            deleting: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshMir);
                    }
                }));
            });
        }
    }

    toggleSettings(event) {
        event.preventDefault();
        const { showSettings } = this.state;
        this.setState({
            alert: {
                type: '',
                message: ''
            },
            showSettings: !showSettings
        });
    }

    toggleCreateMir(event) {
        event.preventDefault();
        const { showCreateMir } = this.state;
        this.setState({
            alert: {
                type: '',
                message: ''
            },
            newMir: {},
            showCreateMir: !showCreateMir
        });
    }

    toggleCreatePt(event) {
        event.preventDefault();
        const { warehouses } = this.props;
        const { showCreatePt, selectedIds } = this.state;
        if (_.isEmpty(selectedIds) || selectedIds.length > 1) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select one line to generate picking tickets'
                }
            });
        } else if (warehouses.hasOwnProperty('items') && !_.isEmpty(warehouses.items)) {
            let warehousesIds = warehouses.items.reduce(function (acc, cur) {
                acc.push(cur._id)
                return acc;
            }, []);
            this.setState({
                alert: {
                    type: '',
                    message: ''
                },
                logs: [],
                warehouseIds: warehousesIds,
                showCreatePt: !showCreatePt
            });
        }
    }

    createNewMir(event) {
        event.preventDefault();
        const { newMir } = this.state;
        if (!newMir.mir && !newMir.dateReceived && !newMir.dateExpected && !newMir.projectId ) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'All fields are required.'
                }
            });
        } else if (!isValidFormat(newMir.dateReceived, 'date', getDateFormat())) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Date Received: Not a valid date format.'
                }
            });
        } else if (!isValidFormat(newMir.dateExpected, 'date', getDateFormat())) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Date Expected: Not a valid date format.'
                }
            });
        } else {
            //fix on date format
            let dateReceived = StringToDate(newMir.dateReceived, 'date', getDateFormat());
            let dateExpected = StringToDate(newMir.dateExpected, 'date', getDateFormat());
            
            this.setState({
                ...this.state,
                creatingMir: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mir: newMir.mir,
                        dateReceived: dateReceived,
                        dateExpected: dateExpected,
                        projectId: newMir.projectId
                    })
                };
                return fetch(`${config.apiUrl}/mir/create`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);;
                    } else {
                        this.setState({
                            creatingMir: false,
                            showCreateMir: false,
                            newMir: {},
                            alert: {
                                type: responce.status === 200 ? '' : 'alert-danger',
                                message: responce.status === 200 ? '' : data.message
                            }
                        }, this.refreshMir);
                    }
                }));
            });
        }
    }

    handlePrepare(event) {
        event.preventDefault();
        const { selectedIds, projectId } = this.state;
        if (projectId === '') {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Could not retreive projectId.'
                }
            });
        } else if (selectedIds.length != 1) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select one line to Add/Edit MIR items.'
                }
            });
        } else if (!selectedIds[0].hasOwnProperty('mirId')) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Could not retreive mirId.'
                }
            });
        } else {
            history.push({
                pathname:'/mirsplitwindow',
                search: '?id=' + projectId + '&mirid=' + selectedIds[0].mirId
            });
        }
    }

    handleCreatePT(event) {
        event.preventDefault();
        const { selectedIds, warehouseIds, projectId } = this.state;
        if (projectId === '') {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Could not retreive projectId.'
                }
            });
        } else if (selectedIds.length != 1) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select one line to generate picking tickets.'
                }
            });
        } else if (!selectedIds[0].hasOwnProperty('mirId')) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Could not retreive mirId.'
                }
            });
        } else if (warehouseIds.length == 0) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'You need to select at least one warehouse.'
                }
            });
        } else {
            this.setState({
                ...this.state,
                creatingPt: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectId: projectId,
                        mirId: selectedIds[0].mirId,
                        warehouseIds: warehouseIds
                    })
                };
                return fetch(`${config.apiUrl}/pickticket/create`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);;
                    } else {
                        this.setState({
                            creatingPt: false,
                            logs: data.logs || [],
                            alert: {
                                type: responce.status === 400 ? 'alert-danger' : 'alert-success',
                                message: data.message
                            }
                        }, this.refreshMir);
                    }
                }));
            });
        }
    }

    handleModalTabClick(event, tab){
        event.preventDefault();
        const { tabs } = this.state; // 1. Get tabs from state
        tabs.forEach((t) => {t.active = false}); //2. Reset all tabs
        tab.isLoaded = true; // 3. set current tab as active
        tab.active = true;
        this.setState({
            ...this.state,
            tabs // 4. update state
        })
    }

    generateLogRows(logs){
        let temp =[]
        if (!_.isEmpty(logs)) {
            logs.map(function(r, index) {
                temp.push(
                <tr key={index}>
                    <td>{r.lineNr}</td>
                    <td>{r.qtyRequired}</td>
                    <td>{r.qtyAlPicked}</td>
                    <td>{r.qtyTbPicked}</td>
                    <td>{r.qtyPrepared}</td>
                    <td>{r.qtyRemaining}</td>
                </tr>   
                );
            });
            return (temp);
        }
    }

    toggleCollapse() {
        const { dispatch } = this.props;
        dispatch(sidemenuActions.toggle());
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

    clearWidth(event, ...indexes) {
        event.preventDefault();
        const { settingsColWidth } = this.state;
        if (!_.isEmpty(indexes)) {
            let tempArray = copyObject(settingsColWidth);
            indexes.map(index=> delete tempArray[index]);
            this.setState({settingsColWidth: tempArray});
        } else {
            this.setState({settingsColWidth: {} })
        }
    }

    render() {

        const { 
            menuItem,
            projectId, 
            screen, 
            screenId,
            selectedIds,
            warehouseIds,
            unlocked, 
            showSettings,
            //--------
            headersForShow,
            bodysForShow,
            //---------------
            newMir,
            showCreateMir,
            showCreatePt,
            creatingMir,
            creatingPt,
            logs,
            //'-------------------'
            tabs,
            settingsFilter,
            settingsDisplay,
            downloadingTable,
            settingsColWidth,
            settingSaving
        } = this.state;

        const { accesses, fieldnames, fields, warehouses, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSettings && !showCreatePt &&
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
                        <li className="breadcrumb-item active" aria-current="page">Material issue record:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="materialissuerecord" className={ (alert.message && !showSettings && !showCreatePt) ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Create Material Issue Record" onClick={this.toggleCreateMir}>
                            <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Create MIR</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Prepare Material Issue Record" onClick={this.handlePrepare}>
                            <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Prepare MIR</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Create Picking Tickets" onClick={this.toggleCreatePt}>
                            <span><FontAwesomeIcon icon="clipboard-list" className="fa mr-2"/>Create Tickets</span>
                        </button>
                    </div>
                    <div className="body-section">
                        {fieldnames.items && 
                            <ProjectTable
                                screenHeaders={headersForShow}
                                screenBodys={bodysForShow}
                                projectId={projectId}
                                screenId={screenId}
                                selectedIds={selectedIds}
                                updateSelectedIds = {this.updateSelectedIds}
                                toggleUnlock={this.toggleUnlock}
                                downloadTable={this.downloadTable}
                                downloadingTable={downloadingTable}
                                unlocked={unlocked}
                                screen={screen}
                                fieldnames={fieldnames}
                                fields={fields}
                                toggleSettings={this.toggleSettings}
                                refreshStore={this.refreshStore}
                                handleDeleteRows = {this.handleDeleteRows}
                                settingsFilter = {settingsFilter}
                                settingsColWidth={settingsColWidth}
                                colDoubleClick={this.colDoubleClick}
                                setColWidth={this.setColWidth}
                            />
                        }
                    </div>
                </div>
                <Modal
                    show={showSettings}
                    hideModal={this.toggleSettings}
                    title="User Settings"
                    size="modal-xl"
                >
                    <div id="modal-tabs">
                        <ul className="nav nav-tabs">
                        {tabs.map((tab) => 
                            <li className={tab.active ? 'nav-item active' : 'nav-item'} key={tab.index}>
                                <a className="nav-link" href={'#'+ tab.id} data-toggle="tab" onClick={event => this.handleModalTabClick(event,tab)} id={tab.id + '-tab'} aria-controls={tab.id} role="tab">
                                    {tab.label}
                                </a>
                            </li>                        
                        )}
                        </ul>
                        <div className="tab-content" id="modal-nav-tabContent">
                            {alert.message &&
                                <div className={`alert ${alert.type}`}>{alert.message}
                                    <button className="close" onClick={this.handleClearAlert}>
                                        <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                                    </button>
                                </div>
                            }
                            {tabs.map(tab =>
                                <div
                                    className={tab.active ? "tab-pane fade show active" : "tab-pane fade"}
                                    id={tab.id}
                                    role="tabpanel"
                                    aria-labelledby={tab.id + '-tab'}
                                    key={tab.index}
                                >
                                    <tab.component 
                                        tab={tab}
                                        settingsFilter={settingsFilter}
                                        settingsDisplay={settingsDisplay}
                                        settingsColWidth={settingsColWidth}
                                        screenHeaders={headersForShow}
                                        clearWidth={this.clearWidth}
                                        handleInputSettings={this.handleInputSettings}
                                        handleIsEqualSettings={this.handleIsEqualSettings}
                                        handleClearInputSettings={this.handleClearInputSettings}
                                        handleCheckSettings={this.handleCheckSettings}
                                        handleCheckSettingsAll={this.handleCheckSettingsAll}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-right mt-3"> 
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.handleRestoreSettings}>
                            <span><FontAwesomeIcon icon="undo-alt" className="fa mr-2"/>Restore</span>
                        </button>
                        <button className="btn btn-leeuwen btn-lg mr-2" onClick={this.handleSaveSettings}>
                            <span><FontAwesomeIcon icon={settingSaving ? "spinner" : "save" } className={settingSaving ? "fa-pulse fa-fw fa nr-2" : "fa mr-2"}/>Save</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={this.toggleSettings}>
                            <span><FontAwesomeIcon icon="times" className="fa mr-2"/>Close</span>
                        </button>
                    </div>
                </Modal>
                <Modal
                    show={showCreateMir}
                    hideModal={this.toggleCreateMir}
                    title="Create material issue record"
                    
                >
                    <div className="col-12">
                        <form onSubmit={this.createNewMir}>
                            <div className="form-group">
                                <label htmlFor="mir">MIR No.</label>
                                <input
                                    className="form-control"
                                    type='text'
                                    name="mir"
                                    value={newMir.mir}
                                    onChange={this.handleChangeNewMir}
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateReceived">Date received</label>
                                <input
                                    className="form-control"
                                    type='text'
                                    name="dateReceived"
                                    value={newMir.dateReceived}
                                    onChange={this.handleChangeNewMir}
                                    placeholder={getDateFormat()}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateExpected">Date expected</label>
                                <input
                                    className="form-control"
                                    type='text'
                                    name="dateExpected"
                                    value={newMir.dateExpected}
                                    onChange={this.handleChangeNewMir}
                                    placeholder={getDateFormat()}
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-leeuwen-blue btn-lg mt-2">
                                    <span><FontAwesomeIcon icon={creatingMir ? "spinner" : "plus"} className={creatingMir ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Create</span>
                                </button>
                            </div>
                        </form>                  
                    </div>
                </Modal>
                <Modal
                    show={showCreatePt}
                    hideModal={this.toggleCreatePt}
                    title="Create Picking Tickets:" 
                    size="modal-lg"
                >
                        <div className="ml-1 mr-1">
                            {alert.message && 
                                <div className={`alert ${alert.type} mt-3`}>{alert.message}
                                    <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                        <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                                    </button>
                                </div>
                            }
                            <div className="mt-4">
                                <label>Pick from warehouse:</label>
                                {generateWarehouseLayout(warehouses, warehouseIds, this.handleCheckWarehouse)}
                            </div>
                            <div className="text-right mt-2 mb-4">
                                <button className="btn btn-leeuwen-blue btn-lg" title="Generate Picking Tickets" onClick={this.handleCreatePT}>
                                    <span><FontAwesomeIcon icon={creatingPt ? "spinner" : "plus"} className={creatingPt ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Create</span>
                                </button>
                            </div>
                            {!_.isEmpty(logs) &&
                                <div className="rejections" style={{height: '200px'}}>
                                    <div className="table-responcive custom-table-container">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Line</th>
                                                    <th>Required</th>
                                                    <th>Already picked</th>
                                                    <th>To be picked</th>
                                                    <th>Prepared</th>
                                                    <th>Remaining</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.generateLogRows(logs)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }
                        </div>              
                </Modal>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, fieldnames, fields, mirs, selection, settings, sidemenu, warehouses } = state;
    const { loadingAccesses } = accesses;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingMirs } = mirs;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;
    const { loadingWarehouses } = warehouses

    return {
        accesses,
        alert,
        fieldnames,
        fields,
        loadingAccesses,
        loadingFieldnames,
        loadingFields,
        loadingMirs,
        loadingSelection,
        loadingSettings,
        loadingWarehouses,
        mirs,
        selection,
        settings,
        sidemenu,
        warehouses
    };
}

const connectedMaterialIssueRecord = connect(mapStateToProps)(MaterialIssueRecord);
export { connectedMaterialIssueRecord as MaterialIssueRecord };