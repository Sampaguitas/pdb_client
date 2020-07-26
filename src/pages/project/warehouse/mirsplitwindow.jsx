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
    fieldnameActions,
    fieldActions,
    mirActions,
    projectActions,
    settingActions,
    sidemenuActions,
    transactionActions,
} from '../../../_actions';
import {
    getDateFormat,
    DateToString,
    baseTen,
    getInputType,
    getHeaders,
    initSettingsFilter,
    initSettingsDisplay,
    initSettingsColWidth,
    copyObject
} from '../../../_functions';
import { ProjectTable } from '../../../_components/project-table';
import { TabDisplay, TabFilter, TabWidth } from '../../../_components/setting';
import { Layout, Modal } from '../../../_components';
import { SplitMir } from '../../../_components/split-line';
import _ from 'lodash';
import { __promisify__ } from 'glob';

function getBodysForShow(mirs, mirId, selection, headersForShow) {
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let i = 1;
    if (!_.isUndefined(mirs) && mirs.hasOwnProperty('items') && !_.isEmpty(mirs.items)) {
        mirs.items.map(mir => {
            if (_.isEqual(mir._id, mirId)) {
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
                if (!_.isEmpty(mir.miritems)) {
                    mir.miritems.map(miritem => {
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
                                case 'miritem':
                                    arrayRow.push({
                                        collection: 'miritem',
                                        objectId: miritem._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: miritem[screenHeader.fields.name],
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
                                            objectId: miritem.po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: miritem.po[screenHeader.fields.name],
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
                                poId: miritem.po._id,
                                subId: '',
                                certificateId: '',
                                packitemId: '',
                                collipackId: '',
                                mirId: mir._id,
                                miritemId: miritem._id
                            },
                            fields: arrayRow
                        };
                        arrayBody.push(objectRow);
                        i++;
                    });
                }
            }
        });
        
        return arrayBody;
    } else {
        return [];
    }
}

