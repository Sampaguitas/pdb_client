import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
import HeaderCheckBox from '../../../../_components/project-table/header-check-box';
import HeaderInput from '../../../../_components/project-table/header-input';
import HeaderSelect from '../../../../_components/project-table/header-select';
import NewRowCreate from '../../../../_components/project-table/new-row-create';
import NewRowCheckBox from '../../../../_components/project-table/new-row-check-box';
import NewRowInput from '../../../../_components/project-table/new-row-input';
import NewRowSelect from '../../../../_components/project-table/new-row-select';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelect from '../../../../_components/project-table/table-select';
import TableCheckBox from '../../../../_components/project-table/table-check-box';
import TableSelectionRow from '../../../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

class Screens extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            align: '',
            edit: '',
            forSelect: '',
            forShow: '',
            screenId: '',
            fieldId: '',
            custom: '',
            selectedScreen:'5cd2b643fd333616dc360b66',
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
        this.handleChangeScreen = this.handleChangeScreen.bind(this);
        this.filterName = this.filterName.bind(this);
    }

    getTblBound() {
        const tblContainer = document.getElementById("tblScreensContainer");
        if (!tblContainer) {
            return {};
        }
        const rect = tblContainer.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top + window.scrollY,
            width: rect.width || rect.right - rect.left,
            height: rect.height || rect.bottom - rect.top
        };
    }    

    getScrollWidthY() {
        var scroll = document.getElementById("tblScreensBody");
        if (!scroll) {
            return 0;
        } else {
            if(scroll.clientHeight == scroll.scrollHeight){
                return 0;
            } else {
                return 15;
            }
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
                    setTimeout( () => {
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

    toggleNewRow(event) {
        event.preventDefault()
        const { newRow, selectedScreen } = this.state;
        if (!selectedScreen) {
            this.setState({
                ...this.state,
                newRow: false
            });
        } else {
            this.setState({
                ...this.state,
                newRow: !newRow
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

    handleChangeScreen(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value,
            selectedRows: [],
            selectAllRows: false
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
            && element.fields && doesMatch(custom, element.fields.custom, 'String')
            && doesMatch(forShow, element.forShow, 'Number')
            && doesMatch(forSelect, element.forSelect, 'Number')
            && doesMatch(align, element.align, 'Select')
            && doesMatch(edit, element.edit, 'Boolean')
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
            selectedRows,
            selectAllRows,
            fieldName,
            newRow,
            newRowColor
        } = this.state;

        const arrAlign = [
            { _id: 'left', name: 'Left' },
            { _id: 'center', name: 'Center' },
            { _id: 'right', name: 'Right' },
        ]

        const tblBound = this.getTblBound();
        const tblScrollWidth = this.getScrollWidthY();

        return (
            
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
            <div className="row full-height">
                <div className="table-responsive full-height" id="tblScreensContainer">
                    <table className="table table-hover table-bordered table-sm" >
                        <thead>
                            <tr
                                className="text-center"
                                style={{
                                    //display: tblBound.width ? 'block' : 'table-row',
                                    height: '45px'
                                }}
                            >
                                <th colSpan="6" >
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Select Screen</span>
                                        </div>
                                        <select className="form-control mr-2" name="selectedScreen" value={selectedScreen} onChange={this.handleChangeScreen}>
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
                                        <div className="pull-right"> {/* col-12 text-right */}
                                            <button 
                                                className="btn btn-leeuwen-blue bt-lg mr-2"
                                                onClick={event => this.toggleNewRow(event)}
                                                style={{height: '34px'}}
                                            >
                                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add New Field</span>
                                            </button>
                                            <button
                                                className="btn btn-leeuwen bt-lg"
                                                onClick={ (event) => this.handleDelete(event, selectedRows)}
                                                style={{height: '34px'}}
                                            >
                                                <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete Fields</span>
                                            </button>                                     
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr
                                style={{
                                    display: tblBound.width ? 'block' : 'table-row',
                                    height: '63px'
                                }}
                            >
                                <TableSelectionAllRow
                                    checked={selectAllRows}
                                    onChange={this.toggleSelectAllRow}
                                />
                                <HeaderInput
                                    type="text"
                                    title="Field"
                                    name="custom"
                                    value={custom}
                                    onChange={this.handleChangeHeader}
                                    width={tblBound.width ? `${tblBound.width*0.45-30+ 'px'}`: 'calc(45% - 30px)'}
                                />
                                <HeaderInput
                                    type="number"
                                    title="For Show"
                                    name="forShow"
                                    value={forShow}
                                    onChange={this.handleChangeHeader}
                                    width ={tblBound.width ? `${tblBound.width*0.15+ 'px'}`: '15%'}
                                />                                
                                <HeaderInput
                                    type="number"
                                    title="For Select"
                                    name="forSelect"
                                    value={forSelect}
                                    onChange={this.handleChangeHeader}
                                    width ={tblBound.width ? `${tblBound.width*0.15+ 'px'}`: '15%'}
                                />                                 
                                <HeaderSelect
                                        title="Location"
                                        name="align"
                                        value={align}
                                        options={arrAlign}
                                        optionText="name"
                                        onChange={this.handleChangeHeader}
                                        width ={tblBound.width ? `${tblBound.width*0.15+ 'px'}`: '15%'}                                        
                                />                         
                                <HeaderCheckBox 
                                    title="Disable"
                                    name="edit"
                                    value={edit}
                                    onChange={this.handleChangeHeader}
                                    width ={tblBound.width ? `${tblBound.width*0.10+ 'px'}`: '10%'}
                                />
                            </tr>
                        </thead>
                        {tblBound.width ?
                            <tbody style={{display:'block', height: `${tblBound.height-12-45-63 + 'px'}`, overflow:'auto'}}  id="tblScreensBody">
                                {newRow &&
                                    <tr onBlur={this.onBlurRow} onFocus={this.onFocusRow} data-type="newrow"> {/*style={{height: '40px', lineHeight: '17.8571px'}}*/}
                                        <NewRowCreate
                                            onClick={ event => this.cerateNewRow(event)}
                                        />
                                        <NewRowSelect 
                                            name="fieldId"
                                            value={fieldName.fieldId}
                                            options={selection && selection.project && selection.project.fields}
                                            optionText="custom"
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            width={tblBound.width ? `${tblBound.width*0.45-30 + 'px'}`: 'calc(45% - 30px)'}
                                        />
                                        <NewRowInput
                                            type="number"
                                            name="forShow"
                                            value={fieldName.forShow}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            width={tblBound.width ? `${tblBound.width*0.15 + 'px'}`: '15%'}

                                        />
                                        <NewRowInput
                                            type="number"
                                            name="forSelect"
                                            value={fieldName.forSelect}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            width={tblBound.width ? `${tblBound.width*0.15 + 'px'}`: '15%'}
                                        />                                      
                                        <NewRowSelect 
                                            name="align"
                                            value={fieldName.align}
                                            options={arrAlign}
                                            optionText="name"
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            width={tblBound.width ? `${tblBound.width*0.15 + 'px'}`: '15%'}
                                        />
                                        <NewRowCheckBox
                                            name="edit"
                                            checked={fieldName.edit}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            width={tblBound.width ? `${tblBound.width*0.10-tblScrollWidth + 'px'}`: '10%'}
                                        />
                                    </tr>                               
                                }
                                {selection && selection.project && this.filterName(selection.project.fieldnames).map((s) =>
                                    <tr key={s._id} onBlur={this.onBlurRow} onFocus={this.onFocusRow}> {/*style={{height: '40px', lineHeight: '17.8571px'}}*/}
                                        <TableSelectionRow
                                            id={s._id}
                                            selectAllRows={this.state.selectAllRows}
                                            callback={this.updateSelectedRows}
                                        />
                                        <TableSelect 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="fieldId"
                                            fieldValue={s.fieldId}
                                            options={selection.project.fields}
                                            optionText="custom"
                                            width={tblBound.width ? `${tblBound.width*0.45-30 + 'px'}`: 'calc(45% - 30px)'}                                  
                                        />
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forShow"
                                            fieldValue={s.forShow}
                                            fieldType="number"
                                            width={tblBound.width ? `${tblBound.width*0.15 + 'px'}`: '15%'}
                                        />
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forSelect"
                                            fieldValue={s.forSelect}
                                            fieldType="number"
                                            width={tblBound.width ? `${tblBound.width*0.15 + 'px'}`: '15%'}
                                        />
                                        <TableSelect 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="align"
                                            fieldValue={s.align}
                                            options={arrAlign}
                                            optionText="name"
                                            width={tblBound.width ? `${tblBound.width*0.15 + 'px'}`: '15%'}                                 
                                        />
                                        <TableCheckBox 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="edit"
                                            fieldValue={s.edit}
                                            fieldType="checkbox"
                                            width={tblBound.width ? `${tblBound.width*0.10-tblScrollWidth + 'px'}`: '10%'}
                                        />
                                    </tr>
                                )}
                            </tbody>
                        :
                            <tbody />
                        }

                    </table>
                </div>
            </div> 
        </div>
        );
    }
}

export default Screens;