import React, { Component } from 'react';
import TableSelectionRow from '../project-table/table-selection-row';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SplitInput from './split-input';
import moment from 'moment';
import _ from 'lodash';

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
    }
}

function getLiteral(myLocale) {
    let firstLiteral = myLocale.formatToParts().find(function (element) {
      return element.type === 'literal';
    });
    if (firstLiteral) {
      return firstLiteral.value;
    } else {
      return '/';
    }
};

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
            case 'date': return String(moment(fieldValue).format(myDateFormat));
            case 'number': return String(new Intl.NumberFormat().format(fieldValue));
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function StirngToCache(fieldValue, myDateFormat) {
    if (!!fieldValue) {
        let separator = getLiteral(myLocale);
        let cache = myDateFormat.replace('DD','00').replace('MM', '00').replace('YYYY', (new Date()).getFullYear()).split(separator);
        let valueArray = fieldValue.split(separator);
        return cache.reduce(function(acc, cur, idx) {
            if (valueArray.length > idx) {
              let curChars = cur.split("");
                let valueChars = valueArray[idx].split("");
              let tempArray = curChars.reduce(function(accChar, curChar, idxChar) {
                  if (valueChars.length >= (curChars.length - idxChar)) {
                    accChar += valueChars[valueChars.length - curChars.length + idxChar];
                  } else {
                    accChar += curChar;
                  }
                return accChar;
              }, '')
              acc.push(tempArray);
            } else {
              acc.push(cur);
            }
            return acc;
          }, []).join(separator);
    } else {
        return fieldValue;
    } 
}

function isValidFormat (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(StirngToCache(fieldValue, myDateFormat), myDateFormat, true).isValid();
            default: return true;
        }
    } else {
        return true;
    }
    
}

