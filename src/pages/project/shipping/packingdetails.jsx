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
    docdefActions,
    collipackActions,
    collitypeActions,
    fieldnameActions,
    fieldActions,
    poActions,
    projectActions,
    settingActions,
    sidemenuActions
} from '../../../_actions';
import {
    locale,
    myLocale,
    leadingChar,
    getDateFormat,
    StringToDate,
    isValidFormat,
    arraySorted,
    docConf,
    findObj,
    getInputType,
    getHeaders,
    generateOptions,
    initSettingsFilter,
    initSettingsDisplay,
    initSettingsColWidth,
    getPlList,
    copyObject
} from '../../../_functions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import TabFilter from '../../../_components/setting/tab-filter';
import TabDisplay from '../../../_components/setting/tab-display';
import TabWidth from '../../../_components/setting/tab-width';
import Modal from '../../../_components/modal';
import ColliType from '../../../_components/split-line/collitype';
import _ from 'lodash';

function getBodys(collipacks, headersForShow){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;

    let i = 1;
    if (!_.isUndefined(collipacks) && collipacks.hasOwnProperty('items') && !_.isEmpty(collipacks.items)) {
        collipacks.items.map(collipack => {
            arrayRow = [];
            screenHeaders.map(screenHeader => {
                switch(screenHeader.fields.fromTbl) {
                    case 'collipack':
                        if (screenHeader.fields.name === 'plNr' || screenHeader.fields.name === 'colliNr') {
                            arrayRow.push({
                                collection: 'virtual',
                                objectId: collipack._id,
                                fieldName: screenHeader.fields.name,
                                fieldValue: collipack[screenHeader.fields.name],
                                disabled: screenHeader.edit,
                                align: screenHeader.align,
                                fieldType: getInputType(screenHeader.fields.type),
                                screenheaderId: screenHeader._id
                            });
                        } else {
                            arrayRow.push({
                                collection: 'collipack',
                                objectId: collipack._id,
                                fieldName: screenHeader.fields.name,
                                fieldValue: collipack[screenHeader.fields.name],
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
                    collipackId: collipack._id
                },
                fields: arrayRow
            }
            arrayBody.push(objectRow);
            i++;
        });
        return arrayBody;
    } else {
        return [];
    }
}

function getClPo(pos, selectedPl) {
    let badChars = /[^a-zA-Z0-9_()]/mg;
    if (!!pos.items) {
        return pos.items.reduce(function(accPo, curPo){
            if (!accPo) {
                let tempSub = curPo.subs.reduce(function(accSub, curSub) {
                    if (!accSub) {
                        let tempPack = curSub.packitems.reduce(function(accPack, curPack) {
                            if(!accPack && curPack.plNr == selectedPl) {
                                accPack = curPo.clPo.replace(badChars, '_');
                            }
                            return accPack;
                        }, '');
                        accSub = tempPack;
                    }
                    return accSub;
                }, '');
                accPo = tempSub;
            }
            return accPo;
        }, '');
    } else {
        return '';
    }
}

class PackingDetails extends React.Component {
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
            screenId: '5cd2b643fd333616dc360b67', //packing details
            unlocked: false,
            screen: 'packingdetails',
            selectedIds: [],
            selectedPl: '',
            selectedTemplate: '',
            selectedField: '',
            selectedType: 'text',
            updateValue:'',
            plList: [],
            docList: [],
            alert: {
                type:'',
                message:''
            },
            assigning: false,
            generating: false,
            editingValue: false,
            erasingValue: false,
            updatingWeight: false,
            //-----modals-----
            showEditValues: false,
            showColliTypes: false,
            // showSplitLine: false,
            showGenerate: false,
            showSettings: false,
            menuItem: 'Shipping',
            downloadingTable: false
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        this.handleUpdateWeight = this.handleUpdateWeight.bind(this);
        this.assignColliType = this.assignColliType.bind(this);
        // this.handleSplitLine = this.handleSplitLine.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.refreshColliTypes = this.refreshColliTypes.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        //Toggle Modals
        this.toggleEditValues = this.toggleEditValues.bind(this);
        this.toggleColliTypes = this.toggleColliTypes.bind(this);
        this.toggleGenerate = this.toggleGenerate.bind(this);
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
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingCollipacks,
            loadingCollitypes,
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection,
            loadingSettings,
            location,
            //-----
            fieldnames,
            docdefs,
            collipacks,
            settings
        } = this.props;

        const { menuItem, screenId, headersForShow, settingsDisplay } = this.state;
        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;
        dispatch(sidemenuActions.select(menuItem));
        if (qs.id) {
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingDocdefs) {
                dispatch(docdefActions.getAll(qs.id));
            }
            if (!loadingCollipacks) {
                dispatch(collipackActions.getAll(qs.id));
            }
            if (!loadingCollitypes) {
                dispatch(collitypeActions.getAll(qs.id));
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
            bodysForShow: getBodys(collipacks, headersForShow),
            plList: getPlList(collipacks),
            docList: arraySorted(docConf(docdefs.items, ['5d1927131424114e3884ac80', '5d1927141424114e3884ac84', '5d1927131424114e3884ac81', '5d1927141424114e3884ac83']), "name"),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, screenId, selectedField, settingsDisplay } = this.state;
        const { fields, fieldnames, docdefs, collipacks, settings } = this.props;
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

        if (fieldnames != prevProps.fieldnames){
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
            });
        }

        if (collipacks != prevProps.collipacks || headersForShow != prevState.headersForShow) {
            this.setState({bodysForShow: getBodys(collipacks, headersForShow)});
        }

        if (collipacks != prevProps.collipacks) {
            this.setState({plList: getPlList(collipacks)});
        }

        if (docdefs != prevProps.docdefs) {
            this.setState({docList: arraySorted(docConf(docdefs.items, ['5d1927131424114e3884ac80', '5d1927141424114e3884ac84', '5d1927131424114e3884ac81', '5d1927141424114e3884ac83']), "name")});
        }

        if (settingsDisplay != prevState.settingsDisplay) {
            this.setState({headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow')});
        }

        if (settings != prevProps.settings) {
            this.setState({
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
                settingsColWidth: initSettingsColWidth(settings, screenId)
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
            dispatch(collipackActions.getAll(projectId));
            dispatch(settingActions.getAll(projectId, userId));
        }
    }

    refreshColliTypes() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(collitypeActions.getAll(projectId));
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

    handleGenerateFile(event) {
        event.preventDefault();
        const { docdefs, pos } = this.props;
        const { generating, selectedTemplate, selectedPl } = this.state;

        function getProp(doctypeId) {
            switch(doctypeId) {
                case '5d1927131424114e3884ac80': return {route: 'generatePl', doc: 'PL'};//PL01 Packing List
                case '5d1927141424114e3884ac84': return {route: 'generateSm', doc: 'SM'};//SM01 Shipping Mark
                case '5d1927131424114e3884ac81': return {route: 'generatePn', doc: 'PN'};//PN01 Packing Note
                case '5d1927141424114e3884ac83': return {route: 'generateSi', doc: 'SI'};//SI01 Shipping Invoice
                default: return {route: 'generatePl', doc: 'PL'}; //default packing list
            }
        }

        if (!generating && !!selectedTemplate && !!selectedPl) {
            let obj = findObj(docdefs.items, selectedTemplate);
            if (!!obj) {
                this.setState({
                    generating: true
                }, () => {
                    const requestOptions = {
                        method: 'GET',
                        headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    };
                    return fetch(`${config.apiUrl}/template/${getProp(obj.doctypeId).route}?docDefId=${selectedTemplate}&locale=${locale}&selectedPl=${selectedPl}`, requestOptions)
                    // .then(res => res.blob()).then(blob => saveAs(blob, `${getClPo(pos, selectedPl)}_${getProp(obj.doctypeId).doc}_${leadingChar(selectedPl, '0', 3)}.xlsx`)); //obj.field
                    .then(responce => {
                        if (!responce.ok) {
                            if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
                            } else if (responce.status === 400) {
                                this.setState({
                                    generating: false,
                                    alert: {
                                        type: 'alert-danger',
                                        message: 'an error has occured'  
                                    }
                                });
                            }
                        } else {
                            this.setState({
                                generating: false
                            }, () => responce.blob().then(blob => saveAs(blob, `${getClPo(pos, selectedPl)}_${getProp(obj.doctypeId).doc}_${leadingChar(selectedPl, '0', 3)}.xlsx`)));
                        }
                    });
                });
            }
        }
    }

    selectedFieldOptions(fieldnames, fields, screenId) {

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

    handleUpdateValue(event, isErase) {
        event.preventDefault();
        const { dispatch, fieldnames } = this.props;
        const { selectedField, selectedType, selectedIds, projectId, unlocked, updateValue, editingValue, erasingValue} = this.state;
        if (!editingValue && !erasingValue) {
            if (!selectedField) {
                this.setState({
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'You have not selected the field to be updated.'
                    }
                });
            } else if (_.isEmpty(selectedIds)) {
                this.setState({
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'Select line(s) to be updated.'
                    }
                });
            } else if (_.isEmpty(fieldnames)){
                this.setState({
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'An error occured, line(s) where not updated.'
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
                            ...this.state,
                            showEditValues: false,
                            alert: {
                                type:'alert-danger',
                                message:'Wrong Date Format.'
                            }
                        });
                    } else {
                        this.setState({
                            erasingValue: isErase ? true : false,
                            editingValue: isErase ? false : true,
                        }, () => {
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
                                        showEditValues: false,
                                        erasingValue: false,
                                        editingValue: false,
                                        alert: {
                                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                            message: data.message
                                        }
                                    }, this.refreshStore);
                                } else {
                                    this.setState({
                                        showEditValues: false,
                                        erasingValue: false,
                                        editingValue: false,
                                        alert: {
                                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                            message: data.message
                                        }
                                    }, this.refreshStore);
                                }
                            })
                            .catch( () => {
                                this.setState({
                                    showEditValues: false,
                                    alert: {
                                        type: 'alert-danger',
                                        message: 'Field could not be updated.'
                                    }
                                }, this.refreshStore);
                            }));
                        })
                    }
                }  
            }
        }
    }

    handleUpdateWeight(event) {
        event.preventDefault();
        const { selection } = this.props;
        const { projectId, selectedIds, updatingWeight } = this.state;
        if (!updatingWeight) {
            if (_.isEmpty(selectedIds)) {
                this.setState({
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'Select line(s) to get weight.'
                    }
                });
            } else if (!selection.hasOwnProperty('project') || _.isEmpty(selection.project.erp)) {
                this.setState({
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'An error occured, line(s) where not updated.'
                    }
                });
                
                if (projectId) {
                    dispatch(projectActions.getById(projectId));
                }
            } else {
                this.setState({
                    updatingWeight: true
                }, () => {
                    const requestOptions = {
                        method: 'PUT',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            erp: selection.project.erp.name,
                            selectedIds: selectedIds
                        })
                    };
                    return fetch(`${config.apiUrl}/extract/setWeight`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (!responce.ok) {
                            if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
                            }
                            this.setState({
                                showEditValues: false,
                                updatingWeight: false,
                                alert: {
                                    type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                    message: data.message
                                }
                            }, this.refreshStore);
                        } else {
                            this.setState({
                                showEditValues: false,
                                updatingWeight: false,
                                alert: {
                                    type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                    message: data.message
                                }
                            }, this.refreshStore);
                        }
                    })
                    .catch( () => {
                        this.setState({
                            showEditValues: false,
                            alert: {
                                type: 'alert-danger',
                                message: 'Field could not be updated.'
                            }
                        }, this.refreshStore);
                    }));
                });
            }
        }
    }

    assignColliType(collitypeId) {
        const { selection, collitypes } = this.props;
        const { projectId, selectedIds, assigning } = this.state;
        if (!assigning) {
            if (!collitypeId) {
                this.setState({
                    showColliTypes: false,
                    alert: {
                        type:'alert-danger',
                        message:'collitypeId is missing.'
                    }
                });
            } else if (_.isEmpty(selectedIds)) {
                this.setState({
                    showColliTypes: false,
                    alert: {
                        type:'alert-danger',
                        message:'Select line(s) to assign Colli Type.'
                    }
                });
            } else if (!selection.hasOwnProperty('project') || _.isEmpty(selection.project.erp)) {
                this.setState({
                    showColliTypes: false,
                    alert: {
                        type:'alert-danger',
                        message:'An error occured, line(s) where not updated.'
                    }
                });
                
                if (projectId) {
                    dispatch(projectActions.getById(projectId));
                }
            } else if (!collitypes.hasOwnProperty('items') || _.isEmpty(collitypes.items)) {
                this.setState({
                    showColliTypes: false,
                    alert: {
                        type:'alert-danger',
                        message:'An error occured, line(s) where not updated.'
                    }
                });
            } else {
                let colliType = collitypes.items.find(element => element._id === collitypeId);
                if (_.isUndefined(colliType)) {
                    this.setState({
                        showColliTypes: false,
                        alert: {
                            type:'alert-danger',
                            message:'An error occured, line(s) where not updated.'
                        }
                    });
                } else {
                    this.setState({
                        assigning: true
                    }, () => {
                        const requestOptions = {
                            method: 'PUT',
                            headers: { ...authHeader(), 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                colliType: colliType,
                                erp: selection.project.erp.name,
                                selectedIds: selectedIds
                            })
                        };
                        return fetch(`${config.apiUrl}/extract/setCollitype`, requestOptions)
                        .then(responce => responce.text().then(text => {
                            const data = text && JSON.parse(text);
                            if (responce.status === 401) {
                                    localStorage.removeItem('user');
                                    location.reload(true);
                            } else {
                                this.setState({
                                    showColliTypes: false,
                                    assigning: false,
                                    alert: {
                                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                        message: data.message
                                    }
                                }, this.refreshStore);
                            }
                        })
                        .catch( () => {
                            this.setState({
                                showColliTypes: false,
                                assigning: false,
                                alert: {
                                    type: 'alert-danger',
                                    message: 'Colli Type could not be assigned.'
                                }
                            }, this.refreshStore);
                        }));
                    });
                }
            }
        }
    }

    handleDeleteRows(event) {
        event.preventDefault;
        this.setState({
            alert: {
                type:'alert-danger',
                message:'Collis cannot be deleted from this screen, go to transport documents and remove colli Nrs from packitems.'
            }
        });
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
                selectedTemplate: '',
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

    toggleColliTypes(event) {
        event.preventDefault();
        const { showColliTypes, selectedIds } = this.state;
        if (!showColliTypes && _.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            }); 
        } else {
            this.setState({
                alert: {
                    type:'',
                    message:''
                },
                showColliTypes: !showColliTypes,
            });
        }
    }

    toggleGenerate(event) {
        event.preventDefault();
        const { showGenerate, plList, docList } = this.state;
        this.setState({
            ...this.state,
            selectedPl: (!showGenerate  && plList) ? plList[0]._id : '',
            selectedTemplate: (!showGenerate  && docList) ? docList[0]._id : '',
            alert: {
                type:'',
                message:''
            },
            showGenerate: !showGenerate,
        });
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

    render() {
        const { 
            menuItem,
            projectId, 
            screen, 
            screenId,
            selectedIds,
            unlocked,
            selectedPl,
            selectedTemplate,
            selectedField,
            selectedType,
            updateValue,
            plList,
            docList,
            assigning,
            generating,
            editingValue,
            erasingValue,
            updatingWeight,
            //show modals
            showEditValues,
            showColliTypes,
            // showSplitLine,
            showGenerate,
            showSettings,
            //---------
            headersForShow,
            bodysForShow,
            //'-------------------'
            tabs,
            settingsFilter,
            settingsDisplay,
            downloadingTable,
            settingsColWidth
        }= this.state;

        const { accesses, docdefs, fieldnames, fields, collipacks, collitypes, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;
        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSettings && !showColliTypes &&
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
                            <NavLink to={{ pathname: '/shipping', search: '?id=' + projectId }} tag="a">Shipping</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Complete packing details:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="packingdetails" className={ (alert.message && !showSettings && !showColliTypes) ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Edit Values" onClick={event => this.toggleEditValues(event)}>
                            <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Edit Values</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Assign Colli Type" onClick={event => this.toggleColliTypes(event)}>
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa mr-2"/>Colli Type</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Calculate Net Weight" onClick={event => this.handleUpdateWeight(event)}>
                            <span><FontAwesomeIcon icon={updatingWeight ? "spinner" : "balance-scale-left"} className={updatingWeight ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Net Weight</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Generate Shipping Docs" onClick={event => this.toggleGenerate(event)}>
                            <span><FontAwesomeIcon icon="file-excel" className="fa mr-2"/>Shipping Docs</span>
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
                                placeholder={selectedType === 'date' ? getDateFormat(myLocale) : ''}
                            />
                        </div>
                        <div className="text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.handleUpdateValue(event, false)}>
                                <span><FontAwesomeIcon icon={editingValue ? "spinner" : "edit"} className={editingValue ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Update</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleUpdateValue(event, true)}>
                                <span><FontAwesomeIcon icon={erasingValue ? "spinner" : "eraser"} className={erasingValue ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Erase</span>
                            </button>
                        </div>                   
                    </div>
                </Modal>

                <Modal
                    show={showColliTypes}
                    hideModal={this.toggleColliTypes}
                    title="Assign Colli Type"
                    size="modal-xl"
                >
                    <ColliType 
                    collitypes={collitypes}
                    refreshColliTypes={this.refreshColliTypes}
                    projectId={projectId}
                    alert={alert}
                    handleClearAlert={this.handleClearAlert}
                    assignColliType={this.assignColliType}
                    assigning={assigning}
                    />
                </Modal>

                <Modal
                    show={showGenerate}
                    hideModal={this.toggleGenerate}
                    title="Generate Document"
                >
                    <div className="col-12">
                        <form onSubmit={event => this.handleGenerateFile(event)}>
                            <div className="form-group">
                                <label htmlFor="selectedPl">Select PL No</label>
                                <select
                                    className="form-control"
                                    name="selectedPl"
                                    value={selectedPl}
                                    placeholder="Select document..."
                                    onChange={this.handleChange}
                                    required
                                >
                                    <option key="0" value="">Select PL No...</option>
                                    {generateOptions(plList)}
                                </select>
                            </div>
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
                                <button className="btn btn-success btn-lg" type="submit">
                                    <span><FontAwesomeIcon icon={generating ? "spinner" : "file-excel"} className={generating ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Generate</span>
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
    const { accesses, alert, collipacks, collitypes, docdefs, fieldnames, fields, pos, selection, settings, sidemenu } = state;
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingCollipacks } = collipacks;
    const { loadingCollitypes } = collitypes;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;

    return {
        accesses,
        alert,
        collipacks,
        collitypes,
        docdefs,
        fieldnames,
        fields,
        loadingAccesses,
        loadingDocdefs,
        loadingCollipacks,
        loadingCollitypes,
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

const connectedPackingDetails = connect(mapStateToProps)(PackingDetails);
export { connectedPackingDetails as PackingDetails };