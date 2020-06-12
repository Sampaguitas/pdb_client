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
    heatlocActions,
    heatpickActions,
    pickticketActions,
    projectActions,
    settingActions
} from '../../../_actions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import TabFilter from '../../../_components/setting/tab-filter';
import TabDisplay from '../../../_components/setting/tab-display';
import Modal from '../../../_components/modal';
import HeatPick from '../../../_components/split-line/heat-pick';
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

// function passSelectedMir(selectedIds, mirs) {
//     if (_.isEmpty(selectedIds) || selectedIds.length > 1 || _.isEmpty(mirs.items)){
//         return {};
//     } else {
//         return mirs.items.find(mir => mir._id === selectedIds[0].mirId);
//     }
// }


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

function getLocName(location, area) {
    return `${area.areaNr}/${location.hall}${location.row}-${leadingChar(location.col, '0', 3)}${!!location.height ? '-' + location.height : ''}`;
}

function leadingChar(string, char, length) {
    return string.toString().length > length ? string : char.repeat(length - string.toString().length) + string;
}

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
                                arrayRow.push({
                                    collection: pickticket.isProcessed ? 'virtual' : 'pickticket',
                                    objectId: pickticket._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: pickticket[screenHeader.fields.name],
                                    disabled: pickticket.isProcessed ? true : screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                                });
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
                            }); 
                        }
                    });
                    objectRow  = {
                        _id: i,
                        tablesId: {
                            poId: pickitem.miritem.po._id,
                            subId: '',
                            certificateId: '',
                            packitemId: '',
                            collipackId: '',
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

class PtSplitwindow extends React.Component {
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
            // showSplitLine: false,
            showSettings: false,
            showHeat: false,
            processing: false,
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handleChangeNewMir = this.handleChangeNewMir.bind(this);
        

        this.refreshStore = this.refreshStore.bind(this);
        this.refresHeatLocs = this.refresHeatLocs.bind(this);
        this.refreshHeatPicks = this.refreshHeatPicks.bind(this);
        this.refreshPickTicket = this.refreshPickTicket.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        this.handleClosePickTicket = this.handleClosePickTicket.bind(this);
        this.handleOpenPickTicket = this.handleOpenPickTicket.bind(this);
        //Toggle Modals
        this.toggleHeat = this.toggleHeat.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        //Settings
        this.handleInputSettings = this.handleInputSettings.bind(this);
        this.handleIsEqualSettings = this.handleIsEqualSettings.bind(this);
        this.handleClearInputSettings = this.handleClearInputSettings.bind(this);
        this.handleCheckSettings = this.handleCheckSettings.bind(this);
        this.handleCheckSettingsAll = this.handleCheckSettingsAll.bind(this);
        this.handleRestoreSettings = this.handleRestoreSettings.bind(this);
        this.handleSaveSettings = this.handleSaveSettings.bind(this);
        
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

        const { screenId, headersForShow, settingsDisplay } = this.state; //splitScreenId

        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;

        let projectId = qs.id;
        let pickticketId = qs.pickticketid;

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
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
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
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
            });
        }

        if (settingsDisplay != prevState.settingsDisplay || fieldnames != prevProps.fieldnames) {
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
            'Do you whant to update the stock with the quantities of this Picking Ticket?',
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

    render() {

        const { 
            projectId, 
            screen, 
            screenId,
            selectedIds, 
            unlocked, 
            //show modals
            // showSplitLine,
            showHeat,
            showSettings,
            //--------
            headersForShow,
            bodysForShow,
            //---------------
            pickticket,
            // newMir,
            // showCreate,
            processing,
            //'-------------------'
            tabs,
            settingsFilter,
            settingsDisplay
        } = this.state;

        const { accesses, fieldnames, fields, heatlocs, heatpicks, selection } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        return (
            <Layout alert={showSettings ? {type:'', message:''} : alert} accesses={accesses} selection={selection}>
                {alert.message && !showSettings &&
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
                                `${selection.project.name} - Picking Tciket: ${pickticket.pickNr} - Warehouse: ${pickticket.warehouse}`
                            :
                                <FontAwesomeIcon icon="spinner" className="fa-pulse fa-lg fa-fw"/>
                            }
                        </span>
                    </ol>
                </nav>
                <hr />
                <div id="calloff" className="full-height">
                    <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}>
                        <button title="Change/Add Heat Numbers" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} onClick={this.toggleHeat}>
                            <span><FontAwesomeIcon icon="file-certificate" className="fa-lg mr-2"/>Heat Numbers</span>
                        </button>
                        <button title="PickTicket" className="btn btn-leeuwen btn-lg mr-2" style={{height: '34px'}} onClick={pickticket.isProcessed ? this.handleOpenPickTicket : this.handleClosePickTicket}> {/* onClick={this.toggleHeat} */}
                            <span><FontAwesomeIcon icon={processing ? "spinner" : "exclamation-triangle"} className={processing ? "fa-pulse fa-lg fa-fw mr-2" : "fa-lg mr-2"}/>{pickticket.isProcessed ? 'Open PickTicket' : 'Close PickTicket'}</span>
                        </button>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
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
                    show={showHeat}
                    hideModal={this.toggleHeat}
                    title="Change/Add Heat numbers"
                    size="modal-xl"
                >
                    <HeatPick
                        alert={alert}
                        handleClearAlert={this.handleClearAlert}
                        toggleHeat={this.toggleHeat}
                        poId={!_.isEmpty(selectedIds) ? selectedIds[0].poId : ''}
                        locationId={!_.isEmpty(selectedIds) ? selectedIds[0].locationId : ''}
                        pickitemId={!_.isEmpty(selectedIds) ? selectedIds[0].pickitemId : ''}
                        projectId={projectId}
                        // refreshCifs={this.refreshCifs}
                        refresHeatLocs={this.refresHeatLocs}
                        refreshHeatPicks={this.refreshHeatPicks}
                        heatlocs={heatlocs}
                        heatpicks={heatpicks}
                        // certificates={certificates}
                        
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
                            <span><FontAwesomeIcon icon="undo-alt" className="fa-lg mr-2"/>Restore</span>
                        </button>
                        <button className="btn btn-leeuwen btn-lg mr-2" onClick={this.handleSaveSettings}>
                            <span><FontAwesomeIcon icon="save" className="fa-lg mr-2"/>Save</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={this.toggleSettings}>
                            <span><FontAwesomeIcon icon="times" className="fa-lg mr-2"/>Close</span>
                        </button>
                    </div>
                </Modal>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, fieldnames, fields, heatlocs, heatpicks, picktickets, selection, settings } = state;
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
        settings
    };
}

const connectedPtSplitwindow = connect(mapStateToProps)(PtSplitwindow);
export { connectedPtSplitwindow as PtSplitwindow };