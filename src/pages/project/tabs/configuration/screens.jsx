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
            // FromTbls: [],
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
        this.generateScreensOptions = this.generateScreensOptions.bind(this);
        this.generateFromTbls = this.generateFromTbls.bind(this);
    }

    componentDidMount() {

        const { refreshFields, refreshFieldnames } =this.props;
        //refreshStore
        refreshFields;
        refreshFieldnames;

        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const table = document.getElementById('screensTable');
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
                if(colIndex > 0 && !target.parentElement.classList.contains('isEditing')) {
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
        const { refreshFields, refreshFieldnames } = this.props;
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
                        }, refreshFieldnames);
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
                        }, refreshFieldnames);
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
        const { refreshFieldnames } = this.props;
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
                    }, refreshFieldnames);
                })
                .catch( err => {
                    this.setState({
                        ...this.state,
                        deleting: false
                    }, refreshFieldnames);
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
        const { selection, fieldnames } = this.props;
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

    handleChangeScreen(event) {
        const target = event.target;
        const name = target.name;
        const value = event.target.value;
        this.setState({
            ...this.state,
            [name]: value,
            selectedRows: [],
            selectAllRows: false
        });
    }  
    
    filterName(array){

        // const { fields } = this.props;
        
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
        //   return arraySorted(array, 'fields.custom').filter(function (element) {
            return array.filter(function (element) {
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

    generateScreensOptions(screens) {
        let tempArray=[]
        if (screens) {
            arraySorted(screens, "name").map((screen) =>  {        
                tempArray.push (
                    <option 
                        key={screen._id}
                        value={screen._id}>{screen.name}
                    </option>
                );
            });
        }
        return tempArray;
    }

    generateFromTbls(screens, selectedScreen) {
        const found = screens.find(element => element._id === selectedScreen);
        return !_.isUndefined(found) ? found.fromTbls : [];
    }

    render() {
        const {
            fieldnames,
            fields,
            // screens,
            selection, 
            tab,
            refreshFieldnames
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
            newRowColor,
            deleting
        } = this.state;

        const arrAlign = [
            { _id: 'left', name: 'Left' },
            { _id: 'center', name: 'Center' },
            { _id: 'right', name: 'Right' },
        ]

        const screens = [
            {_id: '5cd2b642fd333616dc360b63', name: 'Expediting', fromTbls: ['po', 'sub', 'packitem']},
            {_id: '5cd2b646fd333616dc360b70', name: 'Expediting Splitwindow', fromTbls: ['po', 'sub']},
            {_id: '5cd2b642fd333616dc360b64', name: 'Inspection', fromTbls: ['po', 'sub', 'certificate']},
            {_id: '5cd2b647fd333616dc360b71', name: 'Inspection Splitwindow', fromTbls: ['po', 'sub', 'certificate']},
            {_id: '5cd2b643fd333616dc360b66', name: 'Assign Transport', fromTbls: ['po', 'sub', 'article', 'packitem']},
            {_id: '5cd2b647fd333616dc360b72', name: 'Assign Transport SplitWindow', fromTbls: ['po', 'sub', 'article', 'packitem']}, // weight from table 'article' what if we dont have itemcode?
            {_id: '5cd2b643fd333616dc360b67', name: 'Print Transportdocuments', fromTbls: ['collipack']},
            {_id: '5cd2b642fd333616dc360b65', name: 'Certificates', fromTbls: ['po', 'sub', 'certificate']},
            {_id: '5cd2b643fd333616dc360b68', name: 'Data Upload File', fromTbls: ['packitem', 'collipack']}, //what is this screen Dave?
            {_id: '5cd2b644fd333616dc360b69', name: 'Suppliers', fromTbls: ['supplier']}, //do we need to edit?
            // {_id: '5cd2b644fd333616dc360b6a', name: 'Delete Items', fromTbls: []}, //what is this screen Dave?
            // {_id: '5cd2b644fd333616dc360b6b', name: 'Projects', fromTbls: []}, //main screen no need to customise
            // {_id: '5cd2b645fd333616dc360b6c', name: 'Screens', fromTbls: []}, //screen from config no need to customise
            // {_id: '5cd2b646fd333616dc360b6d', name: 'DUF Fields', fromTbls: []}, //see DUF screen in config
            // {_id: '5cd2b646fd333616dc360b6e', name: 'Fields', fromTbls: []}, //screen from config no need to customise
            // {_id: '5cd2b646fd333616dc360b6f', name: 'Documents', fromTbls: []}, //screen from config no need to customise
            // {_id: '5cd2b647fd333616dc360b73', name: 'Performance Report', fromTbls: ['po']}, //this does not change 
        ]
            

        return (
            
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Select Screen</span>
                        </div>
                        <select className="form-control mr-2" name="selectedScreen" value={selectedScreen} onChange={this.handleChangeScreen}>
                            {this.generateScreensOptions(screens)}
                        </select>
                        <div className="pull-right"> {/* col-12 text-right */}
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
                                <span>
                                    { deleting ? 
                                        <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw mr-2"/> 
                                    :
                                        <FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>
                                    }
                                    Delete Field(s)
                                </span>
                            </button>                                     
                        </div>
                    </div>
                </div>
            <div className="" style={{height: 'calc(100% - 44px)'}}>
                <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                        <table className="table table-bordered table-sm text-nowrap table-striped" id="screensTable">
                            <thead>
                                <tr>
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
                                        width="calc(45% - 30px)"
                                    />
                                    <HeaderInput
                                        type="number"
                                        title="For Show"
                                        name="forShow"
                                        value={forShow}
                                        onChange={this.handleChangeHeader}
                                        width ="15%"
                                    />                                
                                    <HeaderInput
                                        type="number"
                                        title="For Select"
                                        name="forSelect"
                                        value={forSelect}
                                        onChange={this.handleChangeHeader}
                                        width ="15%"
                                    />                                 
                                    <HeaderSelect
                                            title="Location"
                                            name="align"
                                            value={align}
                                            options={arrAlign}
                                            optionText="name"
                                            onChange={this.handleChangeHeader}
                                            width ="15%"
                                    />                         
                                    <HeaderCheckBox 
                                        title="Disable"
                                        name="edit"
                                        value={edit}
                                        onChange={this.handleChangeHeader}
                                        width ="10%"
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
                                        <NewRowSelect 
                                            fieldName="fieldId"
                                            fieldValue={fieldName.fieldId}
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={this.generateFromTbls(screens, selectedScreen)}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />
                                        <NewRowInput
                                            fieldType="number"
                                            fieldName="forShow"
                                            fieldValue={fieldName.forShow}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}

                                        />
                                        <NewRowInput
                                            fieldType="number"
                                            fieldName="forSelect"
                                            fieldValue={fieldName.forSelect}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />                                      
                                        <NewRowSelect 
                                            fieldName="align"
                                            fieldValue={fieldName.align}
                                            options={arrAlign}
                                            optionText="name"
                                            fromTbls={[]}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />
                                        <NewRowCheckBox
                                            name="edit"
                                            checked={fieldName.edit}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                        />
                                    </tr>                               
                                }
                                {fieldnames.items && fields.items && this.filterName(fieldnames.items).map((s) =>
                                    <tr key={s._id} onBlur={this.onBlurRow} onFocus={this.onFocusRow}>
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
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={this.generateFromTbls(screens, selectedScreen)}
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forShow"
                                            fieldValue={s.forShow}
                                            fieldType="number"
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forSelect"
                                            fieldValue={s.forSelect}
                                            fieldType="number"
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableSelect 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="align"
                                            fieldValue={s.align}
                                            options={arrAlign}
                                            optionText="name"
                                            fromTbls={[]}
                                            refreshStore={refreshFieldnames}
                                        />
                                        <TableCheckBox 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="edit"
                                            fieldValue={s.edit}
                                            fieldType="checkbox"
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

export default Screens;