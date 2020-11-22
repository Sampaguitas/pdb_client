import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import arrayMove from'array-move';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../../_helpers';
import { 
    accessActions, 
    alertActions,  
    fieldnameActions,
    fieldActions,
    heatlocActions,
    heatpickActions,
    pickticketActions,
    projectActions,
    settingActions,
    sidemenuActions
} from '../../../_actions';
import {
    baseTen,
    getInputType,
    getHeaders,
    getLocName,
    initSettingsFilter,
    initSettingsDisplay,
    initSettingsColWidth,
    copyObject
} from '../../../_functions';
import ProjectTable from '../../../_components/project-table/project-table';
import { TabDisplay, TabFilter, TabWidth } from '../../../_components/setting';
import SplitHeatPick from '../../../_components/split-line/split-heat-pick';
import { Layout, Modal } from '../../../_components';
import _ from 'lodash';
import { __promisify__ } from 'glob';

function getBodysForShow(picktickets, pickticketId, selection, headersForShow) {
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let i = 1;
    if (!_.isUndefined(picktickets) && picktickets.hasOwnProperty('items') && !_.isEmpty(picktickets.items)) {
        let pickticket = picktickets.items.find(element => _.isEqual(element._id, pickticketId));
        if (!_.isUndefined(pickticket)){
            let itemCount = !_.isEmpty(pickticket.pickitems) ? pickticket.pickitems.length : '';
            let mirWeight = 0;
            if (!_.isEmpty(pickticket.pickitems)) {
                mirWeight = pickticket.pickitems.reduce(function (acc, cur) {
                    if (!!cur.miritem.totWeight) {
                        acc += cur.miritem.totWeight;
                    }
                    return acc;
                }, 0);
            }
            if (!_.isEmpty(pickticket.pickitems)) {
                pickticket.pickitems.map(pickitem => {
                    arrayRow = [];
                    screenHeaders.map(screenHeader => {
                        switch(screenHeader.fields.fromTbl) {
                            case 'pickticket':
                                if (_.isEqual(screenHeader.fields.name, 'pickStatus')) {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: pickticket._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickticket.isProcessed ? 'Closed' : 'Open',
                                        disabled: true,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                } else {
                                    arrayRow.push({
                                        collection: pickticket.isProcessed ? 'virtual' : 'pickticket',
                                        objectId: pickticket._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickticket[screenHeader.fields.name],
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                }
                                break;
                            case 'pickitem':
                                arrayRow.push({
                                    collection: pickticket.isProcessed ? 'virtual' : 'pickitem',
                                    objectId: pickitem._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: pickitem[screenHeader.fields.name],
                                    disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                                    screenheaderId: screenHeader._id
                                });
                                break;
                            case 'miritem':
                                arrayRow.push({
                                    collection: pickticket.isProcessed ? 'virtual' : 'miritem',
                                    objectId: pickitem.miritem._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: pickitem.miritem[screenHeader.fields.name],
                                    disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                                    screenheaderId: screenHeader._id
                                });
                                break;
                            case 'po':
                                if (['project', 'projectNr'].includes(screenHeader.fields.name)) {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: project._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: screenHeader.fields.name === 'project' ? project.name || '' : project.number || '',
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                } else {
                                    arrayRow.push({
                                        collection: pickticket.isProcessed ? 'virtual' : 'po',
                                        objectId: pickitem.miritem.po._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue:pickitem.miritem.po[screenHeader.fields.name],
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                }
                                break;
                            case 'location':
                                if (screenHeader.fields.name === 'area') {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: pickitem.location.area._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickitem.location.area.area,
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                } else if (screenHeader.fields.name === 'warehouse') {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: pickticket.warehouse._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickticket.warehouse.warehouse,
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                } else if (screenHeader.fields.name === 'location') {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: pickitem.location._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: getLocName(pickitem.location, pickitem.location.area),
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    }); 
                                } else {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: '0',
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: '',
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    }); 
                                }
                                break;
                            case 'mir':
                                if (['itemCount', 'mirWeight'].includes(screenHeader.fields.name)) {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: mir._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: screenHeader.fields.name === 'itemCount' ? itemCount : mirWeight,
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                } else {
                                    arrayRow.push({
                                        collection: pickticket.isProcessed ? 'virtual' : 'mir',
                                        objectId: pickticket.mir._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickticket.mir[screenHeader.fields.name],
                                        disabled: pickticket.isProcessed ? true : screenHeader.edit,
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
                                disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                align: screenHeader.align,
                                fieldType: getInputType(screenHeader.fields.type),
                                screenheaderId: screenHeader._id
                            }); 
                        }
                    });
                    objectRow  = {
                        _id: i,
                        tablesId: {
                            poId: pickitem.miritem.po._id,
                            locationId: pickitem.location._id,
                            mirId: pickticket.mir._id,
                            miritemId: pickitem.miritem._id,
                            pickticketId: pickticket._id,
                            pickitemId: pickitem._id
                        },
                        fields: arrayRow
                    };
                    arrayBody.push(objectRow);
                    i++;
                });
            }
        }
        return arrayBody;
    } else {
        return [];
    }
}

class PtSplitwindow extends React.Component {
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
            pickticketId: '',
            pickticket: {
                pickNr: '',
                isProcessed: false,
                mirId: '',
                warehouseId: '',
                warehouse: '',
                projectId: ''
            },
            screenId: '5ed8f4f37c213e044cc1c1af', //Picking Ticket Splitwindow
            unlocked: false,
            screen: 'Picking Ticket Splitwindow',
            selectedIds: [],
            alert: {
                type:'',
                message:''
            },
            showSettings: false,
            showHeat: false,
            processing: false,
            menuItem: 'Warehouse',
            downloadingTable: false,
            settingSaving: false,
            deletingRows: false,
            //upload file
            showModalUpload: false,
            fileName: '',
            inputKey: Date.now(),
            uploading: false,
            responce:{},
        };
        this.moveScreenHeaders = this.moveScreenHeaders.bind(this);
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.refresHeatLocs = this.refresHeatLocs.bind(this);
        this.refreshHeatPicks = this.refreshHeatPicks.bind(this);
        this.refreshPickTicket = this.refreshPickTicket.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleClosePickTicket = this.handleClosePickTicket.bind(this);
        this.handleOpenPickTicket = this.handleOpenPickTicket.bind(this);
        this.toggleHeat = this.toggleHeat.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.handleInputSettings = this.handleInputSettings.bind(this);
        this.handleIsEqualSettings = this.handleIsEqualSettings.bind(this);
        this.handleClearInputSettings = this.handleClearInputSettings.bind(this);
        this.handleCheckSettings = this.handleCheckSettings.bind(this);
        this.handleCheckSettingsAll = this.handleCheckSettingsAll.bind(this);
        this.handleRestoreSettings = this.handleRestoreSettings.bind(this);
        this.handleSaveSettings = this.handleSaveSettings.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
        this.clearWidth = this.clearWidth.bind(this);
        //Upload File
        this.fileInput = React.createRef();
        this.onKeyPress = this.onKeyPress.bind(this);
        this.toggleModalUpload = this.toggleModalUpload.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.uploadTable = this.uploadTable.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.generateRejectionRows = this.generateRejectionRows.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingFieldnames,
            loadingFields,
            loadingHeatlocs,
            loadingHeatpicks,
            loadingPicktickets,
            loadingSelection,
            loadingSettings,
            location,
            //---------
            fieldnames,
            picktickets,
            pos,
            selection,
            settings 
        } = this.props;

        const { menuItem, screenId, headersForShow, settingsDisplay } = this.state; //splitScreenId
        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;
        let projectId = qs.id;
        let pickticketId = qs.pickticketid;
        dispatch(sidemenuActions.select(menuItem));
        if (qs.id) {
            this.setState({
                projectId: projectId,
                pickticketId: pickticketId
            });
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(projectId));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(projectId));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(projectId));
            }
            if (!loadingHeatlocs) {
                dispatch(heatlocActions.getAll(projectId));
            }
            if (!loadingHeatpicks) {
                dispatch(heatpickActions.getAll(projectId));
            }
            if (!loadingPicktickets) {
                dispatch(pickticketActions.getAll(projectId));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(projectId));
            }
            if (!loadingSettings) {
                dispatch(settingActions.getAll(projectId, userId));
            }
        }

        this.setState({
            headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            bodysForShow: getBodysForShow(picktickets, pickticketId, selection, headersForShow),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId)
        }, () => {
            if (picktickets.hasOwnProperty('items') && !_.isEmpty(picktickets.items)) {
                let found = picktickets.items.find(element => _.isEqual(element._id, pickticketId));
                if (!_.isUndefined(found)) {
                    this.setState({
                        pickticket: {
                            pickNr: found.pickNr || '',
                            isProcessed: found.isProcessed || false,
                            mirId: found.mirId || '',
                            warehouseId: found.warehouseId || '',
                            warehouse: found.warehouse.warehouse || '',
                            projectId: found.projectId || ''
                        }
                    });
                } 
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, pickticketId, screenId, settingsDisplay } = this.state; //splitScreenId,
        const { fieldnames, picktickets, selection, settings} = this.props;

        if (fieldnames != prevProps.fieldnames || settings != prevProps.settings){
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
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
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            });
        }

        if (picktickets != prevProps.picktickets || selection != prevProps.selection || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodysForShow(picktickets, pickticketId, selection, headersForShow)
            });
        }

        if ((pickticketId != prevState.pickticketId || picktickets != prevProps.picktickets) && picktickets.hasOwnProperty('items') && !_.isEmpty(picktickets.items)) {
            let found = picktickets.items.find(element => _.isEqual(element._id, pickticketId));
            if (!_.isUndefined(found)) {
                this.setState({
                    pickticket: {
                        pickNr: found.pickNr || '',
                        isProcessed: found.isProcessed || false,
                        mirId: found.mirId || '',
                        warehouseId: found.warehouseId || '',
                        warehouse: found.warehouse.warehouse || '',
                        projectId: found.projectId || ''
                    }
                });
            }  
        }
    }

    moveScreenHeaders(formPosition, toPosition) {
        const { headersForShow } = this.state;
        this.setState({headersForShow: arrayMove(headersForShow, formPosition, toPosition)});
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
            dispatch(pickticketActions.getAll(projectId));
            dispatch(settingActions.getAll(projectId, userId));
        }
    }

    refresHeatLocs() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(heatlocActions.getAll(projectId));
        }
    }

    refreshHeatPicks() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(heatpickActions.getAll(projectId));
            dispatch(heatlocActions.getAll(projectId));
            dispatch(pickticketActions.getAll(projectId));
        }
    }

    refreshPickTicket() {
        const { dispatch } = this.props;
        const { projectId } = this.state;

        if (projectId) {
            dispatch(pickticketActions.getAll(projectId));
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

    handleChange(event) {
        event.preventDefault();
        const name =  event.target.name;
        const value =  event.target.value;
        this.setState({
            [name]: value
        });
    }

    updateSelectedIds(selectedIds) {
        this.setState({
            selectedIds: selectedIds
        });
    }

    handleDeleteRows(event) {
        event.preventDefault();
        this.setState({
            alert: {
                type: 'alert-danger',
                message: 'Picking Items cannot be deleted individually (You can however delete the entire Picking Ticket from the main screen).'
            }
        });
    }

    toggleHeat(event) {
        event.preventDefault();
        const { showHeat, selectedIds } = this.state;
        if (!showHeat && selectedIds.length != 1) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select one line to change/add heat numbers.'
                }
            });
        } else {
            this.setState({
                alert: {
                    type:'',
                    message:''
                },
                showHeat: !showHeat
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

    handleClosePickTicket(event) {
        event.preventDefault();
        const { pickticketId } = this.state
        const alertMessage = [
            'Do you want to update the stock with the quantities of this Picking Ticket?',
            '',
            'In doing so:',
            '- the picked quantities of this picking ticket cannot be changed anymore',
            '- the stock will be updated with this picking ticket\'s quantities',
            '- stock history will be created.',
            '',
            'Make sure that the picked quantities for this picking ticket are complete. Otherwise click on "Cancel".'
        ];
        if (confirm(alertMessage.join('\r\n'))) {
            this.setState({processing: true}, () => {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({ pickticketId: pickticketId })
                };
                return fetch(`${config.apiUrl}/pickticket/close`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            processing: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshPickTicket);
                    }
                }));
            });
        }
    }

    handleOpenPickTicket(event) {
        event.preventDefault();
        const { pickticketId } = this.state
        const alertMessage = [
            'Would you like to reopen this Picking Ticket?',
            '',
            'In doing so:',
            '- the picked quantities of this picking ticket will be editable',
            '- the stock will be updated with this picking ticket\'s quantities',
            '- stock history will be removed.',
            '',
            'Make sure that the picked quantities need to be edited. Otherwise click on "Cancel".'
        ];
        if (confirm(alertMessage.join('\r\n'))) {
            this.setState({processing: true}, () => {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({ pickticketId: pickticketId })
                };
                return fetch(`${config.apiUrl}/pickticket/open`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            processing: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshPickTicket);
                    }
                }));
            });
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

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
          event.preventDefault();
        }
    }

    toggleModalUpload() {
        const { showModalUpload } = this.state;
        this.setState({
            ...this.state,
            showModalUpload: !showModalUpload,
            fileName: '',
            inputKey: Date.now(),
            uploading: false,
            responce:{},
            alert: {
                type:'',
                message:''
            }
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
                return fetch(`${config.apiUrl}/extract/downloadPickItem?projectId=${projectId}&screenId=${screenId}&unlocked=${unlocked}`, requestOptions)
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

    uploadTable(event){
        event.preventDefault();
        const { fileName, projectId, screenId } = this.state
        if(this.fileInput.current.files[0] && projectId && screenId && fileName) {
            this.setState({...this.state, uploading: true});
            var data = new FormData()
            data.append('file', this.fileInput.current.files[0]);
            data.append('projectId', projectId);
            data.append('screenId', screenId);
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader()}, //, 'Content-Type': 'application/json'
                body: data
            }
            return fetch(`${config.apiUrl}/extract/uploadPickItem`, requestOptions)
            .then(responce => responce.text().then(text => {
                const data = text && JSON.parse(text);
                if (!responce.ok) {
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    this.setState({
                        ...this.state,
                        uploading: false,
                        responce: {
                            rejections: data.rejections,
                            nProcessed: data.nProcessed,
                            nRejected: data.nRejected,
                            nEdited: data.nEdited
                        },
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshStore());
                } else {
                    this.setState({
                        ...this.state,
                        uploading: false,
                        responce: {
                            rejections: data.rejections,
                            nProcessed: data.nProcessed,
                            nRejected: data.nRejected,
                            nEdited: data.nEdited
                        },
                    }, this.refreshStore());
                }
            }));            
        }        
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

    render() {

        const { 
            menuItem,
            projectId, 
            screen, 
            screenId,
            selectedIds, 
            unlocked, 
            showHeat,
            showSettings,
            headersForShow,
            bodysForShow,
            pickticket,
            processing,
            tabs,
            settingsFilter,
            settingsDisplay,
            downloadingTable,
            settingsColWidth,
            settingSaving,
            deletingRows,
            //---------upload------
            showModalUpload,
            fileName,
            uploading,
            responce,
        } = this.state;

        const { accesses, fieldnames, fields, heatlocs, heatpicks, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSettings && !showModalUpload &&
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
                        <li className="breadcrumb-item active" aria-current="page">
                            <NavLink to={{ pathname: '/pickingticket', search: '?id=' + projectId }} tag="a">Picking ticket:</NavLink>
                        </li>
                        <span className="ml-3 project-title">
                            {selection.project ?
                                `${selection.project.name} - Picking Ticket: ${pickticket.pickNr} - Warehouse: ${pickticket.warehouse}`
                            :
                                <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw"/>
                            }
                        </span>
                    </ol>
                </nav>
                <div id="calloff" className={ (alert.message && !showSettings && !showModalUpload) ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button title="Change/Add Heat Numbers" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleHeat}>
                            <span><FontAwesomeIcon icon="file-certificate" className="fa mr-2"/>Heat Numbers</span>
                        </button>
                        <button title="PickTicket" className="btn btn-leeuwen btn-lg mr-2" onClick={pickticket.isProcessed ? this.handleOpenPickTicket : this.handleClosePickTicket}> {/* onClick={this.toggleHeat} */}
                            <span><FontAwesomeIcon icon={processing ? "spinner" : "exclamation-triangle"} className={processing ? "fa-pulse fa fa-fw mr-2" : "fa mr-2"}/>{pickticket.isProcessed ? 'Open PickTicket' : 'Close PickTicket'}</span>
                        </button>
                    </div>
                    <div className="body-section">
                        {fieldnames.items && 
                            <ProjectTable
                                moveScreenHeaders={this.moveScreenHeaders}
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
                                deletingRows={deletingRows}
                                settingsFilter = {settingsFilter}
                                settingsColWidth={settingsColWidth}
                                colDoubleClick={this.colDoubleClick}
                                setColWidth={this.setColWidth}
                                //upload file
                                toggleModalUpload={this.toggleModalUpload}
                            />
                        }
                    </div>
                </div>
                <Modal
                    show={showHeat}
                    hideModal={this.toggleHeat}
                    title="Change/Add Heat numbers"
                    size="modal-xl"
                >
                    <SplitHeatPick
                        alert={alert}
                        handleClearAlert={this.handleClearAlert}
                        toggleHeat={this.toggleHeat}
                        poId={!_.isEmpty(selectedIds) ? selectedIds[0].poId : ''}
                        locationId={!_.isEmpty(selectedIds) ? selectedIds[0].locationId : ''}
                        pickitemId={!_.isEmpty(selectedIds) ? selectedIds[0].pickitemId : ''}
                        projectId={projectId}
                        refresHeatLocs={this.refresHeatLocs}
                        refreshHeatPicks={this.refreshHeatPicks}
                        heatlocs={heatlocs}
                        heatpicks={heatpicks}
                        isProcessed={pickticket.isProcessed}
                    />
                </Modal>
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
                    show={showModalUpload}
                    hideModal={this.toggleModalUpload}
                    title="Upload File"
                    size="modal-xl"
                >
                    <div className="col-12">
                            {alert.message && 
                                <div className={`alert ${alert.type}`}>{alert.message}
                                    <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                        <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                                    </button>
                                </div>
                            }
                            <div className="action-row row ml-1 mb-3 mr-1" >
                                <form
                                    className="col-12"
                                    encType="multipart/form-data"
                                    onSubmit={this.uploadTable}
                                    onKeyPress={this.onKeyPress}
                                    style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                                >

                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Select File:</span>
                                            <input
                                                type="file"
                                                name="fileInput"
                                                id="fileInput"
                                                ref={this.fileInput}
                                                className="custom-file-input"
                                                style={{opacity: 0, position: 'absolute', pointerEvents: 'none', width: '1px'}}
                                                onChange={this.handleFileChange}
                                                key={this.state.inputKey}
                                            />
                                        </div>
                                        <label type="text" className="form-control text-left" htmlFor="fileInput" style={{display:'inline-block', padding: '7px'}}>{fileName ? fileName : 'Choose file...'}</label>
                                        <div className="input-group-append">
                                            <button type="submit" className="btn btn-outline-leeuwen-blue btn-lg">
                                                <span><FontAwesomeIcon icon={uploading ? 'spinner' : 'upload'} className={uploading ? 'fa-pulse fa-lg fa-fw' : 'fa-lg mr-2'}/>Upload</span>
                                            </button> 
                                        </div>       
                                    </div>
                                </form>
                            </div>
                        {!_.isEmpty(responce) &&
                            <div className="ml-1 mr-1">
                                <div className="form-group table-resonsive">
                                    <strong>Total Processed:</strong> {responce.nProcessed}<br />
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
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, fieldnames, fields, heatlocs, heatpicks, picktickets, selection, settings, sidemenu } = state;
    const { loadingAccesses } = accesses;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingHeatlocs } = heatlocs;
    const { loadingHeatpicks } = heatpicks;
    const { loadingPicktickets } = picktickets;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;

    
    return {
        accesses,
        alert,
        fieldnames,
        fields,
        heatlocs,
        heatpicks,
        loadingAccesses,
        loadingFieldnames,
        loadingFields,
        loadingHeatlocs,
        loadingHeatpicks,
        loadingPicktickets,
        loadingSelection,
        loadingSettings,
        picktickets,
        selection,
        settings,
        sidemenu
    };
}

const connectedPtSplitwindow = connect(mapStateToProps)(PtSplitwindow);
export { connectedPtSplitwindow as PtSplitwindow };