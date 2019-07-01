import React from 'react';
import { connect } from 'react-redux';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelect from '../../../../_components/project-table/table-select';
import TableCheckBox from '../../../../_components/project-table/table-check-box';
import TableSelectionRow from '../../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            selectedTemplate:'',
            selectedRows: [],
            selectAllRows: false
        }
        this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
        this.handleChangeField = this.handleChangeFields.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
    }


    handleChangeTemplate(event) {
        // const target = event.target;
        // const name = target.name;
        // const value = target.type === 'checkbox' ? target.checked : target.value;
        // this.setState({
        //     ...this.state,
        //     [name]: value,
        //     selectedRows: [],
        //     selectAllRows: false
        // });
    }

    handleChangeFields(event) {
        // const target = event.target;
        // const name = target.name;
        // const value = target.type === 'checkbox' ? target.checked : target.value;
        // this.setState({
        //     ...this.state,
        //     [name]: value,
        //     selectedRows: [],
        //     selectAllRows: false
        // });
    }
    
    toggleSelectAllRow() {
        // const { selectAllRows } = this.state;
        // const { selection } = this.props;
        // if (selection.project) {
        //     if (selectAllRows) {
        //         this.setState({
        //             selectedRows: [],
        //             selectAllRows: false
        //         });
        //     } else {
        //         this.setState({
        //             selectedRows: this.filterName(selection.project.docdefs).map(s => s._id),
        //             selectAllRows: true
        //         });
        //     }         
        // }
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

        // if (array) {
        //   return arraySorted(array, 'fields.custom').filter(function (element) {
        //     return (doesMatch(selectedTemplate, element.screenId, 'Id')
        //     && doesMatch(custom, element.fields.custom, 'String')
        //     && doesMatch(forShow, element.forShow, 'Number')
        //     && doesMatch(forSelect, element.forSelect, 'Number')
        //     && doesMatch(align, element.align, 'Select')
        //     // && doesMatch(edit, element.edit, 'Boolean')
        //     );
        //   });
        // } else {
        //     return [];
        // }
    }

    render() {

        const { 
            tab,
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
        } = this.state;

        
        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="row full-height">
                    <div className="table-responsive full-height">
                        <table className="table table-hover table-bordered table-sm" >
                            <thead>
                                <tr className="text-center">
                                    <th colSpan="6" >
                                        <div className="col-12 mb-3">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" style={{width: '95px'}}>Select Document</span>
                                                </div>
                                                <select className="form-control" name="selectedTemplate" value={selectedTemplate} placeholder="Select Template..." onChange={this.handleChangeTemplate}>
                                                {/*Options*/}
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
                                        <div className="col-12 mb-3">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <input type="file" style={{visibility: 'hidden', position: 'absolute'}}/>
                                                    <span className="input-group-text" style={{width: '95px'}}>Select Template</span>
                                                    <input type="file" className="custom-file-input" id="validatedCustomFile" style={{display: 'none'}}required></input>
                                                </div>
                                                {/* <div className="custom-file">
                                                    <input type="file" className="custom-file-input" id="validatedCustomFile" required></input>
                                                    <label className="custom-file-label" for="validatedCustomFile">Choose file...</label>
                                                </div> */}
                                                <label type="text" className="form-control text-left" name="description" for="validatedCustomFile" style={{display:'inline-block', padding: '7px'}}>Choose file...</label>
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-leeuwen-blue btn-lg">
                                                        <span><FontAwesomeIcon icon="upload" className="fa-lg mr-2"/>Upload</span>
                                                    </button>
                                                    <button className="btn btn-outline-leeuwen-blue btn-lg">
                                                        <span><FontAwesomeIcon icon="download" className="fa-lg mr-2"/>Download</span>
                                                    </button>  
                                                </div>                                                
                                            </div>
                                        </div>
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
                                            selectAllRows={selectAllRows}
                                            toggleSelectAllRow={this.toggleSelectAllRow}
                                            selectedTemplate={selectedTemplate}
                                        />
                                    </th>
                                    <th>Location<br/>
                                        <input className="form-control" name="location" value={location} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th>Section/Row<br/>
                                        <input className="form-control" name="row" value={row} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th>Col<br/>
                                        <input className="form-control" name="col" value={col} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th>Field<br/>
                                        <input className="form-control" name="custom" value={custom} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th>Parameter<br/>
                                        <input className="form-control" name="param" value={param} onChange={this.handleChangeHeader} />
                                    </th>                              
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>    
            </div>
            );
    }
}

export default Documents;