import React, { Component } from 'react';
import config from 'config';
// import { saveAs } from 'file-saver';
import { authHeader } from '../../_helpers';
import HeaderInput from '../../_components/project-table/header-input';
import TableInput from '../../_components/project-table/table-input';
import Modal from "../../_components/modal";
import TableSelectionRow from '../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { AST_SwitchBranch } from 'terser';
// import { isThisISOWeek } from 'date-fns/esm';
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

function sortCustom(array, headersForShow, sort) {
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
            default: return array;
        }
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
            sort: {
                name: '',
                isAscending: true,
            },
            selectedRows: [],
            selectAllRows: false,
            isEqual: false,
            showModalUpload: false,
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
        this.toggleSort = this.toggleSort.bind(this);
        this.resetHeaders = this.resetHeaders.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.toggleEqual = this.toggleEqual.bind(this);
        this.filterName = this.filterName.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.toggleModalUpload = this.toggleModalUpload.bind(this);
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

        if (selectedRows != prevState.selectedRows || screenBodys != prevProps.screenBodys) {
            updateSelectedIds(getTableIds(selectedRows, screenBodys));
        }
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

    resetHeaders(event) {
        event.preventDefault();
        let tmpObj = this.state.header;
        Object.keys(tmpObj).forEach(function(index) {
            tmpObj[index] = ''
        });
        this.setState({
            // ...this.state,
            header: tmpObj,
            sort: {
                name: '',
                isAscending: true
            }
        });
    }

    handleChangeHeader(event) {
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const { header } = this.state;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            // ...this.state,
            header:{
                ...header,
                [name]: value
            }
        });
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

    filterName(screenBodys){
        const {header, isEqual, sort} = this.state;
        const { screenHeaders, settingsFilter } = this.props
        if (screenBodys) {
            return sortCustom(screenBodys, screenHeaders, sort).filter(function (element) {
                return screenHeaders.reduce(function(acc, cur){
                    if (!!acc) {
                        let matchingCol = element.fields.find(e => _.isEqual(e.fieldName, cur.fields.name));
                        let matchingFilter = settingsFilter.find(e => _.isEqual(e.name, cur.fields.name));
                        if (!_.isUndefined(matchingCol) && !doesMatch(header[cur._id], matchingCol.fieldValue, cur.fields.type, isEqual)) {
                            acc = false;
                        }

                        if (!_.isUndefined(matchingCol) && !_.isUndefined(matchingFilter) && !doesMatch(matchingFilter.value, matchingCol.fieldValue, matchingFilter.type, matchingFilter.isEqual)) {
                            acc = false;
                        }
                    }
                    return acc;
                }, true);
            });
        } else {
            return [];
        }
    }

    generateHeader(screenHeaders) {
        const {header, sort, selectAllRows} = this.state;
        const tempInputArray = []
        
        screenHeaders.map(screenHeader => {
            tempInputArray.push(
                <HeaderInput
                    type={screenHeader.fields.type === 'Number' ? 'number' : 'text' }
                    title={screenHeader.fields.custom}
                    name={screenHeader._id}
                    value={header[screenHeader._id]}
                    onChange={this.handleChangeHeader}
                    key={screenHeader._id}
                    sort={sort}
                    toggleSort={this.toggleSort}
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
        const { selectAllRows, selectedRows } = this.state;
        let tempRows = [];

        this.filterName(screenBodys).map(screenBody => {
            let tempCol = [];
            screenBody.fields.map(function (field, index) {
                // if (field.objectId || field.parentId) {
                    tempCol.push(
                        <TableInput
                            collection={field.collection}
                            objectId={field.objectId}
                            parentId={field.parentId}
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
                // } else {
                //     tempCol.push(<td key={index}></td>) 
                // }
            });
            tempRows.push(
                <tr key={screenBody._id}>
                    <TableSelectionRow
                        id={screenBody._id}
                        selectAllRows={selectAllRows}
                        selectedRows={selectedRows}
                        callback={this.updateSelectedRows}
                    />
                    {tempCol}
                </tr>
            );
        });
        return tempRows;
    }

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
            handleDeleteRows,
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
                    <button className="btn btn-outline-leeuwen-blue" title="Delete Line(s)" onClick={handleDeleteRows} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="trash-alt" className="fas fa-2x"/></span>
                    </button>
                </div>

                <div className="row ml-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
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
                                            <span><FontAwesomeIcon icon={uploading ? 'spinner' : 'upload'} className={uploading ? 'fa-pulse fa-lg fa-fw' : 'fa-lg mr-2'}/>Upload</span>
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