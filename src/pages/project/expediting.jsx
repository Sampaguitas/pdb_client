import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../_helpers';
import { 
    accessActions, 
    alertActions, 
    docdefActions, 
    fieldnameActions,
    fieldActions,
    poActions, 
    projectActions,
    settingActions,
    sidemenuActions
} from '../../_actions';
import {
    arraySorted,
    baseTen,
    docConf,
    StringToDate,
    TypeToString,
    isValidFormat,
    getDateFormat,
    myLocale,
    locale,
    findObj,
    getInputType,
    getHeaders,
    generateOptions,
    initSettingsFilter,
    initSettingsDisplay,
    passSelectedIds,
    passSelectedPo,
    getScreenTbls,
    getTblFields,
    hasPackingList,
    arrayRemove
} from '../../_functions';
import Layout from '../../_components/layout';
import LineCheck from '../../_components/line-check';
import ProjectTable from '../../_components/project-table/project-table';
import TabFilter from '../../_components/setting/tab-filter';
import TabDisplay from '../../_components/setting/tab-display';
import Modal from '../../_components/modal';
import SplitLine from '../../_components/split-line/split-sub';
import _ from 'lodash';
import { __promisify__ } from 'glob';

function virtuals(packitems, uom, packItemFields) {
    let tempVirtuals = [];
    let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(uom.toUpperCase()) ? 'mtrs' : 'pcs';
    if (hasPackingList(packItemFields)) {
        packitems.reduce(function (acc, cur){
            if (cur.plNr){
                if (!acc.includes(cur.plNr)) {
                
                    let tempObject = {};
                    tempObject['shippedQty'] = cur[tempUom];
                    packItemFields.map(function (packItemField) {
                        if (packItemField.name === 'plNr') {
                            tempObject['plNr'] = cur['plNr'];
                            tempObject['_id'] = cur['plNr'];
                        } else {
                            tempObject[packItemField.name] = [TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale))];
                        }               
                    });
                    tempVirtuals.push(tempObject);
                    acc.push(cur.plNr);
                    
                } else if (acc.includes(cur.plNr)) {
        
                    let tempVirtual = tempVirtuals.find(element => element.plNr === cur.plNr);            
                    tempVirtual['shippedQty'] += cur[tempUom];
                    packItemFields.map(function (packItemField) {
                        if (packItemField.name != 'plNr' && !tempVirtual[packItemField.name].includes(TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale)))) {
                            tempVirtual[packItemField.name].push(TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale)));
                        }               
                    });
                }
            } else if (!acc.includes('0')) {
                let tempObject = {_id: '0'}
                tempObject['shippedQty'] = '';
                packItemFields.map(function (packItemField) {
                    if (packItemField.name === 'plNr') {
                        tempObject['plNr'] = ''
                    } else {
                        tempObject[packItemField.name] = [TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale))];
                    }
                });
                tempVirtuals.push(tempObject);
                acc.push('0');
            } else {
                let tempVirtual = tempVirtuals.find(element => element._id === '0');
                packItemFields.map(function (packItemField) {
                    if (packItemField.name != 'plNr' && !tempVirtual[packItemField.name].includes(TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale)))) {
                        tempVirtual[packItemField.name].push(TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale)));
                    }               
                });
            }
            return acc;
        }, []);
    } else {
        packitems.reduce(function(acc, cur) {
            if (cur.plNr){
                if (!acc.includes('1')) {
                    let tempObject = {_id: '1'}
                    tempObject['shippedQty'] = cur[tempUom];
                    packItemFields.map(function (packItemField) {
                        tempObject[packItemField.name] = [TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale))];
                    });
                    tempVirtuals.push(tempObject);
                    acc.push('1');
                } else {
                    let tempVirtual = tempVirtuals.find(element => element._id === '1');
                    tempVirtual['shippedQty'] += cur[tempUom];
                    packItemFields.map(function (packItemField) {
                        if (!tempVirtual[packItemField.name].includes(TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale)))) {
                            tempVirtual[packItemField.name].push(TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale)));
                        }
                    });
                }
            } else {
                if (!acc.includes('0')) {
                    let tempObject = {_id: '0'}
                    packItemFields.map(function (packItemField) {
                        tempObject[packItemField.name] = [TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale))];
                    });
                    tempVirtuals.push(tempObject);
                    acc.push('0');
                } else {
                    let tempVirtual = tempVirtuals.find(element => element._id === '0');
                    packItemFields.map(function (packItemField) {
                        if (!tempVirtual[packItemField.name].includes(TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale)))) {
                            tempVirtual[packItemField.name].push(TypeToString(cur[packItemField.name], packItemField.type, getDateFormat(myLocale)));
                        }
                    });
                }
            }
            return acc;
        }, [])
    }
    return tempVirtuals;
}

