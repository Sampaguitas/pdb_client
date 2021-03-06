import React from 'react';
import config from 'config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authHeader } from '../../../../_helpers';
import {
    doesMatch,
    arrayRemove,
    arraySorted,
    screenSorted,
    generateFromTbls,
    copyObject
} from '../../../../_functions';
import HeaderCheckBox from '../../../../_components/project-table/header-check-box';
import HeaderInput from '../../../../_components/project-table/header-input';
import HeaderSelect from '../../../../_components/project-table/header-select';
import NewRowCheckBox from '../../../../_components/project-table/new-row-check-box';
import NewRowCreate from '../../../../_components/project-table/new-row-create';
import NewRowInput from '../../../../_components/project-table/new-row-input';
import NewRowSelect from '../../../../_components/project-table/new-row-select';
import TableCheckBox from '../../../../_components/project-table/table-check-box';
import TableInput from '../../../../_components/project-table/table-input';
import TableSelect from '../../../../_components/project-table/table-select';
import TableSelectionAllRow from '../../../../_components/project-table/table-selection-all-row';
import TableSelectionRow from '../../../../_components/project-table/table-selection-row';
import _ from 'lodash';

class Screens extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custom: '',
            forShow: '',
            forSelect: '',
            align: '',
            edit: '',
            sort: {
                name: '',
                isAscending: true,
            },
            screenId: '',
            fieldId: '',
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
            settingsColWidth: {}
        }
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.createNewRow = this.createNewRow.bind(this);
        this.toggleNewRow = this.toggleNewRow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.handleChangeScreen = this.handleChangeScreen.bind(this);
        this.filterName = this.filterName.bind(this);
        this.generateScreensOptions = this.generateScreensOptions.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
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

    createNewRow(event) {
        event.preventDefault();
        const { refreshFields, refreshFieldnames } = this.props;
        const { creatingNewRow, fieldName } = this.state;
        if(!creatingNewRow) {
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
    }

    toggleNewRow(event) {
        event.preventDefault()
        const { newRow, selectedScreen } = this.state;
        if (!selectedScreen) {
            this.setState({
                newRow: false,
                fieldName: {}
            });
        } else {
            this.setState({
                newRow: !newRow,
                fieldName: {}
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

    handleDelete(event, selectedRows) {
        event.preventDefault();
        const { refreshFieldnames, handleSetAlert } = this.props;
        if(_.isEmpty(selectedRows)) {
            handleSetAlert('alert-danger', 'Select line(s) to be deleted.');
        } else {
            this.setState({
                ...this.state,
                deleting: true 
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedIds: selectedRows})
                };
                return fetch(`${config.apiUrl}/fieldName/delete`, requestOptions)
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
        const { 
            align,
            edit,
            forSelect,
            forShow,
            screenId,
            fieldId,
            custom,
            selectedScreen,
            sort
        } = this.state;

        if (array) {
            return screenSorted(array, sort).filter(function (element) {
                return (doesMatch(selectedScreen, element.screenId, 'Id', false)
                    && element.fields && doesMatch(custom, element.fields.custom, 'String', false)
                    && doesMatch(forShow, element.forShow, 'Number', false)
                    && doesMatch(forSelect, element.forSelect, 'Number', false)
                    && doesMatch(align, element.align, 'Select', false)
                    && doesMatch(edit, element.edit, 'Boolean', false)
                );
            });
        } else {
            return [];
        }
    }

    generateScreensOptions(screens) {
        let tempArray=[]
        if (screens) {
            screens.map((screen) =>  {        
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

    colDoubleClick(event, index) {
        event.preventDefault();
        const { settingsColWidth } = this.state;
        if (settingsColWidth.hasOwnProperty(index)) {
            let tempArray = copyObject(settingsColWidth);
            delete tempArray[index];
            this.setState({ settingsColWidth: tempArray });
        } else {
            this.setState({
                settingsColWidth: {
                    ...settingsColWidth,
                    [index]: 10
                }
            });
        }
    }

    setColWidth(index, width) {
        const { settingsColWidth } = this.state;
        this.setState({
            settingsColWidth: {
                ...settingsColWidth,
                [index]: width
            }
        });
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
            custom,
            creatingNewRow,
            forShow,
            forSelect,
            align,
            edit,
            sort,
            screenId,
            fieldId,
            selectedScreen,
            selectedRows,
            selectAllRows,
            fieldName,
            newRow,
            newRowColor,
            deleting,
            settingsColWidth
        } = this.state;

        const arrAlign = [
            { _id: 'left', name: 'Left' },
            { _id: 'center', name: 'Center' },
            { _id: 'right', name: 'Right' },
        ]

        const screens = [
            {_id: '5cd2b642fd333616dc360b63', name: 'Expediting - Expediting', fromTbls: ['po', 'sub', 'packitem', 'certificate']},
            {_id: '5cd2b646fd333616dc360b70', name: 'Expediting - Expediting Splitwindow', fromTbls: ['po', 'sub']},
            
            {_id: '5cd2b642fd333616dc360b64', name: 'Inspection - Inspection & Release data', fromTbls: ['po', 'sub', 'packitem', 'certificate']}, //Inspection
            {_id: '5cd2b647fd333616dc360b71', name: 'Inspection - Inspection & Release data Splitwindow', fromTbls: ['po', 'sub', 'certificate']}, //Inspection Splitwindow
            {_id: '5cd2b642fd333616dc360b65', name: 'Inspection - Certificates', fromTbls: ['po', 'sub', 'return', 'certificate']}, //Certificates
            
            {_id: '5cd2b643fd333616dc360b66', name: 'Shipping - Prepare transport docs', fromTbls: ['po', 'sub', 'article', 'packitem', 'certificate']}, //Assign Transport
            {_id: '5cd2b647fd333616dc360b72', name: 'Shipping - Prepare transport docs SplitWindow', fromTbls: ['po', 'sub', 'article', 'packitem']}, //Assign Transport SplitWindow
            {_id: '5cd2b643fd333616dc360b67', name: 'Shipping - Complete packing details', fromTbls: ['collipack']}, //Print Transportdocuments
            
            {_id: '5ea8eefb7c213e2096462a2c', name: 'Warehouse - Stock Management - Stock Management', fromTbls: ['po', 'location']}, //Stock Management
            {_id: '5eb0f60ce7179a42f173de47', name: 'Warehouse - Stock Management - Goods Receipt with PO', fromTbls: ['po', 'location']}, //Goods Receipt with PO
            {_id: '5ea911747c213e2096462d79', name: 'Warehouse - Stock Management - Goods Receipt with NFI', fromTbls: ['po', 'sub', 'location']}, //Goods Receipt with NFI
            {_id: '5ea919727c213e2096462e3f', name: 'Warehouse - Stock Management - Goods Receipt with PL', fromTbls: ['po', 'sub', 'packitem', 'location']}, //Goods Receipt with PL
            {_id: '5f02b878e7179a221ee2c718', name: 'Warehouse - Stock Management - Goods Receipt with RET', fromTbls: ['po', 'return', 'location']}, //Goods Receipt with RET
            {_id: '5ed1e76e7c213e044cc01884', name: 'Warehouse - Material Issue Record - Material Issue Record', fromTbls: ['mir']}, //Material Issue Record
            {_id: '5ed1e7a67c213e044cc01888', name: 'Warehouse - Material Issue Record - Material Issue Record Splitwindow', fromTbls: ['miritem', 'po']}, //Material Issue Record Splitwindow
            {_id: '5ed8f4ce7c213e044cc1c1a9', name: 'Warehouse - Picking Ticket - Picking Ticket', fromTbls: ['mir', 'pickticket', 'location', 'po']}, //Picking Ticket
            {_id: '5ed8f4f37c213e044cc1c1af', name: 'Warehouse - Picking Ticket - Picking Ticket Splitwindow', fromTbls: ['area', 'location', 'mir', 'miritem', 'pickitem', 'po']}, //Picking Ticket Splitwindow
            {_id: '5ee60fbb7c213e044cc480e4', name: 'Warehouse - Shipping - Prepare transport docs', fromTbls: ['article', 'location', 'mir', 'miritem', 'po', 'packitem', 'pickitem', 'pickticket', 'certificate']}, //WH Assign Transport
            {_id: '5ee60fd27c213e044cc480e7', name: 'Warehouse - Shipping - Prepare transport docs SplitWindow', fromTbls: ['article', 'location', 'mir', 'miritem', 'po', 'packitem', 'pickitem', 'pickticket']}, //WH Assign Transport SplitWindow
            {_id: '5ee60fe87c213e044cc480ea', name: 'Warehouse - Shipping - Complete packing details', fromTbls: ['collipack']}, //WH Print Transportdocuments
            
            {_id: '5cd2b644fd333616dc360b69', name: 'Configuration - Suppliers', fromTbls: ['supplier']},

            // {_id: '5cd2b643fd333616dc360b68', name: 'Data Upload File', fromTbls: ['packitem', 'collipack']}, //what is this screen Dave?
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
                <div className="action-row row">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Select Screen:</span>
                        </div>
                        <select className="form-control mr-2" name="selectedScreen" value={selectedScreen} onChange={this.handleChangeScreen} style={{display:'inline-block', height: '30px', padding: '5px'}}>
                            {this.generateScreensOptions(screens)}
                        </select>
                        <div className="pull-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Add Field" onClick={event => this.toggleNewRow(event)}> {/* style={{height: '34px'}} */}
                                <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Add</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" title="Delete Field(s)" onClick={event => this.handleDelete(event, selectedRows)}> {/* style={{height: '34px'}} */}
                                <span><FontAwesomeIcon icon={deleting ? "spinner" : "trash-alt"} className={deleting ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Delete</span>
                            </button>                                     
                        </div>
                    </div>
                </div>
            <div className="body-section">
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
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                        index="0"
                                        colDoubleClick={this.colDoubleClick}
                                        setColWidth={this.setColWidth}
                                        settingsColWidth={settingsColWidth}
                                    />
                                    <HeaderInput
                                        type="number"
                                        title="For Show"
                                        name="forShow"
                                        value={forShow}
                                        onChange={this.handleChangeHeader}
                                        width ="15%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                        index="1"
                                        colDoubleClick={this.colDoubleClick}
                                        setColWidth={this.setColWidth}
                                        settingsColWidth={settingsColWidth}
                                    />                                
                                    <HeaderInput
                                        type="number"
                                        title="For Select"
                                        name="forSelect"
                                        value={forSelect}
                                        onChange={this.handleChangeHeader}
                                        width ="15%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                        index="2"
                                        colDoubleClick={this.colDoubleClick}
                                        setColWidth={this.setColWidth}
                                        settingsColWidth={settingsColWidth}
                                    />                                 
                                    <HeaderSelect
                                        title="Location"
                                        name="align"
                                        value={align}
                                        options={arrAlign}
                                        optionText="name"
                                        onChange={this.handleChangeHeader}
                                        width ="15%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                        index="3"
                                        colDoubleClick={this.colDoubleClick}
                                        setColWidth={this.setColWidth}
                                        settingsColWidth={settingsColWidth}
                                    />                         
                                    <HeaderCheckBox 
                                        title="Disable"
                                        name="edit"
                                        value={edit}
                                        onChange={this.handleChangeHeader}
                                        width ="10%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                        index="4"
                                        colDoubleClick={this.colDoubleClick}
                                        setColWidth={this.setColWidth}
                                        settingsColWidth={settingsColWidth}
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                {newRow &&
                                    <tr data-type="newrow">
                                        <NewRowCreate
                                            onClick={ event => this.createNewRow(event)}
                                            creatingNewRow={creatingNewRow}
                                        />
                                        <NewRowSelect 
                                            fieldName="fieldId"
                                            fieldValue={fieldName.fieldId}
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={generateFromTbls(screens, selectedScreen)}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            index="0"
                                            settingsColWidth={settingsColWidth}
                                        />
                                        <NewRowInput
                                            fieldType="number"
                                            fieldName="forShow"
                                            fieldValue={fieldName.forShow}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            index="1"
                                            settingsColWidth={settingsColWidth}

                                        />
                                        <NewRowInput
                                            fieldType="number"
                                            fieldName="forSelect"
                                            fieldValue={fieldName.forSelect}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            index="2"
                                            settingsColWidth={settingsColWidth}
                                        />                                      
                                        <NewRowSelect 
                                            fieldName="align"
                                            fieldValue={fieldName.align}
                                            options={arrAlign}
                                            optionText="name"
                                            fromTbls={[]}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            index="3"
                                            settingsColWidth={settingsColWidth}
                                        />
                                        <NewRowCheckBox
                                            name="edit"
                                            checked={fieldName.edit}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            index="4"
                                            settingsColWidth={settingsColWidth}
                                        />
                                    </tr>                               
                                }
                                {fieldnames.items && fields.items && this.filterName(fieldnames.items).map((s) =>
                                    <tr key={s._id}>
                                        <TableSelectionRow
                                            id={s._id}
                                            selectAllRows={selectAllRows}
                                            selectedRows={selectedRows}
                                            callback={this.updateSelectedRows}
                                        />
                                        <TableSelect 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="fieldId"
                                            fieldValue={s.fieldId}
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={generateFromTbls(screens, selectedScreen)}
                                            refreshStore={refreshFieldnames}
                                            index="0"
                                            settingsColWidth={settingsColWidth}
                                        />
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forShow"
                                            fieldValue={s.forShow}
                                            fieldType="number"
                                            refreshStore={refreshFieldnames}
                                            index="1"
                                            settingsColWidth={settingsColWidth}
                                        />
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forSelect"
                                            fieldValue={s.forSelect}
                                            fieldType="number"
                                            refreshStore={refreshFieldnames}
                                            index="2"
                                            settingsColWidth={settingsColWidth}
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
                                            index="3"
                                            settingsColWidth={settingsColWidth}
                                        />
                                        <TableCheckBox 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="edit"
                                            fieldValue={s.edit}
                                            fieldType="checkbox"
                                            refreshStore={refreshFieldnames}
                                            index="4"
                                            settingsColWidth={settingsColWidth}
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