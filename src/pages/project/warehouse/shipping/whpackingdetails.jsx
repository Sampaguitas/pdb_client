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
    docdefActions,
    whcollipackActions,
    collitypeActions,
    fieldnameActions,
    fieldActions,
    pickticketActions,
    projectActions,
    settingActions,
    sidemenuActions
} from '../../../../_actions';
import {
    locale,
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
} from '../../../../_functions';
import ProjectTable from '../../../../_components/project-table/project-table';
import { TabDisplay, TabFilter, TabWidth } from '../../../../_components/setting';
import SplitWhColliType from '../../../../_components/split-line/split-whcollitype';
import { Layout, Modal } from '../../../../_components';

const typeOf = [
    '5ef4e9a67c213e6263a723f0', //WHPL01 WH Packing List
    '5ef4e9d67c213e6263a7240e', //WHPN01 WH Packing Note
    '5ef4ea197c213e6263a7241b', //WHSI01 WH Shipping Invoice
    '5ef4ea597c213e6263a72425', //WHSM01 WH Shipping Mark
];

function getBodys(whcollipacks, headersForShow){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;

    let i = 1;
    if (!_.isUndefined(whcollipacks) && whcollipacks.hasOwnProperty('items') && !_.isEmpty(whcollipacks.items)) {
        whcollipacks.items.map(whcollipack => {
            arrayRow = [];
            screenHeaders.map(screenHeader => {
                switch(screenHeader.fields.fromTbl) {
                    case 'collipack':
                        if (screenHeader.fields.name === 'plNr' || screenHeader.fields.name === 'colliNr') {
                            arrayRow.push({
                                collection: 'virtual',
                                objectId: whcollipack._id,
                                fieldName: screenHeader.fields.name,
                                fieldValue: whcollipack[screenHeader.fields.name],
                                disabled: screenHeader.edit,
                                align: screenHeader.align,
                                fieldType: getInputType(screenHeader.fields.type),
                                screenheaderId: screenHeader._id
                            });
                        } else {
                            arrayRow.push({
                                collection: 'whcollipack',
                                objectId: whcollipack._id,
                                fieldName: screenHeader.fields.name,
                                fieldValue: whcollipack[screenHeader.fields.name],
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
                    whcollipackId: whcollipack._id
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

function getMir(picktickets, selectedPl) {
    let badChars = /[^a-zA-Z0-9_()]/mg;
    if (!!picktickets.items) {
        return picktickets.items.reduce(function(accPickticket, curPickticket){
            if (!accPickticket) {
                let tempPickitem = curPickticket.pickitems.reduce(function(accPickitem, curPickitem) {
                    if (!accPickitem) {
                        let tempWhpackitem = curPickitem.whpackitems.reduce(function(accWhpackitem, curWhPackitem) {
                            if (!accWhpackitem && curWhPackitem.plNr == selectedPl) {
                                accWhpackitem = curPickticket.mir.mir.replace(badChars, '_');
                            }
                            return accWhpackitem;
                        }, '');
                        accPickitem = tempWhpackitem;
                    }
                    return accPickitem;
                }, '');
                accPickticket = tempPickitem;
            }
            return accPickticket;
        }, '');
    } else {
        return '';
    }
}

class WhPackingDetails extends React.Component {
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
            screenId: '5ee60fe87c213e044cc480ea', //packing details
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
            generating: false,
            assigning: false,
            editingValue: false,
            erasingValue: false,
            updatingWeight: false,
            //-----modals-----
            showEditValues: false,
            showColliTypes: false,
            // showSplitLine: false,
            showGenerate: false,
            showSettings: false,
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
        //Upload File
        this.fileInput = React.createRef();
        this.onKeyPress = this.onKeyPress.bind(this);
        this.toggleModalUpload = this.toggleModalUpload.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.generateRejectionRows = this.generateRejectionRows.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingWhcollipacks,
            loadingCollitypes,
            loadingFieldnames,
            loadingFields,
            loadingPicktickets,
            loadingSelection,
            loadingSettings,
            location,
            //-----
            fieldnames,
            docdefs,
            whcollipacks,
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
            if (!loadingWhcollipacks) {
                dispatch(whcollipackActions.getAll(qs.id));
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
            bodysForShow: getBodys(whcollipacks, headersForShow),
            plList: getPlList(whcollipacks),
            docList: arraySorted(docConf(docdefs.items, typeOf), "name"),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, screenId, selectedField, settingsDisplay } = this.state;
        const { fields, fieldnames, docdefs, whcollipacks, settings } = this.props;
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

        if (whcollipacks != prevProps.whcollipacks || headersForShow != prevState.headersForShow) {
            this.setState({bodysForShow: getBodys(whcollipacks, headersForShow)});
        }

        if (whcollipacks != prevProps.whcollipacks) {
            this.setState({plList: getPlList(whcollipacks)});
        }

        if (docdefs != prevProps.docdefs) {
            this.setState({docList: arraySorted(docConf(docdefs.items, typeOf), "name")});
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
            // dispatch(collipackActions.getAll(projectId));
            dispatch(whcollipackActions.getAll(projectId));
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
        const { docdefs, picktickets } = this.props;
        const { generating, selectedTemplate, selectedPl } = this.state;

        function getProp(doctypeId) {
            switch(doctypeId) {
                case '5ef4e9a67c213e6263a723f0': return {route: 'generateWhPl', doc: 'WHPL'};//PL01 Packing List
                case '5ef4ea597c213e6263a72425': return {route: 'generateWhSm', doc: 'WHSM'};//SM01 Shipping Mark
                case '5ef4e9d67c213e6263a7240e': return {route: 'generateWhPn', doc: 'WHPN'};//PN01 Packing Note
                case '5ef4ea197c213e6263a7241b': return {route: 'generateWhSi', doc: 'WHSI'};//SI01 Shipping Invoice
                default: return {route: 'generateWhPl', doc: 'WHPL'}; //default packing list
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
                    // .then(res => res.blob()).then(blob => saveAs(blob, `${getMir(picktickets, selectedPl)}_${getProp(obj.doctypeId).doc}_${leadingChar(selectedPl, '0', 3)}.xlsx`)); //obj.field
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
                            }, () => responce.blob().then(blob => saveAs(blob, `${getMir(picktickets, selectedPl)}_${getProp(obj.doctypeId).doc}_${leadingChar(selectedPl, '0', 3)}.xlsx`)));
                            
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
        const { selectedField, selectedType, selectedIds, projectId, unlocked, updateValue, editingValue, erasingValue, screenId} = this.state;
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
                let found = fieldnames.items.find(f => f.fields._id === selectedField && f.screenId === screenId);

                if (found.edit && !unlocked) {
                    this.setState({
                        showEditValues: false,
                        alert: {
                            type:'alert-danger',
                            message:'Selected  field is disabled, please unlock table and try again.'
                        }
                    });
                } else {
                    let collection = found.fields.fromTbl = 'collipack' ? 'whcollipack' : found.fields.fromTbl;
                    let fieldName = found.fields.name;
                    let fieldValue = isErase ? '' : updateValue;
                    let fieldType = selectedType;
    
                    if (!isValidFormat(fieldValue, fieldType, getDateFormat())) {
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
                            editingValue: isErase ? false : true
                        }, () => {
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
                                if (responce.status === 401) {
                                        localStorage.removeItem('user');
                                        location.reload(true);
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
                                    erasingValue: false,
                                    editingValue: false,
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
                    return fetch(`${config.apiUrl}/extract/setWhWeight`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
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
                            updatingWeight: false,
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
                    const requestOptions = {
                        method: 'PUT',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            colliType: colliType,
                            erp: selection.project.erp.name,
                            selectedIds: selectedIds
                        })
                    };
                    return fetch(`${config.apiUrl}/extract/setWhCollitype`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
                        } else {
                            this.setState({
                                showColliTypes: false,
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
                            alert: {
                                type: 'alert-danger',
                                message: 'Colli Type could not be assigned.'
                            }
                        }, this.refreshStore);
                    }));
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

    handleUploadFile(event){
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
            return fetch(`${config.apiUrl}/extract/upload`, requestOptions)
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
            settingsColWidth,
            settingSaving,
            deletingRows,
            //---------upload------
            showModalUpload,
            fileName,
            uploading,
            responce,
        }= this.state;

        const { accesses, docdefs, fieldnames, fields, whcollipacks, collitypes, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;
        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSettings && !showColliTypes && !showModalUpload &&
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
                        <li className="breadcrumb-item active" aria-current="page">Complete packing details:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="packingdetails" className={ (alert.message && !showSettings && !showColliTypes && !showModalUpload) ? "main-section-alert" : "main-section"}>
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
                                handleDeleteRows={this.handleDeleteRows}
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
                    <SplitWhColliType 
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
                                    onSubmit={this.handleUploadFile}
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
    const { accesses, alert, whcollipacks, collitypes, docdefs, fieldnames, fields, picktickets, selection, settings, sidemenu } = state; //pos, 
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingWhcollipacks } = whcollipacks;
    const { loadingCollitypes } = collitypes;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPicktickets } = picktickets;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;

    return {
        accesses,
        alert,
        whcollipacks,
        collitypes,
        docdefs,
        fieldnames,
        fields,
        loadingAccesses,
        loadingDocdefs,
        loadingWhcollipacks,
        loadingCollitypes,
        loadingFieldnames,
        loadingFields,
        loadingPicktickets,
        loadingSelection,
        loadingSettings,
        picktickets,
        selection,
        settings,
        sidemenu
    };
}

const connectedWhPackingDetails = connect(mapStateToProps)(WhPackingDetails);
export { connectedWhPackingDetails as WhPackingDetails };