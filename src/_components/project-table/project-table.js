import React, { Component } from 'react';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import HeaderCheckBox from '../../_components/project-table/header-check-box';
import HeaderInput from '../../_components/project-table/header-input';
import HeaderSelect from '../../_components/project-table/header-select';
import NewRowCreate from '../../_components/project-table/new-row-create';
import NewRowCheckBox from '../../_components/project-table/new-row-check-box';
import NewRowInput from '../../_components/project-table/new-row-input';
import NewRowSelect from '../../_components/project-table/new-row-select';
import TableInput from '../../_components/project-table/table-input';
import TableSelect from '../../_components/project-table/table-select';
import TableCheckBox from '../../_components/project-table/table-check-box';
import TableSelectionRow from '../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function returnScreenHeaders(selection, screenId) {
    if (selection.project) {
        return selection.project.fieldnames.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
        });
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
        };
        this.resetHeaders = this.resetHeaders.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.onFocusRow = this.onFocusRow.bind(this);
        this.onBlurRow = this.onBlurRow.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.filterName = this.filterName.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.matchingHeader = this.matchingHeader.bind(this);
        this.matchingField = this.matchingField.bind(this);
        this.matchingRow = this.matchingRow.bind(this);
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
        const { screen } = this.props;
        var currentDate = new Date();
        var date = currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        var wb = XLSX.utils.table_to_book(document.getElementById('myProjectTable')); //, {sheet:screen}
        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `DOWNLOAD_${screen}_${year}_${baseTen(month+1)}_${date}.xlsx`);
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    }

    handleChangeHeader(event) {
        event.preventDefault();
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
        
        // const {
        //     header
        // } = this.state;

        // if (array) {
        //   return arraySorted(array, 'fields.custom').filter(function (element) {
        //     return (doesMatch(selectedTemplate, element.docdefId, 'Id')
        //     && doesMatch(worksheet, element.worksheet, 'Select')
        //     && doesMatch(location, element.location, 'Select')
        //     && doesMatch(row, element.row, 'Number')
        //     && doesMatch(col, element.col, 'Number')
        //     && element.fields && doesMatch(custom, element.fields.custom, 'String')
        //     );
        //   });
        // } else {
        //     return [];
        // }
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
                        name={screenHeader._id}
                        value={header[screenHeader._id]}
                        onChange={this.handleChangeHeader}
                        key={screenHeader._id}
                    />
                );
            case "Number":
                return ( 
                    <HeaderInput
                        type="number"
                        title={screenHeader.fields.custom}
                        name={screenHeader._id}
                        value={header[screenHeader._id]}
                        onChange={this.handleChangeHeader}
                        key={screenHeader._id}
                    />
                );
            default: 
                return ( 
                    <HeaderInput
                        type="text"
                        title={screenHeader.fields.custom}
                        name={screenHeader._id}
                        value={header[screenHeader._id]}
                        onChange={this.handleChangeHeader}
                        key={screenHeader._id}
                    />
                );                                                                                                  
        }        
    }

    matchingField(screenBody, screenHeader, sub) {
        const { unlocked } = this.props;
        if (screenHeader.fields.fromTbl == "po") {
            switch (screenHeader.fields.type) {
                case "String":
                    return ( 
                        <TableInput
                            collection={screenHeader.fields.fromTbl}
                            objectId={screenBody._id}
                            fieldName={screenHeader.fields.name}
                            fieldValue={screenBody[screenHeader.fields.name]}
                            disabled={screenHeader.edit}
                            unlocked={unlocked}
                            align={screenHeader.align}
                            fieldType="text"
                            textNoWrap={true}
                            key={screenHeader._id}
                        />
                    );                    
                case "Number":
                    return ( 
                        <TableInput
                            collection={screenHeader.fields.fromTbl}
                            objectId={screenBody._id}
                            fieldName={screenHeader.fields.name}
                            fieldValue={screenBody[screenHeader.fields.name]}
                            disabled={screenHeader.edit}
                            unlocked={unlocked}
                            align={screenHeader.align}
                            fieldType="number"
                            textNoWrap={true}
                            key={screenHeader._id}
                        />
                    ); 
                case "Date":
                    return ( 
                        <TableInput
                            collection={screenHeader.fields.fromTbl}
                            objectId={screenBody._id}
                            fieldName={screenHeader.fields.name}
                            fieldValue={screenBody[screenHeader.fields.name]}
                            disabled={screenHeader.edit}
                            unlocked={unlocked}
                            align={screenHeader.align}
                            fieldType="date"
                            textNoWrap={true}
                            key={screenHeader._id}
                        />
                    ); 
                case "Boolean":
                    return ( 
                        <TableCheckBox
                            collection={screenHeader.fields.fromTbl}
                            objectId={screenBody._id}
                            fieldName={screenHeader.fields.name}
                            fieldValue={screenBody[screenHeader.fields.name]}
                            disabled={screenHeader.edit}
                            unlocked={unlocked}
                            align={screenHeader.align}
                            key={screenHeader._id}
                        />
                    );
                default: 
                return ( 
                    <TableInput
                        collection={screenHeader.fields.fromTbl}
                        objectId={screenBody._id}
                        fieldName={screenHeader.fields.name}
                        fieldValue={screenBody[screenHeader.fields.name]}
                        disabled={screenHeader.edit}
                        unlocked={unlocked}
                        align={screenHeader.align}
                        fieldType="text"
                        textNoWrap={true}
                        key={screenHeader._id}
                    />
                );
            }                 
        } else if (screenHeader.fields.fromTbl == "sub") {
            switch (screenHeader.fields.type) {
                case "String":
                    return ( 
                        <TableInput
                            collection={screenHeader.fields.fromTbl}
                            objectId={sub._id}
                            fieldName={screenHeader.fields.name}
                            fieldValue={sub[screenHeader.fields.name]}
                            disabled={screenHeader.edit}
                            unlocked={unlocked}
                            align={screenHeader.align}
                            fieldType="text"
                            textNoWrap={true}
                            key={screenHeader._id}
                        />
                    );                    
                case "Number":
                    return ( 
                        <TableInput
                            collection={screenHeader.fields.fromTbl}
                            objectId={sub._id}
                            fieldName={screenHeader.fields.name}
                            fieldValue={sub[screenHeader.fields.name]}
                            disabled={screenHeader.edit}
                            unlocked={unlocked}
                            align={screenHeader.align}
                            fieldType="number"
                            textNoWrap={true}
                            key={screenHeader._id}
                        />
                    ); 
                case "Date":
                    return ( 
                        <TableInput
                            collection={screenHeader.fields.fromTbl}
                            objectId={sub._id}
                            fieldName={screenHeader.fields.name}
                            fieldValue={sub[screenHeader.fields.name]}
                            disabled={screenHeader.edit}
                            unlocked={unlocked}
                            align={screenHeader.align}
                            fieldType="date"
                            textNoWrap={true}
                            key={screenHeader._id}
                        />
                    ); 
                case "Boolean":
                    return ( 
                        <TableCheckBox
                            collection={screenHeader.fields.fromTbl}
                            objectId={sub._id}
                            fieldName={screenHeader.fields.name}
                            fieldValue={sub[screenHeader.fields.name]}
                            disabled={screenHeader.edit}
                            unlocked={unlocked}
                            key={screenHeader._id}
                        />
                    );
                default: 
                return ( 
                    <TableInput
                        collection={screenHeader.fields.fromTbl}
                        objectId={sub._id}
                        fieldName={screenHeader.fields.name}
                        fieldValue={sub[screenHeader.fields.name]}
                        disabled={screenHeader.edit}
                        unlocked={unlocked}
                        align={screenHeader.align}
                        fieldType="text"
                        textNoWrap={true}
                        key={screenHeader._id}
                    />
                );
            }         
        } else {
            return <td></td>
        }

    }

    matchingRow(screenBody){
        const { screenHeaders } = this.props
        if(screenBody.subs){
            return screenBody.subs.map(sub => {
                return  (
                    <tr key={sub._id} onBlur={this.onBlurRow} onFocus={this.onFocusRow}> {/*style={{height: '30px', lineHeight: '17.8571px'}}*/}
                        <TableSelectionRow
                            id={sub._id}
                            selectAllRows={this.state.selectAllRows}
                            callback={this.updateSelectedRows}
                        />
                        {screenHeaders.map(screenHeader => this.matchingField(screenBody, screenHeader, sub))}
                    </tr>                
                );
    
            })
        }
    }
    
    render() {
        const { handleSelectionReload, toggleUnlock, screenHeaders, screenBodys, unlocked } = this.props;
        const { header,selectAllRows  } = this.state;
        return (
            <div className="full-height">
                <div className="btn-group-vertical pull-right">
                    <button className="btn btn-outline-leeuwen-blue" style={{width: '40px', height: '40px'}}> 
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
                <div className="row ml-1 full-height">
                    <div className="table-responsive full-height" > 
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
                                {screenBodys && screenBodys.map(screenBody => this.matchingRow(screenBody))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        );
    }
}

export default ProjectTable;