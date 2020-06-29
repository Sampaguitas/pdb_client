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
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import TabFilter from '../../../_components/setting/tab-filter';
import TabDisplay from '../../../_components/setting/tab-display';
import Modal from '../../../_components/modal';
import ColliType from '../../../_components/split-line/collitype';


const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function leadingChar(string, char, length) {
    return string.toString().length > length ? string : char.repeat(length - string.toString().length) + string;
}

function baseTen(number) {
    return number.toString().length > 2 ? number : '0' + number;
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


function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'Date': return String(moment(fieldValue).format(myDateFormat));
            case 'Number': return String(new Intl.NumberFormat().format(fieldValue)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}


function DateToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function StringToDate (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat).toDate();
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function isValidFormat (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat, true).isValid();
            default: return true;
        }
    } else {
        return true;
    }
    
}

function resolve(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

function arraySorted(array, fieldOne, fieldTwo, fieldThree) {
    if (array) {
        const newArray = array
        newArray.sort(function(a,b){
            if (resolve(fieldOne, a) < resolve(fieldOne, b)) {
                return -1;
            } else if (resolve(fieldOne, a) > resolve(fieldOne, b)) {
                return 1;
            } else if (fieldTwo && resolve(fieldTwo, a) < resolve(fieldTwo, b)) {
                return -1;
            } else if (fieldTwo && resolve(fieldTwo, a) > resolve(fieldTwo, b)) {
                return 1;
            } else if (fieldThree && resolve(fieldThree, a) < resolve(fieldThree, b)) {
                return -1;
            } else if (fieldThree && resolve(fieldThree, a) > resolve(fieldThree, b)) {
                return 1;
            } else {
                return 0;
            }
        });
        return newArray;             
    }
}

function docConf(array) {
    const tpeOf = [
        //'5d1927121424114e3884ac7e', //ESR01 Expediting status report
        '5d1927131424114e3884ac80', //PL01 Packing List
        '5d1927141424114e3884ac84', //SM01 Shipping Mark
        '5d1927131424114e3884ac81', //PN01 Packing Note
        '5d1927141424114e3884ac83' //SI01 Shipping Invoice
        // '5d1927131424114e3884ac7f', //NFI1 Notification for Inspection
        // '5eacef91e7179a42f172feea', //SH01 Stock History Report
        //'5edb2317e7179a6b6367d786', //PT01 Picking Ticket
        //'5ef4e9a67c213e6263a723f0', //WHPL01 WH Packing List
        //'5ef4e9d67c213e6263a7240e', //WHPN01 WH Packing Note
        //'5ef4ea197c213e6263a7241b', //WHSI01 WH Shipping Invoice
        //'5ef4ea597c213e6263a72425', //WHSM01 WH Shipping Mark
    ];
    if (array) {
        return array.filter(function (element) {
            return tpeOf.includes(element.doctypeId);
        });
    }
}

function findObj(array, search) {
    if (!_.isEmpty(array) && search) {
        return array.find((function(element) {
            return _.isEqual(element._id, search);
        }));
    } else {
        return {};
    }
}

function getScreenTbls (fieldnames) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        return fieldnames.items.reduce(function (accumulator, currentValue) {
            if(!accumulator.includes(currentValue.fields.fromTbl)) {
                accumulator.push(currentValue.fields.fromTbl)
            }
            return accumulator;
        },[]);
    } else {
        return [];
    }
    
}

function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
    }
}

function getHeaders(settingsDisplay, fieldnames, screenId, forWhat) {
    
    let tempArray = [];
    let screens = [
        '5cd2b642fd333616dc360b63', //Expediting
        '5cd2b646fd333616dc360b70', //Expediting Splitwindow
        '5cd2b642fd333616dc360b64', //Inspection
        '5cd2b647fd333616dc360b71', //Inspection Splitwindow
        '5cd2b643fd333616dc360b66', //Assign Transport
        '5cd2b647fd333616dc360b72', //Assign Transport SplitWindow
        '5cd2b643fd333616dc360b67', //Print Transportdocuments
        '5cd2b642fd333616dc360b65', //Certificates
        '5cd2b644fd333616dc360b69', //Suppliers
        '5ea8eefb7c213e2096462a2c', //Stock Management
        '5eb0f60ce7179a42f173de47', //Goods Receipt with PO
        '5ea911747c213e2096462d79', //Goods Receipt with NFI
        '5ea919727c213e2096462e3f', //Goods Receipt with PL
        '5ed1e76e7c213e044cc01884', //Material Issue Record
        '5ed1e7a67c213e044cc01888', //Material Issue Record Splitwindow
        '5ee60fbb7c213e044cc480e4', //'WH Assign Transport'
        '5ee60fd27c213e044cc480e7', //'WH Assign Transport SplitWindow'
        '5ee60fe87c213e044cc480ea', //'WH Print Transportdocuments'
    ];

    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {        
        
        let displayIds = settingsDisplay.reduce(function(acc, cur) {
            if (!!cur.isChecked) {
                acc.push(cur._id);
            }
            return acc;
        }, []);

        if (!_.isEmpty(displayIds) && screens.includes(screenId)) {
            tempArray = fieldnames.items.filter(function(element) {
                return (_.isEqual(element.screenId, screenId) && !!element[forWhat] && displayIds.includes(element._id)); 
            });
        } else {
            tempArray = fieldnames.items.filter(function(element) {
                return (_.isEqual(element.screenId, screenId) && !!element[forWhat]); 
            });
        }

        if (!!tempArray) {
            return tempArray.sort(function(a,b) {
                return a[forWhat] - b[forWhat];
            });
        } 
    }

    return [];
}

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

