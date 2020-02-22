import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
import HeaderInput from '../../../../_components/project-table/header-input';
import HeaderSelect from '../../../../_components/project-table/header-select';
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
                if(search == 'any') {
                    return true; //any or equal
                } else if (search == 'true' && !!array) {
                    return true; //true
                } else if (search == 'false' && !array) {
                    return true; //true
                } else {
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

class Duf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forShow: '',
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

    componentDidMount() {
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const table = document.getElementById('dufTable');
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
        const { fieldnames } = this.props;
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


    
    filterName(array){
        const { 
            forShow,
            custom,
            selectedScreen,
        } = this.state;

        if (array) {
        //   return arraySorted(array, 'forShow').filter(function (element) {
            return array.filter(function (element) {
            return (doesMatch(selectedScreen, element.screenId, 'Id')
            && element.fields && doesMatch(custom, element.fields.custom, 'String')
            && doesMatch(forShow, element.forShow, 'Number')
            );
          });
        } else {
            return [];
        }
    }

    // selectableOptions(fields, fromTbls) {
    //     if (fields.items) {
    //         return fields.items.reduce(f => {
    //             return fromTbls.indexOf(f.fromTbl);
    //         });
    //     }
    // }

    render() {

        const {
            fieldnames,
            fields,
            selection, 
            tab,
            refreshFieldnames,
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
                <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                    <div className="ml-auto pull-right">
                        <button
                            className="btn btn-leeuwen-blue btn-lg mr-2"
                            onClick={event => this.toggleNewRow(event)}
                            style={{height: '34px'}}
                        >
                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add Field</span>
                        </button>
                        <button
                            className="btn btn-leeuwen btn-lg"
                            onClick={ (event) => this.handleDelete(event, selectedRows)}
                            style={{height: '34px'}}
                        >
                            <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete Fields</span>
                        </button>
                    </div>
                </div>
            <div className="" style={{height: 'calc(100% - 44px)'}}>
                <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                        <table className="table table-bordered table-sm text-nowrap table-striped" id="dufTable" >
                            <thead>
                                <tr>
                                    <TableSelectionAllRow
                                        checked={selectAllRows}
                                        onChange={this.toggleSelectAllRow}                                        
                                    />
                                    <HeaderInput
                                        type="number"
                                        title="Column"
                                        name="forShow"
                                        value={forShow}
                                        onChange={this.handleChangeHeader}
                                        width="calc(15% - 30px)"
                                    />                                
                                    <HeaderInput
                                        type="text"
                                        title="Field"
                                        name="custom"
                                        value={custom}
                                        onChange={this.handleChangeHeader}
                                        width="85%"
                                    />                
                                </tr>
                            </thead>
                            <tbody>
                                {newRow && 
                                    <tr
                                        onBlur={this.onBlurRow}
                                        onFocus={this.onFocusRow}
                                        data-type="newrow"
                                    >
                                        <NewRowCreate
                                            onClick={ event => this.cerateNewRow(event)}
                                        />                                    
                                        <NewRowInput
                                            fieldType="number"
                                            fieldName="forShow"
                                            fieldValue={fieldName.forShow}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />
                                        <NewRowSelect 
                                            fieldName="fieldId"
                                            fieldValue={fieldName.fieldId}
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={['po', 'sub']}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />
                                    </tr>                            
                                }
                                {fieldnames.items && this.filterName(fieldnames.items).map((s) =>
                                    <tr key={s._id} onBlur={this.onBlurRow} onFocus={this.onFocusRow}>
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
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableSelect 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="fieldId"
                                            fieldValue={s.fieldId}
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={['po', 'sub']}
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

export default Duf;