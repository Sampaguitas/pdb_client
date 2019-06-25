import React from 'react';
import { connect } from 'react-redux';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelect from '../../../../_components/project-table/table-select';
import TableSelectionRow from '../../../../_components/project-table/table-selection-row';
import TableCheckBox from '../../../../_components/project-table/table-check-box';
import _ from 'lodash';

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
                console.log('array:', typeof(String(array)));
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
                if(search == 'any' || _.isEqual(search, array)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

class Screens extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            align: 'any',
            edit: 1,
            forSelect: '',
            forShow: '',
            screenId: '',
            fieldId: '',
            custom: '',
            selectedScreen:'5cd2b643fd333616dc360b66',
            loaded: false,
            show: false,
            selectedRows: [],
            selectAllRows: false,
        }
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.toggleRow = this.toggleRow.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.handleChangeScreen = this.handleChangeScreen.bind(this);
    }

    toggleRow(event, Id) {
        event.preventDefault();
        const { selectedRows } = this.state;
        if (selectedRows.includes(Id)) {
                this.setState({
                    ...this.state,
                    selectedRows: arrayRemove(selectedRows, Id)
                });
        } else {
            this.setState({
                ...this.state,
                selectedRows: [...selectedRows, Id]
            });
        }
    }
    
	toggleSelectAllRow() {
        event.preventDefault();
        // let newSelectedRows = {};
        const { selectedRows, selectAllRows } = this.state;
        const { selection } = this.props;

		if (this.state.selectAllRows) {
            this.setState({
                selectedRows: [],
                selectAllRows: !selectAllRows
            });
		} else {
            this.setState({
                selectedRows: this.filterName(selection.project.fieldnames).map(s => s._id),
                selectAllRows: !selectAllRows
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

    handleChangeScreen(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value,
            selectedRows: []
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
        } = this.state;

        if (array) {
          return arraySorted(array, 'fields.custom').filter(function (element) {
            return (doesMatch(selectedScreen, element.screenId, 'Id')
            && doesMatch(custom, element.fields.custom, 'String')
            && doesMatch(forShow, element.forShow, 'Number')
            && doesMatch(forSelect, element.forSelect, 'Number')
            && doesMatch(align, element.align, 'Select')
            // && doesMatch(edit, element.edit, 'Boolean')
            );
          });
        } else {
            return [];
        }
    }

    render() {
        const {
            selection, 
            tab,
            screens,
        } = this.props;
        
        const {
            align,
            edit,
            forSelect,
            forShow,
            screenId,
            fieldId,
            custom,
            selectedScreen,
            selectedRows
        } = this.state;


        const arrAlign = [
            { _id: 'left', name: 'Left' },
            { _id: 'center', name: 'Center' },
            { _id: 'right', name: 'Right' },
        ]
        console.log('render called');
        return (
            
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
            <div className="row full-height">
                <div className="table-responsive full-height">
                    <table className="table table-hover table-sm table-bordered" >
                        <thead>
                            <tr className="text-center">
                                <th colSpan="6" >
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Select Screen</span>
                                        </div>
                                        <select className="form-control" name="selectedScreen" value={selectedScreen} onChange={this.handleChangeScreen}>
                                            {
                                                screens.items && arraySorted(screens.items, "name").map((screen) =>  {        
                                                    return (
                                                        <option 
                                                            key={screen._id}
                                                            value={screen._id}>{screen.name}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <th style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}>
                                    <TableSelectionRow
                                        // style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}
                                            checked={this.selectAllRows}
                                            onChange={(event) => { this.toggleSelectAllRow(event) } }
                                    />
                                </th>
                                <th>Field<br/>
                                    <input className="form-control" name="custom" value={custom} onChange={this.handleChangeHeader} />
                                </th>
                                <th style={{width: '15%'}}>For Show<br/>
                                    <input type="number" min="0" step="1" className="form-control" name="forShow" value={forShow} onChange={this.handleChangeHeader} />
                                </th>
                                <th style={{width: '15%'}}>For Select<br/>
                                    <input type="number" min="0" step="1" className="form-control" name="forSelect" value={forSelect} onChange={this.handleChangeHeader} />
                                </th>
                                <th scope="col" style={{width: '15%'}}>Align<br />
                                    <select className="form-control" name="align" value={align} onChange={this.handleChangeHeader}>
                                        <option key="0" value="any">Any</option>
                                        <option key="1" value="left">Left</option>
                                        <option key="2" value="center">Center</option>
                                        <option key="3" value="right">Right</option>                     
                                    </select>
                                </th>
                                <th scope="col" style={{width: '10%'}}>Disable<br />
                                    <select className="form-control" name="edit" value={edit} onChange={this.handleChangeHeader}>
                                        <option key="1" value="1">Any</option>
                                        <option key="2" value="2">True</option> 
                                        <option key="3" value="3">False</option>                    
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="full-height" style={{overflowY:'auto'}}>
                            {selection && selection.project && this.filterName(selection.project.fieldnames).map((s) =>
                                <tr key={s._id}>
                                    <td style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}>
                                        <TableSelectionRow
                                        // style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}
                                            checked={selectedRows.includes(s._id)}
                                            onChange={(event) => { this.toggleRow(event, s._id) } }
                                        />
                                    </td>
                                    {/* <td>{s.fields.custom}</td> */}
                                    <TableSelect 
                                        collection="fieldname"
                                        objectId={s._id}
                                        fieldName="fieldId"
                                        fieldValue={s.fieldId}
                                        options={selection.project.fields}
                                        optionText="custom"                                  
                                    />
                                    {/* <td>{s.forShow}</td> */}
                                    <TableInput 
                                        collection="fieldname"
                                        objectId={s._id}
                                        fieldName="forShow"
                                        fieldValue={s.forShow}
                                        fieldType="number"
                                    />
                                    {/* <td>{s.forSelect}</td> */}
                                    <TableInput 
                                        collection="fieldname"
                                        objectId={s._id}
                                        fieldName="forSelect"
                                        fieldValue={s.forSelect}
                                        fieldType="number"
                                    />
                                    {/* <td>{s.align}</td> */}
                                    <TableSelect 
                                        collection="fieldname"
                                        objectId={s._id}
                                        fieldName="align"
                                        fieldValue={s.align}
                                        options={arrAlign}
                                        optionText="name"                                  
                                    />
                                    {/* <td>{s.edit}</td> */}
                                    <TableCheckBox 
                                        collection="fieldname"
                                        objectId={s._id}
                                        fieldName="edit"
                                        fieldValue={s.edit}
                                        fieldType="checkbox"
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

export default Screens;