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
import TabForSelect from './tab-for-select';
import TabForShow from './tab-for-show';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

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

function doesMatch(search, array, type) {
    if (!search) {
        return true;
    } else if (!array && search != 'any' && search != 'false') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, array);
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number':
                search = String(search).replace(/([()[{*+.$^\\|?])/g, "");
                return !!String(array).match(new RegExp(search, "i"));
                //return array == Number(search);
            case 'Boolean':
                // if (Number(search) == 1) {
                //     return true; //any
                // } else if (Number(search) == 2) {
                //     return !!array == 1; //true
                // } else if (Number(search) == 3) {
                //     return !!array == 0; //false
                // }
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

// function returnScreenHeaders(selection, screenId) {
//     if (selection.project) {
//         return selection.project.fieldnames.filter(function(element) {
//             return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
//         });
//     } else {
//         return [];
//     }
// }

class ProjectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: {},
            selectedRows: [],
            selectAllRows: false,
            showModalSettings: false,
            tabs: [
                {
                    index: 0, 
                    id: 'forShow', 
                    label: 'for Show', 
                    component: TabForShow, 
                    active: true, 
                    isLoaded: false
                },
                {
                    index: 1, 
                    id: 'forSelect', 
                    label: 'for Select', 
                    component: TabForSelect, 
                    active: false, 
                    isLoaded: false
                }
            ]
        };
        
        this.resetHeaders = this.resetHeaders.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.uploadTable = this.uploadTable.bind(this);
        this.onFocusRow = this.onFocusRow.bind(this);
        this.onBlurRow = this.onBlurRow.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.filterName = this.filterName.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.matchingHeader = this.matchingHeader.bind(this);
        this.MatchingRow = this.MatchingRow.bind(this);
        this.toggleModalSettings = this.toggleModalSettings.bind(this);
        this.handleModalTabClick = this.handleModalTabClick.bind(this);
    }

    componentDidMount() {
        // this.setState({
        //     header: this.props.screenHeaders.reduce((acc,header)=>{
        //         acc[header._id] = "";
        //         return acc;
        //     },{})
        // });
    }

    resetHeaders(event) {
        event.preventDefault();
        let tmpObj = this.state.header;
        Object.keys(tmpObj).forEach(function(index) {
            tmpObj[index] = ''
        }, () => {
            this.setState({
                ...this.state,
                header: tmpObj
            });
        });
    }

    downloadTable(event){
        event.preventDefault();
        const { projectId, screenId, screen } = this.props;
        var currentDate = new Date();
        var date = currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${config.apiUrl}/extract/download?projectId=${projectId}&screenId=${screenId}`, requestOptions)
        .then(res => res.blob()).then(blob => saveAs(blob, `DOWNLOAD_${screen}_${year}_${baseTen(month+1)}_${date}.xlsx`));
    }

    uploadTable(event) {
        event.preventDefault();
        // console.log('testBodys:',this.props.testBodys);
    }

    handleChangeHeader(event) {
        event.preventDefault();
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
        }, () => {
            // for (const prop in header) {
            //     //console.log(`header.${prop} = ${header[prop]}`);
            //     var found =  this.props.screenHeaders.find(function (element) {
            //         return _.isEqual(element.fieldId, prop)
            //     })
            //     console.log('header[prop]:', header[prop])
            //     console.log('found.fields.name:', found.fields.name);
            //     console.log('type:', found.fields.type);
            //     let matchingElement = this.props.screenBodys.filter(function (element) {
            //         return _.isEqual(element.fileds.fieldName, found.fields.name)
            //     });
            //     console.log(matchingElement);
            // }
            // console.log('screenHeaders:', this.props.screenHeaders);
            // console.log('screenBodys:', this.props.screenBodys)
            // console.log('header:', this.state.header);
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
        // const { selectAllRows } = this.state;
        // const { selection } = this.props;
        // if (selection.project) {
        //     if (selectAllRows) {
        //         this.setState({
        //             ...this.state,
        //             selectedRows: [],
        //             selectAllRows: false
        //         });
        //     } else {
        //         this.setState({
        //             ...this.state,
        //             selectedRows: this.filterName(selection.project.docfields).map(s => s._id),
        //             selectAllRows: true
        //         });
        //     }         
        // }
    }

    filterName(array){
        const {header} = this.state;
        const { screenHeaders } = this.props
        if (array) {
            return array;
        //   return array.filter(function (element) {
        //     for (const prop in header) {
        //         var found =  screenHeaders.find(function (e) {
        //             return _.isEqual(e.fieldId, prop)
        //         });
        //         return (doesMatch(header[prop], element.fieldValue, found.fields.type))
        //     }
            // return (doesMatch(selectedTemplate, element.docdefId, 'Id')
            // && doesMatch(worksheet, element.worksheet, 'Select')
            // && doesMatch(location, element.location, 'Select')
            // && doesMatch(row, element.row, 'Number')
            // && doesMatch(col, element.col, 'Number')
            // && element.fields && doesMatch(custom, element.fields.custom, 'String')
            // );
        //   });
        } else {
            return [];
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

    matchingHeader(screenHeader, header){
        switch (screenHeader.fields.type) {
            case "String":
                return ( 
                    <HeaderInput
                        type="text"
                        title={screenHeader.fields.custom}
                        name={screenHeader.fieldId}
                        value={header[screenHeader.fieldId]}
                        onChange={this.handleChangeHeader}
                        key={screenHeader._id}
                    />
                );
            case "Number":
                return ( 
                    <HeaderInput
                        type="number"
                        title={screenHeader.fields.custom}
                        name={screenHeader.fieldId}
                        value={header[screenHeader.fieldId]}
                        onChange={this.handleChangeHeader}
                        key={screenHeader._id}
                    />
                );
            default: 
                return ( 
                    <HeaderInput
                        type="text"
                        title={screenHeader.fields.custom}
                        name={screenHeader.fieldId}
                        value={header[screenHeader.fieldId]}
                        onChange={this.handleChangeHeader}
                        key={screenHeader._id}
                    />
                );                                                                                                  
        }        
    }

    MatchingRow(screenBody) {
        const { unlocked } = this.props;
        const { selectAllRows } = this.state;
        return (
            <tr key={screenBody._id}>
                <TableSelectionRow
                    id={screenBody._id}
                    selectAllRows={selectAllRows}
                    callback={this.updateSelectedRows}
                />
                {screenBody.fields.map(field => {
                    if (field.objectId) {
                        return (
                            <TableInput
                                collection={field.collection}
                                objectId={field.objectId}
                                fieldName={field.fieldName}
                                fieldValue={field.fieldValue}
                                disabled={field.disabled}
                                unlocked={unlocked}
                                align={field.align}
                                fieldType={field.fieldType}
                                textNoWrap={true}
                                // key={field.key}
                            />
                        );                        
                    } else {
                        return <td></td>
                    }
                })}
            </tr>
        )
    }

    toggleModalSettings() {
        const { showModalSettings } = this.state;
        this.setState({
            showModalSettings: !showModalSettings
        });
    }


    handleModalTabClick(event, tab){
        event.preventDefault();
        // const { handleSelectionReload } = this.props
        const { tabs } = this.state; // 1. Get tabs from state
        tabs.forEach((t) => {t.active = false}); //2. Reset all tabs
        tab.isLoaded = true; // 3. set current tab as active
        tab.active = true;
        this.setState({
            tabs // 4. update state
        })
        // handleSelectionReload(event); //reload selection state

    }
    
    render() {
        const { handleSelectionReload, toggleUnlock, screenHeaders, screenBodys, unlocked } = this.props;
        const { header,selectAllRows, showModalSettings, tabs  } = this.state;
        return (
            <div className="full-height">
                <div className="btn-group-vertical pull-right" style={{marginLeft: '5px'}}>
                    <button className="btn btn-outline-leeuwen-blue" onClick={event => this.toggleModalSettings(event)} style={{width: '40px', height: '40px'}}> 
                        <span><FontAwesomeIcon icon="cog" className="fas fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" onClick={event => this.resetHeaders(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="filter" className="far fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" onClick={event => handleSelectionReload(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="sync-alt" className="far fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" onClick={event => toggleUnlock(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon={unlocked ? "unlock" : "lock"} className="fas fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" onClick={event => this.downloadTable(event)} style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="download" className="fas fa-2x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" style={{width: '40px', height: '40px'}}>
                        <span><FontAwesomeIcon icon="upload" className="fas fa-2x"/></span>
                    </button>
                </div>
                <div className="row ml-1 full-height" style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd'}}>
                    <div className="table-responsive custom-table-container" > 
                        <table className="table table-bordered table-sm text-nowrap table-striped" id="myProjectTable">
                            <thead>                                   
                                {screenHeaders && (
                                    <tr>
                                        <TableSelectionAllRow
                                            checked={selectAllRows}
                                            onChange={this.toggleSelectAllRow}
                                        />
                                        {screenHeaders.map(screenHeader => this.matchingHeader(screenHeader, header))}
                                    </tr>
                                )}
                            </thead>                                
                            <tbody className="full-height">
                                {screenBodys && this.filterName(screenBodys).map(screenBody => this.MatchingRow(screenBody))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal
                    show={showModalSettings}
                    hideModal={this.toggleModalSettings}
                    title="Table Settings"
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
                </Modal>
            </div>
        );
    }
}

export default ProjectTable;