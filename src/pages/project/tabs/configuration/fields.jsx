import React from 'react';
import { connect } from 'react-redux';
import {
    doesMatch,
} from '../../../../_functions';
import HeaderInput from '../../../../_components/project-table/header-input';
import TableInput from '../../../../_components/project-table/table-input'
import _ from 'lodash';

function fieldSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'fromTbl':
        case 'name':
        case 'type':
        case 'custom':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? String(a[sort.name]).toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? String(b[sort.name]).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        default: return array; 
    }
}

class Fields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromTbl: '',
            name: '',
            type: '',
            custom: '',
            sort: {
                name: '',
                isAscending: true,
            },
            loaded: false,
            show: false,
        }
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
    }

    componentDidMount() {
        const { refreshFields } = this.props;
        //refreshStore
        refreshFields;
        
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const table = document.getElementById('fieldsTable');
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
            name,
            custom,
            fromTbl,
            type,
            sort
        } = this.state;

        if (array) {
        return fieldSorted(array, sort).filter(function (element) {
            return ([
                'article',
                'certificate',
                'collipack',
                'location',
                'mir',
                'miritem',
                'packitem',
                'pickitem',
                'pickticket',
                'po',
                'return',
                'sub',
                'supplier',
                'storedproc',
                'transaction'
            ].includes(element.fromTbl)
            && doesMatch(name, element.name, 'String', false)
            && doesMatch(custom, element.custom, 'String', false)
            && doesMatch(fromTbl, element.fromTbl, 'String', false) 
            && doesMatch(type, element.type, 'String', false));
          });
        } else {
            return [];
        }
    }

    generateHeader() {
        const { fromTbl, name, type, custom, sort } = this.state;
        return (
            <tr>
                <HeaderInput
                    type="text"
                    title="From Table"
                    name="fromTbl"
                    value={fromTbl}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />
                <HeaderInput
                    type="text"
                    title="Field Name"
                    name="name"
                    value={name}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />                                
                <HeaderInput
                    type="text"
                    title="Type"
                    name="type"
                    value={type}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}

                />                                    
                <HeaderInput
                    type="text"
                    title="Custom Name"
                    name="custom"
                    value={custom}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />                                      
            </tr>
        );
    }

    generateBody(fields) {
        const { refreshFields } = this.props;
        let tempRows = [];

        if (fields && fields.hasOwnProperty('items')) {
            this.filterName(fields.items).map(field => {        
                if (field._id) {
                    tempRows.push(
                        <tr key={field._id}>
                            <TableInput 
                                collection='virtual'
                                objectId='0'
                                fieldName="fromTbl"
                                fieldValue={field.fromTbl}
                                disabled={true}
                                align='left'
                                fieldType="text"
                                refreshStore={refreshFields}
                            />
                            <TableInput 
                                collection='virtual'
                                objectId='0'
                                fieldName="name"
                                fieldValue={field.name}
                                disabled={true}
                                align='left'
                                fieldType="text"
                                refreshStore={refreshFields}
                            />
                            <TableInput 
                                collection='virtual'
                                objectId='0'
                                fieldName="type"
                                fieldValue={field.type}
                                disabled={true}
                                align='left'
                                fieldType="text"
                                refreshStore={refreshFields}
                            />
                            <TableInput 
                                collection="field"
                                objectId={field._id}
                                fieldName="custom"
                                fieldValue={field.custom}
                                disabled={false}
                                align='left'
                                fieldType="text"
                                refreshStore={refreshFields}
                            />
                        </tr>
                    );
                }
            });
            return tempRows;
        }
    }

    render() {

        const {
            fields,
            selection, 
            tab,
            refreshFields,
        } = this.props;

        const {
            name,
            custom,
            fromTbl,
            type
        } = this.state;

        return ( 
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                    <div className="table-responsive custom-table-container">
                        <table className="table table-bordered table-sm text-nowrap table-striped" id="fieldsTable">
                            <thead>
                                {this.generateHeader()}
                            </thead>
                            <tbody className="full-height">
                                {this.generateBody(fields)}
                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
        );
    }
}

export default Fields;