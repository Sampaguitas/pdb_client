import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../../_helpers';
import { 
    accessActions, 
    alertActions, 
    docdefActions,
    fieldnameActions, 
    fieldActions,
    poActions, 
    projectActions,
    settingActions,
    supplierActions,
    sidemenuActions
} from '../../../_actions';
import {
    locale,
    myLocale,
    getDateFormat,
    passSelectedIds,
    passSelectedPo,
    TypeToString,
    StringToDate,
    isValidFormat,
    getObjectIds,
    baseTen,
    arraySorted,
    docConf,
    findObj,
    getScreenTbls,
    getInputType,
    getHeaders,
    generateOptions,
    initSettingsFilter,
    initSettingsDisplay,
    initSettingsColWidth,
    getTblFields, // -> check this one
    copyObject
} from '../../../_functions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import TabFilter from '../../../_components/setting/tab-filter';
import TabDisplay from '../../../_components/setting/tab-display';
import TabWidth from '../../../_components/setting/tab-width';
import Modal from '../../../_components/modal';
import SplitLine from '../../../_components/split-line/split-sub';
import CheckLocation from '../../../_components/check-location';
import _ from 'lodash';

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
                                                objectId: sub._id,
                                                fieldName: 'shippedQty',
                                                fieldValue: virtual.shippedQty || '',
                                                disabled: screenHeader.edit,
                                                align: screenHeader.align,
                                                fieldType: getInputType(screenHeader.fields.type),
                                                screenheaderId: screenHeader._id
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
                                            objectId: '0',
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: certificate[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                            screenheaderId: screenHeader._id
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
                                                screenheaderId: screenHeader._id
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
                                            objectId: '0',
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: certificate[screenHeader.fields.name],
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
                                        objectId: '0',
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: certificate[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                        screenheaderId: screenHeader._id
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
                                    screenheaderId: screenHeader._id
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

function selectionHasNfi (selectedIds, pos) {
    let selectedSubIds = getObjectIds('sub', selectedIds)
    if (!_.isEmpty(selectedSubIds) && pos.hasOwnProperty('items')) {
        return pos.items.reduce(function (accPo, curPo) {
            let curPoHasNFI = curPo.subs.reduce(function (accSub, currSub){
                if(selectedSubIds.includes(currSub._id) && currSub.hasOwnProperty('nfi') && !_.isNull(currSub.nfi)) {
                    accSub = true;
                }
                return accSub;
            }, false);
    
            if (curPoHasNFI === true) {
                accPo = true;
            }
            return accPo;
        }, false);

    } else {
        return false;
    }
}

function getNfiList(pos) {
    if (pos.hasOwnProperty('items') && !_.isUndefined(pos.items)){
        let tempNfi = pos.items.reduce(function (accPo, curPo) {
            let curPoNfi = curPo.subs.reduce(function (accSub, curSub) {
                if (!!curSub.nfi) {
                    accSub.push(curSub.nfi);
                }
                return accSub;
            }, []);
            return accPo.concat(curPoNfi);
        }, [])
        let uniqueNfi = [...new Set(tempNfi)];
        uniqueNfi.sort((a, b) => b - a);
        return uniqueNfi.reduce(function(acc, curr) {
            acc.push({_id: curr, name: curr})
            return acc;
        }, []);
    }
}

function getLocationList(suppliers) {
    if (suppliers.hasOwnProperty('items') && !_.isUndefined(suppliers.items)){
        let tempSuppliers = [];
        suppliers.items.reduce(function (acc, curr) {
            if(curr.name && !acc.includes(curr.name)) {
                tempSuppliers.push({ _id: curr._id, name: curr.name});
                acc.push(curr.name)
            }
            return acc;
        }, [])
        return tempSuppliers.sort(function (a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase()
            if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
        });

    }
}

class ReleaseData extends React.Component {
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
            screenId: '5cd2b642fd333616dc360b64', //Inspection
            splitScreenId: '5cd2b647fd333616dc360b71', //Inspection Splitwindow
            unlocked: false,
            screen: 'inspection',
            selectedIds: [],
            selectedTemplate: '',
            selectedField: '',
            selectedType: 'text',
            updateValue:'',
            inputNfi: '',
            showLocation: true,
            selectedLocation:'',
            nfiList:[],
            locationList:[],
            docList: [],
            alert: {
                type:'',
                message:''
            },
            //-----modals-----
            showSplitLine: false,
            showEditValues: false,
            showAssignNfi: false,
            showGenerate: false,
            showSettings: false,
            menuItem: 'Inspection',
            downloadingTable: false                   
        };

        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.toggleLocation=this.toggleLocation.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleSplitLine = this.handleSplitLine.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        this.getNfi = this.getNfi.bind(this);
        this.handleUpdateNFI = this.handleUpdateNFI.bind(this);
        this.updateRequest = this.updateRequest.bind(this);
        
        this.refreshStore = this.refreshStore.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        //Toggle Modals
        this.toggleSplitLine = this.toggleSplitLine.bind(this);
        this.toggleEditValues = this.toggleEditValues.bind(this);
        this.toggleAssignNfi = this.toggleAssignNfi.bind(this);
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
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection,
            loadingSettings,
            loadingSuppliers, 
            location,
            //---------
            fieldnames,
            pos,
            suppliers,
            docdefs,
            selection,
            settings
        } = this.props;

        const { menuItem, screenId, splitScreenId, headersForShow, settingsDisplay } = this.state;
        dispatch(sidemenuActions.select(menuItem));
        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;
        if (qs.id) {
            //State items with projectId
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
            if (!loadingSuppliers) {
                dispatch(supplierActions.getAll(qs.id));
            }
        }

        this.setState({
            headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            bodysForShow: getBodys(fieldnames, selection, pos, headersForShow, screenId),
            splitHeadersForShow: getHeaders([], fieldnames, splitScreenId, 'forShow'),
            splitHeadersForSelect: getHeaders([], fieldnames, splitScreenId, 'forSelect'),
            nfiList: getNfiList(pos),
            locationList: getLocationList(suppliers),
            docList: arraySorted(docConf(docdefs.items, ['5d1927131424114e3884ac7f']), "name"),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId)
        });

    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, screenId, splitScreenId, selectedField, settingsDisplay } = this.state;
        const { fields, fieldnames, selection, pos, suppliers, docdefs, settings } = this.props;

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

        if (settingsDisplay != prevState.settingsDisplay || fieldnames != prevProps.fieldnames) {
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            });
        }

        if (fieldnames != prevProps.fieldnames) {
            this.setState({
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
                splitHeadersForShow: getHeaders([], fieldnames, splitScreenId, 'forShow'),
                splitHeadersForSelect: getHeaders([], fieldnames, splitScreenId, 'forSelect'),
            })
        }

        if (fieldnames != prevProps.fieldnames || selection != prevProps.selection || pos != prevProps.pos || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodys(fieldnames, selection, pos, headersForShow, screenId),
            });
        }

        if (pos != prevProps.pos) {
            this.setState({nfiList: getNfiList(pos)});
        }

        if (suppliers != prevProps.suppliers) {
            this.setState({locationList: getLocationList(suppliers)});
        }

        if (docdefs != prevProps.docdefs) {
            this.setState({docList: arraySorted(docConf(docdefs.items, ['5d1927131424114e3884ac7f']), "name")});
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
        const target = event.target;
        const name  =  target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }

    handleGenerateFile(event) {
        event.preventDefault();
        const { docdefs } = this.props;
        const { selectedTemplate, inputNfi, showLocation, selectedLocation } = this.state;
        if (selectedTemplate && inputNfi) {
            let obj = findObj(docdefs.items, selectedTemplate);
            if (obj) {
               const requestOptions = {
                   method: 'GET',
                   headers: { ...authHeader(), 'Content-Type': 'application/json'},
               };
               return fetch(`${config.apiUrl}/template/generateNfi?id=${selectedTemplate}&locale=${locale}&inputNfi=${inputNfi}&selectedLocation=${showLocation ? selectedLocation : ''}`, requestOptions)
                   .then(res => res.blob()).then(blob => saveAs(blob, obj.field));
            }
        } else {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select a document and NFI number.'
                }
            })
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
            ...this.state,
            selectedIds: selectedIds
        });
    }

    getNfi(event, topUp) {
        const { pos } = this.props;
        event.preventDefault();
        if (pos.hasOwnProperty('items') && !_.isUndefined(pos.items)){
            
            let tempNfi = pos.items.reduce(function (accPo , currPo) {
                
                let currPoNfi = currPo.subs.reduce(function (accSub, currSub) {
                    if (currSub.hasOwnProperty('nfi') && currSub.nfi > accSub) {
                        accSub = currSub.nfi;
                    }
                    return accSub;
                }, 0);

                if (currPoNfi > accPo) {
                    accPo = currPoNfi;
                }
                return accPo;
            }, 0);
            if (tempNfi === 0) {
                this.setState({inputNfi: 1});
            } else {
                this.setState({inputNfi: tempNfi + topUp});
            }
        }
    }

    handleUpdateNFI(event) {
        event.preventDefault();
        const { dispatch, fieldnames, pos } = this.props;
        const { projectId, selectedIds, inputNfi, rfiDateAct, unlocked } = this.state;
        if (_.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                inputNfi: '',
                rfiDateAct: '',
                showAssignNfi: false,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else if (inputNfi === '') {
            this.setState({
                ...this.state,
                inputNfi: '',
                rfiDateAct: '',
                showAssignNfi: false,
                alert: {
                    type:'alert-danger',
                    message:'NFI number is missing.'
                }
            });
        } else if (_.isEmpty(fieldnames)) {
            this.setState({
                ...this.state,
                inputNfi: '',
                rfiDateAct: '',
                showAssignNfi: false,
                alert: {
                    type:'alert-danger',
                    message:'An error has occured, line(s) where not updated.'
                }
            });
            if (projectId) {
                dispatch(fieldActions.getAll(projectId));
            }
        } else {
            let found = fieldnames.items.find( function (f) {
                return f.fields.name === 'nfi';
            });

            if (found.edit && !unlocked){
                this.setState({
                    ...this.state,
                    inputNfi: '',
                    rfiDateAct: '',
                    showAssignNfi: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock the table and try again.'
                    }
                });
            } else if (!selectionHasNfi (selectedIds, pos) || confirm('Already existing NFI numbers found. Do you want to proceed?')) {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        collection: 'sub',
                        fieldName: 'nfi',
                        fieldValue: encodeURI(inputNfi),
                        rfiDateAct: encodeURI(StringToDate (rfiDateAct, 'date', getDateFormat(myLocale))),
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
                            inputNfi: '',
                            rfiDateAct: '',
                            showAssignNfi: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    } else {
                        this.setState({
                            inputNfi: '',
                            rfiDateAct: '',
                            showAssignNfi: false,
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, this.refreshStore);
                    }
                })
                .catch( () => {
                    this.setState({
                        inputNfi: '',
                        rfiDateAct: '',
                        showAssignNfi: false,
                        alert: {
                            type: 'alert-danger',
                            message: 'Field could not be updated.'
                        }
                    }, this.refreshStore);
                }));
            } else {
                this.setState({
                    ...this.state,
                    inputNfi: '',
                    rfiDateAct: '',
                    showAssignNfi: false,
                    alert: {
                        type:'',
                        message:''
                    }
                });
            }
        }
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
                ...this.state,
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
                ...this.state,
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
                ...this.state,
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'An error has occured, line(s) where not updated.'
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
                    ...this.state,
                    selectedField: '',
                    selectedType: 'text',
                    updateValue:'',
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock the table and try again.'
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
        event.preventDefault;
        // const { dispatch } = this.props;
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
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Select one Line.'
                }
            });
        } else {
            this.setState({
                ...this.state,
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

    toggleAssignNfi(event) {
        event.preventDefault();
        const { showAssignNfi, selectedIds } = this.state;
        if (!showAssignNfi && _.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to assign NFI.'
                }
            });
        } else {
            this.setState({
                ...this.state,
                inputNfi: '',
                rfiDateAct:'',
                alert: {
                    type:'',
                    message:''
                },
                showAssignNfi: !showAssignNfi,
            });
        }
    }

    toggleGenerate(event) {
        event.preventDefault();
        const { showGenerate, docList, nfiList, locationList } = this.state;
        this.setState({
            ...this.state,
            selectedTemplate: (!showGenerate  && docList) ? docList[0]._id : '',
            inputNfi: (!showGenerate  && nfiList) ? nfiList[0]._id : '',
            showLocation: true,
            selectedLocation: (!showGenerate  && locationList) ? locationList[0]._id : '',
            alert: {
                type:'',
                message:''
            },
            showGenerate: !showGenerate,
        });
    }

    toggleLocation(isChecked) {
        this.setState({showLocation: isChecked});
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
            selectedTemplate, 
            selectedField,
            selectedType,
            updateValue,
            inputNfi,
            rfiDateAct,
            showLocation,
            selectedLocation,
            nfiList,
            locationList,
            docList,
            //show modals
            showSplitLine,
            showEditValues,
            showAssignNfi,
            showGenerate,
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
            settingsColWidth
        }= this.state;

        const { accesses, fieldnames, fields, pos, selection, suppliers, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;
        
        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSplitLine && !showSettings &&
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
                            <NavLink to={{ pathname: '/inspection', search: '?id=' + projectId }} tag="a">Inspection</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Inspection & Release data:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="releasedata" className={ (alert.message && !showSplitLine && !showSettings) ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button title="Split Line" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.toggleSplitLine(event)}>
                            <span><FontAwesomeIcon icon="page-break" className="fa mr-2"/>Split Line</span>
                        </button>
                        <button title="Edit Values" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.toggleEditValues(event)}>
                            <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Edit Values</span>
                        </button>
                        <button title="Assign NFI" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.toggleAssignNfi(event)}>
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa mr-2"/>Assign NFI</span>
                        </button>
                        <button title="Generate NFI" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.toggleGenerate(event)}>
                            <span><FontAwesomeIcon icon="file-excel" className="fa mr-2"/>Generate NFI</span>
                        </button>
                    </div>
                    <div className="body-section">
                        {selection && selection.project && 
                            <ProjectTable
                                // screenHeaders={arraySorted(generateScreenHeader(fieldnames, screenId), "forShow")}
                                screenHeaders={headersForShow}
                                // screenBodys={generateScreenBody(screenId, fieldnames, pos)}
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
                                settingsFilter={settingsFilter}
                                settingsColWidth={settingsColWidth}
                                colDoubleClick={this.colDoubleClick}
                                setColWidth={this.setColWidth}
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
                                <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Update</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleUpdateValue(event, true)}>
                                <span><FontAwesomeIcon icon="eraser" className="fa mr-2"/>Erase</span>
                            </button>
                        </div>                   
                    </div>
                </Modal>

                <Modal
                    show={showAssignNfi}
                    hideModal={this.toggleAssignNfi}
                    title="Assign NFI"
                >
                    <div className="col-12">
                        <form onSubmit={event => this.handleUpdateNFI(event, false)}>
                            <div className="form-group">
                                <label htmlFor="inputNfi">NFI Number</label>
                                <div className="input-group">
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="inputNfi"
                                        value={inputNfi}
                                        onChange={this.handleChange}
                                        placeholder=""
                                        required
                                    />
                                    <div className="input-group-append">
                                        <button
                                                className="btn btn-leeuwen-blue btn-lg"
                                                title="Get Latest NFI"
                                                onClick={event => this.getNfi(event, 0)}
                                            >
                                            <span><FontAwesomeIcon icon="arrow-to-bottom" className="fa"/> </span>
                                        </button>
                                        <button
                                            className="btn btn-success btn-lg"
                                            title="Get New NFI"
                                            onClick={event => this.getNfi(event, 1)}
                                        >
                                            <span><FontAwesomeIcon icon="sync-alt" className="fa"/> </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group mt-2">
                                <label htmlFor="updateValue">Act RFI Date</label>
                                    <input
                                        className="form-control"
                                        type='text'
                                        name="rfiDateAct"
                                        value={rfiDateAct}
                                        onChange={this.handleChange}
                                        placeholder={getDateFormat(myLocale)}
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
                    show={showGenerate}
                    hideModal={this.toggleGenerate}
                    title="Generate Document"
                    // size="modal-xl"
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
                            <div className="form-group">
                                <label htmlFor="inputNfi">Select NFI</label>
                                <select
                                    className="form-control"
                                    name="inputNfi"
                                    value={inputNfi}
                                    placeholder="Select NFI..."
                                    onChange={this.handleChange}
                                    required
                                >
                                    <option key="0" value="">Select NFI...</option>
                                    {generateOptions(nfiList)}
                                </select>
                            </div>
                            <CheckLocation 
                                title="Show Inspection Location"
                                callback={this.toggleLocation}
                            />
                            {showLocation &&
                                <div className="form-group">
                                    <label htmlFor="selectedLocation">Select Location</label>
                                    <select
                                        className="form-control"
                                        name="selectedLocation"
                                        value={selectedLocation}
                                        placeholder="Select Location..."
                                        onChange={this.handleChange}
                                        required
                                    >
                                        <option key="0" value="">Select Location...</option>
                                        {generateOptions(locationList)}
                                    </select>
                                </div>
                            }
                            <div className="text-right">
                                <button type="submit" className="btn btn-success btn-lg">
                                    <span><FontAwesomeIcon icon="file-excel" className="fa mr-2"/>Generate</span>
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
    const { accesses, alert, docdefs, fieldnames, fields, pos, selection, settings, suppliers, sidemenu } = state;
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;
    const { loadingSuppliers } = suppliers;
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
        loadingSuppliers,
        pos,
        selection,
        settings,
        suppliers,
        sidemenu
    };
}

const connectedReleaseData = connect(mapStateToProps)(ReleaseData);
export { connectedReleaseData as ReleaseData };