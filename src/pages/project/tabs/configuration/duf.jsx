import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
import {
    doesMatch,
    arrayRemove,
    screenSorted,
    copyObject
} from '../../../../_functions'
import {
    HeaderInput,
    NewRowCreate,
    NewRowInput,
    NewRowSelect,
    TableInput,
    TableSelect,
    TableSelectionAllRow,
    TableSelectionRow
} from '../../../../_components/project-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

class Duf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forShow: '',
            screenId: '',
            fieldId: '',
            custom: '',
            sort: {
                name: '',
                isAscending: true,
            },
            selectedScreen:'5cd2b646fd333616dc360b6d',
            selectedRows: [],
            selectAllRows: false,
            loaded: false,
            show: false,
            deleting: false,
            newRow: false,
            fieldName:{},
            newRowFocus:false,
            creatingNewRow: false,
            newRowColor: 'inherit',
            settingsColWidth: {}
        }
        this.toggleSort = this.toggleSort.bind(this);
        this.cerateNewRow = this.cerateNewRow.bind(this);
        this.toggleNewRow = this.toggleNewRow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const { refreshFieldnames, refreshFields} = this.props;
        //refreshStore
        refreshFieldnames;
        refreshFields;

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

    cerateNewRow(event) {
        event.preventDefault();
        const { refreshFieldnames } = this.props;
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
                newRow: false,
                fieldName:{}
            });
        } else {
            this.setState({
                newRow: !newRow,
                fieldName:{}
            });
        }
    }

    handleDelete(event, selectedRows) {
        event.preventDefault();
        const { deleting } = this.state;
        const { refreshFieldnames } = this.props;
        if(!deleting && !_.isEmpty(selectedRows)) {
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
            sort
        } = this.state;

        if (array) {
            return screenSorted(array, sort).filter(function (element) {
                return (doesMatch(selectedScreen, element.screenId, 'Id', false)
                    && element.fields && doesMatch(custom, element.fields.custom, 'String', false)
                    && doesMatch(forShow, element.forShow, 'Number', false)
                );
            });
        } else {
            return [];
        }
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
            tab,
            refreshFieldnames,
        } = this.props;
        
        const {
            deleting,
            forShow,
            custom,
            sort,
            selectedRows,
            selectAllRows,
            fieldName,
            newRow,
            newRowColor,
            creatingNewRow,
            settingsColWidth
        } = this.state;

        return ( 
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="action-row row">
                        <button title="Add Field"className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.toggleNewRow(event)}>
                            <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Add</span>
                        </button>
                        <button title="Delete Field(s)"className="btn btn-leeuwen btn-lg" onClick={event => this.handleDelete(event, selectedRows)}>
                            <span><FontAwesomeIcon icon={deleting ? "spinner" : "trash-alt"} className={deleting ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Delete</span>
                        </button>
                </div>
                <div className="body-section">
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
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                        index="0"
                                        colDoubleClick={this.colDoubleClick}
                                        setColWidth={this.setColWidth}
                                        settingsColWidth={settingsColWidth}
                                    />                                
                                    <HeaderInput
                                        type="text"
                                        title="Field"
                                        name="custom"
                                        value={custom}
                                        onChange={this.handleChangeHeader}
                                        width="85%"
                                        sort={sort}
                                        toggleSort={this.toggleSort}
                                        index="1"
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
                                            onClick={ event => this.cerateNewRow(event)}
                                            creatingNewRow={creatingNewRow}
                                        />                                    
                                        <NewRowInput
                                            fieldType="number"
                                            fieldName="forShow"
                                            fieldValue={fieldName.forShow}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            index="0"
                                            settingsColWidth={settingsColWidth}
                                        />
                                        <NewRowSelect 
                                            fieldName="fieldId"
                                            fieldValue={fieldName.fieldId}
                                            options={fields.items}
                                            optionText="custom"
                                            fromTbls={['po', 'sub']}
                                            onChange={event => this.handleChangeNewRow(event)}
                                            color={newRowColor}
                                            index="1"
                                            settingsColWidth={settingsColWidth}
                                        />
                                    </tr>                            
                                }
                                {fieldnames.items && fields.items && this.filterName(fieldnames.items).map((s) =>
                                    <tr
                                    key={s._id}
                                    // onBlur={this.onBlurRow}
                                    // onFocus={this.onFocusRow}
                                    >
                                        <TableSelectionRow
                                            id={s._id}
                                            selectAllRows={selectAllRows}
                                            selectedRows={selectedRows}
                                            callback={this.updateSelectedRows}
                                        />                                  
                                        <TableInput 
                                            collection="fieldname"
                                            objectId={s._id}
                                            fieldName="forShow"
                                            fieldValue={s.forShow}
                                            fieldType="number"
                                            refreshStore={refreshFieldnames}
                                            index="0"
                                            settingsColWidth={settingsColWidth}
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
                                            index="1"
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

export default Duf;