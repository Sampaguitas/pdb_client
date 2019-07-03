import React from 'react';
import { connect } from 'react-redux';
import config from 'config';
import { saveAs } from 'file-saver';
import { authHeader } from '../../../../_helpers';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelect from '../../../../_components/project-table/table-select';
import TableCheckBox from '../../../../_components/project-table/table-check-box';
import TableSelectionRow from '../../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function docConf(array) {
    const tpeOf = [
        '5d1927131424114e3884ac80', //PL01 Packing List
        '5d1927141424114e3884ac84', //SM01 Shipping Mark
        '5d1927131424114e3884ac81', //PN01 Packing Note
        '5d1927141424114e3884ac83' //SI01 Shipping Invoice
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

function doesMatch(search, array, type) {
    if (!search) {
        return true;
    } else if (!array && search) {
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
                if (Number(search) == 1) {
                    return true; //any
                } else if (Number(search) == 2) {
                    return !!array == 1; //true
                } else if (Number(search) == 3) {
                    return !!array == 0; //false
                }
            case 'Select':
                if(search.toLowerCase() == 'any' || _.isEqual(search, array)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

class Documents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            row: '',
            col: '',
            custom: '',
            param: '',
            description:'',
            selectedTemplate:'0',
            multi: false,
            selectedRows: [],
            selectAllRows: false,
            fileName:'',
            inputKey: Date.now()
        }
        this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        // this.handleChangeField = this.handleChangeFields.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.handleDownloadFile = this.handleDownloadFile.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.handleFileChange=this.handleFileChange.bind(this);
        this.fileInput = React.createRef();
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        //this.docConf = this.docConf.bind(this);
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
        alert(
            `Selected file - ${
                this.fileInput.current.files[0].name
            }`
        );        
    }

    handleDownloadFile(event) {
        event.preventDefault();
        const { selection, handleSelectionReload } = this.props;
        const { selectedTemplate } = this.state;
        if (selection.project) {
            let obj = findObj(selection.project.docdefs,selectedTemplate);
             if (obj) {
                const requestOptions = {
                    method: 'GET',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    // body: `{"file":"${obj.field}","project":"${selection.project.number}"}`
                };
                return fetch(`${config.apiUrl}/template/download?project=${selection.project.number}&file=${obj.field}`, requestOptions)
                    .then(data => {
                        saveAs(new Blob([data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}), obj.field);
                    });
             }
        }
    }

    handleFileChange(event){
        if(event.target.files.length > 0) {
            this.setState({
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


    handleChangeTemplate(event) {
        const { selection } = this.props;
        // const { selectedTemplate } = this.state;
        // const target = event.target;
        // const name = target.name;
        const value =  event.target.value;
        this.setState({
            ...this.state,
            selectedTemplate: value,
            selectedRows: [],
            selectAllRows: false,
            inputKey: Date.now(),
            fileName:''
        }, () => {
            
            if (selection.project) {
                let obj = findObj(selection.project.docdefs,value);
                if (obj) {
                    this.setState({
                        fileName: obj.field
                    });
                    if (!!obj.col2){
                        this.setState({
                            multi: true
                        });
                    } else {
                        this.setState({
                            multi: false
                        })
                    }
                }
            }
        });
    }
    
    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { selection } = this.props;
        if (selection.project) {
            if (selectAllRows) {
                this.setState({
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    selectedRows: this.filterName(selection.project.docfields).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
    }
    
    filterName(array){
        
        const { 
            location,
            row,
            col,
            custom,
            param,
            selectedTemplate,
        } = this.state;

        if (array) {
          return arraySorted(array, 'fields.custom').filter(function (element) {
            return (doesMatch(selectedTemplate, element.docdefId, 'Id')
            && doesMatch(location, element.location, 'Select')
            && doesMatch(row, element.row, 'Number')
            && doesMatch(col, element.col, 'Number')
            && doesMatch(custom, element.fields.custom, 'String')
            );
          });
        } else {
            return [];
        }
    }

    render() {

        const { 
            tab,
            selection,
            handleDeleteDocDef,
            handleDeleteDocFields,
        } = this.props
        
        const {
            location,
            row,
            col,
            custom,
            param,
            description,
            selectedTemplate,
            selectAllRows,
            fileName,
            multi
        } = this.state;

        const ArrLocation = [
            { _id: 'Header', location: 'Header'},
            { _id: 'Line', location: 'Line'}
        ]

        const ArrSheet = [
            { _id: 'Sheet1', worksheet: 'Sheet1'},
            { _id: 'Sheet2', worksheet: 'Sheet2'}
        ]
        
        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="row full-height">
                    <div className="table-responsive full-height">
                        <table className="table table-hover table-bordered table-sm" >
                            <thead>
                                <tr className="text-center">
                                    <th colSpan={multi ? '7' : '6'}>
                                        <div className="col-12 mb-3">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" style={{width: '95px'}}>Select Document</span>
                                                </div>
                                                <select className="form-control" name="selectedTemplate" value={selectedTemplate} defaultValue="0" placeholder="Select Template..." onChange={this.handleChangeTemplate}>
                                                    <option key="0" value="0">Select document...</option>
                                                {
                                                    selection.project && arraySorted(docConf(selection.project.docdefs), "name").map((p) =>  {        
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
                                                    <button className="btn btn-leeuwen-blue btn-lg">
                                                        <span><FontAwesomeIcon icon="edit" className="fa-lg"/></span>
                                                    </button>
                                                    <button className="btn btn-dark btn-lg">
                                                        <span><FontAwesomeIcon icon="plus" className="fa-lg"/></span>
                                                    </button>
                                                    <button className="btn btn-leeuwen btn-lg" onClick={ (event) => handleDeleteDocDef(event, selectedTemplate)}>
                                                        <span><FontAwesomeIcon icon="trash-alt" className="fa-lg"/></span>
                                                    </button>  
                                                </div>
                                            </div>
                                        </div>
                                        <form className="col-12 mb-3" onSubmit={this.handleUploadFile}>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    {/* <input type="file" style={{visibility: 'hidden', position: 'absolute'}}/> */}
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
                                                <div className="input-group-append">
                                                    <button type="submit" className="btn btn-outline-leeuwen-blue btn-lg">
                                                        <span><FontAwesomeIcon icon="upload" className="fa-lg mr-2"/>Upload</span>
                                                    </button>
                                                    <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={ (event) => this.handleDownloadFile(event)}>
                                                        <span><FontAwesomeIcon icon="download" className="fa-lg mr-2"/>Download</span>
                                                    </button>  
                                                </div>                                                
                                            </div>
                                        </form>
                                        <div className="col-12 text-right">
                                            {/* <div className="row"> */}
                                                <button className="btn btn-leeuwen-blue bt-lg mr-3">
                                                    <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add New Field</span>
                                                </button>                                               
                                                <button className="btn btn-leeuwen bt-lg">
                                                    <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete Fields</span>
                                                </button> 
                                            {/* </div> */}
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}>
                                        <TableSelectionAllRow
                                            checked={selectAllRows}
                                            onChange={this.toggleSelectAllRow}
                                        />
                                    </th>
                                    {multi &&
                                        <th style={{width: '15%'}}>Worksheet<br/>
                                            <select className="form-control" name="location" value={location} onChange={this.handleChangeHeader}>
                                                <option key="0" value="Any">Any</option>
                                                <option key="1" value="Sheet1">Sheet1</option>
                                                <option key="2" value="Sheet2">Sheet2</option>
                                            </select>
                                        </th>
                                    }
                                    <th style={{width: '15%'}}>Location<br/>
                                        <select className="form-control" name="location" value={location} onChange={this.handleChangeHeader}>
                                            <option key="0" value="Any">Any</option>
                                            <option key="1" value="Header">Header</option>
                                            <option key="2" value="Line">Line</option>
                                        </select>
                                    </th>
                                    <th style={{width: '15%'}}>Row<br/>
                                        <input type="number" min="0" step="1" className="form-control" name="row" value={row} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th style={{width: '15%'}}>Col<br/>
                                        <input type="number" min="0" step="1" className="form-control" name="col" value={col} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th>Field<br/>
                                        <input className="form-control" name="custom" value={custom} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th>Parameter<br/>
                                        <input className="form-control" name="param" value={param} onChange={this.handleChangeHeader} />
                                    </th>                              
                                </tr>
                            </thead>
                            <tbody className="full-height" style={{overflowY:'auto'}}>
                            {selection && selection.project && this.filterName(selection.project.docfields).map((s) =>
                                <tr key={s._id}>
                                    <td style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}>
                                        <TableSelectionRow
                                            id={s._id}
                                            selectAllRows={this.state.selectAllRows}
                                            callback={this.updateSelectedRows}
                                        />
                                    </td>
                                    {/* <td>{s.fields.custom}</td> */}
                                    {multi &&
                                        <TableSelect 
                                            collection="docfield"
                                            objectId={s._id}
                                            fieldName="worksheet"
                                            fieldValue={s.worksheet}
                                            options={ArrSheet}
                                            optionText="worksheet"                                 
                                        />
                                    }
                                    <TableSelect 
                                        collection="docfield"
                                        objectId={s._id}
                                        fieldName="location"
                                        fieldValue={s.location}
                                        options={ArrLocation}
                                        optionText="location"                                  
                                    />
                                    {/* <td>{s.forShow}</td> */}
                                    <TableInput 
                                        collection="docfield"
                                        objectId={s._id}
                                        fieldName="row"
                                        fieldValue={s.row}
                                        fieldType="number"
                                    />
                                    {/* <td>{s.forSelect}</td> */}
                                    <TableInput 
                                        collection="docfield"
                                        objectId={s._id}
                                        fieldName="col"
                                        fieldValue={s.col}
                                        fieldType="number"
                                    />
                                    {/* <td>{s.align}</td> */}
                                    <TableSelect 
                                        collection="docfield"
                                        objectId={s._id}
                                        fieldName="fieldId"
                                        fieldValue={s.fieldId}
                                        options={selection.project.fields}
                                        optionText="custom"                                  
                                    />
                                    {/* <td>{s.edit}</td> */}
                                    <TableInput 
                                        collection="docfield"
                                        objectId={s._id}
                                        fieldName="param"
                                        fieldValue={s.param}
                                        fieldType="text"
                                    />
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                </div>    
            </div>
            );
    }
}

export default Documents;