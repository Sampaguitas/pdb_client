import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
import NewRowCreate from '../../../../_components/project-table/new-row-create';
import NewRowInput from '../../../../_components/project-table/new-row-input';
import NewRowSelect from '../../../../_components/project-table/new-row-select';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelect from '../../../../_components/project-table/table-select';
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
                if(search == 'any' || _.isEqual(search, array)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

class Duf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forSelect: '',
            screenId: '',
            fieldId: '',
            custom: '',
            selectedScreen:'5cd2b646fd333616dc360b6d',
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
        this.cerateNewRow = this.cerateNewRow.bind(this);
        this.onFocusRow = this.onFocusRow.bind(this);
        this.onBlurRow = this.onBlurRow.bind(this);
        this.toggleNewRow = this.toggleNewRow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
    }

    cerateNewRow(event) {
        event.preventDefault();
        const { handleSelectionReload } = this.props;
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
                    setTimeout(() => {
                        this.setState({
                            ...this.state,
                            newRowColor: 'inherit',
                            newRow:false,
                            fieldName:{},
                            newRowFocus: false
                        }, () => {
                            handleSelectionReload();
                        });
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
                        }, () => {
                            handleSelectionReload();
                        });
                    }, 1000);                                                       
                });
            });
        });        
    }

    onFocusRow(event) {
        event.preventDefault();
        const { selectedScreen, newRowFocus } = this.state;
        if (selectedScreen && event.currentTarget.dataset['type'] == undefined && newRowFocus == true){
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

    toggleNewRow(event) {
        event.preventDefault()
        const { newRow, selectedScreen } = this.state;
        if (!selectedScreen) {
            this.setState({
                ...this.state,
                newRow: false
            })
        } else {
            this.setState({
                ...this.state,
                newRow: !newRow
            })
        }
    }

    handleDelete(event, id) {
        event.preventDefault();
        const { handleSelectionReload } = this.props;
        if(id) {
            this.setState({
                ...this.state,
                deleting: true 
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader()},
                };
                return fetch(`${config.apiUrl}/fieldName/delete?id=${JSON.stringify(id)}`, requestOptions)
                .then( () => {
                    this.setState({
                        ...this.state,
                        deleting: false
                    },
                    () => {
                        handleSelectionReload();
                    });
                })
                .catch( err => {
                    console.log(err),
                    this.setState({
                        ...this.state,
                        deleting: false
                    },
                    ()=> {
                        handleSelectionReload();
                    });
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
        //event.preventDefault();
        const { selectAllRows } = this.state;
        const { selection } = this.props;
        if (selection.project) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(selection.project.fieldnames).map(s => s._id),
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
    
    filterName(array){
        
        const { 
            forShow,
            custom,
            selectedScreen,
        } = this.state;

        if (array) {
          return arraySorted(array, 'fields.custom').filter(function (element) {
            return (doesMatch(selectedScreen, element.screenId, 'Id')
            && element.fields && doesMatch(custom, element.fields.custom, 'String')
            && doesMatch(forShow, element.forShow, 'Number')
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
        } = this.props;
        
        const {
            forShow,
            screenId,
            fieldId,
            custom,
            selectedScreen,
            selectedRows,
            selectAllRows,
            fieldName,
            newRow,
            newRowColor
        } = this.state;

        return ( 
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
            <div className="row full-height">
                <div className="table-responsive full-height">
                    <table className="table table-hover table-bordered table-sm" >
                        <thead>
                            <tr className="text-center">
                                <th colSpan="3" >
                                    <div className="col-12 text-right">
                                        <button className="btn btn-leeuwen-blue bt-lg mr-3" onClick={event => this.toggleNewRow(event)}>
                                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add New Field</span>
                                        </button>
                                        <button className="btn btn-leeuwen bt-lg" onClick={ (event) => this.handleDelete(event, selectedRows)}>
                                            <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete Fields</span>
                                        </button>                                     
                                    </div>                                  
                                </th>
                            </tr>
                            <tr>
                                <TableSelectionAllRow
                                    checked={selectAllRows}
                                    onChange={this.toggleSelectAllRow}                                        
                                />
                                <th style={{width: '15%'}}>Column<br/>
                                    <input type="number" min="0" step="1" className="form-control" name="forShow" value={forShow} onChange={this.handleChangeHeader} />
                                </th>
                                <th>Field<br/>
                                    <input className="form-control" name="custom" value={custom} onChange={this.handleChangeHeader} />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="full-height" style={{overflowY:'auto'}}>
                            {newRow && 
                                <tr onBlur={this.onBlurRow} onFocus={this.onFocusRow} data-type="newrow" style={{height: '40px', lineHeight: '17.8571px'}}>
                                    {/* <td style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}></td> */}
                                    <NewRowCreate
                                        onClick={ event => this.cerateNewRow(event)}
                                    />                                    
                                    <NewRowInput
                                        type="number"
                                        name="forShow"
                                        value={fieldName.forShow}
                                        onChange={event => this.handleChangeNewRow(event)}
                                        color={newRowColor}
                                    />
                                    <NewRowSelect 
                                        name="fieldId"
                                        value={fieldName.fieldId}
                                        options={selection && selection.project && selection.project.fields}
                                        optionText="custom"
                                        onChange={event => this.handleChangeNewRow(event)}
                                        color={newRowColor}
                                    />
                                </tr>                            
                            }
                            {selection && selection.project && this.filterName(selection.project.fieldnames).map((s) =>
                                <tr key={s._id} onBlur={this.onBlurRow} onFocus={this.onFocusRow} style={{height: '40px', lineHeight: '17.8571px'}}>
                                    <TableSelectionRow
                                        id={s._id}
                                        selectAllRows={this.state.selectAllRows}
                                        callback={this.updateSelectedRows}
                                    />                                  
                                    <TableInput 
                                        collection="fieldname"
                                        objectId={s._id}
                                        fieldName="forShow"
                                        fieldValue={s.forShow}
                                        fieldType="number"
                                    />
                                    <TableSelect 
                                        collection="fieldname"
                                        objectId={s._id}
                                        fieldName="fieldId"
                                        fieldValue={s.fieldId}
                                        options={selection.project.fields}
                                        optionText="custom"                                  
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

export default Duf;