function getPlList(collipacks) {
    if (collipacks.hasOwnProperty('items') && !_.isUndefined(collipacks.items)){
        let tempPl = collipacks.items.reduce(function (acc, cur) {
                if(!!cur.plNr && !acc.includes(cur.plNr)) {
                    acc.push(cur.plNr);
                }
                return acc;
        }, []);
        tempPl.sort((a, b) => Number(b) - Number(a));
        return tempPl.reduce(function(acc, cur) {
            acc.push({_id: cur, name: cur});
            return acc;
        }, []);
    }
}

function generateOptions(list) {
    if (list) {
        return list.map((element, index) => <option key={index} value={element._id}>{element.name}</option>);
    }
}


function getClPo(pos, selectedPl) {
    let badChars = /[^a-zA-Z0-9_()]/mg;
    // let tempClPo = '';
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

function initSettingsFilter(fieldnames, settings, screenId) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        let tempArray = fieldnames.items.filter(element => _.isEqual(element.screenId, screenId) && !!element.forShow && !!element.forSelect);
        let screenSettings = settings.items.find(element => _.isEqual(element.screenId, screenId));

        if (!tempArray) {
            return [];
        } else {
            tempArray.sort(function(a,b) {
                return a.forSelect - b.forSelect;
            });
            return tempArray.reduce(function(acc, cur) {
                if (_.isUndefined(screenSettings) || _.isEmpty(screenSettings.params.filter)) {
                    acc.push({
                        _id: cur._id,
                        name: cur.fields.name,
                        custom: cur.fields.custom,
                        value: '',
                        type: cur.fields.type,
                        isEqual: false
                    });
                } else {
                    let found = screenSettings.params.filter.find(element => element._id === cur._id);
                    if (_.isUndefined(found)) {
                        acc.push({
                            _id: cur._id,
                            name: cur.fields.name,
                            custom: cur.fields.custom,
                            value: '',
                            type: cur.fields.type,
                            isEqual: false
                        });
                    } else {
                        acc.push({
                            _id: cur._id,
                            name: cur.fields.name,
                            custom: cur.fields.custom,
                            value: found.value,
                            type: cur.fields.type,
                            isEqual: found.isEqual
                        });
                    }
                }
                return acc;
            }, []);
        }
    } else {
        return [];
    }
}

function initSettingsDisplay(fieldnames, settings, screenId) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        let tempArray = fieldnames.items.filter(element => _.isEqual(element.screenId, screenId) && !!element.forShow);
        let screenSettings = settings.items.find(element => _.isEqual(element.screenId, screenId));

        if (!tempArray) {
            return [];
        } else {
            tempArray.sort(function(a,b) {
                return a.forShow - b.forShow;
            });
            return tempArray.reduce(function(acc, cur) {
                if (_.isUndefined(screenSettings) || !screenSettings.params.display.includes(cur._id)) {
                    acc.push({
                        _id: cur._id,
                        custom: cur.fields.custom,
                        isChecked: true
                    });
                } else {
                    acc.push({
                        _id: cur._id,
                        custom: cur.fields.custom,
                        isChecked: false
                    });
                }
                return acc;
            }, []);
        }
    } else {
        return [];
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
            //-----modals-----
            showEditValues: false,
            showColliTypes: false,
            // showSplitLine: false,
            showGenerate: false,
            showSettings: false,
            menuItem: 'Shipping'
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
            docList: arraySorted(docConf(docdefs.items), "name"),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
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

        if (screenId != prevState.screenId || fieldnames != prevProps.fieldnames){
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
            this.setState({docList: arraySorted(docConf(docdefs.items), "name")});
        }

        if (settingsDisplay != prevState.settingsDisplay) {
            this.setState({headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow')});
        }

        if (settings != prevProps.settings) {
            this.setState({
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
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
            .then(res => res.blob()).then(blob => saveAs(blob, `DOWNLOAD_${screen}_${year}_${leadingChar(month+1, '0', 2)}_${date}.xlsx`));
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
        const { selectedField, selectedType, selectedIds, projectId, unlocked, updateValue} = this.state;
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
                                alert: {
                                    type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                    message: data.message
                                }
                            }, this.refreshStore);
                        } else {
                            this.setState({
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

    handleUpdateWeight(event) {
        event.preventDefault();
        const { selection } = this.props;
        const { projectId, selectedIds } = this.state;

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
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshStore);
                } else {
                    this.setState({
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
                    showEditValues: false,
                    alert: {
                        type: 'alert-danger',
                        message: 'Field could not be updated.'
                    }
                }, this.refreshStore);
            }));
        }
    }

    assignColliType(collitypeId) {
        const { selection, collitypes } = this.props;
        const { projectId, selectedIds, assigning } = this.state;
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
            settingsDisplay
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
                            <span><FontAwesomeIcon icon="balance-scale-left" className="fa mr-2"/>Net Weight</span>
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