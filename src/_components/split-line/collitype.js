import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../project-table/header-input';
import TableInput from '../project-table/table-input';
import TableSelectionRow from '../project-table/table-selection-row';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import moment from 'moment';
import _ from 'lodash';

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function getDateFormat(myLocale) {
    let tempDateFormat = ''
    myLocale.formatToParts().map(function (element) {
        switch(element.type) {
            case 'month': 
                tempDateFormat = tempDateFormat + 'MM';
                break;
            case 'literal': 
                tempDateFormat = tempDateFormat + element.value;
                break;
            case 'day': 
                tempDateFormat = tempDateFormat + 'DD';
                break;
            case 'year': 
                tempDateFormat = tempDateFormat + 'YYYY';
                break;
        }
    });
    return tempDateFormat;
}

function colliTypeSorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'type':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? a[sort.name].toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? b[sort.name].toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a[sort.name]) && !_.isNull(a[sort.name]) ? a[sort.name].toUpperCase() : '';
                    let nameB = !_.isUndefined(b[sort.name]) && !_.isNull(b[sort.name]) ? b[sort.name].toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'length':
        case 'width':
        case 'height':
        case 'pkWeight':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let valueA = a[sort.name] || 0;
                    let valueB = b[sort.name] || 0;
                    return valueA - valueB;
                });
            } else {
                return tempArray.sort(function (a, b){
                    let valueA = a[sort.name] || 0;
                    let valueB = b[sort.name] || 0;
                    return valueB - valueA
                });
            }
        default: return array;
    }
}

function doesMatch(search, value, type, isEqual) {
    
    if (!search) {
        return true;
    } else if (!value && search != 'any' && search != 'false' && search != '-1' && String(search).toUpperCase() != '=BLANK') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, value);
            case 'String':
                if (String(search).toUpperCase() === '=BLANK') {
                    return !value;
                } else if (String(search).toUpperCase() === '=NOTBLANK') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual(String(value).toUpperCase(), String(search).toUpperCase());
                } else {
                    return String(value).toUpperCase().includes(String(search).toUpperCase());
                }
            case 'Date':
                if (String(search).toUpperCase() === '=BLANK') {
                    return !value;
                } else if (String(search).toUpperCase() === '=NOTBLANK') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual(TypeToString(value, 'date', getDateFormat(myLocale)), search);
                } else {
                    return TypeToString(value, 'date', getDateFormat(myLocale)).includes(search);
                }
            case 'Number':
                if (search === '-1') {
                    return !value;
                } else if (search === '-2') {
                    return !!value;
                } else if (isEqual) {
                    return _.isEqual( Intl.NumberFormat().format(value).toString(), Intl.NumberFormat().format(search).toString());
                } else {
                    return Intl.NumberFormat().format(value).toString().includes(Intl.NumberFormat().format(search).toString());
                }
            case 'Boolean':
                if(search == 'any') {
                    return true; //any or equal
                } else if (search == 'true' && !!value) {
                    return true; //true
                } else if (search == 'false' && !value) {
                    return true; //true
                }else {
                    return false;
                }
            case 'Select':
                if(search == 'any' || _.isEqual(search, value)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

class ColliType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            length: '',
            width: '',
            height: '',
            pkWeight: '',
            selectedRows: [],
            selectAllRows: false,
            sort: {
                name: '',
                isAscending: true,
            },
            alert: {
                type:'',
                message:''
            }
        }
        this.toggleSort = this.toggleSort.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
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

    updateSelectedRows(id) {
        const { selectedRows } = this.state;
        if (selectedRows.includes(id)) {
            this.setState({
                // ...this.state,
                selectedRows: arrayRemove(selectedRows, id)
            });
        } else {
            this.setState({
                // ...this.state,
                selectedRows: [...selectedRows, id]
            });
        }       
    }

    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { collitypes } = this.props;
        if (collitypes.items) {
            if (selectAllRows) {
                this.setState({
                    selectedRows: [],
                    selectAllRows: false
                });
            } else {
                this.setState({
                    selectedRows: this.filterName(collitypes.items).map(s => s._id),
                    selectAllRows: true
                });
            }         
        }
    }

    handleAssign(event) {
        event.preventDefault();
    }

    handleChangeHeader(event) {
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [name]: value });
    }
    
    

    generateHeader() {
        const { type, length, width, height, pkWeight, selectAllRows, sort } = this.state;
        return (
            <tr>
                <TableSelectionAllRow
                    checked={selectAllRows}
                    onChange={this.toggleSelectAllRow}
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
                    type="number"
                    title="Length"
                    name="length"
                    value={length}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />                                
                <HeaderInput
                    type="number"
                    title="Width"
                    name="width"
                    value={width}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}

                />                                    
                <HeaderInput
                    type="number"
                    title="Height"
                    name="height"
                    value={height}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />
                <HeaderInput
                    type="number"
                    title="pkWeight"
                    name="pkWeight"
                    value={pkWeight}
                    onChange={this.handleChangeHeader}
                    sort={sort}
                    toggleSort={this.toggleSort}
                />                            
            </tr>
        );
    }

    generateBody(collitypes) {
        const { refreshStore } = this.props;
        const { selectAllRows } = this.state;
        let tempRows = [];
        if (collitypes.items) {
            this.filterName(collitypes.items).map(collitype => {
                tempRows.push(
                    <tr key={collitype._id}>
                        <TableSelectionRow
                            id={collitype._id}
                            selectAllRows={selectAllRows}
                            callBack={this.updateSelectedRows}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="type"
                            fieldValue={collitype.type}
                            disabled={false}
                            align="left"
                            fieldType="text"
                            refreshStore={refreshStore}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="length"
                            fieldValue={collitype.length}
                            disabled={false}
                            align="left"
                            fieldType="number"
                            refreshStore={refreshStore}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="width"
                            fieldValue={collitype.width}
                            disabled={false}
                            align="left"
                            fieldType="number"
                            refreshStore={refreshStore}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="height"
                            fieldValue={collitype.height}
                            disabled={false}
                            align="left"
                            fieldType="number"
                            refreshStore={refreshStore}
                        />
                        <TableInput
                            collection="collitype"
                            objectId={collitype._id}
                            fieldName="pkWeight"
                            fieldValue={collitype.pkWeight}
                            disabled={false}
                            align="left"
                            fieldType="number"
                            refreshStore={refreshStore}
                        />
                    </tr>
                );
            });
            return tempRows;
        }
    }

    filterName(array){
        const { 
            type,
            length,
            width,
            height,
            pkWeight,
            sort
        } = this.state;

        if (array) {
            return colliTypeSorted(array, sort).filter(function (element) {
                return (doesMatch(type, element.type, 'String', false)
                    && doesMatch(length, element.length, 'Number', false)
                    && doesMatch(width, element.width, 'Number', false)
                    && doesMatch(height, element.height, 'Number', false)
                    && doesMatch(pkWeight, element.pkWeight, 'Number', false)
                );
            });
        } else {
            return [];
        }
    }

    render() {
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;
        const { collitypes } = this.props;
        return (
            <div id='colliType'>
                <div className="ml-2 mr-2">
                    {alert.message && 
                        <div className={`alert ${alert.type} mt-3`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className="row">
                        <div className="col">
                            <h3>Select type:</h3>
                        </div>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '400px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row" >
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="collitypeTable">
                                <thead>
                                    {this.generateHeader()}
                                </thead>
                                <tbody>
                                    {this.generateBody(collitypes)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => this.handleAssign(event)}>
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa-lg mr-2"/>Assign</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default ColliType;