import React from 'react';
import { connect } from 'react-redux';
import config from 'config';
import { saveAs } from 'file-saver';
import { authHeader } from '../../../../_helpers';
import Modal from "../../../../_components/modal";
import Input from '../../../../_components/input';
import CheckBox from '../../../../_components/check-box';
import Select from '../../../../_components/select';
import HeaderCheckBox from '../../../../_components/project-table/header-check-box';
import HeaderInput from '../../../../_components/project-table/header-input';
import HeaderSelect from '../../../../_components/project-table/header-select';
import NewRowCreate from '../../../../_components/project-table/new-row-create';
import NewRowCheckBox from '../../../../_components/project-table/new-row-check-box';
import NewRowInput from '../../../../_components/project-table/new-row-input';
import NewRowSelect from '../../../../_components/project-table/new-row-select';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelect from '../../../../_components/project-table/table-select';
import TableCheckBox from '../../../../_components/project-table/table-check-box';
import TableSelectionRow from '../../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
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

function arraySorted(array, fieldOne, fieldTwo, fieldThree, fieldFour) {
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

function docSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'worksheet':
        case 'location':
        case 'param':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'row':
        case 'col':
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
        default: return array;
    }
}

function docConf(array) {
    const tpeOf = [
        '5d1927121424114e3884ac7e', //ESR01 Expediting status report
        '5d1927131424114e3884ac80', //PL01 Packing List
        '5d1927141424114e3884ac84', //SM01 Shipping Mark
        '5d1927131424114e3884ac81', //PN01 Packing Note
        '5d1927141424114e3884ac83', //SI01 Shipping Invoice
        '5d1927131424114e3884ac7f', //NFI01 Notification for inspection,
        '5eacef91e7179a42f172feea' //SH01 Stock History Report
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

function doesMatch(search, value, type, isEqual) {
    
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
                    return _.isEqual(TypeToString(value, 'date', getDateFormat(myLocale)), search);
                } else {
                    return TypeToString(value, 'date', getDateFormat(myLocale)).includes(search);
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

function findCustomField(fields, fieldId){
    if (fields.items && fieldId) {
        let found = fields.items.find(function (element) {
            return element._id === fieldId;
        });
        if (found) {
            return found.custom;
        } else {
            return ''
        }
    } else {
        return ''
    }
}

class Documents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            worksheet: '',
            location: '',
            row: '',
            col: '',
            custom: '',
            param: '',
            sort: {
                name: '',
                isAscending: true,
            },
            description:'',
            selectedTemplate:'0',
            fileName:'',
            inputKey: Date.now(),
            multi: false,
            selectedRows: [],
            selectAllRows: false,
            loaded: false,
            deletingFields: false,
            show: false,
            submitted: false,
            deletingDocDef: false,
            updatingDocDef: false,
            creatingDocDef: false,
            //create new row
            docDef:{},
            newRow: false,
            docField:{},
            newRowFocus:false,
            creatingNewRow: false,
            newRowColor: 'inherit',

        }
        this.toggleSort = this.toggleSort.bind(this);
        this.cerateNewRow = this.cerateNewRow.bind(this);
        this.onFocusRow = this.onFocusRow.bind(this);
        this.onBlurRow = this.onBlurRow.bind(this);
        this.toggleNewRow = this.toggleNewRow.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
        this.handleChangeDocDef = this.handleChangeDocDef.bind(this);
        this.handleDeleteDocFields = this.handleDeleteDocFields.bind(this);
        this.handleDeleteDocDef = this.handleDeleteDocDef.bind(this);
        this.handleSubmitDocDef = this.handleSubmitDocDef.bind(this);
        this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.handleDownloadFile = this.handleDownloadFile.bind(this);
        this.handlePreviewFile = this.handlePreviewFile.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleFileChange=this.handleFileChange.bind(this);
        this.fileInput = React.createRef();
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    componentDidMount() {
        const { docdefs, refreshFields, refreshDocfields, refreshDocdefs,  } = this.props;
        const { selectedTemplate } = this.state;
        
        //refreshStore
        refreshFields;
        refreshDocfields;
        refreshDocdefs;

        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const table = document.getElementById('documentsTable');
        table.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });

        if (docdefs.hasOwnProperty('items') && !_.isEmpty(docdefs.items) && selectedTemplate === '0') {
            this.setState({
                selectedTemplate: arraySorted(docConf(docdefs.items), "name")[0]._id
            });
        }
    }

    keyHandler(e) {

        let target = e.target;
        let colIndex = target.parentElement.cellIndex;               
        let rowIndex = target.parentElement.parentElement.rowIndex;
        var nRows = target.parentElement.parentElement.parentElement.childNodes.length;
        
        switch(e.keyCode) {
            case 9:// tab
                if(target.parentElement.nextSibling) {
                    target.parentElement.nextSibling.click();
                }
                break;
            case 13: //enter
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                }
                break;
            case 37: //left
                if(colIndex > 0 && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.previousSibling.click();
                } 
                break;
            case 38: //up
                if(rowIndex > 1) {
                    target.parentElement.parentElement.previousSibling.childNodes[colIndex].click();
                }
                break;
            case 39: //right
                if(target.parentElement.nextSibling && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.nextSibling.click();
                }
                break;
            case 40: //down
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                }
                break;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { fields, docdefs, refreshFieldnames, refreshDocfields } = this.props;
        const { selectedTemplate } = this.state;

        if(docdefs != prevProps.docdefs && docdefs.hasOwnProperty('items') && !_.isEmpty(docdefs.items) && selectedTemplate === '0') {
            this.setState({selectedTemplate: arraySorted(docConf(docdefs.items), "name")[0]._id});
        }

        if (selectedTemplate != prevState.selectedTemplate) {
            this.setState({
                selectedRows: [],
                selectAllRows: false,
                inputKey: Date.now(),
                fileName:''
            }, () => {
                if (docdefs.items) {
                    let obj = findObj(docdefs.items, selectedTemplate);
                    if (obj) {
                        this.setState({
                            ...this.state,
                            fileName: obj.field
                        }, () => {
                            if (!!obj.row2){
                                this.setState({
                                    ...this.state,
                                    multi: true
                                });
                            } else {
                                this.setState({
                                    ...this.state,
                                    multi: false
                                })
                            }
                        });
                    }
                }
            });
        }
    }

    toggleSort(event, name) {
        event.preventDefault();
        const { sort } = this.state;
        if (sort.name != name) {
            this.setState({
                sort: {
                    name: name,
                    isAscending: true
                }
            });
        } else if (!!sort.isAscending) {
            this.setState({
                sort: {
                    name: name,
                    isAscending: false
                }
            });
        } else {
            this.setState({
                sort: {
                    name: '',
                    isAscending: true
                }
            });
        }
    }

    cerateNewRow(event) {
        event.preventDefault()
        const { refreshDocfields } = this.props;
        const { docField } = this.state;
        if (docField.location && docField.row && docField.col && docField.fieldId) {
            this.setState({
                ...this.state,
                creatingNewRow: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify(docField)
                };
                return fetch(`${config.apiUrl}/docField/create`, requestOptions)
                .then( () => {
                    this.setState({
                        ...this.state,
                        creatingNewRow: false,
                        newRowColor: 'green'
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ...this.state,
                                newRowColor: 'inherit',
                                newRow:false,
                                docField:{},
                                newRowFocus: false
                            }, refreshDocfields);
                        }, 1000);
                    });
                })
                .catch( () => {
                    this.setState({
                        ...this.state,
                        creatingNewRow: false,
                        newRowColor: 'red'
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ...this.state,
                                newRowColor: 'inherit',
                                newRow:false,
                                docField:{},
                                newRowFocus: false
                            }, refreshDocfields);
                        }, 1000);
                    });
                });
            });
        }
    }

    onFocusRow(event) {
        event.preventDefault();
        const { selectedTemplate, newRowFocus } = this.state;
        if (selectedTemplate !='0' && event.currentTarget.dataset['type'] == undefined && newRowFocus == true){
            this.cerateNewRow(event);
        }
    }

    onBlurRow(event){
        event.preventDefault()
        if (event.currentTarget.dataset['type'] == 'newrow'){
            this.setState({
                ...this.state,
                newRowFocus: true
            });
        }
    }

    toggleNewRow(event) {
        event.preventDefault()
        const { newRow, selectedTemplate } = this.state;
        if (selectedTemplate == '0') {
            this.setState({
                ...this.state,
                newRow: false}
                )
        } else {
            this.setState({
                ...this.state,
                newRow: !newRow
            })
        }
    }

    handleChangeNewRow(event){
        const { projectId } = this.props;
        const { docField, selectedTemplate } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (projectId && selectedTemplate != '0') {
            this.setState({
                ...this.state,
                docField: {
                    ...docField,
                    [name]: value,
                    docdefId: selectedTemplate,
                    projectId: projectId
                }
            });
        } 
    }

    showModal() {
        const { projectId } = this.props
        if (projectId) {
            this.setState({
                ...this.state,
                docDef: {
                    code: "",
                    location: "Template",
                    field: "",
                    description: "",
                    row1: "",
                    col1: "",
                    grid: "",
                    worksheet1: "",
                    worksheet2: "",
                    row2: "",
                    col2: "",
                    doctypeId: "",
                    projectId: projectId,
                    detail: false
            },
            show: true,
            submitted: false,
            });
        }
      }

    hideModal() {
        this.setState({
            ...this.state,
            docDef: {
                code: "",
                location: "",
                field: "",
                description: "",
                row1: "",
                col1: "",
                grid: "",
                worksheet1: "",
                worksheet2: "",
                row2: "",
                col2: "",
                doctypeId: "",
                projectId: "",
                daveId: "",
                detail: false
          },
          show: false,
          submitted: false,
        });
      }

      handleOnclick(event, id) {
          event.preventDefault();
          const { docdefs } = this.props;
        //   const { project } = this.props.selection
        if (id != '0' && docdefs.items) {
          let found = docdefs.items.find(element => element._id === id);
          this.setState({
            ...this.state,
            docDef: {
              id: id,
              code: found.code,
              location: found.location,
              field: found.field,
              description: found.description,
              row1: found.row1,
              col1: found.col1,
              grid: found.grid,
              worksheet1: found.worksheet1,
              worksheet2: found.worksheet2,
              row2: found.row2,
              col2: found.col2,
              doctypeId: found.doctypeId,
              projectId: found.projectId,
              daveId: found.daveId,
              detail: found.row2 ? true : false
            },
            show: true,
            submitted: false,
          });
        }
      }


    handleDeleteDocFields(event, id) {
        event.preventDefault();
        const { refreshDocfields } = this.props;
        if(id) {
            this.setState({
                ...this.state,
                deletingFields: true 
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader()},
                };
                return fetch(`${config.apiUrl}/docField/delete?id=${JSON.stringify(id)}`, requestOptions)
                .then( () => {
                    this.setState({deletingFields: false}, refreshDocfields);
                })
                .catch( err => {
                    this.setState({deletingFields: false}, refreshDocfields);
                });
            });
        }
    }

    handleDeleteDocDef(event, id) {
        event.preventDefault();
        const { refreshDocdefs, handleSetAlert } = this.props;
        if (id != '0') {
            this.setState({
                ...this.state,
                deletingDocDef: true 
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader()},
                };
                return fetch(`${config.apiUrl}/docdef/delete?id=${id}`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (!responce.ok) {
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        }
                        // const error = (data && data.message) || responce.statusText;
                        this.setState({
                            ...this.state,
                            deletingDocDef: false,
                            selectedTemplate: '0',
                            fileName: '',
                            inputKey: Date.now()
                            
                        }, handleSetAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message, refreshDocdefs));
                    } else {
                        this.setState({
                            ...this.state,
                            deletingDocDef: false,
                            selectedTemplate: '0',
                            fileName: '',
                            inputKey: Date.now()
                            
                        }, handleSetAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message, refreshDocdefs));
                    }
                }));
                // .then( () => {
                //     this.setState({
                //         ...this.state,
                //         deletingDoc: false,
                //         selectedTemplate: '0',
                //         fileName: '',
                //         inputKey: Date.now()
                //     }, refreshDocdefs);
                // })
                // .catch( err => {
                //     this.setState({
                //         ...this.state,
                //         deletingDoc: false,
                //         selectedTemplate: '0',
                //         fileName: '',
                //         inputKey: Date.now()
                //     }, refreshDocdefs);
                // });
            });
        }
    }
 
    
    handleSubmitDocDef(event) {
        event.preventDefault();
        const { docDef } = this.state;
        const { refreshDocdefs, handleSetAlert } = this.props;
        this.setState({
            ...this.state,
            submitted: true
        }, () => {
            if (docDef.id && docDef.description && docDef.doctypeId && docDef.row1 && docDef.col1 && docDef.projectId) {
                this.setState({
                    ...this.state,
                    updatingDocDef: true
                }, () => {
                    const requestOptions = {
                        method: 'PUT',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' }, //, 'Content-Type': 'application/json'
                        body: JSON.stringify(docDef)
                    }
                    return fetch(`${config.apiUrl}/docdef/update?id=${docDef.id}`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (!responce.ok) {
                            if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
                            }
                            // const error = (data && data.message) || responce.statusText;
                            this.setState({
                                ...this.state,
                                submitted: false,
                                updatingDocDef: false  
                            }, () => {
                                this.hideModal(event);
                                handleSetAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message, refreshDocdefs)
                            });
                        } else {
                            this.setState({
                                ...this.state,
                                submitted: false,
                                updatingDocDef: false  
                            }, () => {
                                this.hideModal(event);
                                handleSetAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message, refreshDocdefs)
                            });
                        }
                    }));
                });
            } else if (docDef.description && docDef.doctypeId && docDef.row1 && docDef.col1 && docDef.projectId){
                this.setState({
                    ...this.state,
                    creatingDocDef: true
                }, () => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { ...authHeader(), 'Content-Type': 'application/json' },
                        body: JSON.stringify(docDef)
                    }
                    return fetch(`${config.apiUrl}/docdef/create`, requestOptions)
                    .then(responce => responce.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (!responce.ok) {
                            if (responce.status === 401) {
                                localStorage.removeItem('user');
                                location.reload(true);
                            }
                            this.setState({
                                ...this.state,
                                submitted: false,
                                creatingDocDef: false  
                            }, () => {
                                this.hideModal(event),
                                handleSetAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message, refreshDocdefs)
                            });
                        } else {
                            this.setState({
                                ...this.state,
                                submitted: false,
                                creatingDocDef: false  
                            }, () => {
                                this.hideModal(event),
                                handleSetAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message, refreshDocdefs)
                            });
                        }
                    }));
                });
            }
        });
    }

    updateSelectedRows(id) {
        const { selectedRows } = this.state;
        if (selectedRows.includes(id)) {
            this.setState({
                ...this.state,
                selectedRows: arrayRemove(selectedRows, id)
            });
        } else {
            this.setState({
                ...this.state,
                selectedRows: [...selectedRows, id]
            });
        }       
    }

    handleUploadFile(event){
        event.preventDefault();
        const { selectedTemplate, fileName } = this.state;
        const { selection, refreshDocdefs } = this.props
        if(this.fileInput.current.files[0] && selectedTemplate != '0' && selection.project && fileName) {
            var data = new FormData()
            data.append('file', this.fileInput.current.files[0])
            data.append('documentId', selectedTemplate)
            data.append('project', selection.project.number)
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader()}, //, 'Content-Type': 'application/json'
                body: data
            }
            return fetch(`${config.apiUrl}/template/upload`, requestOptions)
            .then(refreshDocdefs);            
        }        
    }

    handleDownloadFile(event) {
        event.preventDefault();
        const { selection, docdefs } = this.props;
        const { selectedTemplate, fileName } = this.state;
        if (selection.project && docdefs.items && selectedTemplate != "0" && fileName) {
            let obj = findObj(docdefs.items, selectedTemplate);
            if (obj) {
            const requestOptions = {
                method: 'GET',
                headers: { ...authHeader(), 'Content-Type': 'application/json'},
            };
            return fetch(`${config.apiUrl}/template/download?project=${selection.project.number}&file=${obj.field}`, requestOptions)
                .then(res => res.blob()).then(blob => saveAs(blob, obj.field));
            }
        }
    }

    handlePreviewFile(event) {
        event.preventDefault();
        const { selection, docdefs } = this.props;
        const { selectedTemplate, fileName } = this.state;
        if (selection.project && docdefs.items && selectedTemplate != "0" && fileName) {
            let obj = findObj(docdefs.items, selectedTemplate);
             if (obj) {
                const requestOptions = {
                    method: 'GET',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                };
                return fetch(`${config.apiUrl}/template/preview?docDef=${selectedTemplate}`, requestOptions) //project=${selection.project.number}&
                    .then(res => res.blob()).then(blob => saveAs(blob, obj.field));
             }
        }
    }

    handleFileChange(event){
        if(event.target.files.length > 0) {
            this.setState({
                ...this.state,
                fileName: event.target.files[0].name
            });
        }
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    handleChangeDocDef(event) {
        const target = event.target;
        const { docDef } = this.state
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            docDef: {
                ...docDef,
                [name]: value
            }
        });
    }

    handleChangeTemplate(event) {
        const value =  event.target.value;
        this.setState({selectedTemplate: value});
    }
    
    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { docfields } = this.props;
        if (docfields.items) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(docfields.items).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
    }
    
    filterName(array){
        
        const {
            worksheet,
            location,
            row,
            col,
            custom,
            param,
            selectedTemplate,
            sort
        } = this.state;

        if (array) {
        return docSorted(array, sort).filter(function (element) {
            return (doesMatch(selectedTemplate, element.docdefId, 'Id', false)
            && doesMatch(worksheet, element.worksheet, 'Select', false)
            && doesMatch(location, element.location, 'Select', false)
            && doesMatch(row, element.row, 'Number', false)
            && doesMatch(col, element.col, 'Number', false)
            && doesMatch(param, element.param, 'String', false)
            && element.fields && doesMatch(custom, element.fields.custom, 'String', false)
            );
          });
        } else {
            return [];
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
          event.preventDefault();
        }
    }

    render() {

        const { 
            docdefs,
            docfields,
            fields,
            tab,
            selection,
            refreshDocfields,
        } = this.props
        
        const {
            worksheet,
            location,
            row,
            col,
            custom,
            param,
            sort,
            description,
            selectedTemplate,
            selectedRows,
            selectAllRows,
            fileName,
            multi,
            show,
            submitted,
            updatingDocDef,
            creatingDocDef,
            deletingDocDef,
            docDef,
            newRow,
            docField,
            newRowColor
        } = this.state;

        const ArrLocation = [
            { _id: 'Header', location: 'Header'},
            { _id: 'Line', location: 'Line'}
        ]

        const ArrSheet = [
            { _id: 'Sheet1', worksheet: 'Sheet1'},
            { _id: 'Sheet2', worksheet: 'Sheet2'}
        ]

        const ArrType = [
            {_id: '5d1927121424114e3884ac7e', code: 'ESR01' , name: 'Expediting status report'},
            {_id: '5d1927131424114e3884ac80', code: 'PL01' , name: 'Packing List'},
            {_id: '5d1927141424114e3884ac84', code: 'SM01' , name: 'Shipping Mark'},
            {_id: '5d1927131424114e3884ac81', code: 'PN01' , name: 'Packing Note'},
            {_id: '5d1927141424114e3884ac83', code: 'SI01' , name: 'Shipping Invoice'},
            {_id: '5eacef91e7179a42f172feea', code: 'SH01', name: 'Stock History Report'}
        ]

        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text" style={{width: '95px'}}>Select Document</span>
                        </div>
                        <select className="form-control" name="selectedTemplate" value={selectedTemplate} placeholder="Select Template..." onChange={this.handleChangeTemplate}>
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
                        <div className="input-group-append">
                            <button className="btn btn-dark btn-lg" onClick={this.showModal} title="Create">
                                <span><FontAwesomeIcon icon="plus" className="fa-lg"/></span>
                            </button>
                            <button className="btn btn-leeuwen-blue btn-lg" onClick={(event) => this.handleOnclick(event, selectedTemplate)} title="Update">
                                <span><FontAwesomeIcon icon="edit" className="fa-lg"/></span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={ (event) => this.handleDeleteDocDef(event, selectedTemplate)} title="Delete">
                                <span><FontAwesomeIcon icon={deletingDocDef ? "spinner" : "trash-alt"} className={deletingDocDef ? "fa-pulse fa-lg fa-fw" : "fa-lg"}/></span>
                            </button>  
                        </div>
                    </div>
                </div>
                <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                    <form
                        className="col-12"
                        encType="multipart/form-data"
                        onSubmit={this.handleUploadFile}
                        onKeyPress={this.onKeyPress}
                        style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                    >
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" style={{width: '95px'}}>Select Template</span>
                                <input
                                    type="file"
                                    name="fileInput"
                                    id="fileInput"
                                    ref={this.fileInput}
                                    className="custom-file-input"
                                    style={{opacity: 0, position: 'absolute', pointerEvents: 'none', width: '1px'}}
                                    onChange={this.handleFileChange}
                                    key={this.state.inputKey}
                                />
                            </div>
                            <label type="text" className="form-control text-left" htmlFor="fileInput" style={{display:'inline-block', padding: '7px'}}>{fileName ? fileName : 'Choose file...'}</label>
                            <div className="input-group-append mr-2">
                                <button type="submit" className="btn btn-outline-leeuwen-blue btn-lg">
                                    <span><FontAwesomeIcon icon="upload" className="fa-lg mr-2"/>Upload</span>
                                </button>
                                <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.handleDownloadFile(event)}>
                                    <span><FontAwesomeIcon icon="download" className="fa-lg mr-2"/>Download</span>
                                </button>
                                <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.handlePreviewFile(event)}>
                                    <span><FontAwesomeIcon icon="eye" className="fa-lg mr-2"/>Preview</span>
                                </button>   
                            </div>
                            <div className="pull-right">
                                <button title="Add Field" className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.toggleNewRow(event)} style={{height: '34px'}}>
                                    <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add</span>
                                </button>                                               
                                <button title="Delete Field(s)" className="btn btn-leeuwen btn-lg" onClick={event => this.handleDeleteDocFields(event, selectedRows)} style={{height: '34px'}}>
                                    <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete</span>
                                </button> 
                            </div>        
                        </div>
                    </form>
                </div>
                <div className="" style={{height: 'calc(100% - 88px)'}}>
                    <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="documentsTable">
                                <thead>
                                    <tr>
                                        <TableSelectionAllRow
                                            checked={selectAllRows}
                                            onChange={this.toggleSelectAllRow}
                                        />
                                        {multi &&
                                            <HeaderSelect
                                                title="Worksheet"
                                                name="worksheet"
                                                value={worksheet}
                                                options={ArrSheet}
                                                optionText="worksheet"
                                                onChange={this.handleChangeHeader}
                                                width ="15%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />                                        
                                        }
                                        <HeaderSelect
                                            title="Location"
                                            name="location"
                                            value={location}
                                            options={ArrLocation}
                                            optionText="location"
                                            onChange={this.handleChangeHeader}
                                            width ={multi ? '10%' : '15%'} 
                                            sort={sort}
                                            toggleSort={this.toggleSort}                                       
                                        />
                                        <HeaderInput
                                            type="number"
                                            title="Row"
                                            name="row"
                                            value={row}
                                            onChange={this.handleChangeHeader}
                                            width ={multi ? '10%': '15%'}
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                        />
                                        <HeaderInput
                                            type="number"
                                            title="Col"
                                            name="col"
                                            value={col}
                                            onChange={this.handleChangeHeader}
                                            width ={multi ? '10%': '15%'}
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                        />
                                        <HeaderInput
                                            type="text"
                                            title="Field"
                                            name="custom"
                                            value={custom}
                                            onChange={this.handleChangeHeader}
                                            width ="40%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                        />
                                        <HeaderInput
                                            type="text"
                                            title="Parameter"
                                            name="param"
                                            value={param}
                                            onChange={this.handleChangeHeader}
                                            width ="15%"
                                            sort={sort}
                                            toggleSort={this.toggleSort}
                                        />
                                    </tr>
                                </thead>
                                <tbody>
                                    {newRow &&
                                        <tr onBlur={this.onBlurRow} onFocus={this.onFocusRow} data-type="newrow">
                                            <NewRowCreate
                                                onClick={ event => this.cerateNewRow(event)}
                                            />
                                            {multi &&
                                                <NewRowSelect 
                                                    fieldName="worksheet"
                                                    fieldValue={docField.worksheet}
                                                    options={ArrSheet}
                                                    optionText="worksheet"
                                                    fromTbls={[]}
                                                    onChange={event => this.handleChangeNewRow(event)}
                                                    color={newRowColor}
                                                />
                                            }
                                            <NewRowSelect 
                                                fieldName="location"
                                                fieldValue={docField.location}
                                                options={ArrLocation}
                                                optionText="location"
                                                fromTbls={[]}
                                                onChange={event => this.handleChangeNewRow(event)}
                                                color={newRowColor}
                                            />                                        
                                            <NewRowInput
                                                fieldType="number"
                                                fieldName="row"
                                                fieldValue={docField.row}
                                                onChange={event => this.handleChangeNewRow(event)}
                                                color={newRowColor}
                                            />                                        
                                            <NewRowInput
                                                fieldType="number"
                                                fieldName="col"
                                                fieldValue={docField.col}
                                                onChange={event => this.handleChangeNewRow(event)}
                                                color={newRowColor}
                                            />                                         
                                            <NewRowSelect 
                                                fieldName="fieldId"
                                                fieldValue={docField.fieldId}
                                                options={fields.items}
                                                optionText="custom"
                                                fromTbls={[]}
                                                onChange={event => this.handleChangeNewRow(event)}
                                                color={newRowColor}
                                            />                                        
                                            <NewRowInput
                                                fieldType="text"
                                                fieldName="param"
                                                fieldValue={docField.param}
                                                onChange={event => this.handleChangeNewRow(event)}
                                                color={newRowColor}
                                            />                                         
                                        </tr>                                
                                    }
                                    {docfields.items && fields.items && this.filterName(docfields.items).map((s) =>
                                        <tr key={s._id} onBlur={this.onBlurRow} onFocus={this.onFocusRow}>                                  
                                            <TableSelectionRow
                                                id={s._id}
                                                selectAllRows={this.state.selectAllRows}
                                                callback={this.updateSelectedRows}
                                            />
                                            {multi &&
                                                <TableSelect 
                                                    collection="docfield"
                                                    objectId={s._id}
                                                    fieldName="worksheet"
                                                    fieldValue={s.worksheet}
                                                    options={ArrSheet}
                                                    optionText="worksheet"
                                                    fromTbls={[]}
                                                    refreshStore={refreshDocfields}
                                                />
                                            }
                                            <TableSelect 
                                                collection="docfield"
                                                objectId={s._id}
                                                fieldName="location"
                                                fieldValue={s.location}
                                                options={ArrLocation}
                                                optionText="location"
                                                fromTbls={[]}
                                                refreshStore={refreshDocfields}
                                            />
                                            <TableInput 
                                                collection="docfield"
                                                objectId={s._id}
                                                fieldName="row"
                                                fieldValue={s.row}
                                                fieldType="number"
                                                refreshStore={refreshDocfields}
                                            />
                                            <TableInput 
                                                collection="docfield"
                                                objectId={s._id}
                                                fieldName="col"
                                                fieldValue={s.col}
                                                fieldType="number"
                                                refreshStore={refreshDocfields}
                                            />
                                            <TableSelect 
                                                collection="docfield"
                                                objectId={s._id}
                                                fieldName="fieldId"
                                                fieldValue={s.fieldId}
                                                options={fields.items}
                                                optionText="custom"
                                                fromTbls={[]}
                                                refreshStore={refreshDocfields}
                                            />
                                            <TableInput 
                                                collection="docfield"
                                                objectId={s._id}
                                                fieldName="param"
                                                fieldValue={s.param}
                                                fieldType="text"
                                                refreshStore={refreshDocfields}
                                            />
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Modal
                                show={show}
                                hideModal={this.hideModal}
                                title={docDef.id ? 'Update Document' : 'Add Document'}
                            >
                                <div className="col-12">
                                    <form
                                        name="form"
                                        onKeyPress={this.onKeyPress}
                                        onSubmit={(event) => this.handleSubmitDocDef(event, docDef)}
                                    >
                                        <Input
                                            title="Description"
                                            name="description"
                                            type="text"
                                            value={docDef.description}
                                            onChange={this.handleChangeDocDef}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Select
                                            title="Document Type"
                                            name="doctypeId"
                                            options={ArrType}
                                            value={docDef.doctypeId}
                                            onChange={this.handleChangeDocDef}
                                            placeholder=""
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                            disabled={docDef.id ? true : false}
                                        />
                                        {docDef.doctypeId == '5d1927131424114e3884ac80' &&
                                            <CheckBox
                                                title="Master and Detail sheet"
                                                name="detail"
                                                checked={docDef.detail}
                                                onChange={this.handleChangeDocDef}
                                                disabled={false}
                                            />
                                        }
                                        <Input
                                            title="Start Row (Sheet1)"
                                            name="row1"
                                            type="number"
                                            value={docDef.row1}
                                            onChange={this.handleChangeDocDef}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Input
                                            title="Last Column (Sheet1)"
                                            name="col1"
                                            type="number"
                                            value={docDef.col1}
                                            onChange={this.handleChangeDocDef}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        {docDef.doctypeId == '5d1927131424114e3884ac80' && docDef.detail == true &&
                                            <div>
                                                <Input
                                                    title="Start Row (Sheet2)"
                                                    name="row2"
                                                    type="number"
                                                    value={docDef.row2}
                                                    onChange={this.handleChangeDocDef}
                                                    submitted={submitted}
                                                    inline={false}
                                                    required={docDef.detail == true}
                                                />
                                                <Input
                                                    title="Last Column (Sheet2)"
                                                    name="col2"
                                                    type="number"
                                                    value={docDef.col2}
                                                    onChange={this.handleChangeDocDef}
                                                    submitted={submitted}
                                                    inline={false}
                                                    required={docDef.detail == true}
                                                />
                                            </div>
                                        }

                                        <div className="modal-footer">
                                            <button type="submit" className="btn btn-leeuwen-blue btn-lg btn-full">
                                                <span>
                                                    <FontAwesomeIcon
                                                        icon={updatingDocDef ? "spinner" : docDef.id ? "edit" : "plus"}
                                                        className={updatingDocDef ? "fa-pulse fa-lg fa-fw mr-2" : "fa-lg mr-2"}
                                                    />
                                                    {docDef.id ? "Update" : "Create"}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>    
            </div>
        );
    }
}

export default Documents;