function getBodysForSelect(pos, selection, headersForSelect) {
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForSelect;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let i = 1;
    if (!_.isEmpty(pos)) {
        pos.map(po => {
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
                    certificateId: '',
                    packitemId: '',
                    collipackId: '',
                    mirId: '',
                    miritemId: '',
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

function getPos(transactions, mirs, mirId) {
    if (!_.isUndefined(transactions) && transactions.hasOwnProperty('items') && !_.isEmpty(transactions.items)) {
        let selectedMir =  (!_.isUndefined(mirs) && mirs.hasOwnProperty('items') && !_.isEmpty(mirs.items)) ? mirs.items.find(element => _.isEqual(element._id, mirId)) : undefined;
        return transactions.items.reduce(function(acc, cur) {
            let includesMiritem = !_.isUndefined(selectedMir) ? selectedMir.miritems.some(element => _.isEqual(element._id, mirId)) : false;
            if (!includesMiritem) {
                let found = acc.find(element => _.isEqual(element._id, cur.po._id));
                if (!found) {
                    let mirQty = 0;
                    if (!_.isUndefined(mirs) && mirs.hasOwnProperty('items') && !_.isEmpty(mirs.items)) {
                        mirQty = mirs.items.reduce(function(accMir, curMir) {
                            let mirItemsQty = curMir.miritems.reduce(function(accItem, curItem) {
                                if (_.isEqual(curItem.poId, cur.po.Id)) {
                                    let required = cur.qtyRequired || 0;
                                    accItem += required
                                }
                                return accItem;
                            }, 0);
                            accMir += mirItemsQty;
                            return accMir;
                        }, 0);
                    }
                    let copyPo = cur.po;
                    copyPo.stock = cur.transQty;
                    copyPo.mirQty = mirQty;
                    acc.push(copyPo);
                } else {
                    found.stock += cur.transQty;
                }
            }
            return acc;
        }, []);
    } else {
        return [];
    }
}

class MirSplitwindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: [],
            headersForShow: [],
            bodysForShow: [],
            headersForSelect: [],
            bodysForSelect: [],
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
            mirId: '',
            mir: {
                mir: '',
                dateReceived: '',
                dateExpected: '',
                miritems: '',
            },
            screenId: '5ed1e7a67c213e044cc01888',
            unlocked: false,
            screen: 'Material issue record',
            selectedIds: [],
            alert: {
                type:'',
                message:''
            },
            showSplitLine: false,
            showSettings: false,
            creating: false,
            menuItem: 'Warehouse',
            downloadingTable: false,
            settingSaving
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.refreshMir = this.refreshMir.bind(this);
        this.refreshTransactions = this.refreshTransactions.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleSplitLine = this.handleSplitLine.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.toggleSplitLine = this.toggleSplitLine.bind(this);
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
            loadingTransactions,
            location,
            fieldnames,
            mirs,
            selection,
            settings,
            transactions
        } = this.props;

        const { menuItem, screenId, headersForShow, headersForSelect, settingsDisplay, pos } = this.state;
        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;
        dispatch(sidemenuActions.select(menuItem));
        let projectId = qs.id;
        let mirId = qs.mirid;

        if (qs.id) {
            this.setState({
                projectId: projectId,
                mirId: mirId
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
            if (!loadingMirs) {
                dispatch(mirActions.getAll(projectId));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(projectId));
            }
            if (!loadingSettings) {
                dispatch(settingActions.getAll(projectId, userId));
            }
            if (!loadingTransactions) {
                dispatch(transactionActions.getAll(projectId));
            }
        }

        this.setState({
            pos: getPos(transactions, mirs, mirId),
            headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            headersForSelect: getHeaders([], fieldnames, screenId, 'forSelect'),
            bodysForShow: getBodysForShow(mirs, mirId, selection, headersForShow),
            bodysForSelect: getBodysForSelect(pos, selection, headersForSelect),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId),
            settingsColWidth: initSettingsColWidth(settings, screenId)
        }, () => {
            if (mirs.hasOwnProperty('items') && !_.isEmpty(mirs.items)) {
                let found = mirs.items.find(element => _.isEqual(element._id, mirId));
                if (!_.isUndefined(found)) {
                    this.setState({
                        mir: {
                            mir: found.mir,
                            dateReceived: found.dateReceived,
                            dateExpected: found.dateExpected,
                            miritems: found.miritems
                        }
                    });
                }
                
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { bodysForSelect, headersForShow, headersForSelect, mirId, screenId, settingsDisplay, pos } = this.state;
        const { fieldnames, mirs, selection, settings, transactions} = this.props;

        if (transactions != prevProps.transactions || mirs != prevProps.mirs) {
            this.setState({ pos: getPos(transactions, mirs, mirId) });
        }

        if (fieldnames != prevProps.fieldnames){
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
                headersForSelect: getHeaders([], fieldnames, screenId, 'forSelect'),
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

        if (mirs != prevProps.mirs || selection != prevProps.selection || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodysForShow(mirs, mirId, selection, headersForShow)
            });
        }

        if (pos != prevState.pos || selection != prevProps.selection || headersForSelect != prevState.headersForSelect) {
            this.setState({
                bodysForSelect: getBodysForSelect(pos, selection, headersForSelect)
            });
        }

        if ((mirId != prevState.mirId || mirs != prevProps.mirs) && mirs.hasOwnProperty('items') && !_.isEmpty(mirs.items)) {
            let found = mirs.items.find(element => _.isEqual(element._id, mirId));
            if (!_.isUndefined(found)) {
                this.setState({
                    mir: {
                        mir: found.mir,
                        dateReceived: found.dateReceived,
                        dateExpected: found.dateExpected,
                        miritems: found.miritems
                    }
                });
            }
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

    refreshTransactions() {
        const { dispatch } = this.props;
        const { projectId } = this.state;

        if (projectId) {
            dispatch(transactionActions.getAll(projectId));
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
        } else if (confirm('For the Selected line(s) all items details and picking lists shall be deleted. Are you sure you want to proceed?')){
            this.setState({
                ...this.state,
                deleting: true
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedIds: selectedIds })
                };
                return fetch(`${config.apiUrl}/miritem/delete`, requestOptions)
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

    toggleSplitLine(event) {
        event.preventDefault();
        const { showSplitLine } = this.state;
        this.setState({
            alert: {
                type: '',
                message: ''
            },
            showSplitLine: !showSplitLine
        });
    }

    handleSplitLine(event, containsPo, qtyRequired, poId) {
        event.preventDefault();
        const { creating, projectId, mirId, pos } = this.state;
        let selectedPo = pos.find(element => element._id === poId);
        if (!containsPo && !creating) {
            if (!_.isUndefined(selectedPo) && (qtyRequired > (selectedPo.stock - selectedPo.mirQty))) {
                this.setState({
                    alert: {
                        type: 'alert-danger',
                        message: 'You cannot add more units than remaining.'
                    }
                });
            } else if (!qtyRequired || qtyRequired < 0) {
                this.setState({
                    alert: {
                        type: 'alert-danger',
                        message: 'Quantity required should be greater than 0.'
                    }
                });
            } else {
                this.setState({
                    creating: true
                }, () => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            qtyRequired: qtyRequired,
                            poId: poId,
                            mirId: mirId,
                            projectId: projectId
                        })
                    };
                    return fetch(`${config.apiUrl}/miritem/create`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);;
                        } else {
                            this.setState({
                                creating: false,
                                showSplitLine: false,
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
    }

    handleEditClick(event) {
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
        } else {

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
            showSplitLine,
            showSettings,
            headersForShow,
            bodysForShow,
            headersForSelect,
            bodysForSelect,
            mir,
            creating,
            tabs,
            settingsFilter,
            settingsDisplay,
            pos,
            downloadingTable,
            settingsColWidth,
            settingSaving
        } = this.state;

        const { accesses, fieldnames, fields, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && !showSettings && !showSplitLine &&
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
                            <NavLink to={{ pathname: '/materialissuerecord', search: '?id=' + projectId }} tag="a">Material issue record:</NavLink>
                        </li>
                        <span className="ml-3 project-title">
                            {selection.project ?
                                `${selection.project.name} - MIR: ${mir.mir} - Received: ${DateToString(mir.dateReceived, 'date', getDateFormat())} / Expected: ${DateToString(mir.dateExpected, 'date', getDateFormat())}`
                            :
                                <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw"/>
                            }
                        </span>
                    </ol>
                </nav>
                <div id="mirsplitwindow" className={ (alert.message && !showSettings && !showSplitLine) ? "main-section-alert" : "main-section"}>
                        <div className="action-row row">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Add Line to MIR" onClick={this.toggleSplitLine}>
                            <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Add Line</span>
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
                    show={showSplitLine}
                    hideModal={this.toggleSplitLine}
                    title="Order Lines"
                    size="modal-xl"
                >
                    <SplitMir 
                        screenHeaders={headersForSelect}
                        screenBodys={bodysForSelect}
                        mir={mir}
                        pos={pos}
                        alert={alert}
                        creating={creating}
                        handleClearAlert={this.handleClearAlert}
                        handleSplitLine={this.handleSplitLine}
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
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, fieldnames, fields, mirs, selection, settings, sidemenu, transactions } = state;
    const { loadingAccesses } = accesses;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingMirs } = mirs;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;
    const { loadingTransactions } = transactions;

    
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
        loadingTransactions,
        mirs,
        selection,
        settings,
        sidemenu,
        transactions
    };
}

const connectedMirSplitwindow = connect(mapStateToProps)(MirSplitwindow);
export { connectedMirSplitwindow as MirSplitwindow };