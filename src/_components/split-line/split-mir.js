import React, { Component } from 'react';
import TableSelectionRow from '../project-table/table-selection-row';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../project-table/header-input';
import moment from 'moment';
import _ from 'lodash';

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
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

function isValidFormat (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat, true).isValid();
            default: return true;
        }
    } else {
        return true;
    }
    
}

function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat));
            case 'number': return String(new Intl.NumberFormat().format(fieldValue));
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function DateToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat));
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function StringToDate (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat).toDate();
            default: return fieldValue;
        }
    } else {
        return '';
    }
}
//--------------------------------------
function sortCustom(array, headersForShow, sort) {
    let found = headersForShow.find(element => element._id === sort.name);
    if (!found) {
        return array;
    } else {
        let tempArray = array.slice(0);
        let fieldName = found.fields.name
        switch(found.fields.type) {
            case 'String':
                if (sort.isAscending) {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = !_.isUndefined(fieldA.fieldValue) && !_.isNull(fieldA.fieldValue) ? String(fieldA.fieldValue).toUpperCase() : '';
                            let valueB = !_.isUndefined(fieldB.fieldValue) && !_.isNull(fieldB.fieldValue) ?  String(fieldB.fieldValue).toUpperCase() : '';
                            if (valueA < valueB) {
                                return -1;
                            } else if (valueA > valueB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                } else {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = !_.isUndefined(fieldA.fieldValue) && !_.isNull(fieldA.fieldValue) ? String(fieldA.fieldValue).toUpperCase() : '';
                            let valueB = !_.isUndefined(fieldB.fieldValue) && !_.isNull(fieldB.fieldValue) ?  String(fieldB.fieldValue).toUpperCase() : '';
                            if (valueA > valueB) {
                                return -1;
                            } else if (valueA < valueB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                }
            case 'Number':
                if (sort.isAscending) {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = fieldA.fieldValue || 0;
                            let valueB = fieldB.fieldValue || 0;
                            return valueA - valueB;
                        }
                    });
                } else {
                    return tempArray.sort(function (a, b) {
                        let fieldA = a.fields.find(element => element.fieldName === fieldName);
                        let fieldB = b.fields.find(element => element.fieldName === fieldName);
                        if (_.isUndefined(fieldA) || _.isUndefined(fieldB)) {
                            return 0;
                        } else {
                            let valueA = fieldA.fieldValue || 0;
                            let valueB = fieldB.fieldValue || 0;
                            return valueB - valueA;
                        }
                    });
                }
            default: return array;
        }
    }   
}
//--------------------------------------
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
//--------------------------------------
function getTableIds(selectedRows, screenBodys) {
    if (screenBodys) {
        
        let filtered = screenBodys.filter(function (s) {
            return selectedRows.includes(s._id);
        });
        
        return filtered.reduce(function (acc, cur) {
            
            if(!acc.includes(cur.tablesId)) {
                acc.push(cur.tablesId);
            }
            return acc;
        }, []);

    } else {
        return [];
    }
}


class SplitLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: {},
            sort: {
                name: '',
                isAscending: true,
            },
            isEqual: false,
            // selectedLine: '',
            alert: {
                type: '',
                message: ''
            }
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        // this.handleClickLine = this.handleClickLine.bind(this);
    }


    handleClearAlert(event){
        const { handleClearAlert } = this.props;
        event.preventDefault;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            }
        }, handleClearAlert(event));
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
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const { header } = this.state;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            // ...this.state,
            header:{
                ...header,
                [name]: value
            }
        });
    }

    filterName(screenBodys){
        const {header, isEqual, sort} = this.state;
        const { screenHeaders } = this.props
        if (screenBodys) {
            return sortCustom(screenBodys, screenHeaders, sort).filter(function (element) {
                return screenHeaders.reduce(function(acc, cur){
                    if (!!acc) {
                        let matchingCol = element.fields.find(e => _.isEqual(e.fieldName, cur.fields.name));
                        if (!_.isUndefined(matchingCol) && !doesMatch(header[cur._id], matchingCol.fieldValue, cur.fields.type, isEqual)) {
                            acc = false;
                        }
                    }
                    return acc;
                }, true);
            });
        } else {
            return [];
        }
    }

    generateHeader(screenHeaders) {
        const {header, sort} = this.state;
        const tempInputArray = [];
        if (!_.isEmpty(screenHeaders)) {
            screenHeaders.map(screenHeader => {
                tempInputArray.push(
                    <HeaderInput
                        type={screenHeader.fields.type === 'Number' ? 'number' : 'text' }
                        title={screenHeader.fields.custom}
                        name={screenHeader._id}
                        value={header[screenHeader._id]}
                        onChange={this.handleChangeHeader}
                        key={screenHeader._id}
                        sort={sort}
                        toggleSort={this.toggleSort}
                    />
                );
            });
    
            return <tr>{tempInputArray}</tr>;
        }
    }

    generateBody(screenBodys) {
        console.log('screenBodys:', screenBodys);
        let tempRows = [];
        if (!_.isEmpty(screenBodys)) {
            this.filterName(screenBodys).map(screenBody => {
                let tempCol = [];
                screenBody.fields.map(function (field, index) {
                    if (field.objectId) {
                        tempCol.push(
                            <td
                                key={index}
                                align={field.align ? field.align : 'left'}>
                                {TypeToString(field.fieldValue, field.fieldType, getDateFormat(myLocale))}
                            </td>
                        );
                    } else {
                        tempCol.push(<td key={index}></td>);
                    }
                });
    
                tempRows.push(<tr key={screenBody._id}>{tempCol}</tr>);
            });
            return tempRows;
        }
    }

    render() {

        const { screenHeaders, screenBodys } = this.props;
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;

        return (
            <div id='splitLine'>
                <div className="ml-2 mt-2 mr-2">
                    {alert.message && 
                        <div className={`alert ${alert.type} mt-3`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '400px'}}>
                        <div className="table-responsive custom-table-container">
                            <table className="table table-bordered table-sm table-hover text-nowrap" id="forSelect">
                                <thead>
                                    {this.generateHeader(screenHeaders)}
                                </thead>
                                <tbody>
                                    {this.generateBody(screenBodys)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" title="Add Line to MIR">
                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add Line</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default SplitLine;