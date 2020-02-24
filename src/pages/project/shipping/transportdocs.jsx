import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
// import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../../_helpers';
import { 
    accessActions, 
    alertActions,
    fieldnameActions,
    fieldActions,
    poActions,
    projectActions 
} from '../../../_actions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import Modal from '../../../_components/modal';
import SplitLine from '../../../_components/split-line/split-packitem';

import moment from 'moment';
import _ from 'lodash';

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

function getObjectIds(collection, selectedIds) {
    if (!_.isEmpty(selectedIds)) {
        switch(collection) {
            case 'po': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.poId)) {
                    acc.push(curr.poId);
                }
                return acc;
            }, []);
            case 'sub': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.subId)) {
                    acc.push(curr.subId);
                }
                return acc;
            }, []);
            case 'certificate': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.certificateId)) {
                    acc.push(curr.certificateId);
                }
                return acc;
            }, []);
            case 'packitem': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.packItemId)) {
                    acc.push(curr.packItemId);
                }
                return acc;
            }, []);
            case 'collipack': return selectedIds.reduce(function(acc, curr) {
                if(!acc.includes(curr.colliPackId)) {
                    acc.push(curr.colliPackId);
                }
                return acc;
            }, []);
            default: return [];
        }
    } else {
        return [];
    }
}

// function arrayRemove(arr, value) {

//     return arr.filter(function(ele){
//         return ele != value;
//     });
 
//  }

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

// function generateScreenHeader(fieldnames, screenId) {
//     if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
//         return fieldnames.items.filter(function(element) {
//             return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
//         });
//     } else {
//         return [];
//     }
// }

function getHeaders(fieldnames, screenId, forWhat) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        let tempArray = fieldnames.items.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element[forWhat]); 
        });
        if (!tempArray) {
            return [];
        } else {
            return tempArray.sort(function(a,b) {
                return a[forWhat] - b[forWhat];
            });
        }
    } else {
        return [];
    }
}

