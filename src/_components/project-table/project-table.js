import React, { Component } from 'react';
//import XLSX from 'xlsx';
// import Excel from 'exceljs';
import config from 'config';
import { saveAs } from 'file-saver';
import { authHeader } from '../../_helpers';
import HeaderCheckBox from '../../_components/project-table/header-check-box';
import HeaderInput from '../../_components/project-table/header-input';
import HeaderSelect from '../../_components/project-table/header-select';
import NewRowCreate from '../../_components/project-table/new-row-create';
import NewRowCheckBox from '../../_components/project-table/new-row-check-box';
import NewRowInput from '../../_components/project-table/new-row-input';
import NewRowSelect from '../../_components/project-table/new-row-select';
import TableInput from '../../_components/project-table/table-input';
import Modal from "../../_components/modal";
import TableSelect from '../../_components/project-table/table-select';
import TableCheckBox from '../../_components/project-table/table-check-box';
import TableSelectionRow from '../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../_components/project-table/table-selection-all-row';
// import TabDisplay from '../setting/tab-display';
// import TabFilter from '../setting/tab-filter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import { AST_SwitchBranch } from 'terser';
import { isThisISOWeek } from 'date-fns/esm';
import moment from 'moment';

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


function baseTen(number) {
    return number.toString().length > 2 ? number : '0' + number;
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

function doesMatch(search, array, type, isEqual) {
    
    if (!search) {
        return true;
    } else if (!array && search != 'any' && search != 'false') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, array);
            case 'String':
                if(isEqual) {
                    return _.isEqual(array.toUpperCase(), search.toUpperCase());
                } else {
                    // console.log('array.toUpperCase():', array.toUpperCase());
                    // console.log('search.toUpperCase():', search.toUpperCase());

                    return array.toUpperCase().includes(search.toUpperCase());
                }
            case 'Date':
                if (isEqual) {
                    return _.isEqual(TypeToString(array, 'date', getDateFormat(myLocale)), search);
                } else {
                    return TypeToString(array, 'date', getDateFormat(myLocale)).includes(search);
                }
            case 'Number':
                if (isEqual) {
                    return _.isEqual( Intl.NumberFormat().format(array).toString(), Intl.NumberFormat().format(search).toString());
                } else {
                    return Intl.NumberFormat().format(array).toString().includes(Intl.NumberFormat().format(search).toString());
                }
            case 'Boolean':
                if(search == 'any') {
                    return true; //any or equal
                } else if (search == 'true' && !!array) {
                    return true; //true
                } else if (search == 'false' && !array) {
                    return true; //true
                }else {
                    return false;
                }
            case 'Select':
                if(search == 'any' || _.isEqual(search, array)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

function getTableIds(selectedRows, screenBodys) {
    if (screenBodys) {
        
        let filtered = screenBodys.filter(function (s) {
            return selectedRows.includes(s._id);
        });
        
        return filtered.reduce(function (acc, cur) {
            
            if(!acc.includes(cur.tablesId)) {
                acc.push(cur.tablesId);
            }
            return acc;
        }, []);

    } else {
        return [];
    }
}

class ProjectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: {},
            selectedRows: [],
            selectAllRows: false,
            // showModalSettings: false,
            isEqual: false,
            showModalUpload: false,
            // tabs: [
            //     {
            //         index: 0, 
            //         id: 'filter',
            //         label: 'Filter', 
            //         component: TabFilter, 
            //         active: true, 
            //         isLoaded: false
            //     },
            //     {
            //         index: 1, 
            //         id: 'display',
            //         label: 'Display', 
            //         component: TabDisplay, 
            //         active: false, 
            //         isLoaded: false
            //     }
            // ],
            fileName: '',
            inputKey: Date.now(),
            uploading: false,
            downloading: false,
            responce:{},
            alert: {
                type:'',
                message:''
            }
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.resetHeaders = this.resetHeaders.bind(this);
        // this.downloadTable = this.downloadTable.bind(this);
        this.onFocusRow = this.onFocusRow.bind(this);
        this.onBlurRow = this.onBlurRow.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.toggleEqual = this.toggleEqual.bind(this);
        this.filterName = this.filterName.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        // this.matchingRow = this.matchingRow.bind(this);
        // this.toggleModalSettings = this.toggleModalSettings.bind(this);
        this.toggleModalUpload = this.toggleModalUpload.bind(this);
        // this.handleModalTabClick = this.handleModalTabClick.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.fileInput = React.createRef();
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.generateRejectionRows = this.generateRejectionRows.bind(this);
    }

    componentDidMount() {
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const table = document.getElementById('myProjectTable');
        table.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { selectedRows } = this.state;
        const { screenBodys, updateSelectedIds } = this.props;
        if (selectedRows !== prevState.selectedRows) {
            updateSelectedIds(getTableIds(selectedRows, screenBodys));
        }

        // if (screenBodys !== prevProps.screenBodys) {
        //     this.setState({
        //         selectAllRows: false
        //     });
        // }
        
    }

    handleClearAlert(event){
        event.preventDefault;
        this.setState({
            ...this.state,
            alert: {
                type:'',
                message:'' 
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
                if(colIndex > 1 && !target.parentElement.classList.contains('isEditing')) {
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

    resetHeaders(event) {
        event.preventDefault();
        let tmpObj = this.state.header;
        Object.keys(tmpObj).forEach(function(index) {
            tmpObj[index] = ''
        });
        this.setState({
            ...this.state,
            header: tmpObj
        });
    }

    handleChangeHeader(event) {
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const { header } = this.state;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            header:{
                ...header,
                [name]: value
            }
        });
    }

    onFocusRow(event) {
        // event.preventDefault();
        // const { selectedTemplate, newRowFocus } = this.state;
        // if (selectedTemplate !='0' && event.currentTarget.dataset['type'] == undefined && newRowFocus == true){
        //     this.cerateNewRow(event);
        // }
    }

    onBlurRow(event){
        // event.preventDefault()
        // if (event.currentTarget.dataset['type'] == 'newrow'){
        //     this.setState({
        //         ...this.state,
        //         newRowFocus: true
        //     });
        // }
    }

    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { screenBodys } = this.props;
        if (!_.isEmpty(screenBodys)) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(screenBodys).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
    }

    toggleEqual(event) {
        event.preventDefault();
        const { isEqual } = this.state;
        this.setState({
            ...this.state,
            isEqual: !isEqual
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

    filterName(array){
        const {header, isEqual} = this.state;
        const { screenHeaders } = this.props
        if (array) {
            return array.filter(function (element) {
                let conditionMet = true;
                for (const prop in header) {
                    var fieldName =  screenHeaders.find(function (el) {
                        return _.isEqual(el._id, prop)
                    });
                    let matchingCol = element.fields.find(function (col) {
                        return _.isEqual(col.fieldName, fieldName.fields.name);
                    });
                    if (!doesMatch(header[prop], matchingCol.fieldValue, fieldName.fields.type, isEqual)) {
                        conditionMet = false;
                    }
                }
                return conditionMet;
            });
        } else {
            return [];
        }
    }

    generateHeader(screenHeaders) {
        const {header, selectAllRows} = this.state;
        const tempInputArray = []
        
        screenHeaders.map(screenHeader => {
            tempInputArray.push(
                <HeaderInput
                    type= {screenHeader.fields.type === 'Number' ? 'number' : 'text' }
                    title={screenHeader.fields.custom}
                    // name={screenHeader.fieldId}
                    name={screenHeader._id}
                    // value={header[screenHeader.fieldId]}
                    value={header[screenHeader._id]}
                    onChange={this.handleChangeHeader}
                    key={screenHeader._id}
                />
            );
        });

        return (
            <tr>
                <TableSelectionAllRow
                    checked={selectAllRows}
                    onChange={this.toggleSelectAllRow}
                />
                {tempInputArray}
            </tr>
        );
    }

    generateBody(screenBodys) {
        const { unlocked, refreshStore } = this.props;
        const { selectAllRows } = this.state;
        let tempRows = [];

        this.filterName(screenBodys).map(screenBody => {
            let tempCol = [];
            screenBody.fields.map(function (field, index) {
                if (field.objectId || field.parentId) {
                    tempCol.push(
                        <TableInput
                            collection={field.collection}
                            objectId={field.objectId}
                            parentId={field.parentId} //<--------parentId
                            fieldName={field.fieldName}
                            fieldValue={field.fieldValue}
                            disabled={field.disabled}
                            unlocked={unlocked}
                            align={field.align}
                            fieldType={field.fieldType}
                            textNoWrap={true}
                            key={index}
                            refreshStore={refreshStore}
                        />
                    );                        
                } else {
                    tempCol.push(<td key={index}></td>) 
                }
            });
            tempRows.push(
                <tr key={screenBody._id}>
                    <TableSelectionRow
                        id={screenBody._id}
                        selectAllRows={selectAllRows}
                        callback={this.updateSelectedRows}
                    />
                    {tempCol}
                </tr>
            );
        });
        return tempRows;
    }

    // toggleModalSettings() {
    //     const { showModalSettings } = this.state;
    //     this.setState({
    //         ...this.state,
    //         showModalSettings: !showModalSettings
    //     });
    // }

    toggleModalUpload() {
        const { showModalUpload } = this.state;
        this.setState({
            ...this.state,
            showModalUpload: !showModalUpload,
            fileName: '',
            inputKey: Date.now(),
            uploading: false,
            downloading: false,
            responce:{},
            alert: {
                type:'',
                message:''
            }
        });
    }

    // handleModalTabClick(event, tab){
    //     event.preventDefault();
    //     const { tabs } = this.state; // 1. Get tabs from state
    //     tabs.forEach((t) => {t.active = false}); //2. Reset all tabs
    //     tab.isLoaded = true; // 3. set current tab as active
    //     tab.active = true;
    //     this.setState({
    //         ...this.state,
    //         tabs // 4. update state
    //     })
    // }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
          event.preventDefault();
        }
    }

    handleUploadFile(event){
        event.preventDefault();
        const { fileName } = this.state
        const { projectId, screenId, refreshStore } = this.props;
        if(this.fileInput.current.files[0] && projectId && screenId && fileName) {
            this.setState({...this.state, uploading: true});
            var data = new FormData()
            data.append('file', this.fileInput.current.files[0]);
            data.append('projectId', projectId);
            data.append('screenId', screenId);
            const requestOptions = {
                method: 'POST',
                headers: { ...authHeader()}, //, 'Content-Type': 'application/json'
                body: data
            }
            return fetch(`${config.apiUrl}/extract/upload`, requestOptions)
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
                        uploading: false,
                        responce: {
                            rejections: data.rejections,
                            nProcessed: data.nProcessed,
                            nRejected: data.nRejected,
                            nEdited: data.nEdited
                        },
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, refreshStore);
                } else {
                    this.setState({
                        ...this.state,
                        uploading: false,
                        responce: {
                            rejections: data.rejections,
                            nProcessed: data.nProcessed,
                            nRejected: data.nRejected,
                            nEdited: data.nEdited
                        },
                    }, refreshStore);
                }
            }));            
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

    generateRejectionRows(responce){
        let temp =[]
        if (!_.isEmpty(responce.rejections)) {
            responce.rejections.map(function(r, index) {
                temp.push(
                <tr key={index}>
                    <td>{r.row}</td>
                    <td>{r.reason}</td>
                </tr>   
                );
            });
            return (temp);
        } else {
            return (
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            );
        }
    }

    render() {

        const { 
            toggleSettings,
            toggleDelete,
            toggleUnlock,
            downloadTable,
            screenHeaders, 
            screenBodys, 
            unlocked,
            refreshStore,
            
        } = this.props;
        
        const { 
            header,
            selectAllRows,
            // showModalSettings, 
            showModalUpload,
            isEqual, 
            tabs,
            fileName,
            responce,
            downloading,
            uploading,
            alert
        } = this.state;

        return (
            <div className="full-height">
                <div className="btn-group-vertical pull-right" style={{marginLeft: '5px'}}>
                    <button className="btn btn-outline-leeuwen-blue" title="Configs" onClick={event => toggleSettings(event)} style={{width: '40px', height: '40px'}}> 
                        <span><FontAwesomeIcon icon="cog" className="fas fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title="Refresh" onClick={refreshStore} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="sync-alt" className="far fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title="Clear Filters" onClick={event => this.resetHeaders(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="filter" className="far fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title={isEqual ? 'Equal (Filters)' : 'Contain (Filters)'} onClick={event => this.toggleEqual(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon={isEqual ? 'equals' : 'brackets-curly'} className="far fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title="Unlock Cells" onClick={event => toggleUnlock(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon={unlocked ? "unlock" : "lock"} className="fas fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title="Download" onClick={event => downloadTable(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="download" className="fas fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title="Upload" onClick={event => this.toggleModalUpload(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="upload" className="fas fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title="Delete Line(s)" onClick={toggleDelete} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="trash-alt" className="fas fa-2x"/></span>
                    </button>
                </div>

                <div className="row ml-1 full-height" style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd'}}>
                    <div className="table-responsive custom-table-container custom-table-container__fixed-row" > 
                        <table className="table table-bordered table-sm text-nowrap table-striped" id="myProjectTable">
                            <thead>                                   
                                {screenHeaders && this.generateHeader(screenHeaders)}
                            </thead>                                
                            <tbody className="full-height">
                                {screenBodys && this.generateBody(screenBodys)}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* <Modal
                    show={showModalSettings}
                    hideModal={this.toggleModalSettings}
                    title="Field Settings"
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
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Modal> */}

                <Modal
                    show={showModalUpload}
                    hideModal={this.toggleModalUpload}
                    title="Upload File"
                    size="modal-xl"
                >
                    <div className="col-12">
                            {alert.message && 
                                <div className={`alert ${alert.type}`}>{alert.message}
                                    <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                        <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                                    </button>
                                </div>
                            }
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
                                        <span className="input-group-text" style={{width: '95px'}}>Select File</span>
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
                                    <div className="input-group-append">
                                        <button type="submit" className="btn btn-outline-leeuwen-blue btn-lg">
                                            <span><FontAwesomeIcon icon={uploading ? 'spinner' : 'upload'} className={uploading ? 'fa-pulse fa-1x fa-fw' : 'fa-lg mr-2'}/>Upload</span>
                                        </button> 
                                    </div>       
                                </div>
                            </form>
                        </div>
                        {!_.isEmpty(responce) &&
                            <div className="ml-1 mr-1">
                                <div className="form-group table-resonsive">
                                    <strong>Total Processed:</strong> {responce.nProcessed}<br />
                                    <strong>Total Records Edited:</strong> {responce.nEdited}<br />
                                    <strong>Total Records Rejected:</strong> {responce.nRejected}<br />
                                    <hr />
                                </div>
                                {!_.isEmpty(responce.rejections) &&
                                    <div className="rejections">
                                        <h3>Rejections</h3>
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th style={{width: '10%'}}>Row</th>
                                                        <th style={{width: '90%'}}>Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.generateRejectionRows(responce)}
                                                </tbody>
                                            </table>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </Modal>
                
            </div>
        );
    }
}

export default ProjectTable;