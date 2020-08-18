import React from 'react';
import moment from 'moment';
import _ from 'lodash';

export const locale = Intl.DateTimeFormat().resolvedOptions().locale;
// export const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
export const options = {'year': 'numeric', 'month': '2-digit', day: '2-digit', timeZone: 'GMT'};
// export const myLocale = Intl.DateTimeFormat(locale, options);

export function getDateFormat() {
    let tempDateFormat = ''
    Intl.DateTimeFormat(locale, options).formatToParts().map(function (element) {
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

export function getLiteral() {
    let firstLiteral = Intl.DateTimeFormat(locale, options).formatToParts().find(function (element) {
      return element.type === 'literal';
    });
    if (firstLiteral) {
      return firstLiteral.value;
    } else {
      return '/';
    }
};

export function StirngToCache(fieldValue, myDateFormat) {
    if (!!fieldValue) {
        let separator = getLiteral();
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

export function StringToType (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'Date':
            case 'date': return moment.utc(StirngToCache(fieldValue, myDateFormat), myDateFormat).toDate();
            // case 'Number':
            // case 'number': return Number(fieldValue);
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

export function StringToDate (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'Date':
            case 'date': return moment.utc(StirngToCache(fieldValue, myDateFormat), myDateFormat).toDate();
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

export function isValidFormat (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'Date':
            case 'date': return moment.utc(StirngToCache(fieldValue, myDateFormat), myDateFormat, true).isValid();
            default: return true;
        }
    } else {
        return true;
    }
    
}

export function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'Date':
            case 'date': return String(moment.utc(fieldValue).format(myDateFormat));
            case 'Number':
            case 'number': return String(new Intl.NumberFormat().format(fieldValue));
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

export function DateToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'Date':
            case 'date': return String(moment.utc(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

export function doesMatch(search, value, type, isEqual) {
    
    if (!search) {
        return true;
    } else if (!value && search != 'any' && search != 'false' && search != '-1' && String(search).toUpperCase() != '=BLANK') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, value);
            case 'String':
                if (String(search).toUpperCase() === '=BLANK') {
                    return !value;
                } else if (String(search).toUpperCase() === '=NOTBLANK') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual(String(value).toUpperCase(), String(search).toUpperCase());
                } else {
                    return String(value).toUpperCase().includes(String(search).toUpperCase());
                }
            case 'Date':
                if (String(search).toUpperCase() === '=BLANK') {
                    return !value;
                } else if (String(search).toUpperCase() === '=NOTBLANK') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual(DateToString(value, 'date', getDateFormat()), search);
                } else {
                    return DateToString(value, 'date', getDateFormat()).includes(search);
                }
            case 'Number':
                if (search === '-1') {
                    return !value;
                } else if (search === '-2') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual( Intl.NumberFormat().format(value).toString(), Intl.NumberFormat().format(search).toString());
                } else {
                    return Intl.NumberFormat().format(value).toString().includes(Intl.NumberFormat().format(search).toString());
                }
            case 'Boolean':
                if(search == 'any') {
                    return true; //any or equal
                } else if (search == 'true' && !!value) {
                    return true; //true
                } else if (search == 'false' && !value) {
                    return true; //true
                }else {
                    return false;
                }
            case 'Select':
                if(search == 'any' || _.isEqual(search, value)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

export function resolve(path, obj) {
    return path.split('.').reduce(function(prev, cur) {
        return prev ? prev[cur] : null
    }, obj || self)
}

export function arraySorted(array, fieldOne, fieldTwo, fieldThree, fieldFour) {
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
            } else if (fieldFour && resolve(fieldFour, a) < resolve(fieldFour, b)) {
                return -1;
            } else if (fieldFour && resolve(fieldFour, a) > resolve(fieldFour, b)) {
                return 1;
            } else {
                return 0;
            }
        });
        return newArray;             
    }
}

export function arrayRemove(arr, value) {
    return arr.filter(function(ele){
        return ele != value;
    });
}

export function docConf(array, typeOf) {
    if (array) {
        return array.filter(function (element) {
            return typeOf.includes(element.doctypeId);
        });
    }
}

export function baseTen(number) {
    return number.toString().length > 2 ? number : '0' + number;
}

export function leadingChar(string, char, length) {
    return string.toString().length > length ? string : char.repeat(length - string.toString().length) + string;
}

export function findObj(array, search) {
    if (!_.isEmpty(array) && search) {
        return array.find((function(element) {
            return _.isEqual(element._id, search);
        }));
    } else {
        return {};
    }
}

export function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
    }
}

