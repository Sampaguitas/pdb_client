import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../../../_helpers';
import { 
    accessActions, 
    alertActions,
    fieldnameActions,
    fieldActions,
    pickticketActions,
    projectActions,
    settingActions,
    sidemenuActions
} from '../../../../_actions';
import {
    getDateFormat,
    passSelectedIds,
    StringToDate,
    isValidFormat,
    getObjectIds,
    baseTen,
    arraySorted,
    getInputType,
    getHeaders,
    getLocName,
    initSettingsFilter,
    initSettingsDisplay,
    initSettingsColWidth,
    copyObject
} from '../../../../_functions';
import ProjectTable from '../../../../_components/project-table/project-table';
import { TabDisplay, TabFilter, TabWidth } from '../../../../_components/setting';
import SplitWhPackItem from '../../../../_components/split-line/split-whpackitem';
import { Layout, Modal } from '../../../../_components';
import _ from 'lodash';

function passSelectedPickticket(selectedIds, picktickets) {
    if (_.isEmpty(selectedIds) || selectedIds.length > 1 || _.isEmpty(picktickets.items)){
        return {};
    } else {
        return picktickets.items.find(pickticket => pickticket._id === selectedIds[0].pickticketId);
    }
}

function getBodys(fieldnames, selection, picktickets, headersForShow){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    let project = selection.project || { _id: '0', name: '', number: '' };

    let i = 1;
    if (!_.isUndefined(picktickets) && picktickets.hasOwnProperty('items') && !_.isEmpty(picktickets.items)) {
        picktickets.items.map(pickticket => {
            if (!_.isEmpty(pickticket.pickitems) && pickticket.isProcessed) {
                pickticket.pickitems.map(pickitem => {
                    if(!_.isEmpty(pickitem.whpackitems)) {
                        pickitem.whpackitems.map(whpackitem => {
                            arrayRow = [];
                            screenHeaders.map(screenHeader => {
                                switch(screenHeader.fields.fromTbl) {
                                    case 'pickticket':
                                        arrayRow.push({
                                            collection: 'pickticket',
                                            objectId: pickticket._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: pickticket[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
                                        });
                                        break;
                                    case 'pickitem':
                                        arrayRow.push({
                                            collection: 'pickitem',
                                            objectId: pickitem._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: pickitem[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
                                        });
                                        break;
                                    case 'miritem':
                                        arrayRow.push({
                                            collection: 'miritem',
                                            objectId: pickitem.miritem._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: pickitem.miritem[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
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
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                                screenheaderId: screenHeader._id
                                            });
                                        } else {
                                            arrayRow.push({
                                                collection: 'po',
                                                objectId: pickitem.miritem.po._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: pickitem.miritem.po[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
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
                                                disabled: screenHeader.edit,
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
                                                disabled: screenHeader.edit,
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
                                                disabled: screenHeader.edit,
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
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                                screenheaderId: screenHeader._id
                                            }); 
                                        }
                                        break;
                                    case 'packitem':
                                        arrayRow.push({
                                            collection: 'whpackitem',
                                            objectId: whpackitem._id,
                                            parentId: pickitem._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: whpackitem[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
                                        });
                                        break;
                                    case 'mir':
                                        if (!['itemCount', 'mirWeight'].includes(screenHeader.fields.name)) {
                                            arrayRow.push({
                                                collection: 'mir',
                                                objectId: pickticket.mir._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: pickticket.mir[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
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
                                    pickticketId: pickticket._id,
                                    pickitemId: pickitem._id,
                                    miritemId: pickitem.miritem._id,
                                    projectId: project._id,
                                    poId: pickitem.miritem.po._id,
                                    areaId: pickitem.location.area._id,
                                    warehouseId: pickticket.warehouse._id,
                                    locationId: pickitem.location._id,
                                    whpackitemId: whpackitem._id
                                },
                                isPacked: true,
                                fields: arrayRow
                            };
                            arrayBody.push(objectRow);
                            i++;
                            
                        });
                    } else {
                        arrayRow = [];
                        screenHeaders.map(screenHeader => {
                            switch(screenHeader.fields.fromTbl) {
                                case 'pickticket':
                                    arrayRow.push({
                                        collection: 'pickticket',
                                        objectId: pickticket._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickticket[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                    break;
                                case 'pickitem':
                                    arrayRow.push({
                                        collection: 'pickitem',
                                        objectId: pickitem._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickitem[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                    break;
                                case 'miritem':
                                    arrayRow.push({
                                        collection: 'miritem',
                                        objectId: pickitem.miritem._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickitem.miritem[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
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
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
                                        });
                                    } else {
                                        arrayRow.push({
                                            collection: 'po',
                                            objectId: pickitem.miritem.po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: pickitem.miritem.po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
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
                                            disabled: screenHeader.edit,
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
                                            disabled: screenHeader.edit,
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
                                            disabled: screenHeader.edit,
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
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
                                        }); 
                                    }
                                    break;
                                case 'packitem':
                                    arrayRow.push({
                                        collection: 'whpackitem',
                                        objectId: '',
                                        parentId: pickitem._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: '',
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                    break;
                                case 'mir':
                                    if (!['itemCount', 'mirWeight'].includes(screenHeader.fields.name)) {
                                        arrayRow.push({
                                            collection: 'mir',
                                            objectId: pickticket.mir._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: pickticket.mir[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
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
                                pickticketId: pickticket._id,
                                pickitemId: pickitem._id,
                                miritemId: pickitem.miritem._id,
                                projectId: project._id,
                                poId: pickitem.miritem.po._id,
                                areaId: pickitem.location.area._id,
                                warehouseId: pickticket.warehouse._id,
                                locationId: pickitem.location._id,
                                whpackitemId: ''
                            },
                            isPacked: true,
                            fields: arrayRow
                        };
                        arrayBody.push(objectRow);
                        i++;
                    }
                })
            }
        });
        return arrayBody;
    } else {
        return [];
    } 
}

function selectionHasData (selectedIds, picktickets, field) {
    let selectedPackitemIds = getObjectIds('whpackitem', selectedIds)
    if (!_.isEmpty(selectedPackitemIds) && picktickets.hasOwnProperty('items')) {
        return picktickets.items.reduce(function (accPickticket, curPickticket) {
            let curPickticketHasData =  curPickticket.pickitems.reduce(function(accPickitem, curPickitem) {
                let curPickitemHasData = curPickitem.whpackitems.reduce(function (accWhPackitem, curWhpackitem){
                        if(selectedPackitemIds.includes(curWhpackitem._id) && curWhpackitem.hasOwnProperty(field) && !!curWhpackitem[field]) {
                            accWhPackitem = true
                        } 
                    return accWhPackitem;
                }, false);
                if (curPickitemHasData) {
                    accPickitem = true;
                }
                return accPickitem
            }, false);
            if (curPickticketHasData) {
                accPickticket = true;
            }
            return accPickticket;
        }, false);
    } else {
        return false;
    }
}

class WhTransportDocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headersForShow: [],
            bodysForShow: [],
            splitHeadersForShow: [],
            splitHeadersForSelect:[],
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
            screenId: '5ee60fbb7c213e044cc480e4', //'WH Assign Transport'
            splitScreenId: '5ee60fd27c213e044cc480e7', //'WH Assign Transport SplitWindow'
            unlocked: false,
            screen: 'transportdocs',
            selectedIds: [],
            // selectedTemplate: '0',
            selectedField: '',
            selectedType: 'text',
            updateValue:'',
            inputPl: '',
            inputColli: '',
            alert: {
                type:'',
                message:''
            },
            //-----modals-----
            showEditValues: false,
            showAssignPl: false,
            showAssignColli: false,
            showSplitLine: false,
            splitting: false,
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
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSplitLine = this.handleSplitLine.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.getPl = this.getPl.bind(this);
        this.handleUpdatePL = this.handleUpdatePL.bind(this);
        this.handleUpdateColli = this.handleUpdateColli.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        //Toggle Modals
        this.toggleSplitLine = this.toggleSplitLine.bind(this);
        this.toggleEditValues = this.toggleEditValues.bind(this);
        this.toggleAssignPl = this.toggleAssignPl.bind(this);
        this.toggleAssignColli = this.toggleAssignColli.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        //Settings
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
            loadingPicktickets,
            loadingSelection,
            loadingSettings,
            location,
            //---------
            fieldnames,
            picktickets,
            selection,
            settings
        } = this.props;

        const { menuItem, screenId, splitScreenId, headersForShow, settingsDisplay } = this.state;
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
            if (!loadingPicktickets) {
                dispatch(pickticketActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
            if (!loadingSettings) {
                dispatch(settingActions.getAll(qs.id, userId));
            }
        }

        this.setState({
            headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            bodysForShow: getBodys(fieldnames, selection, picktickets, headersForShow),
            splitHeadersForShow: getHeaders([], fieldnames, splitScreenId, 'forShow'),
            splitHeadersForSelect: getHeaders([], fieldnames, splitScreenId, 'forSelect'),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, screenId, splitScreenId, selectedField, settingsDisplay } = this.state;
        const { fields, fieldnames, picktickets, selection, settings } = this.props;

        if (selectedField != prevState.selectedField && selectedField != '0') {
            let found = fields.items.find(function (f) {
                return f._id === selectedField;
            });
            if (found) {
                this.setState({
                    ...this.state,
                    updateValue: '',
                    selectedType: getInputType(found.type),
                });
            }
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

        if (fieldnames != prevProps.fieldnames) {
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
                splitHeadersForShow: getHeaders([], fieldnames, splitScreenId, 'forShow'),
                splitHeadersForSelect: getHeaders([], fieldnames, splitScreenId, 'forSelect'),
            })
        }

        if (fieldnames != prevProps.fieldnames || selection != prevProps.selection || picktickets != prevProps.picktickets || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodys(fieldnames, selection, picktickets, headersForShow),
            });
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
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId),
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

    handleSplitLine(event, selectionIds, virtuals) {
        event.preventDefault();
        const { splitting } = this.state;
        if (!splitting) {
            this.setState({
                splitting: true
            }, () => {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({virtuals: virtuals})
                }
                return fetch(`${config.apiUrl}/split/whpackitem?pickitemId=${selectionIds.pickitemId}&whpackitemId=${selectionIds.whpackitemId}`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (!responce.ok) {
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        }
                        this.setState({
                            showSplitLine: false,
                            splitting: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    } else {
                        this.setState({
                            showSplitLine: false,
                            splitting: false,
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

    selectedFieldOptions(fieldnames, fields) {

        const { headersForShow } = this.state;

        if (fieldnames.items && fields.items) {
            let screenHeaders = headersForShow;
            let fieldIds = screenHeaders.reduce(function (accumulator, currentValue) {
                if (accumulator.indexOf(currentValue.fieldId) === -1 ) {
                    accumulator.push(currentValue.fieldId);
                }
                return accumulator;
            }, []);
            let fieldsFromHeader = fields.items.reduce(function (accumulator, currentValue) {
                if (fieldIds.indexOf(currentValue._id) !== -1) {
                    accumulator.push({ 
                        value: currentValue._id,
                        name: currentValue.custom
                    });
                }
                return accumulator;
            }, []);
            return arraySorted(fieldsFromHeader, 'name').map(field => {
                return (
                    <option 
                        key={field.value}
                        value={field.value}>{field.name}
                    </option>                
                );
            });
        }
    }

    updateSelectedIds(selectedIds) {
        this.setState({
            ...this.state,
            selectedIds: selectedIds
        });
    }

    getPl(event, topUp) {
        const { picktickets } = this.props;
        event.preventDefault();
        if (picktickets.hasOwnProperty('items') && !_.isUndefined(picktickets.items)){
            let tempPl = picktickets.items.reduce(function (accPickticket , curPickticket) {
                let curPickticketPl = curPickticket.pickitems.reduce(function (accPickitem, curPickitem) {
                    let curPickitemPl = curPickitem.whpackitems.reduce(function (accWhpackitem, curWhpackitem) {
                        if (curWhpackitem.hasOwnProperty('plNr') && curWhpackitem.plNr > accWhpackitem) {
                            accWhpackitem =  curWhpackitem.plNr
                        }
                        return accWhpackitem;
                    }, 0);
                    if (curPickitemPl > accPickitem) {
                        accPickitem = curPickitemPl;
                    }
                    return accPickitem;
                }, 0);
                if (curPickticketPl > accPickticket) {
                    accPickticket = curPickticketPl;
                }
                return accPickticket;
            }, 0);

            if (tempPl === 0) {
                this.setState({inputPl: 1});
            } else {
                this.setState({inputPl: tempPl + topUp});
            }
        }
    }

    handleUpdatePL(event) {
        event.preventDefault();
        const { dispatch, fieldnames, picktickets } = this.props;
        const { projectId, selectedIds, inputPl, unlocked, screenId } = this.state;
        if (_.isEmpty(selectedIds)) {
            this.setState({
                inputPl: '',
                showAssignPl: false,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else if (inputPl === '') {
            this.setState({
                inputPl: '',
                showAssignPl: false,
                alert: {
                    type:'alert-danger',
                    message:'PL number is missing.'
                }
            });
        } else if (_.isEmpty(fieldnames)) {
            this.setState({
                inputPl: '',
                showAssignPl: false,
                alert: {
                    type:'alert-danger',
                    message:'An error has occured, line(s) where not updated.'
                }
            });
            if (projectId) {
                dispatch(fieldActions.getAll(projectId));
            }
        } else {
            let found = fieldnames.items.find(f => f.fields.name === 'plNr' && f.screenId === screenId);

            if (found.edit && !unlocked){
                this.setState({
                    inputPl: '',
                    showAssignPl: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock the table and try again.'
                    }
                });
            } else if (!selectionHasData(selectedIds, picktickets, 'plNr') || confirm('Existing PL number(s) found! Do you want to replace them?')) {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        collection: 'whpackitem',
                        fieldName: found.fields.name,
                        fieldValue: encodeURI(inputPl),
                        selectedIds: selectedIds
                    })
                };
                return fetch(`${config.apiUrl}/extract/update`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (!responce.ok) {
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        }
                        this.setState({
                            inputPl: '',
                            showAssignPl: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    } else {
                        this.setState({
                            inputPl: '',
                            showAssignPl: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    }
                })
                .catch( () => {
                    this.setState({
                        inputPl: '',
                        showAssignPl: false,
                        alert: {
                            type: 'alert-danger',
                            message: 'Field could not be updated.'
                        }
                    }, this.refreshStore);
                }));
            } else {
                this.setState({
                    inputPl: '',
                    showAssignPl: false,
                    alert: {
                        type:'',
                        message:''
                    }
                });
            }
        }

    }

    handleUpdateColli(event) {
        event.preventDefault();
        const { dispatch, fieldnames, picktickets } = this.props;
        const { projectId, selectedIds, inputColli, unlocked, screenId } = this.state;
        if (_.isEmpty(selectedIds)) {
            this.setState({
                inputColli: '',
                showAssignColli: false,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else if (inputColli === '') {
            this.setState({
                inputColli: '',
                showAssignColli: false,
                alert: {
                    type:'alert-danger',
                    message:'Colli is missing.'
                }
            });
        } else if (_.isEmpty(fieldnames)) {
            this.setState({
                inputColli: '',
                showAssignColli: false,
                alert: {
                    type:'alert-danger',
                    message:'An error has occured, line(s) where not updated.'
                }
            });
            if (projectId) {
                dispatch(fieldActions.getAll(projectId));
            }
        } else {
            let found = fieldnames.items.find(f => f.fields.name === 'colliNr' && f.screenId === screenId);

            if (found.edit && !unlocked){
                this.setState({
                    inputColli: '',
                    showAssignColli: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock the table and try again.'
                    }
                });
            } else if (!selectionHasData(selectedIds, picktickets, 'colliNr') || confirm('Existing Colli(s) found! Do you want to replace them?')) {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        collection: 'whpackitem',
                        fieldName: found.fields.name,
                        fieldValue: encodeURI(inputColli),
                        selectedIds: selectedIds
                    })
                };
                return fetch(`${config.apiUrl}/extract/update`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (!responce.ok) {
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        }
                        this.setState({
                            inputColli: '',
                            showAssignColli: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    } else {
                        this.setState({
                            inputColli: '',
                            showAssignColli: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    }
                })
                .catch( () => {
                    this.setState({
                        inputColli: '',
                        showAssignColli: false,
                        alert: {
                            type: 'alert-danger',
                            message: 'Field could not be updated.'
                        }
                    }, this.refreshStore);
                }));
            } else {
                this.setState({
                    inputColli: '',
                    showAssignColli: false,
                    alert: {
                        type:'',
                        message:''
                    }
                });
            }
        };
    }

    handleUpdateValue(event, isErase) {
        event.preventDefault();
        const { dispatch, fieldnames } = this.props;
        const { selectedField, selectedType, selectedIds, projectId, unlocked, updateValue, screenId} = this.state;
        if (!selectedField) {
            this.setState({
                updateValue: '',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'You have not selected the field to be updated.'
                }
            });
        } else if (_.isEmpty(selectedIds)) {
            this.setState({
                updateValue: '',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else if (_.isEmpty(fieldnames)){
            this.setState({
                updateValue: '',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'An error occured.'
                }
            });
            if (projectId) {
                dispatch(fieldActions.getAll(projectId));
            }
        } else {
            let found = fieldnames.items.find(f => f.fields._id === selectedField && f.screenId === screenId);

            if (found.edit && !unlocked) {
                this.setState({
                    updateValue: '',
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock table and try again.'
                    }
                });
            } else {
                let collection = _.isEqual(found.fields.fromTbl, 'packitem') ? 'whpackitem' : found.fields.fromTbl;
                let fieldName = found.fields.name;
                let fieldValue = isErase ? '' : updateValue;
                let fieldType = selectedType;
                if (!isValidFormat(fieldValue, fieldType, getDateFormat())) {
                    this.setState({
                        updateValue: '',
                        showEditValues: false,
                        alert: {
                            type:'alert-danger',
                            message:'Wrong date format.'
                        }
                    });
                } else {
                    const requestOptions = {
                        method: 'PUT',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            collection: collection,
                            fieldName: fieldName,
                            fieldValue: encodeURI(StringToDate (fieldValue, fieldType, getDateFormat())),
                            selectedIds: selectedIds
                        })
                    };
                    return fetch(`${config.apiUrl}/extract/update`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (!responce.ok) {
                            if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
                            }
                            this.setState({
                                updateValue: '',
                                showEditValues: false,
                                alert: {
                                    type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                    message: data.message
                                }
                            }, this.refreshStore);
                        } else {
                            this.setState({
                                updateValue: '',
                                showEditValues: false,
                                alert: {
                                    type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                    message: data.message
                                }
                            }, this.refreshStore);
                        }
                    })
                    .catch( () => {
                        this.setState({
                            updateValue: '',
                            showEditValues: false,
                            alert: {
                                type: 'alert-danger',
                                message: 'Field could not be updated.'
                            }
                        }, this.refreshStore);
                    }));
                }
            }  
        }
    }

    handleDeleteRows(event) {
        event.preventDefault;
        const { selectedIds } = this.state;
        if (_.isEmpty(selectedIds)) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be deleted.'
                }
            });
        } else if (confirm('Selected line(s) will be permanently deleted! would you like to proceed?')){
            this.setState({
                deletingRows: true
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedIds: selectedIds })
                };
                return fetch(`${config.apiUrl}/whpackitem/delete`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            deletingRows: false,
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

    toggleSplitLine(event) {
        event.preventDefault();
        const { showSplitLine, selectedIds } = this.state;
        if (!showSplitLine && (_.isEmpty(selectedIds) || selectedIds.length > 1)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Select one Line.'
                }
            });
        } else {
            this.setState({
                ...this.state,
                selectedTemplate: '0',
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                alert: {
                    type:'',
                    message:''
                },
                showSplitLine: !showSplitLine,
            });
        }
    }

    toggleEditValues(event) {
        event.preventDefault();
        const { showEditValues, selectedIds } = this.state;
        if (!showEditValues && _.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else {
            this.setState({
                ...this.state,
                selectedTemplate: '0',
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                alert: {
                    type:'',
                    message:''
                },
                showEditValues: !showEditValues,
            });
        }
    }

    toggleAssignPl(event) {
        event.preventDefault();
        const { showAssignPl, selectedIds } = this.state;
        if (!showAssignPl && _.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else {
            this.setState({
                ...this.state,
                inputPl: '',
                alert: {
                    type:'',
                    message:''
                },
                showAssignPl: !showAssignPl,
            });
        }
    }

    toggleAssignColli(event) {
        event.preventDefault();
        const { showAssignColli, selectedIds } = this.state;
        if (!showAssignColli && _.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else {
            this.setState({
                ...this.state,
                inputColli: '',
                alert: {
                    type:'',
                    message:''
                },
                showAssignColli: !showAssignColli,
            });
        }
    }

    toggleSettings(event) {
        event.preventDefault();
        const { showSettings } = this.state;
        this.setState({
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
                return fetch(`${config.apiUrl}/extract/downloadWhTransDocs?projectId=${projectId}&screenId=${screenId}&unlocked=${unlocked}`, requestOptions)
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
            return fetch(`${config.apiUrl}/extract/uploadWhTransDocs`, requestOptions)
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
            splitting,
            menuItem,
            projectId, 
            screen, 
            screenId,
            selectedIds, 
            unlocked,
            // selectedTemplate,
            selectedField,
            selectedType, 
            updateValue,
            inputPl,
            inputColli,
            //show modals
            showSplitLine,
            showEditValues,
            showAssignPl,
            showAssignColli,
            showSettings,
            //--------
            headersForShow,
            bodysForShow,
            splitHeadersForShow,
            splitHeadersForSelect,
            //'-------------------'
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
        }= this.state;

        const { accesses, fieldnames, fields, picktickets, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;
        
        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSplitLine && !showSettings && !showModalUpload &&
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
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/whshipping', search: '?id=' + projectId }} tag="a">Shipping</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Prepare transport docs:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="whtransportdocs" className={ (alert.message && !showSplitLine && !showSettings && !showModalUpload) ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Split Line" onClick={event => this.toggleSplitLine(event)}>
                            <span><FontAwesomeIcon icon="page-break" className="fa mr-2"/>Split Line</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Edit Values" onClick={event => this.toggleEditValues(event)}>
                            <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Edit Values</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Assign PL Number" onClick={event => this.toggleAssignPl(event)}> 
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa mr-2"/>Assign PL</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Assign Colli Number" onClick={event => this.toggleAssignColli(event)}>
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa mr-2"/>Assign Colli</span>
                        </button>
                    </div>
                    <div className="body-section">
                        {selection && selection.project && 
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
                                handleDeleteRows={this.handleDeleteRows}
                                deletingRows={deletingRows}
                                settingsFilter={settingsFilter}
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
                    show={showSplitLine}
                    hideModal={this.toggleSplitLine}
                    title="Split Line"
                    size="modal-xl"
                >
                    <SplitWhPackItem 
                        headersForSelect={splitHeadersForSelect}
                        headersForShow={splitHeadersForShow}
                        selection={selection}
                        selectedIds={passSelectedIds(selectedIds)}
                        selectedPickticket={passSelectedPickticket(selectedIds, picktickets)}
                        alert={alert}
                        handleClearAlert={this.handleClearAlert}
                        handleSplitLine={this.handleSplitLine}
                        splitting={splitting}

                    />
                </Modal>

                <Modal
                    show={showEditValues}
                    hideModal={this.toggleEditValues}
                    title="Edit Values"
                >
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="selectedField">Select Field</label>
                            <select
                                className="form-control"
                                name="selectedField"
                                value={selectedField}
                                placeholder="Select field..."
                                onChange={this.handleChange}
                            >
                                <option key="0" value="0">Select field...</option>
                                {this.selectedFieldOptions(fieldnames, fields, screenId)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="updateValue">Value</label>
                            <input
                                className="form-control"
                                type={selectedType === 'number' ? 'number' : 'text'}
                                name="updateValue"
                                value={updateValue}
                                onChange={this.handleChange}
                                placeholder={selectedType === 'date' ? getDateFormat() : ''}
                            />
                        </div>
                        <div className="text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.handleUpdateValue(event, false)}>
                                <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Update</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleUpdateValue(event, true)}>
                                <span><FontAwesomeIcon icon="eraser" className="fa mr-2"/>Erase</span>
                            </button>
                        </div>                   
                    </div>
                </Modal>

                <Modal
                    show={showAssignPl}
                    hideModal={this.toggleAssignPl}
                    title="Assign PL"
                >
                    <div className="col-12">
                        <form onSubmit={event => this.handleUpdatePL(event, false)}>
                            <div className="form-group">
                                <label htmlFor="inputPl">PL Number</label>
                                <div className="input-group">
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="inputPl"
                                        value={inputPl}
                                        onChange={this.handleChange}
                                        placeholder=""
                                        required
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-leeuwen-blue btn-lg"
                                            title="Get Latest PL"
                                            onClick={event => this.getPl(event, 0)}
                                        >
                                            <span><FontAwesomeIcon icon="arrow-to-bottom" className="fa"/> </span>
                                        </button>
                                        <button
                                            className="btn btn-success btn-lg"
                                            title="Get New PL"
                                            onClick={event => this.getPl(event, 1)}
                                        >
                                            <span><FontAwesomeIcon icon="sync-alt" className="fa"/> </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-leeuwen-blue btn-lg">
                                    <span><FontAwesomeIcon icon="hand-point-right" className="fa mr-2"/>Assign</span>
                                </button>
                            </div>
                        </form>                 
                    </div>
                </Modal>

                <Modal
                    show={showAssignColli}
                    hideModal={this.toggleAssignColli}
                    title="Assign Colli"
                >
                    <div className="col-12">
                        <form onSubmit={event => this.handleUpdateColli(event, false)}>
                            <div className="form-group">
                                <label htmlFor="inputColli">Colli Number</label>
                                <div className="input-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="inputColli"
                                        value={inputColli}
                                        onChange={this.handleChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-leeuwen-blue btn-lg">
                                    <span><FontAwesomeIcon icon="hand-point-right" className="fa mr-2"/>Assign</span>
                                </button>
                            </div>
                        </form>                 
                    </div>
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
                                <a className="nav-link" href={'#'+ tab.id} data-toggle="tab" onClick={event => this.handleModalTabClick(event,tab)} id={tab.id + '-tab'} aria-controls={tab.id} role="tab" draggable="false">
                                    {tab.label}
                                </a>
                            </li>                        
                        )}
                        </ul>
                        <div className="tab-content" id="modal-nav-tabContent">
                            {alert.message &&
                                <div className={`alert ${alert.type}`}>{alert.message}
                                    <button className="close" onClick={(event) => this.handleClearAlert(event)}>
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
    const { accesses, alert, fieldnames, fields, picktickets, selection, settings, sidemenu } = state; //pos, 
    const { loadingAccesses } = accesses;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPicktickets } = picktickets;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;
    
    return {
        accesses,
        alert,
        fieldnames,
        fields,
        loadingAccesses,
        loadingFields,
        loadingFieldnames,
        loadingPicktickets,
        loadingSelection,
        loadingSettings,
        picktickets,
        selection,
        settings,
        sidemenu
    };
}

const connectedWhTransportDocuments = connect(mapStateToProps)(WhTransportDocuments);
export { connectedWhTransportDocuments as WhTransportDocuments };