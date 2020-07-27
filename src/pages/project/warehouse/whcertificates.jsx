import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../../_helpers';
import { 
    accessActions, 
    alertActions,
    certificateActions,
    fieldnameActions,
    fieldActions,
    poActions,
    projectActions,
    settingActions,
    sidemenuActions
} from '../../../_actions';
import {
    baseTen,
    resolve,
    arraySorted,
    getInputType,
    getHeaders,
    initSettingsFilter,
    initSettingsDisplay,
    initSettingsColWidth,
    copyObject
} from '../../../_functions';
import { ProjectTable } from '../../../_components/project-table';
import { TabDisplay, TabFilter, TabWidth } from '../../../_components/setting';
import { SplitHeat } from '../../../_components/split-line';
import { Layout, Modal } from '../../../_components';


function virtuals(heats) {
    let tempVirtuals = [];
    
    if (!_.isEmpty(heats)) {
        tempVirtuals = heats.reduce(function(acc, cur) {
            acc.push({
                cif: cur.certificate.cif,
                heatNr: cur.heatNr,
                inspQty: cur.inspQty,
                heatId: cur._id,
                certificateId: cur.certificateId
            });
            return acc;
        }, []);
    }

    if (!_.isEmpty(tempVirtuals)) {
        return tempVirtuals;
    } else {
        return ([
            {
                cif: '',
                heatNr: '',
                inspQty: '',
                heatId: '',
                certificateId: '',
            }
        ]);
    }
}

function getBodys(selection, pos, headersForShow){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let enableInspection = selection.project ? selection.project.enableInspection : false;
    let i = 1;

    if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
        pos.items.map(po => {
            if (po.subs) {
                po.subs.map(sub => {
                    virtuals(sub.heats).map(function(virtual){
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
                                            screenheaderId: screenHeader._id
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
                                            screenheaderId: screenHeader._id
                                        });
                                    }
                                    break;
                                case 'sub': 
                                    if (screenHeader.fields.name === 'shippedQty') {
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
                                    } else if (screenHeader.fields.name === 'heatNr') {
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: virtual._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: virtual[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
                                        });
                                    } else if (_.isEqual(screenHeader.fields.name, 'relQty') && !enableInspection){
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: sub._id,
                                            fieldName: 'splitQty',
                                            fieldValue: sub.splitQty,
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
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
                                            screenheaderId: screenHeader._id
                                        });
                                    }
                                    break;
                                case 'certificate':
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: virtual._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: virtual[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
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
                                poId: po._id,
                                subId: sub._id,
                                returnId: '',
                                packitemId: '',
                                collipackId: '',
                                certificateId: virtual.certificateId,
                                heatId: virtual.heatId
                            },
                            fields: arrayRow
                        };
                        arrayBody.push(objectRow);
                        i++;
                    });
                });
            }
            if (po.returns) {
                po.returns.map(_return => {
                    virtuals(_return.heats).map(function(virtual){
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
                                            screenheaderId: screenHeader._id
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
                                            screenheaderId: screenHeader._id
                                        });
                                    }
                                    break;
                                case 'sub': 
                                    if (screenHeader.fields.name === 'shippedQty') {
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
                                    } else if (screenHeader.fields.name === 'heatNr') {
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: virtual._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: virtual[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
                                        });
                                    } else if (_.isEqual(screenHeader.fields.name, 'relQty') && !enableInspection){
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: sub._id,
                                            fieldName: 'splitQty',
                                            fieldValue: sub.splitQty,
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
                                case 'return':
                                    arrayRow.push({
                                        collection: 'return',
                                        objectId: _return._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: _return[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
                                    break;
                                case 'certificate':
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: virtual._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: virtual[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
                                    });
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
                                poId: po._id,
                                subId: '',
                                returnId: _return._id,
                                packitemId: '',
                                collipackId: '',
                                certificateId: virtual.certificateId,
                                heatId: virtual.heatId
                            },
                            fields: arrayRow
                        };
                        arrayBody.push(objectRow);
                        i++;
                    });
                });
            }
        });
        return arrayBody;
    } else {
        return [];
    }
}