export function generateOptions(list) {
    if (list) {
        return list.map((element, index) => <option key={index} value={element._id}>{element.name}</option>);
    }
}

export function getHeaders(settingsDisplay, fieldnames, screenId, forWhat) {
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
        '5f02b878e7179a221ee2c718', //Goods Receipt with RET
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


export function initSettingsFilter(fieldnames, settings, screenId) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items) && !_.isUndefined(settings) && settings.hasOwnProperty('items') && !_.isEmpty(settings.items)) {
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

export function initSettingsDisplay(fieldnames, settings, screenId) {
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

export function initSettingsColWidth(settings, screenId) {
    if (!_.isUndefined(settings) && settings.hasOwnProperty('items') && !_.isEmpty(settings.items)) {
        let screenSettings = settings.items.find(element => _.isEqual(element.screenId, screenId));
        if (!_.isUndefined(screenSettings) && screenSettings.params.hasOwnProperty('colWidth')) {
            return screenSettings.params.colWidth || {};
        } else {
            return {};
        }
    } else {
        return {};
    }
}

export function passSelectedIds(selectedIds) {
    if (_.isEmpty(selectedIds) || selectedIds.length > 1) {
        return {};
    } else {
        return selectedIds[0];
    }
}

export function passSelectedPo(selectedIds, pos) {
    if (_.isEmpty(selectedIds) || selectedIds.length > 1 || _.isEmpty(pos.items)){
        return {};
    } else {
        return pos.items.find(po => po._id === selectedIds[0].poId);
    }
}

export function getScreenTbls (fieldnames, screenId) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        return fieldnames.items.reduce(function (acc, cur) {
            if(!acc.includes(cur.fields.fromTbl) && cur.screenId === screenId) {
                acc.push(cur.fields.fromTbl)
            }
            return acc;
        },[]);
    } else {
        return [];
    }
}

export function getTblFields (screenHeaders, fromTbl) {
    if (screenHeaders) {
        let tempArray = [];
        screenHeaders.reduce(function (acc, cur) {
            if (cur.fields.fromTbl === fromTbl && !acc.includes(cur.fields._id)) {
                tempArray.push(cur.fields);
                acc.push(cur.fields._id);
            }
            return acc;
        },[]);
        return tempArray;
    } else {
        return [];
    }
}

export function hasPackingList(packItemFields) {
    let tempResult = false;
    if (packItemFields) {
        packItemFields.map(function (packItemField) {
            if (packItemField.name === 'plNr') {
                tempResult = true;
            }
        });
    }
    return tempResult;
}

export function getObjectIds(collection, selectedIds) {
    if (!_.isEmpty(selectedIds)) {
        switch(collection) {
            case 'area': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.areaId)) {
                    acc.push(cur.areaId);
                }
                return acc;
            }, []);
            case 'certificate': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.certificateId)) {
                    acc.push(cur.certificateId);
                }
                return acc;
            }, []);
            case 'collipack': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.collipackId)) {
                    acc.push(cur.collipackId);
                }
                return acc;
            }, []);
            case 'location': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.locationId)) {
                    acc.push(cur.locationId);
                }
                return acc;
            }, []);
            case 'miritem' : return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.miritemId)) {
                    acc.push(cur.miritemId);
                }
                return acc;
            }, []);
            case 'packitem': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.packitemId)) {
                    acc.push(cur.packitemId);
                }
                return acc;
            }, []);
            case 'pickitem' : return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.pickitemId)) {
                    acc.push(cur.pickitemId);
                }
                return acc;
            }, []);
            case 'pickticket' : return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.pickticketId)) {
                    acc.push(cur.pickticketId);
                }
                return acc;
            }, []);
            case 'po': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.poId)) {
                    acc.push(cur.poId);
                }
                return acc;
            }, []);
            case 'project' : return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.projectId)) {
                    acc.push(cur.projectId);
                }
                return acc;
            }, []);
            case 'sub': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.subId)) {
                    acc.push(cur.subId);
                }
                return acc;
            }, []);
            case 'warehouse': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.warehouseId)) {
                    acc.push(cur.warehouseId);
                }
                return acc;
            }, []);
            case 'whpackitem': return selectedIds.reduce(function(acc, cur) {
                if(!acc.includes(cur.whpackitemId)) {
                    acc.push(cur.whpackitemId);
                }
                return acc;
            }, []);
            default: return [];
        }
    } else {
        return [];
    }
}

export function generateFromTbls(ArrType, doctypeId) {
    const found = ArrType.find(element => element._id === doctypeId);
    return !_.isUndefined(found) ? found.fromTbls : [];
}

