import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
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

function arraySorted(array, field) {
    if (array) {
        const newArray = array
        newArray.sort(function(a,b){
            if (resolve(field, a) < resolve(field, b)) {
                return -1;
            } else if ((resolve(field, a) > resolve(field, b))) {
                return 1;
            } else {
                return 0;
            }
        });
        return newArray;             
    }
}

function screenSorted(array, sort) {
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

function generateFromTbls(screens, selectedScreen) {
    const found = screens.find(element => element._id === selectedScreen);
    return !_.isUndefined(found) ? found.fromTbls : [];
}

class Screens extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custom: '',
            forShow: '',
            forSelect: '',
            align: '',
            edit: '',
            sort: {
                name: '',
                isAscending: true,
            },
            screenId: '',
            fieldId: '',
            selectedScreen:'5cd2b643fd333616dc360b66',
            // FromTbls: [],
            selectedRows: [],
            selectAllRows: false,
            loaded: false,
            show: false,
            deleting: false,
            //create new row
            newRow: false,
            fieldName:{},
            newRowFocus:false,
            creatingNewRow: false,
            //creating new row
            newRowColor: 'inherit',
        }
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.createNewRow = this.createNewRow.bind(this);
        // this.onFocusRow = this.onFocusRow.bind(this);
        // this.onBlurRow = this.onBlurRow.bind(this);
        this.toggleNewRow = this.toggleNewRow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.handleChangeScreen = this.handleChangeScreen.bind(this);
        this.filterName = this.filterName.bind(this);
        this.generateScreensOptions = this.generateScreensOptions.bind(this);
        // this.generateFromTbls = this.generateFromTbls.bind(this);
    }

    componentDidMount() {

        const { refreshFields, refreshFieldnames } =this.props;
        //refreshStore
        refreshFields;
        refreshFieldnames;

        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const table = document.getElementById('screensTable');
        table.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
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

    createNewRow(event) {
        event.preventDefault();
        const { refreshFields, refreshFieldnames } = this.props;
        const { fieldName } = this.state;
        this.setState({
            ...this.state,
            creatingNewRow: true
        }, () => {
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify(fieldName)
            };
            return fetch(`${config.apiUrl}/fieldName/create`, requestOptions)
            .then( () => {
                this.setState({
                    ...this.state,
                    creatingNewRow: false,
                    newRowColor: 'green'
                }, () => {
                    setTimeout( () => {
                        this.setState({
                            ...this.state,
                            newRowColor: 'inherit',
                            newRow:false,
                            fieldName:{},
                            newRowFocus: false
                        }, refreshFieldnames);
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
                            fieldName:{},
                            newRowFocus: false                                    
                        }, refreshFieldnames);
                    }, 1000);                                                      
                });
            });
        });
    }

    // onFocusRow(event) {
    //     event.preventDefault();
    //     const { selectedScreen, newRowFocus } = this.state;
    //     if (selectedScreen && event.currentTarget.dataset['type'] == undefined && newRowFocus == true){
    //         this.createNewRow(event);
    //     }
    // }

    // onBlurRow(event){
    //     event.preventDefault()
    //     if (event.currentTarget.dataset['type'] == 'newrow'){
    //         this.setState({
    //             ...this.state,
    //             newRowFocus: true
    //         });
    //     }
    // }

    toggleNewRow(event) {
        event.preventDefault()
        const { newRow, selectedScreen } = this.state;
        if (!selectedScreen) {
            this.setState({
                newRow: false,
                fieldName: {}
            });
        } else {
            this.setState({
                newRow: !newRow,
                fieldName: {}
            });
        }
    }

    handleChangeNewRow(event){
        const { projectId } = this.props;
        const { fieldName, selectedScreen} = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (projectId && selectedScreen) {
            this.setState({
                ...this.state,
                fieldName: {
                    ...fieldName,
                    [name]: value,
                    screenId: selectedScreen,
                    projectId: projectId
                }
            });
        }
    }

    handleDelete(event, selectedRows) {
        event.preventDefault();
        const { refreshFieldnames } = this.props;
        if(_.isEmpty(selectedRows)) {
            this.setState({
                ...this.state,
                deleting: true 
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedIds: selectedRows})
                };
                return fetch(`${config.apiUrl}/fieldName/delete`, requestOptions)
                .then( () => {
                    this.setState({
                        ...this.state,
                        deleting: false
                    }, refreshFieldnames);
                })
                .catch( err => {
                    this.setState({
                        ...this.state,
                        deleting: false
                    }, refreshFieldnames);
                });
            });
        }
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
    
	toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { selection, fieldnames } = this.props;
        if (fieldnames.items) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(fieldnames.items).map(s => s._id),
                    selectAllRows: true
                });
            }         
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

    handleChangeScreen(event) {
        const target = event.target;
        const name = target.name;
        const value = event.target.value;
        this.setState({
            ...this.state,
            [name]: value,
            selectedRows: [],
            selectAllRows: false
        });
    }  
    
    filterName(array){
        const { 
            align,
            edit,
            forSelect,
            forShow,
            screenId,
            fieldId,
            custom,
            selectedScreen,
            sort
        } = this.state;

        if (array) {
            return screenSorted(array, sort).filter(function (element) {
                return (doesMatch(selectedScreen, element.screenId, 'Id', false)
                    && element.fields && doesMatch(custom, element.fields.custom, 'String', false)
                    && doesMatch(forShow, element.forShow, 'Number', false)
                    && doesMatch(forSelect, element.forSelect, 'Number', false)
                    && doesMatch(align, element.align, 'Select', false)
                    && doesMatch(edit, element.edit, 'Boolean', false)
                );
            });
        } else {
            return [];
        }
    }

    generateScreensOptions(screens) {
        let tempArray=[]
        if (screens) {
            arraySorted(screens, "name").map((screen) =>  {        
                tempArray.push (
                    <option 
                        key={screen._id}
                        value={screen._id}>{screen.name}
                    </option>
                );
            });
        }
        return tempArray;
    }

    render() {
        const {
            fieldnames,
            fields,
            // screens,
            selection, 
            tab,
            refreshFieldnames
        } = this.props;
        
        const {
            custom,
            forShow,
            forSelect,
            align,
            edit,
            sort,
            screenId,
            fieldId,
            selectedScreen,
            selectedRows,
            selectAllRows,
            fieldName,
            newRow,
            newRowColor,
            deleting
        } = this.state;

        const arrAlign = [
            { _id: 'left', name: 'Left' },
            { _id: 'center', name: 'Center' },
            { _id: 'right', name: 'Right' },
        ]

        const screens = [
            {_id: '5cd2b642fd333616dc360b63', name: 'Expediting', fromTbls: ['po', 'sub', 'packitem', 'certificate']},
            {_id: '5cd2b646fd333616dc360b70', name: 'Expediting Splitwindow', fromTbls: ['po', 'sub']},
            {_id: '5cd2b642fd333616dc360b64', name: 'Inspection', fromTbls: ['po', 'sub', 'packitem', 'certificate']},
            {_id: '5cd2b647fd333616dc360b71', name: 'Inspection Splitwindow', fromTbls: ['po', 'sub', 'certificate']},
            {_id: '5cd2b643fd333616dc360b66', name: 'Assign Transport', fromTbls: ['po', 'sub', 'article', 'packitem', 'certificate']},
            {_id: '5cd2b647fd333616dc360b72', name: 'Assign Transport SplitWindow', fromTbls: ['po', 'sub', 'article', 'packitem']},
            {_id: '5cd2b643fd333616dc360b67', name: 'Print Transportdocuments', fromTbls: ['collipack']},
            {_id: '5cd2b642fd333616dc360b65', name: 'Certificates', fromTbls: ['po', 'sub', 'certificate']},
            {_id: '5cd2b644fd333616dc360b69', name: 'Suppliers', fromTbls: ['supplier']},
            {_id: '5ea8eefb7c213e2096462a2c', name: 'Stock Management', fromTbls: ['po', 'location']},
            {_id: '5eb0f60ce7179a42f173de47', name: 'Goods Receipt with PO', fromTbls: ['po', 'location']},
            {_id: '5ea911747c213e2096462d79', name: 'Goods Receipt with NFI', fromTbls: ['po', 'sub', 'location']},
            {_id: '5ea919727c213e2096462e3f', name: 'Goods Receipt with PL', fromTbls: ['po', 'sub', 'packitem', 'location']},
            {_id: '5ed1e76e7c213e044cc01884', name: 'Material Issue Record', fromTbls: ['mir']},
            {_id: '5ed1e7a67c213e044cc01888', name: 'Material Issue Record Splitwindow', fromTbls: ['miritem', 'po']},
            {_id: '5ed8f4ce7c213e044cc1c1a9', name: 'Picking Ticket', fromTbls: ['mir', 'pickticket', 'location', 'po']},
            {_id: '5ed8f4f37c213e044cc1c1af', name: 'Picking Ticket Splitwindow', fromTbls: ['area', 'location', 'mir', 'miritem', 'pickitem', 'po']},

            {_id: '5ee60fbb7c213e044cc480e4', name: 'WH Assign Transport', fromTbls: ['po', 'sub', 'article', 'packitem', 'certificate']},
            {_id: '5ee60fd27c213e044cc480e7', name: 'WH Assign Transport SplitWindow', fromTbls: ['po', 'sub', 'article', 'packitem']},
            {_id: '5ee60fe87c213e044cc480ea', name: 'WH Print Transportdocuments', fromTbls: ['collipack']},
            // {_id: '5cd2b643fd333616dc360b68', name: 'Data Upload File', fromTbls: ['packitem', 'collipack']}, //what is this screen Dave?
            // {_id: '5cd2b644fd333616dc360b6a', name: 'Delete Items', fromTbls: []}, //what is this screen Dave?
            // {_id: '5cd2b644fd333616dc360b6b', name: 'Projects', fromTbls: []}, //main screen no need to customise
            // {_id: '5cd2b645fd333616dc360b6c', name: 'Screens', fromTbls: []}, //screen from config no need to customise
            // {_id: '5cd2b646fd333616dc360b6d', name: 'DUF Fields', fromTbls: []}, //see DUF screen in config
            // {_id: '5cd2b646fd333616dc360b6e', name: 'Fields', fromTbls: []}, //screen from config no need to customise
            // {_id: '5cd2b646fd333616dc360b6f', name: 'Documents', fromTbls: []}, //screen from config no need to customise
            // {_id: '5cd2b647fd333616dc360b73', name: 'Performance Report', fromTbls: ['po']}, //this does not change 
        ]
            

        return (
            
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Select Screen</span>
                        </div>
                        <select className="form-control mr-2" name="selectedScreen" value={selectedScreen} onChange={this.handleChangeScreen}>
                            {this.generateScreensOptions(screens)}
                        </select>
                        <div className="pull-right"> {/* col-12 text-right */}
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Add Field" onClick={event => this.toggleNewRow(event)} style={{height: '34px'}}>
                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" title="Delete Field(s)" onClick={event => this.handleDelete(event, selectedRows)} style={{height: '34px'}}>
                                <span><FontAwesomeIcon icon={deleting ? "spinner" : "trash-alt"} className={deleting ? "fa-pulse fa-fw fa-lg mr-2" : "fa-lg mr-2"}/>Delete</span>
                            </button>                                     
                        </div>
                    </div>
                </div>
            <div className="" style={{height: 'calc(100% - 44px)'}}>
                <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                        <table className="table table-bordered table-sm text-nowrap table-striped" id="screensTable">
                            <thead>
                                <tr>
                                    <TableSelectionAllRow
                                        checked={selectAllRows}
                                        onChange={this.toggleSelectAllRow}
                                    />
                                    <HeaderInput
                                        type="text"
                                        title="Field"
                                        name="custom"
                                        value={custom}
                                        onChange={this.handleChangeHeader}
                                        width="calc(45% - 30px)"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                    />
                                    <HeaderInput
                                        type="number"
                                        title="For Show"
                                        name="forShow"
                                        value={forShow}
                                        onChange={this.handleChangeHeader}
                                        width ="15%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                    />                                
                                    <HeaderInput
                                        type="number"
                                        title="For Select"
                                        name="forSelect"
                                        value={forSelect}
                                        onChange={this.handleChangeHeader}
                                        width ="15%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                    />                                 
                                    <HeaderSelect
                                        title="Location"
                                        name="align"
                                        value={align}
                                        options={arrAlign}
                                        optionText="name"
                                        onChange={this.handleChangeHeader}
                                        width ="15%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                    />                         
                                    <HeaderCheckBox 
                                        title="Disable"
                                        name="edit"
                                        value={edit}
                                        onChange={this.handleChangeHeader}
                                        width ="10%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {newRow &&
                                    <tr
                                        // onBlur={this.onBlurRow}
                                        // onFocus={this.onFocusRow}
                                        data-type="newrow"
                                    >
                                        <NewRowCreate
                                            onClick={ event => this.createNewRow(event)}
                                        />
                                        <NewRowSelect 
                                            fieldName="fieldId"
                                            fieldValue={fieldName.fieldId}
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={generateFromTbls(screens, selectedScreen)}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />
                                        <NewRowInput
                                            fieldType="number"
                                            fieldName="forShow"
                                            fieldValue={fieldName.forShow}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}

                                        />
                                        <NewRowInput
                                            fieldType="number"
                                            fieldName="forSelect"
                                            fieldValue={fieldName.forSelect}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />                                      
                                        <NewRowSelect 
                                            fieldName="align"
                                            fieldValue={fieldName.align}
                                            options={arrAlign}
                                            optionText="name"
                                            fromTbls={[]}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />
                                        <NewRowCheckBox
                                            name="edit"
                                            checked={fieldName.edit}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />
                                    </tr>                               
                                }
                                {fieldnames.items && fields.items && this.filterName(fieldnames.items).map((s) =>
                                    <tr
                                        key={s._id}
                                        // onBlur={this.onBlurRow}
                                        // onFocus={this.onFocusRow}
                                    >
                                        <TableSelectionRow
                                            id={s._id}
                                            selectAllRows={selectAllRows}
                                            selectedRows={selectedRows}
                                            callback={this.updateSelectedRows}
                                        />
                                        <TableSelect 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="fieldId"
                                            fieldValue={s.fieldId}
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={generateFromTbls(screens, selectedScreen)}
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forShow"
                                            fieldValue={s.forShow}
                                            fieldType="number"
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forSelect"
                                            fieldValue={s.forSelect}
                                            fieldType="number"
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableSelect 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="align"
                                            fieldValue={s.align}
                                            options={arrAlign}
                                            optionText="name"
                                            fromTbls={[]}
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableCheckBox 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="edit"
                                            fieldValue={s.edit}
                                            fieldType="checkbox"
                                            refreshStore={refreshFieldnames}
                                        />
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Screens;