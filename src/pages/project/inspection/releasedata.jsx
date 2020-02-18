import React from 'react';
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
    projectActions 
} from '../../../_actions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import Modal from '../../../_components/modal';
import SplitLine from '../../../_components/split-line/split-line';

import moment from 'moment';
import _ from 'lodash';
import { accessConstants } from '../../../_constants';

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

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
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
        '5d1927131424114e3884ac7f' //NFI1 Notification for Inspection
    ];
    return array.filter(function (element) {
        return tpeOf.includes(element.doctypeId);
    });
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

function getCertificateFields (screenHeaders) {
    if (screenHeaders) {
        let tempArray = [];
        screenHeaders.reduce(function (accumulator, currentValue) {
            if (currentValue.fields.fromTbl === 'certificate' && !accumulator.includes(currentValue.fields._id)) {
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

function virtuals(certificates, certificateFields) {
    let tempVirtuals = [];
    let tempObject = {_id: '0'}
    certificates.map(function (certificate){
        certificateFields.map(function (certificateField) {
            if (!tempObject.hasOwnProperty(certificateField.name)) {
                tempObject[certificateField.name] = [TypeToString(certificate[certificateField.name], certificateField.type, getDateFormat(myLocale))]
            } else if(!tempObject[certificateField.name].includes(TypeToString(certificate[certificateField.name], certificateField.type, getDateFormat(myLocale)))) {
                tempObject[certificateField.name].push(TypeToString(certificate[certificateField.name], certificateField.type, getDateFormat(myLocale)));
            }
        });
    });
    tempVirtuals.push(tempObject);
    return tempVirtuals;
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
    // let hasPackitems = getScreenTbls(fieldnames).includes('packitem');
    let hasCertificates = getScreenTbls(fieldnames).includes('certificate');
    let screenHeaders = headersForShow;
    
    let i = 1;
    if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
        pos.items.map(po => {
            if (po.subs) {
                po.subs.map(sub => {
                    if (!_.isEmpty(sub.certificates) && hasCertificates){
                        virtuals(sub.certificates, getCertificateFields(screenHeaders)).map(virtual => {
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
                                    case 'certificate':
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: virtual._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: virtual[screenHeader.fields.name].join(' | '),
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
//     let hasCertificates = getScreenTbls(fieldnames).includes('certificate');
//     let screenHeaders = arraySorted(generateScreenHeader(fieldnames, screenId), 'forShow');
//     let i = 1;
//     if (!_.isUndefined(pos) && pos.hasOwnProperty('items') && !_.isEmpty(pos.items)) {
//         pos.items.map(po => {
//             if (po.subs) {
//                 po.subs.map(sub => {
//                     if (!_.isEmpty(sub.certificates) && hasCertificates){
//                         virtuals(sub.certificates, getCertificateFields(screenHeaders)).map(virtual => {
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
//                                     case 'certificate':
//                                         arrayRow.push({
//                                             collection: 'virtual',
//                                             objectId: virtual._id,
//                                             fieldName: screenHeader.fields.name,
//                                             fieldValue: virtual[screenHeader.fields.name].join(' | '),
//                                             disabled: screenHeader.edit,
//                                             align: screenHeader.align,
//                                             fieldType: getInputType(screenHeader.fields.type),
//                                         });
//                                         break;
//                                     default: arrayRow.push({
//                                             collection: 'virtual',
//                                             objectId: '0',
//                                             fieldName: screenHeader.fields.name,
//                                             fieldValue: '',
//                                             disabled: screenHeader.edit,
//                                             align: screenHeader.align,
//                                             fieldType: getInputType(screenHeader.fields.type),
//                                     });
//                                 }
//                             });
//                             objectRow  = {
//                                 _id: i, 
//                                 tablesId: { 
//                                     poId: po._id,
//                                     subId: sub._id,
//                                     certificateId: '',
//                                     packItemId: '',
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


function selectedIdsArry (selectedIds, whichId) {
    return selectedIds.reduce(function(acc, curr){
        if(curr[whichId] != '' && !acc.includes(curr[whichId])){
            acc.push(curr[whichId]);
        }
        return acc;
    }, []);
}

function selectionHasNfi (selectedIds, pos) {
    let selectedSubIds = selectedIdsArry(selectedIds, 'subId');
    if (!_.isEmpty(selectedSubIds) && pos.hasOwnProperty('items')) {
        return pos.items.reduce(function (accPo, currPo) {
            let currPoHasNFI = currPo.subs.reduce(function (accSub, currSub){
                if(selectedSubIds.includes(currSub._id) && currSub.hasOwnProperty('nfi') && !_.isNull(currSub.nfi)) {
                    accSub = true;
                }
                return accSub;
            }, false);
    
            if (currPoHasNFI === true) {
                accPo = true;
            }
            return accPo;
        }, false);

    } else {
        return false;
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
            projectId:'',
            screenId: '5cd2b642fd333616dc360b64', //Inspection
            splitScreenId: '5cd2b647fd333616dc360b71', //Inspection Splitwindow
            unlocked: false,
            screen: 'inspection',
            selectedIds: [],
            selectedTemplate: '0',
            selectedField: '',
            selectedType: 'text',
            updateValue:'',
            inputNfi: '',
            alert: {
                type:'',
                message:''
            },
            //-----modals-----
            showSplitLine: false,
            showEditValues: false,
            showAssignNfi: false,
            showGenerate: false,
            showDelete: false,                      
        };

        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleSplitLine = this.handleSplitLine.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        this.getNfi = this.getNfi.bind(this);
        this.handleUpdateNFI = this.handleUpdateNFI.bind(this);
        this.updateRequest = this.updateRequest.bind(this);
        
        this.refreshStore = this.refreshStore.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        //Toggle Modals
        this.toggleSplitLine = this.toggleSplitLine.bind(this);
        this.toggleEditValues = this.toggleEditValues.bind(this);
        this.toggleAssignNfi = this.toggleAssignNfi.bind(this);
        this.toggleGenerate = this.toggleGenerate.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
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
            location,
            //---------
            fieldnames,
            pos 
        } = this.props;

        const { screenId, splitScreenId, headersForShow, splitHeadersForSelect } = this.state;
        
        var qs = queryString.parse(location.search);
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

    handleSelectionReload(event){
        const { 
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection, 
            location 
        } = this.props;

        var qs = queryString.parse(location.search);
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
        }
   
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

    handleGenerateFile(event) {
        event.preventDefault();
        const { docdefs } = this.props;
        const { selectedTemplate } = this.state;
        if (selectedTemplate != "0") {
            let obj = findObj(docdefs.items, selectedTemplate);
             if (obj) {
                const requestOptions = {
                    method: 'GET',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                };
                return fetch(`${config.apiUrl}/template/generate?docDef=${selectedTemplate}`, requestOptions)
                    .then(res => res.blob()).then(blob => saveAs(blob, obj.field));
             }
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
        const { projectId, selectedIds, inputNfi, unlocked, bodysForShow } = this.state;
        console.log('selectionHasNfi:', selectionHasNfi (selectedIds, pos));
        if (_.isEmpty(selectedIds)) {
            this.setState({
                ...this.state,
                inputNfi: '',
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

            if (!found.edit && !unlocked){
                this.setState({
                    ...this.state,
                    inputNfi: '',
                    showAssignNfi: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock the table and try again.'
                    }
                });
            } else if (!selectionHasNfi (selectedIds, pos) || confirm('Already existing NFI numbers found. Do you want to proceed?')) {
                this.updateRequest('sub', 'nfi', inputNfi, 'text', getObjectIds('sub', selectedIds));
            } else {
                this.setState({
                    ...this.state,
                    inputNfi: '',
                    showAssignNfi: false,
                    alert: {
                        type:'',
                        message:''
                    }
                });
            }
        }
    }

    updateRequest(collection, fieldName, fieldValue, fieldType, objectIds) {
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
                inputNfi: '',
                showAssignNfi: false,
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
                inputNfi: '',
                showAssignNfi: false,
                showEditValues: false,
                alert: {
                    type:'alert-danger',
                    message:'Field could not be updated.'
                }
            });
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
            if (!found.edit && !unlocked) {
                this.setState({
                    ...this.state,
                    updateValue: '',
                    showEditValues: false,
                    alert: {
                        type:'alert-danger',
                        message:'Selected  field is disabled, please unlock the table and try again.'
                    }
                });
            } else {
                let collection = found.fields.fromTbl;
                this.updateRequest(collection, found.fields.name, isErase ? '' : updateValue, selectedType, getObjectIds(collection, selectedIds));
                
                // let collection = found.fields.fromTbl;
                // let objectIds = getObjectIds(collection, selectedIds);
                // let fieldName = found.fields.name;
                // let fieldValue = isErase ? '' : updateValue;
                // let fieldType = selectedType;
                // if (!isValidFormat(fieldValue, fieldType, getDateFormat(myLocale))) {
                //     this.setState({
                //         ...this.state,
                //         showEditValues: false,
                //         alert: {
                //             type:'alert-danger',
                //             message:'Wrong Date Format.'
                //         }
                //     });
                // } else {
                //     const requestOptions = {
                //         method: 'PUT',
                //         headers: { ...authHeader(), 'Content-Type': 'application/json' },
                //         body: JSON.stringify({
                //             collection: collection,
                //             fieldName: fieldName,
                //             fieldValue: encodeURI(StringToDate (fieldValue, fieldType, getDateFormat(myLocale))),
                //             objectIds: objectIds
                //         })
                //     };
                //     return fetch(`${config.apiUrl}/extract/update`, requestOptions)
                //     .then( () => {
                //         this.refreshStore();
                //         this.setState({
                //             ...this.state,
                //             showEditValues: false,
                //             alert: {
                //                 type:'alert-success',
                //                 message:'Field sucessfully updated.'
                //             }
                //         });
                //     })
                //     .catch( () => {
                //         this.setState({
                //             ...this.state,
                //             showEditValues: false,
                //             alert: {
                //                 type:'alert-danger',
                //                 message:'Field could not be updated.'
                //             }
                //         });
                //     });
                // }
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
            console.log(toto);
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
                inputNfi: '',
                alert: {
                    type:'',
                    message:''
                },
                showSplitLine: !showSplitLine,
                showEditValues: false,
                showAssignNfi: false,
                showGenerate: false,
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
                inputNfi: '',
                alert: {
                    type:'',
                    message:''
                },
                showSplitLine: false,
                showEditValues: !showEditValues,
                showAssignNfi: false,
                showGenerate: false,
                showDelete: false
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
                selectedTemplate: '0',
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                inputNfi: '',
                alert: {
                    type:'',
                    message:''
                },
                showSplitLine: false,
                showEditValues: false,
                showAssignNfi: !showAssignNfi,
                showGenerate: false,
                showDelete: false
            });
        }


    }

    toggleGenerate(event) {
        event.preventDefault();
        const { showGenerate } = this.state;
        this.setState({
            ...this.state,
            selectedTemplate: '0',
            selectedField: '',
            selectedType: 'text',
            updateValue:'',
            inputNfi: '',
            alert: {
                type:'',
                message:''
            },
            showSplitLine: false,
            showEditValues: false,
            showAssignNfi: false,
            showGenerate: !showGenerate,
            showDelete: false
        });
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
                selectedTemplate: '0',
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                inputNfi: '',
                alert: {
                    type:'',
                    message:''
                },
                showSplitLine: false,
                showEditValues: false,
                showAssignNfi: false,
                showGenerate: false,
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
            selectedTemplate, 
            selectedField,
            selectedType,
            updateValue,
            inputNfi,
            //show modals
            showSplitLine,
            showEditValues,
            showAssignNfi,
            showGenerate,
            showDelete,
            //--------
            headersForShow,
            bodysForShow,
            splitHeadersForShow,
            splitHeadersForSelect,

        }= this.state;

        const { accesses, docdefs, fieldnames, fields, pos, selection } = this.props;
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
                <h2>Inspection | Inspection & Release data > {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="inspection" className="full-height">
                    <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}> {/*, marginBottom: '10px' */}
                        <button className="btn btn-warning btn-lg mr-2" style={{height: '34px'}} onClick={event => this.toggleSplitLine(event)}>
                            <span><FontAwesomeIcon icon="page-break" className="fa-lg mr-2"/>Split line</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} onClick={event => this.toggleEditValues(event)}>
                            <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Edit Values</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} onClick={event => this.toggleAssignNfi(event)}>
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa-lg mr-2"/>Assign NFI</span>
                        </button>
                        <button className="btn btn-success btn-lg mr-2" style={{height: '34px'}} onClick={event => this.toggleGenerate(event)}>
                            <span><FontAwesomeIcon icon="file-excel" className="fa-lg mr-2"/>Generate NFI</span>
                        </button>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
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
                                handleSelectionReload={this.handleSelectionReload}
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
                    show={showAssignNfi}
                    hideModal={this.toggleAssignNfi}
                    title="Assign NFI"
                >
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="updateValue">NFI Number</label>
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="inputNfi"
                                    value={inputNfi}
                                    onChange={this.handleChange}
                                    placeholder=""
                                />
                                <div className="input-group-append">
                                    <button
                                            className="btn btn-leeuwen-blue btn-lg"
                                            title="Get Latest NFI"
                                            onClick={event => this.getNfi(event, 0)}
                                        >
                                        <span><FontAwesomeIcon icon="arrow-to-top" className="fa-lg"/> </span>
                                    </button>
                                    <button
                                        className="btn btn-success btn-lg"
                                        title="Get New NFI"
                                        onClick={event => this.getNfi(event, 1)}
                                    >
                                        <span><FontAwesomeIcon icon="sync-alt" className="fa-lg"/> </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <button className="btn btn-leeuwen-blue btn-lg" onClick={event => this.handleUpdateNFI(event, false)}>
                                <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Assign</span>
                            </button>
                        </div>                   
                    </div>
                </Modal>

                <Modal
                    show={showGenerate}
                    hideModal={this.toggleGenerate}
                    title="Generate Document"
                    // size="modal-xl"
                >
                    <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="selectedTemplate">Select Document</label>
                                <select
                                    className="form-control"
                                    name="selectedTemplate"
                                    value={selectedTemplate}
                                    placeholder="Select document..."
                                    onChange={this.handleChange}
                                >
                                    <option key="0" value="0">Select document...</option>
                                    {
                                        docdefs.items && arraySorted(docConf(docdefs.items), "name").map((p) =>  {        
                                            return (
                                                <option 
                                                    key={p._id}
                                                    value={p._id}>{p.name}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="text-right">
                                <button className="btn btn-success btn-lg" onClick={event => this.handleGenerateFile(event)}>
                                    <span><FontAwesomeIcon icon="file-excel" className="fa-lg mr-2"/>Generate</span>
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
    const { accesses, alert, docdefs, fieldnames, fields, pos, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
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
        pos,
        selection
    };
}

const connectedReleaseData = connect(mapStateToProps)(ReleaseData);
export { connectedReleaseData as ReleaseData };