function StringToType (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(StirngToCache(fieldValue, myDateFormat), myDateFormat).toDate();
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
            case 'date': return moment(StirngToCache(fieldValue, myDateFormat), myDateFormat).toDate();
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function getScreenTbls (headersForSelect) {
    if (!_.isUndefined(headersForSelect) && !_.isEmpty(headersForSelect)) {
        return headersForSelect.reduce(function (acc, cur) {
            if(!acc.includes(cur.fields.fromTbl)) {
                acc.push(cur.fields.fromTbl)
            }
            return acc;
        },[]);
    } else {
        return [];
    }
}

function virtuals(whpackitems, uom) {
    let tempVirtuals = [];
    let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(uom.toUpperCase()) ? 'mtrs' : 'pcs';
    whpackitems.map(function (whpackitem){
        let tempObject = whpackitem;
        if (whpackitem[tempUom]) {
            tempObject['pickQty'] = whpackitem[tempUom];
        } else {
            tempObject['pickQty'] = '';
        }
        tempVirtuals.push(tempObject);
    });
    return tempVirtuals;
}

function getLocName(location, area) {
    return `${area.areaNr}/${location.hall}${location.row}-${leadingChar(location.col, '0', 3)}${!!location.height ? '-' + location.height : ''}`;
}

function leadingChar(string, char, length) {
    return string.toString().length > length ? string : char.repeat(length - string.toString().length) + string;
}

function getBodys(selectedPickticket, selection, headersForSelect, selectedIds){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    // let hasPackitems = getScreenTbls(headersForSelect).includes('packitem');
    let screenHeaders = headersForSelect;
    let pickitemId = selectedIds.pickitemId;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let i = 1;

    if (!_.isEmpty(selectedPickticket) && selectedPickticket.pickitems) {
        selectedPickticket.pickitems.map(pickitem => {
            if(pickitem._id === pickitemId) {
                if (!_.isEmpty(pickitem.whpackitems)) {
                    virtuals(pickitem.whpackitems, pickitem.miritem.po.uom).map(whpackitem => {
                        arrayRow = [];
                        screenHeaders.map(screenHeader => {
                            switch(screenHeader.fields.fromTbl) {
                                case 'pickticket':
                                    arrayRow.push({
                                        collection: 'pickticket',
                                        objectId: selectedPickticket._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: selectedPickticket[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                    break;
                                case 'pickitem':
                                    arrayRow.push({
                                        collection: 'pickitem',
                                        objectId: pickitem._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickitem[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                    break;
                                case 'miritem':
                                    arrayRow.push({
                                        collection: 'miritem',
                                        objectId: pickitem.miritem._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickitem.miritem[screenHeader.fields.name],
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
                                            objectId: pickitem.miritem.po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: pickitem.miritem.po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
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
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    } else if (screenHeader.fields.name === 'warehouse') {
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: selectedPickticket.warehouse._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: selectedPickticket.warehouse.warehouse,
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    } else if (screenHeader.fields.name === 'location') {
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: pickitem.location._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: getLocName(pickitem.location, pickitem.location.area),
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
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
                                        }); 
                                    }
                                    break;
                                case 'packitem':
                                    arrayRow.push({
                                        collection: 'whpackitem',
                                        objectId: whpackitem._id,
                                        parentId: pickitem._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: whpackitem[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                    break;
                                case 'mir':
                                    if (!['itemCount', 'mirWeight'].includes(screenHeader.fields.name)) {
                                        arrayRow.push({
                                            collection: 'mir',
                                            objectId: selectedPickticket.mir._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: selectedPickticket.mir[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
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
                                pickticketId: selectedPickticket._id,
                                pickitemId: pickitem._id,
                                miritemId: pickitem.miritem._id,
                                projectId: project._id,
                                poId: pickitem.miritem.po._id,
                                areaId: pickitem.location.area._id,
                                warehouseId: selectedPickticket.warehouse._id,
                                locationId: pickitem.location._id,
                                whpackitemId: whpackitem._id
                            },
                            isPacked: true,
                            fields: arrayRow
                        };
                        arrayBody.push(objectRow);
                        i++;
                    });
                } else {
                    arrayRow = [];
                    screenHeaders.map(screenHeader => {
                        switch(screenHeader.fields.fromTbl) {
                            case 'pickticket':
                                arrayRow.push({
                                    collection: 'pickticket',
                                    objectId: selectedPickticket._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: selectedPickticket[screenHeader.fields.name],
                                    disabled: screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                                });
                                break;
                            case 'pickitem':
                                arrayRow.push({
                                    collection: 'pickitem',
                                    objectId: pickitem._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: pickitem[screenHeader.fields.name],
                                    disabled: screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                                });
                                break;
                            case 'miritem':
                                arrayRow.push({
                                    collection: 'miritem',
                                    objectId: pickitem.miritem._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: pickitem.miritem[screenHeader.fields.name],
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
                                        objectId: pickitem.miritem.po._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: pickitem.miritem.po[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
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
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                } else if (screenHeader.fields.name === 'warehouse') {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: selectedPickticket.warehouse._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: selectedPickticket.warehouse.warehouse,
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                } else if (screenHeader.fields.name === 'location') {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: pickitem.location._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: getLocName(pickitem.location, pickitem.location.area),
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
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
                                    }); 
                                }
                                break;
                            case 'mir':
                                if (!['itemCount', 'mirWeight'].includes(screenHeader.fields.name)) {
                                    arrayRow.push({
                                        collection: 'mir',
                                        objectId: selectedPickticket.mir._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: selectedPickticket.mir[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
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
                            pickticketId: selectedPickticket._id,
                            pickitemId: pickitem._id,
                            miritemId: pickitem.miritem._id,
                            projectId: project._id,
                            poId: pickitem.miritem.po._id,
                            areaId: pickitem.location.area._id,
                            warehouseId: selectedPickticket.warehouse._id,
                            locationId: pickitem.location._id,
                            whpackitemId: ''
                        },
                        isPacked: _.isEmpty(pickitem.whpackitems) ? false : true,
                        fields: arrayRow
                    };
                    arrayBody.push(objectRow);
                    i++;
                }
            }
        });
        return arrayBody;
    } else {
        return [];
    }
}

function getFirstVirtual(selectedPickticket, screenBody, headersForShow) {
    if (!_.isEmpty(selectedPickticket) && !_.isEmpty(screenBody) && !_.isEmpty(headersForShow)){
        let selectedPickitem = selectedPickticket.pickitems.find(pickitem => pickitem._id === screenBody.tablesId.pickitemId);
        let selectedWhpackitem = selectedPickitem.whpackitems.find(whpackitem => whpackitem._id === screenBody.tablesId.whpackitemId);
        let project = selectedPickticket.project || { _id: '0', name: '', number: '' };
        
        return headersForShow.reduce(function (acc, cur){
            if (cur.fields.fromTbl === 'pickticket') {
                acc[cur.fields.name] = DateToString(selectedPickticket[cur.fields.name], getInputType(cur.fields.type), getDateFormat(myLocale));
            } else if (cur.fields.fromTbl === 'pickitem'){
                acc[cur.fields.name] = DateToString(selectedPickitem[cur.fields.name], getInputType(cur.fields.type), getDateFormat(myLocale));
            } else if (cur.fields.fromTbl === 'miritem'){
                acc[cur.fields.name] = DateToString(selectedPickitem.miritem[cur.fields.name], getInputType(cur.fields.type), getDateFormat(myLocale));
            } else if (cur.fields.fromTbl === 'location'){
                if (cur.fields.name === 'area') {
                    acc[cur.fields.name] = DateToString(selectedPickitem.location.area.area, getInputType(cur.fields.type), getDateFormat(myLocale));
                } else if (cur.fields.name === 'warehouse') {
                    acc[cur.fields.name] = DateToString(selectedPickticket.warehouse.name, getInputType(cur.fields.type), getDateFormat(myLocale));
                } else if (cur.fields.name === 'location') {
                    acc[cur.fields.name] = DateToString(getLocName(selectedPickitem.location, selectedPickitem.location.area), getInputType(cur.fields.type), getDateFormat(myLocale));
                } else {
                    acc[cur.fields.name] = '';
                }
                acc[cur.fields.name] = DateToString(selectedPickitem.miritem[cur.fields.name], getInputType(cur.fields.type), getDateFormat(myLocale));
            } else if (cur.fields.fromTbl === 'po'){
                if (['project', 'projectNr'].includes(cur.fields.name)) {
                    acc[cur.fields.name] = DateToString(cur.fields.name === 'project' ? project.name : project.number, getInputType(cur.fields.type), getDateFormat(myLocale));
                } else {
                    acc[cur.fields.name] = DateToString(selectedPickitem.miritem.po[cur.fields.name], getInputType(cur.fields.type), getDateFormat(myLocale));
                }
            } else if (cur.fields.fromTbl === 'packitem' && !_.isUndefined(selectedWhpackitem)){
                acc[cur.fields.name] = DateToString(selectedWhpackitem[cur.fields.name], getInputType(cur.fields.type), getDateFormat(myLocale));
            } else if (cur.fields.fromTbl === 'mir'){
                if (!['itemCount', 'mirWeight'].includes(cur.fields.name)) {
                    acc[cur.fields.name] = DateToString(selectedPickticket.mir[cur.fields.name], getInputType(cur.fields.type), getDateFormat(myLocale));
                } else {
                    acc[cur.fields.name] = '';
                }
            } else {
                acc[cur.fields.name] = '';
            }
            return acc;
        },{});
    } else {
        return {};
    }
}


function generateHeaderForSelect(screenHeaders) {
    let tempArray = [];
    if (!_.isEmpty(screenHeaders)) { 
        screenHeaders.map(function (screenHeader, index) {
            tempArray.push(<th key={index}>{screenHeader.fields.custom}</th>);
        });
        if (!_.isEmpty(tempArray)) {
            return (
                <tr>
                    {tempArray}
                </tr>
            );
        }
    }
}

function generateBodyForSelect(screenBodys, selectedLine, selectedIds, handleClickLine) {
    let tempRows = [];
    if (!_.isEmpty(screenBodys)) {
        screenBodys.map(function (screenBody) {
            let tempCol = [];
            screenBody.fields.map(function (field, index) {
                if (field.objectId) {
                    tempCol.push(
                        <td key={index}>
                            {TypeToString(field.fieldValue, field.fieldType, getDateFormat(myLocale))}
                        </td>
                    );
                } else {
                    tempCol.push(<td key={index}></td>);
                }
            });
            
            tempRows.push(
                <tr
                    key={screenBody._id}
                    style={selectedLine === screenBody._id ? {backgroundColor: '#A7A9AC', color: 'white', cursor: 'pointer'} : screenBody.tablesId.whpackitemId === selectedIds.whpackitemId ? {backgroundColor: '#C9DDE1', cursor: 'pointer'} : {cursor: 'pointer'}} 
                    onClick={event => handleClickLine(event, screenBody)}>
                    {tempCol}
                </tr>
            );
        
        });
        return tempRows;
    }
}

function generateHeaderForShow(screenHeaders, selectAllRows, toggleAllRow) {
    let tempArray = [];
    if (!_.isEmpty(screenHeaders)) { 
        screenHeaders.map(function (screenHeader, index) {
            tempArray.push(
                <th
                    key={index}
                >
                    {screenHeader.fields.custom}
                </th>
            );
        });
        if (!_.isEmpty(tempArray)) {
            return (
                <tr>
                    < TableSelectionAllRow
                        checked={selectAllRows}
                        onChange={toggleAllRow}
                    />
                    {tempArray}
                </tr>
            );
        }
    }
}

function generateBodyForShow(virtuals, headersForShow, selectedRows, selectAllRows, toggleRow, handleChangeVirtuals) {
    let tempRows = [];
    if (!_.isEmpty(virtuals)) {
        virtuals.map(function (screenBody, indexBody) {
            let tempCol = [];
            headersForShow.map(function (headerForShow, indexHeader) {
                tempCol.push(
                    <SplitInput
                        key={indexHeader} 
                        indexBody={indexBody}
                        fieldName={headerForShow.fields.name}
                        fieldValue={virtuals[indexBody][headerForShow.fields.name]}
                        fieldType={getInputType(headerForShow.fields.type)}
                        callback={handleChangeVirtuals}
                    />
                );
            });
            tempRows.push(
                <tr key={indexBody}>
                    < TableSelectionRow
                        id={indexBody}
                        selectAllRows={selectAllRows}
                        selectedRows={selectedRows}
                        callback={toggleRow}
                    />
                    {tempCol}
                </tr>
            );
        
        });
        return tempRows;
    }
}

function getSelectedPackItemIndex(selectedIds, bodysForSelect) {
    if (!_.isEmpty(selectedIds) && !_.isEmpty(bodysForSelect)){
        let found = bodysForSelect.find(function (b) {
            return b.tablesId.whpackitemId === selectedIds.whpackitemId;
        });
        if (!_.isUndefined(found)) {
            return found._id
        } else {
            return '';
        }
    } else {
        return '';
    }
}

function getSelecetionIds(bodysForSelect, selectedLine) {
    let found = bodysForSelect.find(function (b) {
        return b._id === selectedLine;
    });
    if (!_.isUndefined(found)) {
        return found.tablesId;
    } else {
        return {
            pickticketId: '',
            pickitemId: '',
            miritemId: '',
            projectId: '',
            poId: '',
            areaId: '',
            warehouseId: '',
            locationId: '',
            whpackitemId: ''
        };
    }
}

function getPickQty(selectedPickticket, selectedIds) {
    if (selectedPickticket.hasOwnProperty('pickitems') && !_.isEmpty(selectedPickticket.pickitems)) {
        let selectedPickitem = selectedPickticket.pickitems.find(pickitem => pickitem._id === selectedIds.pickitemId);
        if (!_.isUndefined(selectedPickitem)) {
            return Number(selectedPickitem.qtyPicked) || 0;
        }
    }
    return 0;
}

function getWhpackitemsQty(selectedPickticket, selectedIds, tempUom) {
    if (selectedPickticket.hasOwnProperty('pickitems') && !_.isEmpty(selectedPickticket.pickitems)) {
        let selectedPickitem = selectedPickticket.pickitems.find(pickitem => pickitem._id === selectedIds.pickitemId);
        if (!_.isUndefined(selectedPickitem) && selectedPickitem.hasOwnProperty('whpackitems')) {
            return selectedPickitem.whpackitems.reduce(function (acc, cur) {
                return acc += cur[tempUom] || 0;
            }, 0);
        }
    }
    return 0;
}

function getSelectionQty(selectedPickticket, selectionIds, tempUom) {
    
    if (selectedPickticket.hasOwnProperty('pickitems') && !_.isEmpty(selectedPickticket.pickitems)) {
        let selectedPickitem = selectedPickticket.pickitems.find(pickitem => pickitem._id === selectionIds.pickitemId);
        if (!_.isUndefined(selectedPickitem)) { //&& selectedPickitem.hasOwnProperty('packitems') && !_.isEmpty(selectedPickitem)
            let selectedWhpackitem = selectedPickitem.whpackitems.find(whpackitem => whpackitem._id === selectionIds.whpackitemId);
            if (!_.isUndefined(selectedWhpackitem)) {
                return Number(selectedWhpackitem[tempUom]) || 0;
            } else {
                return Number(selectedPickitem.pickQty) || 0;
            }
        }
    }

    return 0;
}

function getVirturalsQty(virtuals, tempUom) {
    return virtuals.reduce(function(acc, cur) {
        return acc += Number(cur[tempUom]) || 0;
    }, 0);
}

function getRemainingQty(selectedPickticket, selectedIds, bodysForSelect, selectedLine, virtuals) {
    // let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(selectedPo.uom.toUpperCase()) ? 'mtrs' : 'pcs';
    let selectedPickitem = selectedPickticket.pickitems.find(pickitem => pickitem._id === selectedIds.pickitemId);
    let uom = _.isUndefined(selectedPickitem) ? 'pcs' : selectedPickitem.miritem.po.uom;
    let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(uom.toUpperCase()) ? 'mtrs' : 'pcs';
    let selectionIds = getSelecetionIds(bodysForSelect, selectedLine);
    let pickQty = getPickQty(selectedPickticket, selectedIds);
    let whpackitemsQty = getWhpackitemsQty(selectedPickticket, selectedIds, tempUom);
    let selectionQty = getSelectionQty(selectedPickticket, selectionIds, tempUom);
    let virturalsQty = getVirturalsQty(virtuals, tempUom);
    if (!whpackitemsQty) {
        return pickQty - virturalsQty;
    } else {
        return pickQty - (whpackitemsQty - selectionQty + virturalsQty);
    }
}

function isValidArray(virtuals, headersForShow) {
    return virtuals.reduce(function (acc, cur) {
        if (acc) {
            return headersForShow.every(h => {
                return isValidFormat(cur[h.fields.name], getInputType(h.fields.type), getDateFormat(myLocale))
            });
        } else {
            return acc;
        }
    }, true);
}

function formatArray(virtuals, headersForShow) {
    return virtuals.reduce(function (acc, cur) {
        
        let tempObject = {};
        
        headersForShow.map(function (h) {
            if (h.fields.fromTbl === 'packitem'){
                tempObject[h.fields.name] = StringToDate (cur[h.fields.name], getInputType(h.fields.type), getDateFormat(myLocale));
            }
        });

        if (!_.isEmpty(tempObject)) {
            acc.push(tempObject);
        }
        
        return acc;

    },[]);
}

function selectedScreenBody(bodysForSelect, selectedLine) {
    return bodysForSelect.find(function (s) {
        return s._id === selectedLine;
    });
}

class SplitLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bodysForSelect: [],
            selectedLine: '',
            virtuals: [],
            forShowSelectedRows:[],
            forShowIsAll: false,
            alert: {
                type: '',
                message: ''
            }
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleClickLine = this.handleClickLine.bind(this);


        this.handleChangeVirtuals = this.handleChangeVirtuals.bind(this);
        this.keyHandlerForShow = this.keyHandlerForShow.bind(this);
        this.toggleForShowAllRows = this.toggleForShowAllRows.bind(this);
        this.toggleForShowRow = this.toggleForShowRow.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleNewSubLine = this.handleNewSubLine.bind(this);
        this.handleNextLine = this.handleNextLine.bind(this);
    }

    componentDidMount() {
        const { headersForSelect, selectedIds, selectedPickticket, selection } = this.props;
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const tableForShow = document.getElementById('forShow');
        tableForShow.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandlerForShow(e);
            }
        });
        

        this.setState({
            bodysForSelect: getBodys(selectedPickticket, selection, headersForSelect, selectedIds),
            selectedLine: '',
            virtuals: [],
            forShowSelectedRows:[],
            forShowIsAll: false,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForSelect, headersForShow, selectedIds, selectedPickticket, selection } = this.props;
        const { selectedLine, bodysForSelect } = this.state;
        if (prevProps.selectedPickticket != selectedPickticket || prevProps.selection != selection || prevProps.headersForSelect != headersForSelect) {
            this.setState({
                bodysForSelect: getBodys(selectedPickticket, selection, headersForSelect, selectedIds),
                selectedLine: '',
                virtuals: [],
                forShowSelectedRows:[],
                forShowIsAll: false,
                alert: {
                    type: '',
                    message: ''
                }
            });
        }

        if (_.isEmpty(prevState.bodysForSelect) && prevState.bodysForSelect != bodysForSelect) {
            this.setState({
                selectedLine: getSelectedPackItemIndex(selectedIds, bodysForSelect),
            });
        }

        if (prevState.selectedLine != selectedLine) {
            if (selectedLine === '') {
                this.setState({
                    virtuals: [],
                    forShowSelectedRows:[],
                    forShowIsAll: false,
                    alert: {
                        type: '',
                        message: ''
                    }
                });
            } else {
                let screenBody = selectedScreenBody(bodysForSelect, selectedLine);
                
                if (!_.isUndefined(screenBody)) {
                    let tempObject = getFirstVirtual(selectedPickticket, screenBody, headersForShow);
                    this.setState({
                        virtuals: _.isEmpty(tempObject) ? [] : [tempObject],
                        forShowSelectedRows:[],
                        forShowIsAll: false,
                        alert: {
                            type: '',
                            message: ''
                        }
                    });
                } else {
                    this.setState({
                        virtuals: [],
                        forShowSelectedRows:[],
                        forShowIsAll: false,
                        alert: {
                            type: '',
                            message: ''
                        }
                    }); 
                }
            }
        }
    }

    keyHandlerForShow(e) {

        let target = e.target;
        let colIndex = target.parentElement.cellIndex;               
        let rowIndex = target.parentElement.parentElement.rowIndex;
        var nRows = target.parentElement.parentElement.parentElement.childNodes.length;
        
        switch(e.keyCode) {
            case 9:// tab
                if(rowIndex === nRows) {
                    this.handleNextLine(target);
                }
                if(target.parentElement.nextSibling) {
                    target.parentElement.nextSibling.click(); 
                }
                break;
            case 13: //enter
                if(rowIndex === nRows) {
                    this.handleNextLine(target);
                }
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                }
                break;
            case 37: //left
                if (rowIndex === nRows && !target.parentElement.classList.contains('isEditing')) {
                    this.handleNextLine(target);
                }
                if(colIndex > 1 && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.previousSibling.click();
                } 
                break;
            case 38: //up
                if(rowIndex === nRows) {
                    this.handleNextLine(target);
                }
                if(rowIndex > 1) {
                    target.parentElement.parentElement.previousSibling.childNodes[colIndex].click();    
                }
                break;
            case 39: //right
                if (rowIndex === nRows && !target.parentElement.classList.contains('isEditing')) {
                    this.handleNextLine(target);
                }
                if(target.parentElement.nextSibling && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.nextSibling.click();
                }
                break;
            case 40: //down
                if(rowIndex === nRows) {
                    this.handleNextLine(target);
                }
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                }
                break;
        }
    }

    handleClearAlert(event){
        const { handleClearAlert } = this.props;
        event.preventDefault;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            }
        }, handleClearAlert(event));
    }

    handleClickLine(event, screenBody) {
        
        event.preventDefault();
        const { selectedLine } = this.state;
        const { headersForSelect } = this.props;
        if (selectedLine === screenBody._id) {
            this.setState({
                selectedLine: '',
            });
        } else {
            this.setState({
                selectedLine: screenBody._id,
            });
        }
    }

    handleChangeVirtuals(event, index) {
        event.preventDefault();
        const { name, value }  = event.target;
        const { virtuals } = this.state;
        let tempArray = virtuals;
        tempArray[index][name] = value;
        this.setState({
            virtuals: tempArray,
            alert: {
                type: '',
                message: ''
            }
        });
    }

    toggleForShowAllRows(){
        const { forShowIsAll } = this.state;
        const { virtuals } = this.state;
        if (!_.isEmpty(virtuals)) {
            if (forShowIsAll) {
                this.setState({
                    ...this.state,
                    forShowSelectedRows: [],
                    forShowIsAll: false,
                    alert: {
                        type: '',
                        message: ''
                    }
                });
            } else {
                this.setState({
                    ...this.state,
                    forShowSelectedRows: virtuals.map( (s, index) => index),
                    forShowIsAll: true,
                    alert: {
                        type: '',
                        message: ''
                    }
                });
            }         
        }
    }

    toggleForShowRow(id) {
        const { forShowSelectedRows } = this.state;
        if (forShowSelectedRows.includes(id)) {
            this.setState({
                ...this.state,
                forShowSelectedRows: forShowSelectedRows.filter( ele => ele != id),
                alert: {
                    type: '',
                    message: ''
                }
            });
        } else {
            this.setState({
                ...this.state,
                forShowSelectedRows: [...forShowSelectedRows, id],
                alert: {
                    type: '',
                    message: ''
                }
            });
        }
    }

    handleSave(event) {
        const { selectedPickticket, selectedIds, headersForShow, handleSplitLine } = this.props;
        const { selectedLine, bodysForSelect, virtuals } = this.state;
        let remainingQty = getRemainingQty(selectedPickticket, selectedIds, bodysForSelect, selectedLine, virtuals);
        let selectedPickitem = selectedPickticket.pickitems.find(pickitem => pickitem._id === selectedIds.pickitemId);
        let uom = _.isUndefined(selectedPickitem) ? 'pcs' : selectedPickitem.miritem.po.uom;
        let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(uom.toUpperCase()) ? 'mtrs' : 'pcs';

        let screenBody = selectedScreenBody(bodysForSelect, selectedLine);
        

        if (_.isEmpty(virtuals)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'No lines to be saved.'
                }
            });
        } else if (!virtuals.every(cur => Number(cur[tempUom]) > 0)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Split Quantities should be greater than 0.'
                }
            });
        } else if (!isValidArray(virtuals, headersForShow)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Some dates are not properly formated.'
                }
            });
        } else if (remainingQty != 0) {
            if (confirm(`${remainingQty} ${uom} remaining, would you like to proceed?`)){
                handleSplitLine(event, getSelecetionIds(bodysForSelect, selectedLine), formatArray(virtuals, headersForShow));
            }   
        } else {
            handleSplitLine(event, getSelecetionIds(bodysForSelect, selectedLine), formatArray(virtuals, headersForShow));
        }
    }

    handleNewSubLine(event) {
        event.preventDefault();
        const { virtuals, selectedLine } = this.state;
        const { headersForShow } = this.props;
        if (selectedLine === '') {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select a line to split.'
                }
            });
        } else if (headersForShow) {
            let tempArray = headersForShow.reduce(function (acc, cur){
                acc[cur.fields.name] = '';
                return acc;
            }, {});
            this.setState({
                virtuals: [...virtuals, tempArray],
                alert: {
                    type: '',
                    message: ''
                }
            });
        }
    }

    handleNextLine(target) {

        const { selectedPickticket, selectedIds, headersForShow } = this.props;
        const { selectedLine, bodysForSelect, virtuals } = this.state;
        // let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(selectedPo.uom.toUpperCase()) ? 'mtrs' : 'pcs';
        let selectedPickitem = selectedPickticket.pickitems.find(pickitem => pickitem._id === selectedIds.pickitemId);
        let uom = _.isUndefined(selectedPickitem) ? 'pcs' : selectedPickitem.miritem.po.uom;
        let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(uom.toUpperCase()) ? 'mtrs' : 'pcs';
        
        let remainingQty = getRemainingQty(selectedPickticket, selectedIds, bodysForSelect, selectedLine, virtuals);
        
        if (target.name === tempUom && target.value != '' && remainingQty > 0 && !_.isEmpty(headersForShow)) {
            let tempObject = headersForShow.reduce(function (acc, cur){
                if (cur.fields.name === tempUom) {
                    acc[tempUom] = remainingQty;
                } else {
                    acc[cur.fields.name] = '';
                }
                return acc;
            }, {});
            this.setState({
                virtuals: [...virtuals, tempObject],
                alert: {
                    type: '',
                    message: ''
                }
            });
        }
    }

    handleDeleteSubLine(event) {
        event.preventDefault();
        const { virtuals, forShowSelectedRows  } = this.state;
        if (_.isEmpty(forShowSelectedRows)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select sub line(s) to be deleted.'
                }
            });
        } else {
            let tempArray = virtuals;
            for (var i = forShowSelectedRows.length -1; i >= 0; i--) {
                tempArray.splice(forShowSelectedRows[i], 1);
            }

            this.setState({
                ...this.state,
                virtuals: tempArray,
                forShowSelectedRows: [],
                forShowIsAll: false,
                alert: {
                    type: '',
                    message: ''
                }
            });
        }
    }

    render() {

        const { headersForShow, headersForSelect, selectedIds, selectedPickticket } = this.props;
        const { bodysForSelect, virtuals, forShowSelectedRows, forShowIsAll, selectedLine } =this.state;

        let remainingQty = getRemainingQty(selectedPickticket, selectedIds, bodysForSelect, selectedLine, virtuals);
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;

        return (
            <div id='splitLine'>
                <div className="ml-2 mr-2">
                    <div className="row">
                        <div className="col">
                            <h3>Select a line to split:</h3>
                        </div>
                        <div className="col text-right mr-1">
                            <strong>
                                Remaining Qty:
                                <span
                                    style={remainingQty == 0 ? {color: 'green'} : {color: '#A8052C'}}
                                    className="ml-1"
                                >
                                    {remainingQty}
                                </span>
                            </strong>
                        </div>
                    </div> 
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '200px'}}>
                        <div className="table-responsive custom-table-container">
                            <table className="table table-bordered table-sm table-hover text-nowrap" id="forSelect">
                                <thead>
                                    {generateHeaderForSelect(headersForSelect)}
                                </thead>
                                <tbody>
                                    {generateBodyForSelect(bodysForSelect, selectedLine, selectedIds, this.handleClickLine)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {alert.message && 
                        <div className={`alert ${alert.type} mt-3`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className={`row ${alert.message ? "mt-1" : "mt-5"} mb-2`}>
                        <div className="col"> 
                            <h3>Sub line(s) information:</h3>
                        </div>
                        <div className="col text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.handleNewSubLine(event)}>
                                <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Add Sub Line</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleDeleteSubLine(event)}>
                                <span><FontAwesomeIcon icon="trash-alt" className="fa mr-2"/>Delete Sub Line(s)</span>
                            </button>
                        </div>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '200px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="forShow">
                                <thead>
                                    {generateHeaderForShow(headersForShow, forShowIsAll, this.toggleForShowAllRows)}
                                </thead>
                                <tbody>
                                    {generateBodyForShow(virtuals, headersForShow, forShowSelectedRows, forShowIsAll, this.toggleForShowRow, this.handleChangeVirtuals)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => this.handleSave(event)}>
                            <span><FontAwesomeIcon icon="save" className="fa mr-2"/>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default SplitLine;