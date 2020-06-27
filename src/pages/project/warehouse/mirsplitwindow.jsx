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
    poActions,
    projectActions,
    settingActions,
    sidemenuActions
} from '../../../_actions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import TabFilter from '../../../_components/setting/tab-filter';
import TabDisplay from '../../../_components/setting/tab-display';
import SplitLine from '../../../_components/split-line/split-mir';
import Modal from '../../../_components/modal';

import moment from 'moment';
import _ from 'lodash';
import { __promisify__ } from 'glob';

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

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

function passSelectedIds(selectedIds) {
    if (_.isEmpty(selectedIds) || selectedIds.length > 1) {
        return {};
    } else {
        return selectedIds[0];
    }
}

function passSelectedMir(selectedIds, mirs) {
    if (_.isEmpty(selectedIds) || selectedIds.length > 1 || _.isEmpty(mirs.items)){
        return {};
    } else {
        return mirs.items.find(mir => mir._id === selectedIds[0].mirId);
    }
}


function TypeToString(fieldValue, fieldType, myDateFormat) {
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

function DateToString(fieldValue, fieldType, myDateFormat) {
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

function baseTen(number) {
    return number.toString().length > 2 ? number : '0' + number;
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

function findObj(array, search) {
    if (!_.isEmpty(array) && search) {
        return array.find((function(element) {
            return _.isEqual(element._id, search);
        }));
    } else {
        return {};
    }
}

// function getScreenTbls (fieldnames) {
//     if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
//         return fieldnames.items.reduce(function (accumulator, currentValue) {
//             if(!accumulator.includes(currentValue.fields.fromTbl)) {
//                 accumulator.push(currentValue.fields.fromTbl)
//             }
//             return accumulator;
//         },[]);
//     } else {
//         return [];
//     }
    
// }

function getScreenTbls (fieldnames, screenId) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        return fieldnames.items.reduce(function (accumulator, currentValue) {
            if(!accumulator.includes(currentValue.fields.fromTbl) && currentValue.screenId === screenId) {
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
    if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
        
        pos.items.map(po => {
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

class MirSplitwindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headersForShow: [],
            bodysForShow: [],
            headersForSelect: [],
            bodysForSelect: [],
            // splitHeadersForShow: [],
            // splitHeadersForSelect:[],
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
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handleChangeNewMir = this.handleChangeNewMir.bind(this);
        

        this.refreshStore = this.refreshStore.bind(this);
        this.refreshMir = this.refreshMir.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleSplitLine = this.handleSplitLine.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        //Toggle Modals
        this.toggleSplitLine = this.toggleSplitLine.bind(this);
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
            loadingFieldnames,
            loadingFields,
            loadingMirs,
            loadingPos,
            loadingSelection,
            loadingSettings,
            location,
            //---------
            fieldnames,
            mirs,
            pos,
            selection,
            settings 
        } = this.props;

        const { screenId, headersForShow, headersForSelect, settingsDisplay } = this.state; //splitScreenId

        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;

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
            if (!loadingPos) {
                dispatch(poActions.getAll(projectId));
            }
            if (!loadingSettings) {
                dispatch(settingActions.getAll(projectId, userId));
            }
        }

        this.setState({
            headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            headersForSelect: getHeaders([], fieldnames, screenId, 'forSelect'),
            bodysForShow: getBodysForShow(mirs, mirId, selection, headersForShow),
            bodysForSelect: getBodysForSelect(pos, selection, headersForSelect),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
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
        const { bodysForSelect, headersForShow, headersForSelect, mirId, screenId, settingsDisplay } = this.state; //splitScreenId,
        const { fieldnames, mirs, pos, selection, settings} = this.props;

        if (fieldnames != prevProps.fieldnames || settings != prevProps.settings){
            this.setState({
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
            });
        }

        if (settingsDisplay != prevState.settingsDisplay || fieldnames != prevProps.fieldnames) {
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
                headersForSelect: getHeaders([], fieldnames, screenId, 'forSelect')
            });
        }

        if (mirs != prevProps.mirs || selection != prevProps.selection || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodysForShow(mirs, mirId, selection, headersForShow)
            });
        }

        if (pos != prevProps.pos || selection != prevProps.selection || headersForSelect != prevState.headersForSelect) {
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

    // handleChangeNewMir(event) {
    //     event.preventDefault();
    //     const { projectId, newMir } = this.state;
    //     const name =  event.target.name;
    //     const value =  event.target.value;
    //     this.setState({
    //         newMir: {
    //             ...newMir,
    //             [name]: value,
    //             projectId
    //         }
    //     });
    // }

    updateSelectedIds(selectedIds) {
        this.setState({
            selectedIds: selectedIds
        });
    }

    handleDeleteRows(event) {
        event.preventDefault();
        // const { dispatch } = this.props;
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
        const { creating, projectId, mirId } = this.state;
        if (!containsPo && !creating) {
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

    render() {

        const { 
            projectId, 
            screen, 
            screenId,
            selectedIds, 
            unlocked, 
            //show modals
            showSplitLine,
            showSettings,
            //--------
            headersForShow,
            bodysForShow,
            headersForSelect,
            bodysForSelect,
            //---------------
            mir,
            // newMir,
            // showCreate,
            creating,
            
            //'-------------------'
            tabs,
            settingsFilter,
            settingsDisplay
        } = this.state;

        const { accesses, fieldnames, fields, pos, selection, sidemenu } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse}>
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
                                `${selection.project.name} - MIR: ${mir.mir} - Received: ${DateToString(mir.dateReceived, 'date', getDateFormat(myLocale))} / Expected: ${DateToString(mir.dateExpected, 'date', getDateFormat(myLocale))}`
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
                    title="Order Lines"
                    size="modal-xl"
                >
                    <SplitLine 
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
    const { accesses, alert, fieldnames, fields, mirs, pos, selection, settings, sidemenu } = state;
    const { loadingAccesses } = accesses;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingMirs } = mirs;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;

    
    return {
        accesses,
        alert,
        fieldnames,
        fields,
        loadingAccesses,
        loadingFieldnames,
        loadingFields,
        loadingMirs,
        loadingPos,
        loadingSelection,
        loadingSettings,
        mirs,
        pos,
        selection,
        settings,
        sidemenu
    };
}

const connectedMirSplitwindow = connect(mapStateToProps)(MirSplitwindow);
export { connectedMirSplitwindow as MirSplitwindow };