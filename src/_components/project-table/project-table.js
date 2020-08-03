import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import {
    arrayRemove,
    sortCustom,
    doesMatch,
    getTableIds,
} from '../../_functions';
import HeaderInput from '../../_components/project-table/header-input';
import TableInput from '../../_components/project-table/table-input';
import TableSelectionAllRow from '../../_components/project-table/table-selection-all-row';
import TableSelectionRow from '../../_components/project-table/table-selection-row';
import { Modal } from "../../_components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

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
            // showModalUpload: false,
            // fileName: '',
            // inputKey: Date.now(),
            // uploading: false,
            // downloading: false,
            // responce:{},
            alert: {
                type:'',
                message:''
            },
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
        this.keyHandler = this.keyHandler.bind(this);
        
        // this.fileInput = React.createRef();
        // this.onKeyPress = this.onKeyPress.bind(this);
        // this.toggleModalUpload = this.toggleModalUpload.bind(this);
        // this.handleUploadFile = this.handleUploadFile.bind(this);
        // this.handleFileChange = this.handleFileChange.bind(this);
        // this.generateRejectionRows = this.generateRejectionRows.bind(this);
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
            let tableIds = getTableIds(selectedRows, screenBodys);
            if (_.isEmpty(tableIds.tableIds)) {
                this.setState({ selectAllRows: false });
            }
            updateSelectedIds(tableIds.tableIds);
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
            header: tmpObj,
            sort: {
                name: '',
                isAscending: true
            }
        });
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const { header } = this.state;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
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
        const { colDoubleClick, setColWidth, settingsColWidth} = this.props;
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
                    index={screenHeader._id}
                    colDoubleClick={colDoubleClick}
                    setColWidth={setColWidth}
                    settingsColWidth={settingsColWidth}
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
        const { unlocked, refreshStore, settingsColWidth } = this.props;
        const { selectAllRows, selectedRows } = this.state;
        let tempRows = [];
        if (screenBodys) {
            this.filterName(screenBodys).map(screenBody => {
                let tempCol = [];
                screenBody.fields.map(function (field, index) {
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
                                index={field.screenheaderId}
                                settingsColWidth={settingsColWidth}
                            />
                        );                        
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
        }
        return tempRows;
    }

    // toggleModalUpload() {
    //     const { showModalUpload } = this.state;
    //     this.setState({
    //         ...this.state,
    //         showModalUpload: !showModalUpload,
    //         fileName: '',
    //         inputKey: Date.now(),
    //         uploading: false,
    //         downloading: false,
    //         responce:{},
    //         alert: {
    //             type:'',
    //             message:''
    //         }
    //     });
    // }

    // onKeyPress(event) {
    //     if (event.which === 13 /* prevent form submit on key Enter */) {
    //       event.preventDefault();
    //     }
    // }

    // handleUploadFile(event){
    //     event.preventDefault();
    //     const { fileName } = this.state
    //     const { projectId, screenId, refreshStore } = this.props;
    //     if(this.fileInput.current.files[0] && projectId && screenId && fileName) {
    //         this.setState({...this.state, uploading: true});
    //         var data = new FormData()
    //         data.append('file', this.fileInput.current.files[0]);
    //         data.append('projectId', projectId);
    //         data.append('screenId', screenId);
    //         const requestOptions = {
    //             method: 'POST',
    //             headers: { ...authHeader()}, //, 'Content-Type': 'application/json'
    //             body: data
    //         }
    //         return fetch(`${config.apiUrl}/extract/upload`, requestOptions)
    //         .then(responce => responce.text().then(text => {
    //             const data = text && JSON.parse(text);
    //             if (!responce.ok) {
    //                 if (responce.status === 401) {
    //                     localStorage.removeItem('user');
    //                     location.reload(true);
    //                 }
    //                 this.setState({
    //                     ...this.state,
    //                     uploading: false,
    //                     responce: {
    //                         rejections: data.rejections,
    //                         nProcessed: data.nProcessed,
    //                         nRejected: data.nRejected,
    //                         nEdited: data.nEdited
    //                     },
    //                     alert: {
    //                         type: responce.status === 200 ? 'alert-success' : 'alert-danger',
    //                         message: data.message
    //                     }
    //                 }, refreshStore);
    //             } else {
    //                 this.setState({
    //                     ...this.state,
    //                     uploading: false,
    //                     responce: {
    //                         rejections: data.rejections,
    //                         nProcessed: data.nProcessed,
    //                         nRejected: data.nRejected,
    //                         nEdited: data.nEdited
    //                     },
    //                 }, refreshStore);
    //             }
    //         }));            
    //     }        
    // }

    // handleFileChange(event){
    //     if(event.target.files.length > 0) {
    //         this.setState({
    //             ...this.state,
    //             fileName: event.target.files[0].name
    //         });
    //     }
    // }

    // generateRejectionRows(responce){
    //     let temp =[]
    //     if (!_.isEmpty(responce.rejections)) {
    //         responce.rejections.map(function(r, index) {
    //             temp.push(
    //             <tr key={index}>
    //                 <td>{r.row}</td>
    //                 <td>{r.reason}</td>
    //             </tr>   
    //             );
    //         });
    //         return (temp);
    //     } else {
    //         return (
    //             <tr>
    //                 <td></td>
    //                 <td></td>
    //             </tr>
    //         );
    //     }
    // }

    render() {

        const { 
            toggleSettings,
            handleDeleteRows,
            deletingRows,
            toggleUnlock,
            downloadTable,
            downloadingTable,
            screenId,
            screenHeaders, 
            screenBodys, 
            unlocked,
            refreshStore,
            //---------upload------
            toggleModalUpload,
        } = this.props;
        
        const { 
            // showModalUpload,
            // fileName,
            // responce,
            // uploading,
            isEqual,            
            // downloading,
            alert
        } = this.state;

        return (
            <div className="full-height">
                <div className="btn-group-vertical pull-right" style={{marginLeft: '5px'}}>
                    <button className="btn btn-outline-leeuwen-blue" title="Configs" onClick={event => toggleSettings(event)} style={{width: '40px', height: '40px'}}> 
                        <span><FontAwesomeIcon icon="cog" className="fa fa-2x"/></span>
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
                        <span><FontAwesomeIcon icon={unlocked ? "unlock" : "lock"} className="fa fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title="Download" onClick={event => downloadTable(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon={downloadingTable ? "spinner" : "download"} className={downloadingTable ? "fa-pulse fa-fw fa-2x": "fa fa-2x"}/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title="Upload" onClick={event => toggleModalUpload(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="upload" className="fa fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" title={screenId == '5ea8eefb7c213e2096462a2c' ? "Undo Transaction": "Delete Line(s)"} onClick={handleDeleteRows} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon={deletingRows ? "spinner" : "trash-alt"} className={deletingRows ? "fa-pulse fa-fw fa-2x": "fa fa-2x"}/></span>
                    </button>
                </div>

                <div className="row ml-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                    <div className="table-responsive custom-table-container custom-table-container__fixed-row" > 
                        <table className="table table-bordered table-sm text-nowrap table-striped" id="myProjectTable">
                            <thead>                                   
                                {screenHeaders && this.generateHeader(screenHeaders)}
                            </thead>                                
                            <tbody className="full-height">
                                {this.generateBody(screenBodys)}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* <Modal
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
                            <div className="action-row row ml-1 mb-3 mr-1" >
                                <form
                                    className="col-12"
                                    encType="multipart/form-data"
                                    onSubmit={this.handleUploadFile}
                                    onKeyPress={this.onKeyPress}
                                    style={{marginLeft:'0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}
                                >

                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Select File:</span>
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
                </Modal> */}
                
            </div>
        );
    }
}

export default ProjectTable;