export function screenSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'custom':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.fields.custom) && !_.isNull(a.fields.custom) ? String(a.fields.custom).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.fields.custom) && !_.isNull(b.fields.custom) ? String(b.fields.custom).toUpperCase() : '';
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.fields.custom) && !_.isNull(a.fields.custom) ? String(a.fields.custom).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.fields.custom) && !_.isNull(b.fields.custom) ? String(b.fields.custom).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'forShow':
        case 'forSelect':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let valueA = a[sort.name] || 0;
                    let valueB = b[sort.name] || 0;
                    return valueA - valueB;
                });
            } else {
                return tempArray.sort(function (a, b){
                    let valueA = a[sort.name] || 0;
                    let valueB = b[sort.name] || 0;
                    return valueB - valueA
                });
            }
        case 'align':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.align) && !_.isNull(a.align) ? String(a.align).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.align) && !_.isNull(b.align) ? String(b.align).toUpperCase() : '';
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.align) && !_.isNull(a.align) ? String(a.align).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.align) && !_.isNull(b.align) ? String(b.align).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'edit':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = a.edit;
                    let nameB = b.edit;
                    if (nameA === nameB) {
                        return 0;
                    } else if (!!nameA) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
            } else {
                return tempArray.sort(function (a, b) {
                    let nameA = a.edit;
                    let nameB = b.edit;
                    if (nameA === nameB) {
                        return 0;
                    } else if (!!nameA) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }
        default: return array;
    }
}

export function sortCustom(array, headersForShow, sort) {
    let found = headersForShow.find(element => element._id === sort.name);
    if (!found) {
        return array;
    } else {
        let tempArray = array.slice(0);
        let fieldName = found.fields.name
        switch(found.fields.type) {
            case 'String':
                if (sort.isAscending) {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = !_.isUndefined(fieldA.fieldValue) && !_.isNull(fieldA.fieldValue) ? String(fieldA.fieldValue).toUpperCase() : '';
                            let valueB = !_.isUndefined(fieldB.fieldValue) && !_.isNull(fieldB.fieldValue) ?  String(fieldB.fieldValue).toUpperCase() : '';
                            if (valueA < valueB) {
                                return -1;
                            } else if (valueA > valueB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                } else {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = !_.isUndefined(fieldA.fieldValue) && !_.isNull(fieldA.fieldValue) ? String(fieldA.fieldValue).toUpperCase() : '';
                            let valueB = !_.isUndefined(fieldB.fieldValue) && !_.isNull(fieldB.fieldValue) ?  String(fieldB.fieldValue).toUpperCase() : '';
                            if (valueA > valueB) {
                                return -1;
                            } else if (valueA < valueB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                }
            case 'Number':
                if (sort.isAscending) {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = fieldA.fieldValue || 0;
                            let valueB = fieldB.fieldValue || 0;
                            return valueA - valueB;
                        }
                    });
                } else {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = fieldA.fieldValue || 0;
                            let valueB = fieldB.fieldValue || 0;
                            return valueB - valueA;
                        }
                    });
                }
            case 'Date':
                if (sort.isAscending) {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let dateA = new Date(fieldA.fieldValue || 0);
                            let dateB = new Date(fieldB.fieldValue || 0);
                            return dateA - dateB;
                        }
                    });
                } else {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let dateA = new Date(fieldA.fieldValue || 0);
                            let dateB = new Date(fieldB.fieldValue || 0);
                            return dateB - dateA;
                        }
                    });
                }
            default: return array;
        }
    }   
}

export function getPlList(collipacks) {
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

export function getLocName(location, area) {
    return `${area.areaNr}/${location.hall}${location.row}-${leadingChar(location.col, '0', 3)}${!!location.height ? '-' + location.height : ''}`;
}

export function getTableIds(selectedRows, screenBodys) {
    if (screenBodys) {
        
        let filtered = screenBodys.filter(function (s) {
            return selectedRows.includes(s._id);
        });
        
        return filtered.reduce(function (acc, cur) {
            if(!acc.tableIds.includes(cur.tablesId)) {
                acc.tableIds.push(cur.tablesId);
            }
            if (acc.isRemaining && !cur.isRemaining) {
                acc.isRemaining = false;
            }
            return acc;
        }, {
           tableIds: [],
           isRemaining: true
        });
    } else {
        return {
            tableIds: [],
            isRemaining: true
         };
    }
}

export function copyObject(mainObj) {
    if (!!mainObj && !_.isEmpty(mainObj)) {
        let objCopy = {};
        let key;
    
        for (key in mainObj) {
            objCopy[key] = mainObj[key];
        }
        return objCopy;
    } else {
        return {};
    }
}