function getHeats(selectedIds, pos) {
    if (selectedIds.length === 1 && !_.isEmpty(pos.items)) {
        let selectedPo = pos.items.find(po => po._id === selectedIds[0].poId);
        if (!_.isUndefined(selectedPo)) {
            let selectedSub = selectedPo.subs.find(sub => sub._id === selectedIds[0].subId);
            let selectedReturn = selectedPo.returns.find(_return => _return._id === selectedIds[0].returnId);
            if (!_.isUndefined(selectedSub)) {
                return selectedSub.heats;
            } else if (!_.isUndefined(selectedReturn)) {
                return selectedReturn.heats;
            }
        }
    }
    return [];
}

class WhCertificates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headersForShow: [],
            bodysForShow: [],
            heats: [],
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
            screenId: '5cd2b642fd333616dc360b65', //Certificates
            unlocked: false,
            screen: 'certificates',
            selectedIds: [],
            alert: {
                type:'',
                message:''
            },
            //-----modals-----
            showCif: false,
            showHeat: false,
            showSettings: false,
            menuItem: 'Warehouse',
            downloadingTable: false,
            settingSaving: false,
            deletingRows: false

        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.refreshCifs = this.refreshCifs.bind(this);
        this.refreshPos = this.refreshPos.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        //Toggle Modals
        this.toggleCif = this.toggleCif.bind(this);
        this.toggleHeat = this.toggleHeat.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.handleDownloadCif = this.handleDownloadCif.bind(this);
        //settings
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
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingCertificates,
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

        const { menuItem, screenId, headersForShow, settingsDisplay } = this.state;
        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;
        dispatch(sidemenuActions.select(menuItem));
        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingCertificates) {
                dispatch(certificateActions.getAll(qs.id));
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
            bodysForShow: getBodys(selection, pos, headersForShow),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, screenId, selectedField, settingsDisplay, selectedIds } = this.state;
        const { fields, fieldnames, selection, settings, pos } = this.props;
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

        if (fieldnames != prevProps.fieldnames) {
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
            });
        }

        if (fieldnames != prevProps.fieldnames || selection != prevProps.selection || pos != prevProps.pos || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodys(selection, pos, headersForShow),
            });
        }

        if (settingsDisplay != prevState.settingsDisplay) {
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow')
            });
        }

        if (settings != prevProps.settings) {
            this.setState({
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
                settingsColWidth: initSettingsColWidth(settings, screenId)
            });
        }
        
        if (selectedIds != prevState.selectedIds || pos != prevProps.pos) {
            this.setState({
                heats: getHeats(selectedIds, pos)
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
            dispatch(poActions.getAll(projectId));
            dispatch(settingActions.getAll(projectId, userId));
        }
    }

    refreshCifs() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(certificateActions.getAll(projectId));
            dispatch(poActions.getAll(projectId));
        }
    }

    refreshPos() {
        const { dispatch } = this.props;
        const { projectId } = this.state;

        if (projectId) {
            dispatch(poActions.getAll(projectId));
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

    handleDeleteRows(event) {
        event.preventDefault;
        this.setState({
            alert: {
                type:'alert-danger',
                message:'Certificates cannot be deleted at the moment.'
            }
        });
    }

    toggleCif(event) {
        event.preventDefault();
        const { showCif } = this.state;
        this.setState({
            showCif: !showCif
        });
    }

    toggleHeat(event) {
        event.preventDefault();
        const { showHeat, selectedIds } = this.state;
        if (!showHeat && selectedIds.length != 1) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select one line to assign Heat Numbers.'
                }
            });
        } else {
            this.setState({
                showHeat: !showHeat
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

    handleDownloadCif(event) {
        event.preventDefault();
        
        const { selectedIds } = this.state;
        const { certificates } = this.props;
        const myPromises = [];

        function hasFile(heatId) {
            if (certificates.hasOwnProperty('items') && !_.isEmpty(certificates.items)) {
                return certificates.items.reduce(function(cur, acc) {
                    if (!acc && !!cur.hasFile && !_.isUndefined(cur.heats.find(element => element._id === heatId))) {
                        acc === true;
                    }
                    return acc;
                }, false)
            } else {
                return false;
            }
        }

        function downloadPromise(heatId) {
            return new Promise (function (resolve) {
                const requestOptions = {
                    method: 'GET',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                }
                return fetch(`${config.apiUrl}/certificate/downloadHeat?heatId=${encodeURI(heatId)}`, requestOptions)
                .then(res => {
                    if (!res.ok) {
                        resolve({ isRejected: true });
                    } else {
                        let fileName = res.headers.get('Content-Disposition').split("filename=")[1];
                        res.blob().then(blob => {
                            saveAs(blob, fileName);
                            resolve({ isRejected: false });
                        });
                    }
                });
            });
        }

        if (selectedIds.length === 0) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select lines to download Certificate.'
                }
            });
        } else {
            let heatIds = selectedIds.reduce(function(acc, cur) {
                acc.push(cur.heatId);
                return acc;
            }, []);
            if (_.isEmpty(heatIds)) {
                this.setState({
                    alert: {
                        type: 'alert-danger',
                        message: 'No certificates have been uploaded for the selected lines yet...'
                    }
                });
            } else {
                this.setState({
                    isDownloading: true
                }, () => {
                    heatIds.forEach(heatId => {
                        myPromises.push(downloadPromise(heatId));
                    });
                    Promise.all(myPromises).then( (results) => {
                        let nRejected = 0;
                        let nDownloaded = 0;
                        results.map(result => {
                            if (result.isRejected) {
                                nRejected++;
                            } else {
                                nDownloaded++;
                            }
                        });
                        this.setState({
                            isDownloading: false,
                            alert: {
                                type: !!nRejected ? 'alert-danger' : 'alert-success',
                                message: `${nDownloaded} Files Downloaded, ${nRejected} Files Rejected${!!nRejected ? '... Ensure that all lines selected have a heatNr and that a document has well been uploaded for each certificates.' : '.'}`
                            }
                        });
                    });
                });
            }
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
            unlocked,
            showCif,
            showHeat,
            showSettings,
            isDownloading,
            headersForShow,
            bodysForShow,
            heats,
            tabs,
            settingsFilter,
            settingsDisplay,
            downloadingTable,
            settingsColWidth,
            settingSaving,
            deletingRows
        }= this.state;
        
        const { accesses, certificates, fieldnames, fields, pos, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;
        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSettings && !showCif &&
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
                        <li className="breadcrumb-item active" aria-current="page">Certificates:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="certificates" className={ (alert.message && !showSettings && !showCif) ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button title="Add/Edit Certificates" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleCif}>
                            <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Certificates</span>
                        </button>
                        <button title="Add/Edit Heat Numbers" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.toggleHeat}>
                            <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Heat Numbers</span>
                        </button>
                        <button title="Download Certificate" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.handleDownloadCif}>
                            <span><FontAwesomeIcon icon={isDownloading ? "spinner" : "file-pdf"} className={isDownloading ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Download CIF(s)</span>
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
                            />
                        }
                    </div>
                </div>

                <Modal
                    show={showCif}
                    hideModal={this.toggleCif}
                    title="Add/Edit Certificates"
                    size="modal-lg"
                >
                    <Certificate 
                        alert={alert}
                        handleClearAlert={this.handleClearAlert}
                        certificates={certificates}
                        projectId={projectId}
                        refreshCifs={this.refreshCifs}
                        toggleCif={this.toggleCif}
                    />
                </Modal>

                <Modal
                    show={showHeat}
                    hideModal={this.toggleHeat}
                    title="Add/Edit Heat Numbers"
                    size="modal-lg"
                >
                    <SplitHeat
                        alert={alert}
                        handleClearAlert={this.handleClearAlert}
                        refreshPos={this.refreshPos}
                        toggleHeat={this.toggleHeat}
                        certificates={certificates}
                        heats={heats}
                        poId={selectedIds.length === 1 ? selectedIds[0].poId : ''}
                        subId={selectedIds.length === 1 ? selectedIds[0].subId : ''}
                        returnId={selectedIds.length === 1 ? selectedIds[0].returnId : ''}
                        projectId={projectId}
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

            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, certificates, fieldnames, fields, pos, selection, settings, sidemenu } = state;
    const { loadingAccesses } = accesses;
    const { loadingCertificates } = certificates;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;

    return {
        accesses,
        alert,
        certificates,
        fieldnames,
        fields,
        loadingAccesses,
        loadingCertificates,
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

const connectedWhCertificates = connect(mapStateToProps)(WhCertificates);
export { connectedWhCertificates as WhCertificates };