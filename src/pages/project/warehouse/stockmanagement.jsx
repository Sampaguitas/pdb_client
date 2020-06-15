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
    certificateActions,
    docdefActions, 
    fieldnameActions,
    fieldActions,
    heatlocActions,
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
import HeatLocation from '../../../_components/split-line/heat-location';
import moment from 'moment';
import _ from 'lodash';
import { th } from 'date-fns/locale';


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
        // '5d1927141424114e3884ac83', //SI01 Shipping Invoice
        // '5d1927131424114e3884ac7f', //NFI1 Notification for Inspection
        '5eacef91e7179a42f172feea', //SH01 Stock History Report
        //'5edb2317e7179a6b6367d786' //PT01 Picking Ticket
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
                        return element._id === '0';
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
                        _id: '0',
                        stockQty: cur.transQty || 0,
                        locationId: '',
                    });
                }
            }
            return acc;
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

function getPoBodys (selection, pos, transactions, headersForShow) {
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
            virtuals(transactions, po._id, 'poId', hasLocation, hasArea, hasWarehouse).map(function(virtual){
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
            virtuals(transactions, po._id, 'poId', hasLocation, hasArea, hasWarehouse).map(function(virtual){
                if (!!virtual._id) { //&& !!virtual.stockQty
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
                }
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
            //headers
            headersForShow: [],
            headersPo: [],
            headersNfi: [],
            headersPl: [],
            //bodys
            bodysForShow: [],
            bodysPo: [],
            bodysNfi: [],
            bodysPl: [],
            //settings
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
            poScreenId: '5eb0f60ce7179a42f173de47', //Goods Receipt with PO
            nfiScreenId: '5ea911747c213e2096462d79', //Goods Receipt with NFI
            plScreenId: '5ea919727c213e2096462e3f', //Goods Receipt with PL
            unlocked: false,
            screen: 'Stock Management',
            selectedIds: [],
            selectedIdsGr: [],
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
            isDownloadingFile: false,
            alert: {
                type:'',
                message:''
            },
            showGoodsReceipt: false,
            showTransfer: false,
            showCorrection: false,
            showHeat: false,
            showGenerate: false,
            showSettings: false,
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGoodsReceipt = this.handleGoodsReceipt.bind(this);
        this.handleStockTransfer = this.handleStockTransfer.bind(this);
        this.handleCorrection = this.handleCorrection.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);

        this.refreshStore = this.refreshStore.bind(this);
        this.refreshCifs = this.refreshCifs.bind(this);
        this.refresHeatLocs = this.refresHeatLocs.bind(this);
        this.refreshTransactions = this.refreshTransactions.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.updateSelectedIdsGr = this.updateSelectedIdsGr.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);

        //Toggle Modals
        this.toggleGoodsReceipt = this.toggleGoodsReceipt.bind(this);
        this.toggleTransfer = this.toggleTransfer.bind(this);
        this.toggleCorrection = this.toggleCorrection.bind(this);
        this.toggleHeat = this.toggleHeat.bind(this);
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
            loadingCertificates,
            loadingDocdefs,
            loadingFields,
            loadingFieldnames,
            loadingHeatlocs,
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
            poScreenId,
            nfiScreenId, 
            plScreenId, 
            headersForShow,
            headersPo, 
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
            if (!loadingCertificates) {
                dispatch(certificateActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
            if (!loadingDocdefs) {
                dispatch(docdefActions.getAll(qs.id));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingHeatlocs) {
                dispatch(heatlocActions.getAll(qs.id));
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
            headersPo: getHeaders([], fieldnames, poScreenId, 'forShow'),
            headersNfi: getHeaders([], fieldnames, nfiScreenId, 'forShow'),
            headersPl: getHeaders([], fieldnames, plScreenId, 'forShow'),
            bodysForShow: getBodysForShow (selection, pos, transactions, headersForShow),
            bodysPo: getPoBodys(selection, pos, transactions, headersPo),
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
            headersPo,
            headersNfi,
            headersPl,
            screenId,
            poScreenId,
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
                headersPo: getHeaders([], fieldnames, poScreenId, 'forShow'),
                headersNfi: getHeaders([], fieldnames, nfiScreenId, 'forShow'),
                headersPl: getHeaders([], fieldnames, plScreenId, 'forShow'),
                settingsFilter: initSettingsFilter(fieldnames, settings, screenId),
                settingsDisplay: initSettingsDisplay(fieldnames, settings, screenId)
            }); 
        }

        if (selection != prevProps.selection || pos != prevProps.pos || transactions != prevProps.transactions || headersForShow != prevState.headersForShow) {
            this.setState({
                bodysForShow: getBodysForShow(selection, pos, transactions, headersForShow),
            });
        }

        if (selection != prevProps.selection || pos != prevProps.pos || transactions != prevProps.transactions || headersNfi != prevState.headersNfi) {
            this.setState({
                bodysNfi: getNfiBodys(selection, pos, transactions, headersNfi),
            });
        }

        if (selection != prevProps.selection || pos != prevProps.pos || transactions != prevProps.transactions || headersPl != prevState.headersPl) {
            this.setState({
                bodysPl: getPlBodys(selection, pos, transactions, headersPl),
            });
        }

        if (selection != prevProps.selection || pos != prevProps.pos || transactions != prevProps.transactions || headersPo != prevState.headersPo) {
            this.setState({
                bodysPo: getPoBodys(selection, pos, transactions, headersPo),
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
            dispatch(transactionActions.getAll(projectId));
            dispatch(settingActions.getAll(projectId, userId));
        }
    }

    refreshCifs() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(certificateActions.getAll(projectId));
        }
    }

    refresHeatLocs() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(heatlocActions.getAll(projectId));
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

    handleGoodsReceipt(event, route) {
        event.preventDefault();
        const { selectedIdsGr, projectId, toLocation, transQty,  transDate } = this.state;
        if (_.isEmpty(selectedIdsGr)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select line(s) to be received.'
                }
            });
        } else if (!isValidFormat(transDate, 'date', getDateFormat(myLocale))) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Please enter a valid date format.'
                }
            });
        } else {
            this.setState({ receiving: true});
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    selectedIdsGr: selectedIdsGr,
                    toLocation: toLocation,
                    transQty: transQty,
                    transDate: encodeURI(StringToDate (transDate, 'date', getDateFormat(myLocale))),
                })
            };
            return fetch(`${config.apiUrl}/transaction/${route}?projectId=${projectId}`, requestOptions)
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
        }
    }

    handleStockTransfer(event) {
        event.preventDefault();
        const { selectedIds, projectId, toLocation, transQty,  transDate } = this.state;
        if (selectedIds.length != 1) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Please select one line only.'
                }
            });
        } else if (!isValidFormat(transDate, 'date', getDateFormat(myLocale))) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Please enter a valid date format.'
                }
            });
        } else {
            this.setState({ transfering: true});
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    poId: selectedIds[0].poId,
                    fromLocation: selectedIds[0].locationId,
                    toLocation: toLocation,
                    transQty: transQty,
                    transDate: encodeURI(StringToDate (transDate, 'date', getDateFormat(myLocale))),
                })
            };
            return fetch(`${config.apiUrl}/transaction/transfer?projectId=${projectId}`, requestOptions)
            .then(responce => responce.text().then(text => {
                const data = text && JSON.parse(text);
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                this.setState({
                    transfering: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: data.message
                    }
                }, this.refreshTransactions);
            }));
        }
    }

    handleCorrection(event) {
        event.preventDefault();
        const { selectedIds, projectId, transQty,  transDate } = this.state;
        if (selectedIds.length != 1) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Please select one line only.'
                }
            });
        } else if (!isValidFormat(transDate, 'date', getDateFormat(myLocale))) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Please enter a valid date format.'
                }
            });
        } else {
            this.setState({ correcting: true});
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    poId: selectedIds[0].poId,
                    locationId: selectedIds[0].locationId,
                    transQty: transQty,
                    transDate: encodeURI(StringToDate (transDate, 'date', getDateFormat(myLocale))),
                })
            };
            return fetch(`${config.apiUrl}/transaction/correction?projectId=${projectId}`, requestOptions)
            .then(responce => responce.text().then(text => {
                const data = text && JSON.parse(text);
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                this.setState({
                    correcting: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: data.message
                    }
                }, this.refreshTransactions);
            }));
        }
    }

    handleGenerateFile(event) {
        event.preventDefault();
        const { docdefs } = this.props;
        const { selectedTemplate, selectedIds } = this.state;
        if (docdefs && selectedTemplate && selectedIds) {
            this.setState({
                isDownloadingFile: true
            }, () => {
                let obj = findObj(docdefs.items, selectedTemplate);
                if (obj) {
                    const requestOptions = {
                        method: 'POST',
                        headers: { ...authHeader(), 'Content-Type': 'application/json'},
                        body: JSON.stringify({selectedIds: selectedIds})
                    };
                    return fetch(`${config.apiUrl}/template/generateSh?id=${selectedTemplate}&locale=${locale}`, requestOptions)
                    .then(responce => {
                        this.setState({
                            showGenerate: false,
                            isDownloadingFile: false 
                        });
                        if (!responce.ok) {
                            if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
                            } else {
                                responce.text().then(text => {
                                const data = text && JSON.parse(text);
                                    this.setState({
                                        alert: {
                                            type: 'alert-danger',
                                            message: data.message
                                        }
                                    });
                                });
                            }
                        } else {
                            responce.blob().then(blob => saveAs(blob, obj.field));
                        }
                    });
                } else {
                    this.setState({ isDownloadingFile: false });
                }
            });
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

    updateSelectedIdsGr(selectedIds) {
        this.setState({
            selectedIdsGr: selectedIds
        });
    }

    handleDeleteRows(event) {
        event.preventDefault();
        const { transactions } = this.props;
        const { selectedIds } = this.state;
        if (_.isEmpty(selectedIds) || selectedIds.length != 1) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select one line to delete transactions.'
                }
            });
        } else if (!transactions.hasOwnProperty('items') || _.isEmpty(transactions.items)){
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Could not retrive transactions, please refresh the page and try again.'
                }
            });
        } else {
            let tranSelection = transactions.items.filter(element => {
                return _.isEqual(element.poId, selectedIds[0].poId) && _.isEqual(element.locationId, selectedIds[0].locationId)
            });
            if (_.isEmpty(tranSelection)) {
                this.setState({
                    alert: {
                        type:'alert-danger',
                        message: 'Could not retrive transactions, please refresh the page and try again.'
                    }
                });
            } else {
                let lastTransaction = tranSelection[tranSelection.length - 1];
                if (confirm(`You are about to undo the last transaction: "${lastTransaction.transComment}" dated ${DateToString(lastTransaction.transDate, 'date', getDateFormat(myLocale))}. Are you sure you would like to preceed?`)) {
                    const requestOptions = {
                        method: 'DELETE',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    };
                    return fetch(`${config.apiUrl}/transaction/delete?id=${lastTransaction._id}`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
                        } else {
                            this.setState({
                                alert: {
                                    type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                    message: data.message
                                }
                            }, this.refreshStore);
                        }
                    }));
                }
            }
        }
    }

    toggleGoodsReceipt(event) {
        event.preventDefault();
        const { showGoodsReceipt, whList } = this.state;
        this.setState({
            alert: {
                type:'',
                message:''
            },
            showGoodsReceipt: !showGoodsReceipt,
            transQty: '',
            toWarehouse: !_.isEmpty(whList) ? whList[0]._id : '',
            transDate: TypeToString(new Date(), 'Date', getDateFormat(myLocale))
        });
    }

    toggleTransfer(event) {
        event.preventDefault();
        const { showTransfer, selectedIds, whList } = this.state;
        if (!showTransfer && selectedIds.length != 1) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select one line to transfer units to another location.'
                }
            });
        } else {
            this.setState({
                alert: {
                    type:'',
                    message:''
                },
                showTransfer: !showTransfer,
                transQty: '',
                toWarehouse: !_.isEmpty(whList) ? whList[0]._id : '',
                transDate: TypeToString(new Date(), 'Date', getDateFormat(myLocale))
            });
        }
    }

    toggleCorrection(event) {
        event.preventDefault();
        const { showCorrection, selectedIds } = this.state;
        if (!showCorrection && selectedIds.length != 1) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select one line for stock correction.'
                }
            });
        } else {
            this.setState({
                alert: {
                    type:'',
                    message:''
                },
                showCorrection: !showCorrection,
                transQty: '',
                transDate: TypeToString(new Date(), 'Date', getDateFormat(myLocale))
            });
        }
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

    toggleGenerate(event) {
        event.preventDefault();
        const { showGenerate, docList, selectedIds } = this.state;
        if (!showGenerate && _.isEmpty(selectedIds)) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to generate the stock history.'
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
            alert: {
                type:'',
                message:''
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

    render() {
        const { 
            projectId, 
            screen, 
            screenId,
            poScreenId,
            nfiScreenId,
            plScreenId,
            selectedIds,
            selectedIdsGr, 
            unlocked,
            selectedTemplate,
            docList,
            //show modals
            showGoodsReceipt,
            showTransfer,
            showCorrection,
            showHeat,
            showGenerate,
            showSettings,
            //--------
            headersForShow,
            bodysForShow,
            headersPo,
            headersNfi,
            headersPl,
            bodysPo,
            bodysNfi,
            bodysPl,
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
            //--------------------
            isDownloadingFile
        } = this.state;

        const { accesses, certificates, fields, fieldnames, heatlocs, pos, selection, warehouses } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;

        class goodsReceiptObject {
            constructor() {
                if (!!selection.project && !!selection.project.enableShipping) {
                    this.title = "Goods Receipt with PL";
                    this.qtyPlaceHolder = "Leave empty to receive balance Qty (packed - already in stock)...";
                    this.screenHeaders = headersPl;
                    this.screenBodys = bodysPl;
                    this.screenId = plScreenId;
                    this.myRoute = "goodsReceiptPl";
                }
                else if (!!selection.project && !!selection.project.enableInspection) {
                    this.title = "Goods Receipt with NFI";
                    this.qtyPlaceHolder = "Leave empty to receive balance Qty (released - already in stock)...";
                    this.screenHeaders = headersNfi;
                    this.screenBodys = bodysNfi;
                    this.screenId = nfiScreenId;
                    this.myRoute = "goodsReceiptNfi";
                }
                else {
                    this.title = "Goods Receipt with PO";
                    this.qtyPlaceHolder = "Leave empty to receive balance Qty (purchased - already in stock)...";
                    this.screenHeaders =headersPo;
                    this.screenBodys = bodysPo;
                    this.screenId = poScreenId;
                    this.myRoute = "goodsReceiptPo";
                }
            }
        }
        
        var myGoodsReceipt = new goodsReceiptObject();
        
        return (
            <Layout alert={showGoodsReceipt || showTransfer  || showCorrection ? {type:'', message:''} : alert} accesses={accesses} selection={selection}>
                {alert.message && !showGoodsReceipt && !showTransfer && !showCorrection &&
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
                    <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}>
                        <button title={myGoodsReceipt.title} className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} onClick={this.toggleGoodsReceipt}>
                            <span><FontAwesomeIcon icon="cubes" className="fa-lg mr-2"/>Goods Receipt</span>
                        </button>
                        <button title="Stock Transfer" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} onClick={this.toggleTransfer}>
                            <span><FontAwesomeIcon icon="exchange" className="fa-lg mr-2"/>Stock Transfer</span>
                        </button>
                        <button title="Stock Correction" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} onClick={this.toggleCorrection}>
                            <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Stock Correction</span>
                        </button>
                        <button title="Change/Add Heat Numbers" className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} onClick={this.toggleHeat}>
                            <span><FontAwesomeIcon icon="file-certificate" className="fa-lg mr-2"/>Heat Numbers</span>
                        </button>
                        <button title="Stock History" className="btn btn-success btn-lg mr-2" style={{height: '34px'}} onClick={this.toggleGenerate}>
                            <span><FontAwesomeIcon icon="file-excel" className="fa-lg mr-2"/>Stock History</span>
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
                    show={showGoodsReceipt}
                    hideModal={this.toggleGoodsReceipt}
                    title={myGoodsReceipt.title}
                    size="modal-xl"
                >
                    <GoodsReceipt
                        alert={alert}
                        screenHeaders={myGoodsReceipt.screenHeaders}
                        screenBodys={myGoodsReceipt.screenBodys}
                        projectId={projectId}
                        screenId={myGoodsReceipt.poScreenId}
                        selectedIds={selectedIdsGr}
                        updateSelectedIds={this.updateSelectedIdsGr}
                        unlocked={false}
                        handleClearAlert={this.handleClearAlert}
                        refreshStore={this.refreshStore}
                        settingsFilter={[]}
                        handleGoodsReceipt={this.handleGoodsReceipt}
                        myRoute={myGoodsReceipt.myRoute}
                        handleChange={this.handleChange}
                        transQty={transQty}
                        qtyPlaceHolder={myGoodsReceipt.qtyPlaceHolder}
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
                    show={showTransfer}
                    hideModal={this.toggleTransfer}
                    title="Stock Transfer"
                    size="modal-lg"
                >
                    <div className="ml-2 mt-2 mr-2">
                        {alert.message &&
                            <div className={`alert ${alert.type} mb-3`}>{alert.message}
                                <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                    <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                                </button>
                            </div>
                        }
                        <div>
                            <form onSubmit={this.handleStockTransfer}>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" style={{width: '70px'}}>Quantity:</label>
                                        </div>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="transQty"
                                            value={transQty}
                                            onChange={this.handleChange}
                                            placeholder="Leave empty to transfer all the units from location..."
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" style={{width: '70px'}}>Warehouse:</label>
                                        </div>
                                        <select
                                            className="form-control"
                                            name="toWarehouse"
                                            value={toWarehouse}
                                            placeholder="Select Warehouse..."
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option key="0" value="">Select Warehouse...</option>
                                            {generateOptions(whList)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" style={{width: '70px'}}>Area:</label>
                                        </div>
                                        <select
                                            className="form-control"
                                            name="toArea"
                                            value={toArea}
                                            placeholder="Select Area..."
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option key="0" value="">Select Area...</option>
                                            {generateOptions(areaList)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" style={{width: '70px'}}>Location:</label>
                                        </div>
                                        <select
                                            className="form-control"
                                            name="toLocation"
                                            value={toLocation}
                                            placeholder="Select Warehouse..."
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option key="0" value="">Select Location...</option>
                                            {generateOptions(locList)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" style={{width: '70px'}}>Date:</label>
                                        </div>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="transDate"
                                            value={transDate}
                                            onChange={this.handleChange}
                                            placeholder={getDateFormat(myLocale)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="text-right mt-2">
                                    <button type="submit" className="btn btn-leeuwen-blue btn-lg">
                                        <span><FontAwesomeIcon icon="hand-point-right" className="fa-lg mr-2"/>Transfer</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
                <Modal
                    show={showCorrection}
                    hideModal={this.toggleCorrection}
                    title="Stock Correction"
                    size="modal-lg"
                >
                    <div className="ml-2 mt-2 mr-2">
                        {alert.message &&
                            <div className={`alert ${alert.type} mb-3`}>{alert.message}
                                <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                    <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                                </button>
                            </div>
                        }
                        <div>
                            <form onSubmit={this.handleCorrection}>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" style={{width: '70px'}}>Quantity:</label>
                                        </div>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="transQty"
                                            value={transQty}
                                            onChange={this.handleChange}
                                            placeholder="Number of units to be added / removed"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" style={{width: '70px'}}>Date:</label>
                                        </div>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="transDate"
                                            value={transDate}
                                            onChange={this.handleChange}
                                            placeholder={getDateFormat(myLocale)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="text-right mt-2">
                                    <button type="submit" className="btn btn-leeuwen-blue btn-lg">
                                        <span><FontAwesomeIcon icon="hand-point-right" className="fa-lg mr-2"/>Reevaluate</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
                <Modal
                    show={showHeat}
                    hideModal={this.toggleHeat}
                    title="Change/Add Heat numbers"
                    size="modal-xl"
                >
                    <HeatLocation
                        alert={alert}
                        handleClearAlert={this.handleClearAlert}
                        toggleHeat={this.toggleHeat}
                        poId={!_.isEmpty(selectedIds) ? selectedIds[0].poId : ''}
                        locationId={!_.isEmpty(selectedIds) ? selectedIds[0].locationId : ''}
                        projectId={projectId}
                        refreshCifs={this.refreshCifs}
                        refresHeatLocs={this.refresHeatLocs}
                        certificates={certificates}
                        heatlocs={heatlocs}
                    />
                </Modal>
                <Modal
                    show={showGenerate}
                    hideModal={this.toggleGenerate}
                    title="Generate Stock History"
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
                                    <span><FontAwesomeIcon icon={isDownloadingFile ? "spinner" : "file-excel"} className={isDownloadingFile ? "fa-pulse fa-fw fa-lg mr-2"  : "fa-lg mr-2"}/>Generate</span>
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
    const { accesses, alert, certificates, docdefs, fields, fieldnames, heatlocs, pos, selection, settings, transactions, warehouses } = state;
    const { loadingAccesses } = accesses;
    const { loadingCertificates } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingFields } = fields;
    const { loadingFieldnames } = fieldnames;
    const { loadingHeatlocs } = heatlocs;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    const { loadingSettings } = settings;
    const { loadingTransactions } = transactions;
    const { loadingWarehouses } = warehouses;

    return {
        accesses,
        certificates,
        alert,
        docdefs,
        fields,
        fieldnames,
        heatlocs,
        loadingAccesses,
        loadingCertificates,
        loadingDocdefs,
        loadingFieldnames,
        loadingFields,
        loadingHeatlocs,
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