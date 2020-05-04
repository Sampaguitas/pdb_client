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
    transactionActions,
    warehouseActions
} from '../../../_actions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import TabFilter from '../../../_components/setting/tab-filter';
import TabDisplay from '../../../_components/setting/tab-display';
import Modal from '../../../_components/modal';
import GoodsReceipt from '../../../_components/split-line/goods-receipt';
import moment from 'moment';
import _ from 'lodash';


const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function leadingChar(string, char, length) {
    return string.toString().length > length ? string : char.repeat(length - string.toString().length) + string;
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

function passSelectedIds(selectedIds) {
    if (_.isEmpty(selectedIds) || selectedIds.length > 1) {
        return {};
    } else {
        return selectedIds[0];
    }
}

function passSelectedPo(selectedIds, pos) {
    if (_.isEmpty(selectedIds) || selectedIds.length > 1 || _.isEmpty(pos.items)){
        return {};
    } else {
        return pos.items.find(po => po._id === selectedIds[0].poId);
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

function docConf(array) {
    const tpeOf = [
        //'5d1927121424114e3884ac7e', //ESR01 Expediting status report
        // '5d1927131424114e3884ac80', //PL01 Packing List
        // '5d1927141424114e3884ac84', //SM01 Shipping Mark
        // '5d1927131424114e3884ac81', //PN01 Packing Note
        // '5d1927141424114e3884ac83' //SI01 Shipping Invoice
        // '5d1927131424114e3884ac7f' //NFI1 Notification for Inspection
        '5eacef91e7179a42f172feea' //SH01 Stock History Report
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

function getTblFields (screenHeaders, fromTbl) {
    if (screenHeaders) {
        let tempArray = [];
        screenHeaders.reduce(function (accumulator, currentValue) {
            if (currentValue.fields.fromTbl === fromTbl && !accumulator.includes(currentValue.fields._id)) {
                tempArray.push(currentValue.fields);
                accumulator.push(currentValue.fields._id);
            }
            return accumulator;
        },[]);
        return tempArray;
    } else {
        return [];
    }
}

function hasFieldName(tblFields, fieldName) {
    let tempResult = false;
    if (tblFields) {
        tblFields.map(function (tblField) {
            if (tblField.name === fieldName) {
                tempResult = true;
            }
        });
    }
    return tempResult;
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
        '5cd2b642fd333616dc360b63', //overview
        '5cd2b642fd333616dc360b64', //releasedata
        '5cd2b642fd333616dc360b65', //certificates
        '5cd2b643fd333616dc360b67', //packing details
        '5cd2b643fd333616dc360b66', //transportdocs
        '5ea8eefb7c213e2096462a2c', //Stock Management
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

function virtuals(transactions, id, whichId, hasLocation, hasArea, hasWarehouse) {
    let tempResult = [];
    if (transactions.hasOwnProperty('items') && !_.isEmpty(transactions.items)) {
        tempResult = transactions.items.reduce(function (acc, cur) {
            //is it the same id?
            if (cur[whichId] === id) {
                //find existing location
                let found = acc.find(function (element) {
                    if (hasLocation) {
                        return element._id === cur.locationId;
                    } else if (hasArea) {
                        return element._id === cur.location.area._id;
                    } else if (hasWarehouse) {
                        return element._id === cur.location.area.warehouse._id;
                    } else {
                        return element._id === '';
                    }
                });
                if (!_.isUndefined(found)) {
                    found.stockQty += cur.transQty;
                } else if(hasLocation) {
                    let areaNr = cur.location.area.areaNr;
                    let hall = cur.location.hall;
                    let row = cur.location.row;
                    let col = cur.location.col;
                    let height = cur.location.height;
                    acc.push({
                        _id: cur.locationId,
                        stockQty: cur.transQty || 0,
                        warehouse: cur.location.area.warehouse.warehouse,
                        area: cur.location.area.area,
                        location: `${areaNr}/${hall}${row}-${leadingChar(col, '0', 3)}${!!height ? '-' + height : ''}`,
                        locationId: cur.locationId,
                    });
                } else if(hasArea) {
                    acc.push({
                        _id: cur.location.area._id,
                        stockQty: cur.transQty || 0,
                        warehouse: cur.location.area.warehouse.warehouse,
                        area: cur.location.area.area,
                        locationId: '',
                    });
                } else if (hasWarehouse) {
                    acc.push({
                        _id: cur.location.area.warehouse._id,
                        stockQty: cur.transQty || 0,
                        warehouse: cur.location.area.warehouse.warehouse,
                        locationId: '',
                    });
                } else {
                    acc.push({
                        _id: '',
                        stockQty: cur.transQty || 0,
                        locationId: '',
                    });
                }
            }
        }, []);
    }

    if (!_.isEmpty(tempResult)) {
        return tempResult;
    } else {
        return [{
            _id: '',
            stockQty: 0,
            warehouse: '',
            area: '',
            location: '',
            locationId: '', 
        }];
    }
}

function getPlBodys (selection, pos, transactions, headersForShow) {
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    let project = selection.project || { _id: '0', name: '', number: '' };
    // let hasPackitems = getScreenTbls(fieldnames, screenId).includes('packitem');
    let hasLocation = hasFieldName(getTblFields (screenHeaders, 'location'), 'location');
    let hasArea = hasFieldName(getTblFields (screenHeaders, 'location'), 'area');
    let hasWarehouse = hasFieldName(getTblFields (screenHeaders, 'location'), 'warehouse');
    let i = 1;
    if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
        pos.items.map(po => {
            if (po.subs) {
                po.subs.map(sub => {
                    if (!_.isEmpty(sub.packitems)) { //&& hasPackitems
                        sub.packitems.map(packitem => {
                            if (!!packitem.plNr && !!packitem.colliNr) {
                                virtuals(transactions, packitem._id, 'packitemId', hasLocation, hasArea, hasWarehouse).map(function(virtual){
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
                                                arrayRow.push({
                                                    collection: 'sub',
                                                    objectId: sub._id,
                                                    fieldName: screenHeader.fields.name,
                                                    fieldValue: sub[screenHeader.fields.name],
                                                    disabled: screenHeader.edit,
                                                    align: screenHeader.align,
                                                    fieldType: getInputType(screenHeader.fields.type),
                                                });
                                                break;
                                            case 'packitem':
                                                arrayRow.push({
                                                    collection: 'packitem',
                                                    objectId: packitem._id,
                                                    parentId: sub._id,
                                                    fieldName: screenHeader.fields.name,
                                                    fieldValue: packitem[screenHeader.fields.name],
                                                    disabled: screenHeader.edit,
                                                    align: screenHeader.align,
                                                    fieldType: getInputType(screenHeader.fields.type),
                                                });
                                                break;
                                            case 'location':
                                                arrayRow.push({
                                                    collection: 'virtual',
                                                    objectId: virtual._id,
                                                    fieldName: screenHeader.fields.name,
                                                    fieldValue: virtual[screenHeader.fields.name],
                                                    disabled: screenHeader.edit,
                                                    align: screenHeader.align,
                                                    fieldType: getInputType(screenHeader.fields.type),
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
                                            });
                                        }
                                    });
                                    
                                    objectRow  = {
                                        _id: i, 
                                        tablesId: { 
                                            poId: po._id,
                                            subId: sub._id,
                                            certificateId: '',
                                            packitemId: packitem._id,
                                            collipackId: '' 
                                        },
                                        fields: arrayRow
                                    };
                                    arrayBody.push(objectRow);
                                    i++;
                                });
                            }
                        });
                    }
                })
            }
        });
        return arrayBody;
    } else {
        return [];
    }
}

function getNfiBodys (selection, pos, transactions, headersForShow) {
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let hasLocation = hasFieldName(getTblFields (screenHeaders, 'location'), 'location');
    let hasArea = hasFieldName(getTblFields (screenHeaders, 'location'), 'area');
    let hasWarehouse = hasFieldName(getTblFields (screenHeaders, 'location'), 'warehouse');
    
    let i = 1;
    if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
        pos.items.map(po => {
            if (po.subs) {
                po.subs.map(sub => {
                    if (!!sub.nfi && !!sub.relQty) {
                        virtuals(transactions, sub._id, 'subId', hasLocation, hasArea, hasWarehouse).map(function(virtual){
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
                                        arrayRow.push({
                                            collection: 'sub',
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                        break;
                                    case 'location':
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: virtual._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: virtual[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
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
                    }
                })
            }
        });
        return arrayBody;
    } else {
        return [];
    }
}

function getBodysForShow (selection, pos, transactions, headersForShow) {
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let screenHeaders = headersForShow;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let hasLocation = hasFieldName(getTblFields (screenHeaders, 'location'), 'location');
    let hasArea = hasFieldName(getTblFields (screenHeaders, 'location'), 'area');
    let hasWarehouse = hasFieldName(getTblFields (screenHeaders, 'location'), 'warehouse');

    let i = 1;
    if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
        pos.items.map(po => {
            virtuals(transactions, po._id, 'subId', hasLocation, hasArea, hasWarehouse).map(function(virtual){
                // if (!!virtual._id) {
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
                            case 'location':
                                arrayRow.push({
                                    collection: 'virtual',
                                    objectId: virtual._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: virtual[screenHeader.fields.name],
                                    disabled: screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
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
                            locationId: virtual.locationId,
                        },
                        fields: arrayRow
                    };
                    arrayBody.push(objectRow);
                    i++;
                // }
            });
        });
        return arrayBody;
    } else {
        return [];
    }
}

function getWhList(warehouses) {
    let whList = [];
    if (warehouses.hasOwnProperty('items') && !_.isUndefined(warehouses.items)) {
        whList = warehouses.items.reduce(function(acc, cur) {
            acc.push({_id: cur._id, name: cur.warehouse});
            return acc;
        }, []);
    }
    return whList;
}

function getAreaList(warehouses, warehouseId) {
    let areaList = [];
    if (warehouses.hasOwnProperty('items') && !_.isUndefined(warehouses.items)) {
        warehouses.items.map(warehouse => {
            if(warehouse._id === warehouseId) {
                warehouse.areas.map(area => {
                    areaList.push({
                        _id: area._id,
                        name: `${area.area} (${area.areaNr})`
                    });
                });     
            }
        });
    }
    return areaList;
}

function getLocList(warehouses, warehouseId, areaId) {
    let locList = [];
    if (warehouses.hasOwnProperty('items') && !_.isUndefined(warehouses.items)) {
        warehouses.items.map(warehouse => {
            if(warehouse._id === warehouseId) {
                warehouse.areas.map(area => {
                    if (area._id === areaId) {
                        area.locations.map(location => {
                            locList.push({
                                _id: location._id,
                                name: `${area.areaNr}/${location.hall}${location.row}-${leadingChar(location.col, '0', 3)}${!!location.height ? '-' + location.height : ''}`
                            });
                        });
                    }
                });     
            }
        });
    }
    return locList;
}

function generateOptions(list) {
    if (list) {
        return list.map((element, index) => <option key={index} value={element._id}>{element.name}</option>);
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

class StockManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headersForShow: [],
            bodysForShow: [],
            headersPl: [],
            bodysPl: [],
            headersNfi: [],
            bodysNfi: [],
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
            screenId: '5ea8eefb7c213e2096462a2c', //Stock Management
            nfiScreenId: '5ea911747c213e2096462d79', //Goods Receipt with NFI
            plScreenId: '5ea919727c213e2096462e3f', //Goods Receipt with PL
            unlocked: false,
            screen: 'Stock Management',
            selectedIds: [],
            selectedIdsGoodsReceipt: [],
            selectedTemplate: '',
            docList: [],
            transQty: '',
            toWarehouse: '',
            toArea: '',
            toLocation: '',
            transDate: '',
            whList: [],
            areaList: [],
            locList: [],
            alert: {
                type:'',
                message:''
            },
            showGrNfi: false,
            showGrPl: false,
            showGrDuf: false,
            showEditValues: false,
            showSettings: false,
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGoodsReciptPl = this.handleGoodsReciptPl.bind(this);
        this.handleGoodsReciptNfi = this.handleGoodsReciptNfi.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);

        this.refreshStore = this.refreshStore.bind(this);
        this.refreshTransactions = this.refreshTransactions.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.updateSelectedIdsGoodsReceipt = this.updateSelectedIdsGoodsReceipt.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);

        //Toggle Modals
        this.toggleGrNfi = this.toggleGrNfi.bind(this);
        this.toggleGrPl = this.toggleGrPl.bind(this);
        this.toggleGrDuf = this.toggleGrDuf.bind(this);
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
            loadingTransactions,
            loadingWarehouses,
            location,
            //---------
            fieldnames,
            pos,
            docdefs,
            selection,
            settings,
            transactions,

        } = this.props;

        const { 
            screenId, 
            nfiScreenId, 
            plScreenId, 
            headersForShow, 
            headersNfi, 
            headersPl, 
            settingsDisplay 
        } = this.state;

        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;

        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
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
            if (!loadingTransactions) {
                dispatch(transactionActions.getAll(qs.id));
            }
            if (!loadingWarehouses) {
                dispatch(warehouseActions.getAll(qs.id));
            }
        }

        this.setState({
            headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
            headersNfi: getHeaders([], fieldnames, nfiScreenId, 'forShow'),
            headersPl: getHeaders([], fieldnames, plScreenId, 'forShow'),
            bodysForShow: getBodysForShow (selection, pos, transactions, headersForShow),
            bodysNfi: getNfiBodys(selection, pos, transactions, headersNfi),
            bodysPl: getPlBodys(selection, pos, transactions, headersPl),
            docList: arraySorted(docConf(docdefs.items), "name"),
            settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
            settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        
        const {
            fields,
            fieldnames,
            selection,
            transactions,
            settings,
            pos,
            docdefs,
            warehouses
        } = this.props;

        const {
            headersForShow,
            headersNfi,
            headersPl,
            screenId,
            nfiScreenId,
            plScreenId,
            selectedField,
            settingsDisplay,
            toWarehouse,
            toArea,
            whList,
            areaList,
            locList
        } = this.state;
        
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

        if (fieldnames != prevProps.fieldnames){
            this.setState({
                headersForShow: getHeaders(settingsDisplay, fieldnames, screenId, 'forShow'),
                headersNfi: getHeaders([], fieldnames, nfiScreenId, 'forShow'),
                headersPl: getHeaders([], fieldnames, plScreenId, 'forShow'),
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
            }); 
        }

        if (fieldnames != prevProps.fieldnames || selection != prevProps.selection || pos != prevProps.pos || transactions != prevProps.transactions || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodysForShow(selection, pos, transactions, headersForShow),
            });
        }

        if (fieldnames != prevProps.fieldnames || selection != prevProps.selection || pos != prevProps.pos || transactions != prevProps.transactions || headersNfi != prevState.headersNfi) {
            this.setState({
                bodysNfi: getNfiBodys(selection, pos, transactions, headersNfi),
            });
        }

        if (fieldnames != prevProps.fieldnames || selection != prevProps.selection || pos != prevProps.pos || transactions != prevProps.transactions || headersPl != prevState.headersPl) {
            this.setState({
                bodysPl: getPlBodys(selection, pos, transactions, headersPl),
            });
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

        if (warehouses != prevProps.warehouses) {
            this.setState({
                whList: getWhList(warehouses)
            });
        }

        if (warehouses != prevProps.warehouses || toWarehouse != prevState.toWarehouse) {
            this.setState({
                areaList: getAreaList(warehouses, toWarehouse)
            });
        }

        if (warehouses != prevProps.warehouses || toWarehouse != prevState.toWarehouse || toArea != prevState.toArea) {
            this.setState({
                locList: getLocList(warehouses, toWarehouse, toArea)
            });
        }

        if (whList != prevState.whList) {
            this.setState({
                toWarehouse: !_.isEmpty(whList) ? whList[0]._id : ''
            });
        }

        if (areaList != prevState.areaList) {
            this.setState({
                toArea: !_.isEmpty(areaList) ? areaList[0]._id : ''
            });
        }

        if (locList != prevState.locList) {
            this.setState({
                toLocation: !_.isEmpty(locList) ? locList[0]._id : ''
            });
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
                if (!responce.ok) {
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    this.setState({
                        settingSaving: false,
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshStore);
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
            dispatch(transactionActions.getAll(projectId));
            dispatch(settingActions.getAll(projectId, userId));
        }
    }

    refreshTransactions() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        dispatch(transactionActions.getAll(projectId));
    }

    toggleUnlock(event) {
        event.preventDefault()
        const { unlocked } = this.state;
        this.setState({
            unlocked: !unlocked
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
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }

    handleGoodsReciptPl(event) {
        event.preventDefault;
        const { selectedIdsGoodsReceipt, projectId } = this.state;
        if (_.isEmpty(selectedIdsGoodsReceipt)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select line(s) to be imported.'
                }
            });
        } else {
            this.setState({
                receiving: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedIdsGoodsReceipt: selectedIdsGoodsReceipt})
                };
                return fetch(`${config.apiUrl}/transaction/goodsReceiptPl?projectId=${projectId}`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    this.setState({
                        receiving: false,
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshTransactions);
                }));
            });
        }
    }

    handleGoodsReciptNfi(event) {
        event.preventDefault;
        const { selectedIdsGoodsReceipt, projectId } = this.state;
        if (_.isEmpty(selectedIdsGoodsReceipt)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select line(s) to be imported.'
                }
            });
        } else {
            this.setState({
                receiving: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedIdsGoodsReceipt: selectedIdsGoodsReceipt})
                };
                return fetch(`${config.apiUrl}/transaction/goodsReceiptNfi?projectId=${projectId}`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    this.setState({
                        receiving: false,
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshTransactions);
                }));
            });
        }
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
            return fetch(`${config.apiUrl}/template/generateStockHistory?id=${selectedTemplate}&locale=${locale}`, requestOptions)
                .then(res => res.blob()).then(blob => saveAs(blob, obj.field));
            }
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
            selectedIds: selectedIds
        });
    }

    updateSelectedIdsGoodsReceipt(selectedIds) {
        this.setState({
            selectedIdsGoodsReceipt: selectedIds
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
        } else if (confirm('For the Selected line(s) all stock movements shall be deleted. Are you sure you want to proceed?')){
            const requestOptions = {
                method: 'DELETE',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedIds: selectedIds })
            };
            return fetch(`${config.apiUrl}/transaction/delete`, requestOptions)
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

    toggleGrNfi(event) {
        event.preventDefault();
        const { showGrNfi, whList } = this.state;
        this.setState({
            showGrNfi: !showGrNfi,
            // isSameQty: true,
            transQty: '',
            toWarehouse: !_.isEmpty(whList) ? whList[0]._id : '',
            transDate: TypeToString(new Date(), 'Date', getDateFormat(myLocale))
        });
    }

    toggleGrPl(event) {
        event.preventDefault();
        const { showGrPl, whList } = this.state;
        this.setState({
            showGrPl: !showGrPl,
            // isSameQty: true,
            transQty: '',
            toWarehouse: !_.isEmpty(whList) ? whList[0]._id : '',
            transDate: TypeToString(new Date(), 'Date', getDateFormat(myLocale))
        });
    }

    toggleGrDuf(event) {
        event.preventDefault();
        const { showGrDuf, whList } = this.state;
        this.setState({
            showGrDuf: !showGrDuf,
            // isSameQty: true,
            transQty: '',
            toWarehouse: !_.isEmpty(whList) ? whList[0]._id : '',
            transDate: TypeToString(new Date(), 'Date', getDateFormat(myLocale))
        });
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

    generateActionRow() {
        const { selection } = this.props;
        let goodsRecipt = [];
        if (!!selection.project && !!selection.project.enableShipping) {
            goodsRecipt.push(
                <button key="0" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Goods Receipt with PL" onClick={this.toggleGrPl}>
                    <span><FontAwesomeIcon icon="cubes" className="fa-lg mr-2"/>Goods Receipt</span>
                </button>
            );
        } else if (!!selection.project && !!selection.project.enableInspection) {
            goodsRecipt.push(
                <button key="0" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Goods Receipt with NFI" onClick={this.toggleGrNfi}>
                    <span><FontAwesomeIcon icon="cubes" className="fa-lg mr-2"/>Goods Receipt</span>
                </button>
            );
        } else {
            goodsRecipt.push(
                <button key="0" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Goods Receipt with DUF" onClick={this.toggleGrDuf}>
                    <span><FontAwesomeIcon icon="cubes" className="fa-lg mr-2"/>Goods Receipt</span>
                </button>
            );
        }
        return (
            <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}>
                {goodsRecipt}
                <button key="1" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Stock Transfer">
                    <span><FontAwesomeIcon icon="exchange" className="fa-lg mr-2"/>Stock Transfer</span>
                </button>
                <button key="2"className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Stock Correction">
                    <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Stock Correction</span>
                </button>
                <button key="3" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Change/Add Heat Numbers">
                    <span><FontAwesomeIcon icon="file-certificate" className="fa-lg mr-2"/>Heat Numbers</span>
                </button>
                <button key="4" className="btn btn-success btn-lg mr-2" style={{height: '34px'}} title="Stock History">
                    <span><FontAwesomeIcon icon="file-excel" className="fa-lg mr-2"/>Stock History</span>
                </button>
            </div>
        );
    }

    render() {
        const { 
            projectId, 
            screen, 
            screenId,
            nfiScreenId,
            plScreenId,
            selectedIds,
            selectedIdsGoodsReceipt, 
            unlocked, 
            docList,
            //show modals
            showGrPl,
            showGrNfi,
            showGrDuf,
            showGenerate,
            showSettings,
            //--------
            headersForShow,
            bodysForShow,
            headersPl,
            bodysPl,
            headersNfi,
            bodysNfi,
            // splitHeadersForShow,
            // splitHeadersForSelect,
            //'-------------------'
            tabs,
            settingsFilter,
            settingsDisplay,
            //----------------
            transQty,
            toWarehouse,
            toArea,
            toLocation,
            transDate,
            whList,
            areaList,
            locList,
        } = this.state;

        const { accesses, fieldnames, fields, pos, selection, warehouses } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;
        
        return (
            <Layout alert={alert} accesses={accesses} selection={selection}>
                {alert.message && 
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
                        <li className="breadcrumb-item active" aria-current="page">Stock management:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-lg fa-fw" />}</span>
                    </ol>
                </nav>
                <hr />
                <div id="stockManagement" className="full-height">
                    {this.generateActionRow()}
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
                    show={showGrNfi}
                    hideModal={this.toggleGrNfi}
                    title="Goods Receipt with NFI"
                    size="modal-xl"
                >
                    <GoodsReceipt
                        alert={alert}
                        screenHeaders={headersNfi}
                        screenBodys={bodysNfi}
                        projectId={projectId}
                        screenId={nfiScreenId}
                        selectedIds={selectedIdsGoodsReceipt}
                        updateSelectedIds={this.updateSelectedIdsGoodsReceipt}
                        unlocked={false}
                        handleClearAlert={this.handleClearAlert}
                        refreshStore={this.refreshStore}
                        settingsFilter={[]}
                        handleGoodsRecipt={this.handleGoodsReciptNfi}
                        handleChange={this.handleChange}
                        transQty={transQty}
                        qtyPlaceHolder="Leave empty to receive balance Qty (released - already in stock)..."
                        toWarehouse={toWarehouse}
                        toArea={toArea}
                        toLocation={toLocation}
                        transDate={transDate}
                        whOptions={generateOptions(whList)}
                        areaOptions={generateOptions(areaList)}
                        locOptions={generateOptions(locList)}
                    />
                </Modal>
                <Modal
                    show={showGrPl}
                    hideModal={this.toggleGrPl}
                    title="Goods Receipt with PL"
                    size="modal-xl"
                >
                    <GoodsReceipt
                        alert={alert}
                        screenHeaders={headersPl}
                        screenBodys={bodysPl}
                        projectId={projectId}
                        screenId={plScreenId}
                        selectedIds={selectedIdsGoodsReceipt}
                        updateSelectedIds={this.updateSelectedIdsGoodsReceipt}
                        unlocked={false}
                        handleClearAlert={this.handleClearAlert}
                        refreshStore={this.refreshStore}
                        settingsFilter={[]}
                        handleGoodsRecipt={this.handleGoodsReciptPl}
                        handleChange={this.handleChange}
                        transQty={transQty}
                        qtyPlaceHolder="Leave empty to receive balance Qty (packed - already in stock)..."
                        toWarehouse={toWarehouse}
                        toArea={toArea}
                        toLocation={toLocation}
                        transDate={transDate}
                        whOptions={generateOptions(whList)}
                        areaOptions={generateOptions(areaList)}
                        locOptions={generateOptions(locList)}
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
    const { accesses, alert, docdefs, fieldnames, fields, pos, selection, settings, transactions, warehouses } = state;
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;
    const { loadingTransactions } = transactions;
    const { loadingWarehouses } = warehouses;

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
        loadingTransactions,
        loadingWarehouses,
        pos,
        selection,
        settings,
        transactions,
        warehouses
    };
}

const connectedStockManagement = connect(mapStateToProps)(StockManagement);
export { connectedStockManagement as StockManagement };