function getBodys(fieldnames, pos, headersForShow){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let hasPackitems = getScreenTbls(fieldnames).includes('packitem');
    // let hasCertificates = getScreenTbls(fieldnames).includes('certificate');
    let screenHeaders = headersForShow;

    let i = 1;
    if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
        pos.items.map(po => {
            if (po.subs) {
                po.subs.map(sub => {
                    if (!_.isEmpty(sub.packitems) && hasPackitems) {
                        sub.packitems.map(packitem => {
                            arrayRow = [];
                            screenHeaders.map(screenHeader => {
                                switch(screenHeader.fields.fromTbl) {
                                    case 'po':
                                        arrayRow.push({
                                            collection: 'po',
                                            objectId: po._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: po[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
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
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: packitem[screenHeader.fields.name],
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
                                    packItemId: packitem._id,
                                    colliPackId: '' 
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
                                    arrayRow.push({
                                        collection: 'po',
                                        objectId: po._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: po[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
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
                                packItemId: '',
                                colliPackId: '' 
                            },
                            fields: arrayRow
                        };
                        arrayBody.push(objectRow);
                        i++;
                    }
                })
            }
        });
        return arrayBody;
    } else {
        return [];
    } 
}

// function generateScreenBody(screenId, fieldnames, pos){
//     let arrayBody = [];
//     let arrayRow = [];
//     let objectRow = {};
//     let hasPackitems = getScreenTbls(fieldnames).includes('packitem');
//     // let hasCertificates = getScreenTbls(fieldnames).includes('certificate');
//     let screenHeaders = arraySorted(generateScreenHeader(fieldnames, screenId), 'forShow');

//     let i = 1;
//     if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
//         pos.items.map(po => {
//             if (po.subs) {
//                 po.subs.map(sub => {
//                     if (!_.isEmpty(sub.packitems) && hasPackitems) {
//                         sub.packitems.map(packitem => {
//                             arrayRow = [];
//                             screenHeaders.map(screenHeader => {
//                                 switch(screenHeader.fields.fromTbl) {
//                                     case 'po':
//                                         arrayRow.push({
//                                             collection: 'po',
//                                             objectId: po._id,
//                                             fieldName: screenHeader.fields.name,
//                                             fieldValue: po[screenHeader.fields.name],
//                                             disabled: screenHeader.edit,
//                                             align: screenHeader.align,
//                                             fieldType: getInputType(screenHeader.fields.type),
//                                         });
//                                         break;
//                                     case 'sub':
//                                         arrayRow.push({
//                                             collection: 'sub',
//                                             objectId: sub._id,
//                                             fieldName: screenHeader.fields.name,
//                                             fieldValue: sub[screenHeader.fields.name],
//                                             disabled: screenHeader.edit,
//                                             align: screenHeader.align,
//                                             fieldType: getInputType(screenHeader.fields.type),
//                                         });
//                                         break;
//                                     case 'packitem':
//                                         arrayRow.push({
//                                             collection: 'packitem',
//                                             objectId: packitem._id,
//                                             fieldName: screenHeader.fields.name,
//                                             fieldValue: packitem[screenHeader.fields.name],
//                                             disabled: screenHeader.edit,
//                                             align: screenHeader.align,
//                                             fieldType: getInputType(screenHeader.fields.type),
//                                         });
//                                         break;
//                                     default: arrayRow.push({
//                                         collection: 'virtual',
//                                         objectId: '0',
//                                         fieldName: screenHeader.fields.name,
//                                         fieldValue: '',
//                                         disabled: screenHeader.edit,
//                                         align: screenHeader.align,
//                                         fieldType: getInputType(screenHeader.fields.type),
//                                     });
//                                 }
//                             });
                            
//                             objectRow  = {
//                                 _id: i, 
//                                 tablesId: { 
//                                     poId: po._id,
//                                     subId: sub._id,
//                                     certificateId: '',
//                                     packItemId: packitem._id,
//                                     colliPackId: '' 
//                                 },
//                                 fields: arrayRow
//                             };
//                             arrayBody.push(objectRow);
//                             i++;
//                         });
//                     } else {
//                         arrayRow = [];
//                         screenHeaders.map(screenHeader => {
//                             switch(screenHeader.fields.fromTbl) {
//                                 case 'po':
//                                     arrayRow.push({
//                                         collection: 'po',
//                                         objectId: po._id,
//                                         fieldName: screenHeader.fields.name,
//                                         fieldValue: po[screenHeader.fields.name],
//                                         disabled: screenHeader.edit,
//                                         align: screenHeader.align,
//                                         fieldType: getInputType(screenHeader.fields.type),
//                                     });
//                                     break;
//                                 case 'sub':
//                                     arrayRow.push({
//                                         collection: 'sub',
//                                         objectId: sub._id,
//                                         fieldName: screenHeader.fields.name,
//                                         fieldValue: sub[screenHeader.fields.name],
//                                         disabled: screenHeader.edit,
//                                         align: screenHeader.align,
//                                         fieldType: getInputType(screenHeader.fields.type),
//                                     });
//                                     break;
//                                 default: arrayRow.push({
//                                     collection: 'virtual',
//                                     objectId: '0',
//                                     fieldName: screenHeader.fields.name,
//                                     fieldValue: '',
//                                     disabled: screenHeader.edit,
//                                     align: screenHeader.align,
//                                     fieldType: getInputType(screenHeader.fields.type),
//                                 }); 
//                             }
//                         });
//                         objectRow  = {
//                             _id: i, 
//                             tablesId: { 
//                                 poId: po._id,
//                                 subId: sub._id,
//                                 certificateId: '',
//                                 packItemId: '',
//                                 colliPackId: '' 
//                             },
//                             fields: arrayRow
//                         };
//                         arrayBody.push(objectRow);
//                         i++;
//                     }
//                 })
//             }
//         });
//         return arrayBody;
//     } else {
//         return [];
//     } 
// }

class TransportDocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headersForShow: [],
            bodysForShow: [],
            splitHeadersForShow: [],
            splitHeadersForSelect:[],
            projectId:'',
            screenId: '5cd2b643fd333616dc360b66',
            splitScreenId: '5cd2b647fd333616dc360b72', //Assign Transport SplitWindow
            unlocked: false,
            screen: 'inspection',
            selectedIds: [],
            // selectedTemplate: '0',
            selectedField: '',
            selectedType: 'text',
            updateValue:'',
            alert: {
                type:'',
                message:''
            },
            //-----modals-----
            showEditValues: false,
            showSplitLine: false,
            // showGenerate: false,
            showDelete: false,          
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleSplitLine = this.handleSplitLine.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);

        this.refreshStore = this.refreshStore.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        //Toggle Modals
        this.toggleSplitLine = this.toggleSplitLine.bind(this);
        this.toggleEditValues = this.toggleEditValues.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection,
            location,
            //---------
            fieldnames,
            pos 
        } = this.props;

        const { screenId, splitScreenId, headersForShow, splitHeadersForSelect } = this.state;

        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
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
        }

        this.setState({
            headersForShow: getHeaders(fieldnames, screenId, 'forShow'),
            bodysForShow: getBodys(fieldnames, pos, headersForShow),
            splitHeadersForShow: getHeaders(fieldnames, splitScreenId, 'forShow'),
            splitHeadersForSelect: getHeaders(fieldnames, splitScreenId, 'forSelect'),
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForShow, splitHeadersForSelect, screenId, splitScreenId, selectedField } = this.state;
        const { fields, fieldnames, pos } = this.props;

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
                headersForShow: getHeaders(fieldnames, screenId, 'forShow'),
                splitHeadersForShow: getHeaders(fieldnames, splitScreenId, 'forShow'),
                splitHeadersForSelect: getHeaders(fieldnames, splitScreenId, 'forSelect'),
            }); 
        }

        if (fieldnames != prevProps.fieldnames || pos != prevProps.pos || headersForShow != prevState.headersForShow || splitHeadersForSelect != prevState.splitHeadersForSelect) {
            this.setState({
                bodysForShow: getBodys(fieldnames, pos, headersForShow),
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

    refreshStore() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(poActions.getAll(projectId));
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

    handleChange(event) {
        event.preventDefault();
        const name =  event.target.name;
        const value =  event.target.value;
        this.setState({
            [name]: value
        });
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

    

    // selectedFieldOptions(fieldnames, fields, screenId) {
    //     if (fieldnames.items && fields.items) {
    //         let screenHeaders = generateScreenHeader(fieldnames, screenId);
    //         let fieldIds = screenHeaders.reduce(function (accumulator, currentValue) {
    //             if (accumulator.indexOf(currentValue.fieldId) === -1 ) {
    //                 accumulator.push(currentValue.fieldId);
    //             }
    //             return accumulator;
    //         }, []);
    //         let fieldsFromHeader = fields.items.reduce(function (accumulator, currentValue) {
    //             if (fieldIds.indexOf(currentValue._id) !== -1) {
    //                 accumulator.push({ 
    //                     value: currentValue._id,
    //                     name: currentValue.custom
    //                 });
    //             }
    //             return accumulator;
    //         }, []);
    //         return arraySorted(fieldsFromHeader, 'name').map(field => {
    //             return (
    //                 <option 
    //                     key={field.value}
    //                     value={field.value}>{field.name}
    //                 </option>                
    //             );
    //         });
    //     }
    // }

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
                ...this.state,
                updateValue: '',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'You have not selected the field to be updated.'
                }
            });
        } else if (_.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                updateValue: '',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be updated.'
                }
            });
        } else if (_.isEmpty(fieldnames)){
            this.setState({
                ...this.state,
                updateValue: '',
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'An error occured.'
                }
            });
            if (projectId) {
                dispatch(fieldActions.getAll(projectId));
            }
        } else {
            let found = fieldnames.items.find( function (f) {
                return f.fields._id === selectedField;
            });
            if (!found.edit && !unlocked) {
                this.setState({
                    ...this.state,
                    updateValue: '',
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock table and try again.'
                    }
                });
            } else {
                let collection = found.fields.fromTbl;
                let objectIds = getObjectIds(collection, selectedIds);
                let fieldName = found.fields.name;
                let fieldValue = isErase ? '' : updateValue;
                let fieldType = selectedType;
                if (!isValidFormat(fieldValue, fieldType, getDateFormat(myLocale))) {
                    this.setState({
                        ...this.state,
                        updateValue: '',
                        showEditValues: false,
                        alert: {
                            type:'alert-danger',
                            message:'Wrong date format.'
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
                            objectIds: objectIds
                        })
                    };
                    return fetch(`${config.apiUrl}/extract/update`, requestOptions)
                    .then( () => {
                        this.refreshStore();
                        this.setState({
                            ...this.state,
                            updateValue: '',
                            showEditValues: false,
                            alert: {
                                type:'alert-success',
                                message:'Field sucessfully updated.'
                            }
                        });
                    })
                    .catch( () => {
                        this.setState({
                            ...this.state,
                            updateValue: '',
                            showEditValues: false,
                            alert: {
                                type:'alert-danger',
                                message:'Field cannot be updated.'
                            }
                        });
                    });
                }
            }  
        }
    }

    handleDeleteRows(event) {
        event.preventDefault;
        const { dispatch } = this.props;
        const { selectedIds, projectId, unlocked } = this.state;
        if (_.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                showDelete: false,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be deleted.'
                }
            });
        } else if (!unlocked) {
            this.setState({
                ...this.state,
                showDelete: false,
                alert: {
                    type:'alert-danger',
                    message:'Unlock table in order to delete line(s).'
                }
            });
        } else {
            console.log('toto');
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
                selectedTemplate: '0',
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                alert: {
                    type:'',
                    message:''
                },
                showSplitLine: !showSplitLine,
                showEditValues: false,
                showDelete: false
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
                selectedTemplate: '0',
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                alert: {
                    type:'',
                    message:''
                },
                showSplitLine: false,
                showEditValues: !showEditValues,
                showDelete: false
            });
        }
    }

    toggleDelete(event) {
        event.preventDefault();
        const { showDelete, unlocked, selectedIds } = this.state;
        if (!showDelete && _.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Select line(s) to be deleted.'
                }
            });
        } else if (!showDelete && !unlocked) {
            this.setState({
                ...this.state,
                alert: {
                    type:'alert-danger',
                    message:'Unlock table in order to delete line(s).'
                }
            });
        } else {
            this.setState({
                ...this.state,
                // selectedTemplate: '0',
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                alert: {
                    type:'',
                    message:''
                },
                showSplitLine: false,
                showEditValues: false,
                showDelete: !showDelete
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
            // selectedTemplate,
            selectedField,
            selectedType, 
            updateValue,
            //show modals
            showSplitLine,
            showEditValues,
            showDelete,
            //--------
            headersForShow,
            bodysForShow,
            splitHeadersForShow,
            splitHeadersForSelect,

        }= this.state;

        const { accesses, fieldnames, fields, pos, selection } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;
        
        return (
            <Layout alert={showSplitLine ? {type:'', message:''} : alert} accesses={accesses}>
                {alert.message && !showSplitLine &&
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Shipping | Prepare transport docs > {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="transportdocs" className="full-height">
                    <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}>
                        <button className="btn btn-warning btn-lg mr-2" style={{height: '34px'}} onClick={event => this.toggleSplitLine(event)}>
                            <span><FontAwesomeIcon icon="page-break" className="fa-lg mr-2"/>Split line</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} onClick={event => this.toggleEditValues(event)}>
                            <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Edit Values</span>
                        </button>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        {selection && selection.project && 
                            <ProjectTable
                                screenHeaders={headersForShow}
                                screenBodys={bodysForShow}
                                projectId={projectId}
                                screenId={screenId}
                                selectedIds={selectedIds}
                                updateSelectedIds = {this.updateSelectedIds}
                                toggleUnlock={this.toggleUnlock}
                                unlocked={unlocked}
                                screen={screen}
                                fieldnames={fieldnames}
                                fields={fields}
                                refreshStore={this.refreshStore}
                                toggleDelete = {this.toggleDelete}
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
                        
                        selectedIds = {passSelectedIds(selectedIds)}
                        selectedPo = {passSelectedPo(selectedIds, pos)}

                        alert = {alert}
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
                                <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Update</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleUpdateValue(event, true)}>
                                <span><FontAwesomeIcon icon="eraser" className="fa-lg mr-2"/>Erase</span>
                            </button>
                        </div>                   
                    </div>
                </Modal>

                <Modal
                    show={showDelete}
                    hideModal={this.toggleDelete}
                    title="Delete Value(s)"
                >
                    <div className="col-12">
                        <p className="font-weight-bold">Selected Lines will be permanently deleted!</p>
                        <div className="text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.toggleDelete(event)}>
                                <span><FontAwesomeIcon icon="times" className="fa-lg mr-2"/>Cancel</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleDeleteRows(event)}>
                                <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Proceed</span>
                            </button>
                        </div>                   
                    </div>
                </Modal>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, fieldnames, fields, pos, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    return {
        accesses,
        alert,
        fieldnames,
        fields,
        loadingAccesses,
        loadingFields,
        loadingPos,
        loadingSelection,
        pos,
        selection
    };
}

const connectedTransportDocuments = connect(mapStateToProps)(TransportDocuments);
export { connectedTransportDocuments as TransportDocuments };