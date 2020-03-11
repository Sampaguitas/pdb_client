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
    erpActions,
} from '../../../_actions';
import Layout from '../../../_components/layout';
import ProjectTable from '../../../_components/project-table/project-table';
import Modal from '../../../_components/modal';


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

// function getObjectIds(collection, selectedIds) {
//     if (!_.isEmpty(selectedIds)) {
//         switch(collection) {
//             case 'po': return selectedIds.reduce(function(acc, curr) {
//                 if(!acc.includes(curr.poId)) {
//                     acc.push(curr.poId);
//                 }
//                 return acc;
//             }, []);
//             case 'sub': return selectedIds.reduce(function(acc, curr) {
//                 if(!acc.includes(curr.subId)) {
//                     acc.push(curr.subId);
//                 }
//                 return acc;
//             }, []);
//             case 'certificate': return selectedIds.reduce(function(acc, curr) {
//                 if(!acc.includes(curr.certificateId)) {
//                     acc.push(curr.certificateId);
//                 }
//                 return acc;
//             }, []);
//             case 'packitem': return selectedIds.reduce(function(acc, curr) {
//                 if(!acc.includes(curr.packItemId)) {
//                     acc.push(curr.packItemId);
//                 }
//                 return acc;
//             }, []);
//             case 'collipack': return selectedIds.reduce(function(acc, curr) {
//                 if(!acc.includes(curr.colliPackId)) {
//                     acc.push(curr.colliPackId);
//                 }
//                 return acc;
//             }, []);
//             default: return [];
//         }
//     } else {
//         return [];
//     }
// }

function baseTen(number) {
    return number.toString().length > 2 ? number : '0' + number;
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

function docConf(array) {
    const tpeOf = [
        //'5d1927121424114e3884ac7e', //ESR01 Expediting status report
        '5d1927131424114e3884ac80', //PL01 Packing List
        '5d1927141424114e3884ac84', //SM01 Shipping Mark
        '5d1927131424114e3884ac81', //PN01 Packing Note
        '5d1927141424114e3884ac83' //SI01 Shipping Invoice
        // '5d1927131424114e3884ac7f' //NFI1 Notification for Inspection
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
                    packItemId: '',
                    colliPackId: collipack._id
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

class PackingDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headersForShow: [],
            bodysForShow: [],
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
            //-----modals-----
            showEditValues: false,
            showSplitLine: false,
            showGenerate: false,
            showDelete: false,
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleUnlock = this.toggleUnlock.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleUpdateValue = this.handleUpdateValue.bind(this);
        this.handleUpdateWeight = this.handleUpdateWeight.bind(this);
        // this.handleSplitLine = this.handleSplitLine.bind(this);
        this.refreshStore = this.refreshStore.bind(this);
        this.updateSelectedIds = this.updateSelectedIds.bind(this);
        this.handleDeleteRows = this.handleDeleteRows.bind(this);
        //Toggle Modals
        this.toggleEditValues = this.toggleEditValues.bind(this);
        this.toggleGenerate = this.toggleGenerate.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
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
            location,
            //-----
            fieldnames,
            docdefs,
            collipacks,
        } = this.props;

        const { screenId, headersForShow } = this.state;

        var qs = queryString.parse(location.search);
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
        }

        this.setState({
            headersForShow: getHeaders(fieldnames, screenId, 'forShow'),
            bodysForShow: getBodys(collipacks, headersForShow),
            plList: getPlList(collipacks),
            docList: arraySorted(docConf(docdefs.items), "name")
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { selectedField, screenId, headersForShow } = this.state;
        const { fields, fieldnames, docdefs, collipacks } = this.props;
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
            dispatch(collipackActions.getAll(projectId));
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

    handleGenerateFile(event) {
        event.preventDefault();
        const { docdefs } = this.props;
        const { selectedTemplate, selectedPl } = this.state;

        function getRoute(doctypeId) {
            switch(doctypeId) {
                case '5d1927131424114e3884ac80': return 'generatePl';//PL01 Packing List
                case '5d1927141424114e3884ac84': return 'generateSm';//SM01 Shipping Mark
                case '5d1927131424114e3884ac81': return 'generatePn';//PN01 Packing Note
                case '5d1927141424114e3884ac83': return 'generateSi';//SI01 Shipping Invoice
                default: return 'generatePl';
            }
        }

        if (!!selectedTemplate && !!selectedPl) {
            let obj = findObj(docdefs.items, selectedTemplate);
            if (!!obj) {
                const requestOptions = {
                    method: 'GET',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                };
                return fetch(`${config.apiUrl}/template/${getRoute(obj.doctypeId)}?docDefId=${selectedTemplate}&locale=${locale}&selectedPl=${selectedPl}`, requestOptions)
                    .then(res => res.blob()).then(blob => saveAs(blob, obj.field));
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
                selectedTemplate: '',
                selectedField: '',
                selectedType: 'text',
                updateValue:'',
                alert: {
                    type:'',
                    message:''
                },
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
            selectedPl,
            selectedTemplate,
            selectedField,
            selectedType,
            updateValue,
            plList,
            docList,
            //show modals
            showEditValues,
            // showSplitLine,
            showGenerate,
            showDelete,
            //---------
            headersForShow,
            bodysForShow
        }= this.state;

        const { accesses, docdefs, fieldnames, fields, collipacks, selection } = this.props;
        const alert = this.state.alert ? this.state.alert : this.props.alert;
        return (
            <Layout alert={alert} accesses={accesses}>
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
                            <NavLink to={{ pathname: '/shipping', search: '?id=' + projectId }} tag="a">Shipping</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Complete packing details:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</span>
                    </ol>
                </nav>
                {/* <h2>Shipping | Complete packing details > {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2> */}
                <hr />
                <div id="packingdetails" className="full-height">
                    <div className="action-row row ml-1 mb-2 mr-1" style={{height: '34px'}}>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Edit Values" onClick={event => this.toggleEditValues(event)}>
                            <span><FontAwesomeIcon icon="edit" className="fa-lg mr-2"/>Edit Values</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Assign Colli Type"> {/* onClick={event => this.toggleAssignNfi(event)} */}
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa-lg mr-2"/>Colli Type</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" style={{height: '34px'}} title="Calculate Net Weight" onClick={event => this.handleUpdateWeight(event)}> {/* onClick={event => this.toggleAssignNfi(event)} */}
                            <span><FontAwesomeIcon icon="balance-scale-left" className="fa-lg mr-2"/>Net Weight</span>
                        </button>
                        <button className="btn btn-success btn-lg mr-2" style={{height: '34px'}} title="Generate Shipping Docs" onClick={event => this.toggleGenerate(event)}>
                            <span><FontAwesomeIcon icon="file-excel" className="fa-lg mr-2"/>Shipping Docs</span>
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
                                downloadTable={this.downloadTable}
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
                                    <span><FontAwesomeIcon icon="file-excel" className="fa-lg mr-2"/>Generate</span>
                                </button>
                            </div>
                        </form>         
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
    const { accesses, alert, collipacks, collitypes, docdefs, fieldnames, fields, pos, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingCollipacks } = collipacks;
    const { loadingCollitypes } = collitypes;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
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
        pos,
        selection
    };
}

const connectedPackingDetails = connect(mapStateToProps)(PackingDetails);
export { connectedPackingDetails as PackingDetails };