function getBodys(fieldnames, selection, pos, headersForShow, screenId){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let hasPackitems = getScreenTbls(fieldnames, screenId).includes('packitem');
    let screenHeaders = headersForShow;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let i = 1;
    if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
        pos.items.map(po => {
            if (po.subs) {
                po.subs.map(sub => {
                    let certificate = sub.heats.reduce(function (acc, cur) {
                        if (!acc.heatNr.split(' | ').includes(cur.heatNr)) {
                            acc.heatNr = !acc.heatNr ? cur.heatNr : `${acc.heatNr} | ${cur.heatNr}`
                        }
                        if (!acc.cif.split(' | ').includes(cur.certificate.cif)) {
                            acc.cif = !acc.cif ? cur.certificate.cif : `${acc.cif} | ${cur.certificate.cif}`
                        }
                        if (!acc.inspQty.split(' | ').includes(String(cur.inspQty))) {
                            acc.inspQty = !acc.inspQty ? String(cur.inspQty) : `${acc.inspQty} | ${String(cur.inspQty)}`
                        }
                        return acc;
                    }, {
                        heatNr: '',
                        cif: '',
                        inspQty: ''
                    });
                    if (!_.isEmpty(sub.packitems) && hasPackitems) {
                        virtuals(sub.packitems, po.uom, getTblFields(screenHeaders, 'packitem')).map(virtual => {
                            arrayRow = [];
                            screenHeaders.map(screenHeader => {
                                switch(screenHeader.fields.fromTbl) {
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
                                            });
                                        } else {
                                            arrayRow.push({
                                                collection: 'po',
                                                objectId: po._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: po[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                        }
                                        break;
                                    case 'sub':
                                        if (screenHeader.fields.name === 'shippedQty') {
                                            arrayRow.push({
                                                collection: 'virtual',
                                                objectId: sub._id,
                                                fieldName: 'shippedQty',
                                                fieldValue: virtual.shippedQty || '',
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                        } else if (screenHeader.fields.name === 'heatNr') {
                                            arrayRow.push({
                                                collection: 'virtual',
                                                objectId: '0',
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: certificate[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                        } else {
                                            arrayRow.push({
                                                collection: 'sub',
                                                objectId: sub._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: sub[screenHeader.fields.name],
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                        }
                                        break;
                                    case 'certificate':
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: '0',
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: certificate[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                        break
                                    case 'packitem':
                                        if (screenHeader.fields.name === 'plNr') {
                                            arrayRow.push({
                                                collection: 'virtual',
                                                objectId: virtual._id,
                                                fieldName: 'plNr',
                                                fieldValue: virtual.plNr,
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                            });
                                        } else {
                                            arrayRow.push({
                                                collection: 'virtual',
                                                objectId: virtual._id,
                                                fieldName: screenHeader.fields.name,
                                                fieldValue: virtual[screenHeader.fields.name].join(' | '),
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: 'text',
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
                                    }); 
                                }
                            });
                            objectRow  = {
                                _id: i,
                                tablesId: {
                                    poId: po._id,
                                    subId: sub._id,
                                    certificateId: '',
                                    packitemId: '',
                                    collipackId: ''
                                },
                                fields: arrayRow
                            };
                            arrayBody.push(objectRow);
                            i++;
                        });
                    } else {
                        arrayRow = [];
                        screenHeaders.map(screenHeader => {
                            switch(screenHeader.fields.fromTbl) {
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
                                        });
                                    } else {
                                        arrayRow.push({
                                            collection: 'po',
                                            objectId: po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    }
                                    break;
                                case 'sub':
                                    if (screenHeader.fields.name === 'heatNr') {
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: '0',
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: certificate[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    } else {
                                        arrayRow.push({
                                            collection: 'sub',
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    }
                                    break;
                                case 'certificate':
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: '0',
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: certificate[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                    break
                                default: arrayRow.push({
                                    collection: 'virtual',
                                        objectId: '0',
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: '',
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                }); 
                            }
                        });
                        objectRow  = {
                            _id: i,
                            tablesId: {
                                poId: po._id,
                                subId: sub._id,
                                certificateId: '',
                                packitemId: '',
                                collipackId: ''
                            },
                            fields: arrayRow
                        };
                        arrayBody.push(objectRow);
                        i++;
                    }
                });
            }
        });
        return arrayBody;
    } else {
        return [];
    }
}

class Expediting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headersForShow: [],
            bodysForShow: [],
            splitHeadersForShow: [],
            splitHeadersForSelect:[],
            settingsFilter: [],
            settingsDisplay: [],
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
                }
            ],
            projectId:'',
            screenId: '5cd2b642fd333616dc360b63', //Expediting
            splitScreenId: '5cd2b646fd333616dc360b70', //Expediting Splitwindow
            unlocked: false,
            screen: 'expediting',
            selectedIds: [],
            selectedTemplate: '',
            selectedField: '',
            selectedType: 'text',
            updateValue:'',
            docList: [],
            alert: {
                type:'',
                message:''
            },
            //-----modals-----
            showEditValues: false,
            showSplitLine: false,
            showGenerate: false,
            showPr: false,
            showSettings: false,
            menuItem: 'Expediting',
            //Progress Report
            downloadingChart: false,
            unit: 'value',
            period: 'quarter',
            clPo:'',
            clPoRev: '',
            lines: [],
        };

        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);
        
        this.handleSplitLine = this.handleSplitLine.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        this.updateRequest = this.updateRequest.bind(this);
        
        this.refreshStore = this.refreshStore.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        //Toggle Modals
        this.toggleSplitLine = this.toggleSplitLine.bind(this);
        this.toggleEditValues = this.toggleEditValues.bind(this);
        this.toggleGenerate = this.toggleGenerate.bind(this);
        this.togglePr = this.togglePr.bind(this);
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
        //Progress Report
        this.downloadLineChart = this.downloadLineChart.bind(this);
        this.handleChangePr = this.handleChangePr.bind(this);
        this.handleCheckLine = this.handleCheckLine.bind(this);
        this.generateOptionClPo = this.generateOptionClPo.bind(this);
        this.generateOptionclPoRev = this.generateOptionclPoRev.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection,
            loadingSettings,
            location,
            //---------
            fieldnames,
            pos,
            docdefs,
            selection,
            settings
        } = this.props;

        const { menuItem, screenId, splitScreenId, headersForShow, settingsDisplay } = this.state;
        dispatch(sidemenuActions.select(menuItem));
        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;

        if (qs.id) {
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingDocdefs) {
                dispatch(docdefActions.getAll(qs.id));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingPos) {
                dispatch(poActions.getAll(qs.id));
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
            bodysForShow: getBodys(fieldnames, selection, pos, headersForShow, screenId),
            splitHeadersForShow: getHeaders([], fieldnames, splitScreenId, 'forShow'),
            splitHeadersForSelect: getHeaders([], fieldnames, splitScreenId, 'forSelect'),
            docList: arraySorted(docConf(docdefs.items, ['5d1927121424114e3884ac7e']), "name"),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, screenId, splitScreenId, selectedField, settingsDisplay } = this.state;
        const { fields, fieldnames, selection, settings, pos, docdefs } = this.props;
        
        if (selectedField != prevState.selectedField && selectedField != '0') {
            let found = fields.items.find(function (f) {
                return f._id === selectedField;
            });
            if (found) {
                this.setState({
                    updateValue: '',
                    selectedType: getInputType(found.type),
                });
            }
        }

        if (fieldnames != prevProps.fieldnames || settings != prevProps.settings){
            this.setState({
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
            }); 
        }

        if (settingsDisplay != prevState.settingsDisplay || fieldnames != prevProps.fieldnames) {
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow')
            });
        }

        if (fieldnames != prevProps.fieldnames) {
            this.setState({
                splitHeadersForShow: getHeaders([], fieldnames, splitScreenId, 'forShow'),
                splitHeadersForSelect: getHeaders([], fieldnames, splitScreenId, 'forSelect'),
            });
        }

        if (fieldnames != prevProps.fieldnames || selection != prevProps.selection || pos != prevProps.pos || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodys(fieldnames, selection, pos, headersForShow, screenId),
            });
        }
        
        if (docdefs != prevProps.docdefs) {
            this.setState({docList: arraySorted(docConf(docdefs.items, ['5d1927121424114e3884ac7e']), "name")});
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
        const { projectId, screenId, settingsFilter, settingsDisplay  } = this.state;
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
                }, [])
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
            dispatch(poActions.getAll(projectId));
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
            .then(res => res.blob()).then(blob => saveAs(blob, `DOWNLOAD_${screen}_${year}_${baseTen(month+1)}_${date}.xlsx`));
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

    handleGenerateFile(event) {
        event.preventDefault();
        const { docdefs } = this.props;
        const { selectedTemplate, selectedIds } = this.state;
        if (docdefs && selectedTemplate) {
            let obj = findObj(docdefs.items, selectedTemplate);
            if (obj) {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedIds: selectedIds})
                };
            return fetch(`${config.apiUrl}/template/generateEsr?id=${selectedTemplate}&locale=${locale}`, requestOptions)
                .then(res => res.blob()).then(blob => saveAs(blob, obj.field));
            }
        }
    }

    handleSplitLine(event, subId, virtuals) {
        event.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json'},
            body: JSON.stringify({virtuals: virtuals})
        }
        return fetch(`${config.apiUrl}/split/sub?subId=${subId}`, requestOptions)
        .then(responce => responce.text().then(text => {
            const data = text && JSON.parse(text);
            if (!responce.ok) {
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                this.setState({
                    // showSplitLine: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: data.message
                    }
                }, this.refreshStore);
            } else {
                this.setState({
                    // showSplitLine: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: data.message
                    }
                }, this.refreshStore);
            }
        }));
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
            selectedIds: selectedIds
        });
    }

    updateRequest(collection, fieldName, fieldValue, fieldType, selectedIds) {
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collection: collection,
                fieldName: fieldName,
                fieldValue: encodeURI(StringToDate (fieldValue, fieldType, getDateFormat(myLocale))),
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
                    selectedField: '',
                    selectedType: 'text',
                    updateValue:'',
                    showEditValues: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: data.message
                    }
                }, this.refreshStore);
            } else {
                this.setState({
                    selectedField: '',
                    selectedType: 'text',
                    updateValue:'',
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
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                showEditValues: false,
                alert: {
                    type: 'alert-danger',
                    message: 'Field could not be updated.'
                }
            }, this.refreshStore);
        }));
    }

    handleUpdateValue(event, isErase) {
        event.preventDefault();
        const { dispatch, fieldnames } = this.props;
        const { selectedField, selectedType, selectedIds, projectId, unlocked, updateValue} = this.state;
        if (!selectedField) {
            this.setState({
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'You have not selected the field to be updated.'
                }
            });
        } else if (_.isEmpty(selectedIds)) {
            this.setState({
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else if (_.isEmpty(fieldnames)){
            this.setState({
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
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
            let found = fieldnames.items.find( function (f) {
                return f.fields._id === selectedField;
            });

            if (found.edit && !unlocked) {
                this.setState({
                    selectedField: '',
                    selectedType: 'text',
                    updateValue:'',
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock table and try again.'
                    }
                });
            } else {
                let collection = found.fields.fromTbl;
                let fieldName = found.fields.name;
                let fieldValue = isErase ? '' : updateValue;
                let fieldType = selectedType;
                if (!isValidFormat(fieldValue, fieldType, getDateFormat(myLocale))) {
                    this.setState({
                        selectedField: '',
                        selectedType: 'text',
                        updateValue:'',
                        showEditValues: false,
                        alert: {
                            type:'alert-danger',
                            message:'Wrong date format.'
                        }
                    });
                } else {
                    this.updateRequest(collection, fieldName, fieldValue, fieldType, selectedIds);
                }
            }  
        }
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
        } else if (confirm('For the Selected line(s) all sub details, certificates and packing details shall be deleted. Are you sure you want to proceed?')){
            const requestOptions = {
                method: 'DELETE',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedIds: selectedIds })
            };
            return fetch(`${config.apiUrl}/sub/delete`, requestOptions)
            .then(responce => responce.text().then(text => {
                const data = text && JSON.parse(text);
                if (!responce.ok) {
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    this.setState({
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshStore);
                } else {
                    this.setState({
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshStore);
                }
            })
            .catch( () => {
                this.setState({
                    alert: {
                        type: 'alert-danger',
                        message: 'Line(s) could not be deleted.'
                    }
                }, this.refreshStore);
            }));
        }
    }

    toggleSplitLine(event) {
        event.preventDefault();
        const { showSplitLine, selectedIds } = this.state;
        if (!showSplitLine && (_.isEmpty(selectedIds) || selectedIds.length > 1)) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select one Line.'
                }
            });
        } else {
            this.setState({
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
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else {
            this.setState({
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

    toggleGenerate(event) {
        event.preventDefault();
        const { showGenerate, docList, selectedIds } = this.state;
        if (!showGenerate && _.isEmpty(selectedIds)) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be displayed in the ESR.'
                }
            });
        } else {
            this.setState({
                selectedTemplate: (!showGenerate  && docList) ? docList[0]._id : '',
                alert: {
                    type:'',
                    message:''
                },
                showGenerate: !showGenerate,
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

    downloadLineChart(event) {
        event.preventDefault();
        const { projectId, unit, period, clPo, clPoRev, lines } = this.state;
        if (_.isEmpty(lines)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select at least one data set to display the graph.'
                }
            });
        } else {
            this.setState({
                downloadingChart: true
            }, () => {
                const requestOptions = {
                    method: 'GET',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                };
                return fetch(`${config.apiUrl}/dashboard/downloadLineChart?projectId=${projectId}&unit=${unit}&period=${period}&clPo=${clPo}&clPoRev=${clPoRev}&lines=${lines}`, requestOptions)
                .then(responce => {
                    if (!responce.ok) {
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        }
                        this.setState({
                            showPr: false,
                            downloadingChart: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: 'an error has occured'  
                            }
                        });
                    } else {
                        this.setState({
                            showPr: false,
                            downloadingChart: false
                        }, () => responce.blob().then(blob => saveAs(blob, 'Chart.xlsx')));
                    }
                });
            });
        }
    }

    togglePr(event) {
        event.preventDefault();
        const { showPr } = this.state;
        this.setState({
            showPr: !showPr,
            unit: 'value',
            period: 'quarter',
            clPo:'',
            clPoRev: '',
            lines: [],
        });
    }

    handleChangePr(event) {
        event.preventDefault();
        const name =  event.target.name;
        const value =  event.target.value;
        if (name === 'clPo') {
            this.setState({
                clPoRev: '',
                clPo: value
            });
        } else {
            this.setState({
                [name]: value
            });
        }
    }

    handleCheckLine(id) {
        const { lines } = this.state;
        if (lines.includes(id)) {
            this.setState({
                lines: arrayRemove(lines, id) 
            });
        } else {
            this.setState({
                lines: [...lines, id]
            });
        }
    }

    generateOptionClPo(pos) {
        if (pos.items) {
            let clPos = pos.items.reduce(function (acc, cur) {
                if (!!cur.clPo && acc.indexOf(cur.clPo) === -1) {
                    acc.push(cur.clPo)
                }
                return acc;
            }, []);
            if (!_.isEmpty(clPos)) {
                let filteredPos = clPos.sort(function(a, b) {
                    if (a < b) {
                        return -1;
                    } else if (a > b) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return filteredPos.map(function (po, index){
                    return (
                        <option
                            key={index}
                            value={po}>{po}
                        </option>
                    );
                });
            }
        }
    }

    generateOptionclPoRev(pos, clPo) {
        if (pos.items) {
            let clPoRevs = pos.items.reduce(function (acc, cur) {
                if (!!cur.clPoRev && acc.indexOf(cur.clPoRev) === -1 && (clPo ? cur.clPo === clPo : true)) {
                    acc.push(cur.clPoRev)
                }
                return acc;
            }, []);
            if (!_.isEmpty(clPoRevs)) {
                let filteredPoRevs = clPoRevs.sort(function(a, b) {
                    if (a < b) {
                        return -1;
                    } else if (a > b) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return filteredPoRevs.map(function (rev, index){
                    return (
                        <option
                            key={index}
                            value={rev}>{rev}
                        </option>
                    );
                });
            }
        }
    }

    render() {
        const { 
            unit,
            period,
            clPo,
            clPoRev,
            lines,
            downloadingChart,
            menuItem,
            projectId, 
            screen, 
            screenId,
            selectedIds, 
            unlocked, 
            selectedTemplate, 
            selectedField,
            selectedType, 
            updateValue,
            docList,
            showEditValues,
            showSplitLine,
            showGenerate,
            showPr,
            showSettings,
            headersForShow,
            bodysForShow,
            splitHeadersForShow,
            splitHeadersForSelect,
            tabs,
            settingsFilter,
            settingsDisplay
        } = this.state;

        const { accesses, fieldnames, fields, pos, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSplitLine && !showSettings && !showPr &&
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
                        <li className="breadcrumb-item active" aria-current="page">Expediting:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="overview" className={ (alert.message && !showSplitLine && !showSettings && !showPr) ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Split Line" onClick={event => this.toggleSplitLine(event)}>
                            <span><FontAwesomeIcon icon="page-break" className="fa mr-2"/>Split Line</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Edit Values" onClick={event => this.toggleEditValues(event)}>
                            <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Edit Values</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Generate Expediting Status Report" onClick={event => this.toggleGenerate(event)}>
                            <span><FontAwesomeIcon icon="file-excel" className="fa mr-2"/>Generate ESR</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Generate Progress Report" onClick={event => this.togglePr(event)}>
                            <span><FontAwesomeIcon icon="file-chart-line" className="fa mr-2"/>Generate PR</span>
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
                                unlocked={unlocked}
                                screen={screen}
                                fieldnames={fieldnames}
                                fields={fields}
                                toggleSettings={this.toggleSettings}
                                refreshStore={this.refreshStore}
                                handleDeleteRows = {this.handleDeleteRows}
                                settingsFilter = {settingsFilter}
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
                    <SplitLine 
                        headersForSelect={splitHeadersForSelect}
                        headersForShow={splitHeadersForShow}
                        selection={selection}
                        selectedIds={passSelectedIds(selectedIds)}
                        selectedPo={passSelectedPo(selectedIds, pos)}
                        alert={alert}
                        handleClearAlert={this.handleClearAlert}
                        handleSplitLine={this.handleSplitLine}
                    />
                </Modal>

                <Modal
                    show={showEditValues}
                    hideModal={this.toggleEditValues}
                    title="Edit Value(s)"
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
                                {this.selectedFieldOptions(fieldnames, fields)}
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
                                placeholder={selectedType === 'date' ? getDateFormat(myLocale) : ''}
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
                    show={showGenerate}
                    hideModal={this.toggleGenerate}
                    title="Generate Document"
                >
                    <div className="col-12">
                        <form onSubmit={event => this.handleGenerateFile(event)}>
                            <div className="form-group">
                                <label htmlFor="selectedTemplate">Select Document</label>
                                <select
                                    className="form-control"
                                    name="selectedTemplate"
                                    value={selectedTemplate}
                                    placeholder="Select document..."
                                    onChange={this.handleChange}
                                    required
                                >
                                    <option key="0" value="">Select document...</option>
                                    {generateOptions(docList)}
                                </select>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn btn-success btn-lg">
                                    <span><FontAwesomeIcon icon="file-excel" className="fa mr-2"/>Generate</span>
                                </button>
                            </div>
                        </form>                  
                    </div>
                </Modal>
                <Modal
                    show={showPr}
                    hideModal={this.togglePr}
                    title="Generate Progress Report"
                    size="modal-lg"
                >
                    {alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className="row" style={{height: "270px"}}>
                            <div className="col-md-auto full-height">
                                <div className="full-height" style={{padding: '10px', width: '200px'}}>
                                    <LineCheck
                                        key="0"
                                        id="contract"
                                        title="Contractual"
                                        isChecked={lines.includes('contract')}
                                        handleCheck={this.handleCheckLine}
                                    />
                                    <LineCheck
                                        key="1"
                                        id="rfiExp"
                                        title="RFI Expected"
                                        isChecked={lines.includes('rfiExp')}
                                        handleCheck={this.handleCheckLine}
                                    />
                                    <LineCheck
                                        key="2"
                                        id="rfiAct"
                                        title="RFI Actual"
                                        isChecked={lines.includes('rfiAct')}
                                        handleCheck={this.handleCheckLine}
                                    />
                                    <LineCheck
                                        key="3"
                                        id="released"
                                        title="Released"
                                        isChecked={lines.includes('released')}
                                        handleCheck={this.handleCheckLine}
                                    />
                                    <LineCheck
                                        key="4"
                                        id="shipExp"
                                        title="Shipment Expected"
                                        isChecked={lines.includes('shipExp')}
                                        handleCheck={this.handleCheckLine}
                                    />
                                    <LineCheck
                                        key="5"
                                        id="shipAct"
                                        title="Shipment Actual"
                                        isChecked={lines.includes('shipAct')}
                                        handleCheck={this.handleCheckLine}
                                    />
                                    <LineCheck
                                        key="6"
                                        id="delExp"
                                        title="Delivery Expected"
                                        isChecked={lines.includes('delExp')}
                                        handleCheck={this.handleCheckLine}
                                    />
                                    <LineCheck
                                        key="7"
                                        id="delAct"
                                        title="Delivery Actual"
                                        isChecked={lines.includes('delAct')}
                                        handleCheck={this.handleCheckLine}
                                    />
                                </div>
                            </div>
                            <div className="col full-height">
                                <div className="form-group">
                                    <label htmlFor="clPo">Client Po</label>
                                    <select
                                        className="form-control"
                                        id="clPo"
                                        name="clPo"
                                        value={clPo}
                                        placeholder="Select field..."
                                        onChange={this.handleChangePr}
                                    >
                                        <option key="0" value="">Select Po...</option>
                                        {this.generateOptionClPo(pos)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="clPoRev">Revision</label>
                                    <select
                                        className="form-control"
                                        id="clPoRev"
                                        name="clPoRev"
                                        value={clPoRev}
                                        placeholder="Select revision..."
                                        onChange={this.handleChangePr}
                                    >
                                        <option key="0" value="">Select Revision...</option>
                                        {this.generateOptionclPoRev(pos, clPo)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="unit">Unit</label>
                                    <select
                                        className="form-control"
                                        id="unit"
                                        name="unit"
                                        value={unit}
                                        onChange={this.handleChangePr}
                                    >
                                        <option key="0" value="value">Value</option>
                                        <option key="1" value="pcs">Qty (Pcs)</option>
                                        <option key="2" value="mtr">Qty (Mtr/Ft)</option>
                                        <option key="3" value="weight">Weight (Kgs/Lbs)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="period">Period</label>
                                    <select
                                        className="form-control"
                                        id="period"
                                        name="period"
                                        value={period}
                                        onChange={this.handleChangePr}
                                    >
                                        <option key="0" value="day">Days</option>
                                        <option key="1" value="week">Weeks</option>
                                        <option key="2" value="fortnight">Fortnights</option>
                                        <option key="3" value="month">Months</option>
                                        <option key="4" value="quarter">Quarters</option>
                                    </select>
                                </div>
                            </div>
                    </div>
                    <div className="text-right mt-4">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => this.downloadLineChart(event)}>
                            <span><FontAwesomeIcon icon={downloadingChart ? "spinner" : "file-excel"} className={downloadingChart ? "fa-pulse fa-forward fa mr-2" : "fa mr-2"}/>Generate</span>
                        </button>
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
                                <a className="nav-link" href={'#'+ tab.id} data-toggle="tab" onClick={event => this.handleModalTabClick(event,tab)} id={tab.id + '-tab'} aria-controls={tab.id} role="tab">
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
                            <span><FontAwesomeIcon icon="save" className="fa mr-2"/>Save</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={this.toggleSettings}>
                            <span><FontAwesomeIcon icon="times" className="fa mr-2"/>Close</span>
                        </button>
                    </div>
                </Modal>

            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, docdefs, fieldnames, fields, pos, selection, settings, sidemenu } = state;
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;

    return {
        accesses,
        alert,
        docdefs,
        fieldnames,
        fields,
        loadingAccesses,
        loadingDocdefs,
        loadingFieldnames,
        loadingFields,
        loadingPos,
        loadingSelection,
        loadingSettings,
        pos,
        selection,
        settings,
        sidemenu
    };
}

const connectedExpediting = connect(mapStateToProps)(Expediting);
export { connectedExpediting as Expediting };