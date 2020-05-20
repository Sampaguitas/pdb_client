import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../project-table/header-input';
import TableInput from '../project-table/table-input';
import TableSelectionRow from '../project-table/table-selection-row';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import CheckBox from '../../_components/check-box';

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

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
}

function arraySorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'poCif':
        case 'locCif':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.cif) && !_.isNull(a.cif) ? String(a.cif).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.cif) && !_.isNull(b.cif) ? String(b.cif).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.cif) && !_.isNull(a.cif) ? String(a.cif).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.cif) && !_.isNull(b.cif) ? String(b.cif).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'poHeatNr':
        case 'locHeatNr':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let nameA = !_.isUndefined(a.heatNr) && !_.isNull(a.heatNr) ? String(a.heatNr).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.heatNr) && !_.isNull(b.heatNr) ? String(b.heatNr).toUpperCase() : '';
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
                    let nameA = !_.isUndefined(a.heatNr) && !_.isNull(a.heatNr) ? String(a.heatNr).toUpperCase() : '';
                    let nameB = !_.isUndefined(b.heatNr) && !_.isNull(b.heatNr) ? String(b.heatNr).toUpperCase() : '';
                    if (nameA > nameB) {
                        return -1;
                    } else if (nameA < nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
        case 'poInspQty':
        case 'locInspQty':
            if (sort.isAscending) {
                return tempArray.sort(function (a, b) {
                    let valueA = a.inspQty || 0;
                    let valueB = b.inspQty || 0;
                    return valueA - valueB;
                });
            } else {
                return tempArray.sort(function (a, b){
                    let valueA = a.inspQty || 0;
                    let valueB = b.inspQty || 0;
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

function getPoCertificates(certificates, poId) {
    if (certificates.hasOwnProperty('items') && !_.isEmpty(certificates.items)) {
        return certificates.items.reduce(function (acc, cur) {
            cur.heats.forEach(heat => {
                if (heat.poId === poId) {
                    let found = acc.find(element => element.cif === cur.cif && element.heatNr === heat.heatNr);
                    if (_.isUndefined(found)) {
                        acc.push({
                            _id: cur._id,
                            cif: cur.cif,
                            heatNr: heat.heatNr,
                            inspQty: heat.inspQty
                        });
                    } else {
                        found.inspQty += heat.inspQty;
                    }
                }
            });
            return acc;
        }, []);
    } else {
        return [];
    }
}

class HeatLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poCif: '',
            poHeatNr: '',
            poInspQty: '',
            locCif: '',
            locHeatNr: '',
            locInspQty: '', 
            poSelectAllRows: '',
            locSelectAllRows: '',
            poSelectedIds: [],
            locSelectedIds: [],
            poCertificates: [],
            locCertificates: [],
            poSort: {
                name: '',
                isAscending: true, 
            },
            locSort: {
                name: '',
                isAscending: true, 
            },
            alert: {
                type:'',
                message:''
            }
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.poToggleSort = this.poToggleSort.bind(this);
        this.locToggleSort = this.locToggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        
        this.poToggleSelectAllRow = this.poToggleSelectAllRow.bind(this);
        this.locToggleSelectAllRow = this.locToggleSelectAllRow.bind(this);
        this.updatePoSelectedIds = this.updatePoSelectedIds.bind(this);
        this.updateLocSelectedIds = this.updateLocSelectedIds.bind(this);
        this.pofilterName = this.pofilterName.bind(this);
        this.locfilterName = this.locfilterName.bind(this);
    }

    componentDidMount() {
        const { certificates, poId } = this.props;
        this.setState({
            poCertificates: getPoCertificates(certificates, poId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { certificates, poId } = this.props;
        if (certificates != prevProps.certificates || poId != prevProps.poId) {
            this.setState({
                poCertificates: getPoCertificates(certificates, poId)
            });
        }
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

    poToggleSort(event, name) {
        event.preventDefault();
        const { poSort } = this.state;
        if (poSort.name != name) {
            this.setState({
                poSort: {
                    name: name,
                    isAscending: true
                }
            });
        } else if (!!poSort.isAscending) {
            this.setState({
                poSort: {
                    name: name,
                    isAscending: false
                }
            });
        } else {
            this.setState({
                poSort: {
                    name: '',
                    isAscending: true
                }
            });
        }
    }

    locToggleSort(event, name) {
        event.preventDefault();
        const { locSort } = this.state;
        if (locSort.name != name) {
            this.setState({
                locSort: {
                    name: name,
                    isAscending: true
                }
            });
        } else if (!!locSort.isAscending) {
            this.setState({
                locSort: {
                    name: name,
                    isAscending: false
                }
            });
        } else {
            this.setState({
                locSort: {
                    name: '',
                    isAscending: true
                }
            });
        }
    }

    poToggleSelectAllRow() {
        const { poSelectAllRows, poCertificates } = this.state;
        if (poCertificates) {
            if (poSelectAllRows) {
                this.setState({
                    poSelectedIds: [],
                    poSelectAllRows: false
                });
            } else {
                this.setState({
                    poSelectedIds: this.pofilterName(poCertificates).map(s => s._id),
                    poSelectAllRows: true
                });
            }         
        }
    }

    locToggleSelectAllRow() {
        const { locSelectAllRows, locCertificates } = this.state;
        if (locCertificates) {
            if (locSelectAllRows) {
                this.setState({
                    locSelectedIds: [],
                    locSelectAllRows: false
                });
            } else {
                this.setState({
                    locSelectedIds: this.pofilterName(locCertificates).map(s => s._id),
                    locSelectAllRows: true
                });
            }         
        }
    }

    updatePoSelectedIds(id) {
        const { poSelectedIds } = this.state;
        if (poSelectedIds.includes(id)) {
            this.setState({
                poSelectedIds: arrayRemove(poSelectedIds, id)
            });
        } else {
            this.setState({
                poSelectedIds: [...poSelectedIds, id]
            });
        }       
    }

    updateLocSelectedIds(id) {
        const { locSelectedIds } = this.state;
        if (locSelectedIds.includes(id)) {
            this.setState({
                ...this.state,
                locSelectedIds: arrayRemove(locSelectedIds, id)
            });
        } else {
            this.setState({
                ...this.state,
                locSelectedIds: [...locSelectedIds, id]
            });
        }       
    }

    handleChangeHeader(event) {
        // event.preventDefault();
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [name]: value });
    }

    generatePoHeader() {
        const { poCif, poHeatNr, poInspQty, poSelectAllRows, poSort } = this.state;
        return (
            <tr>
                <TableSelectionAllRow
                    checked={poSelectAllRows}
                    onChange={this.poToggleSelectAllRow}
                />
                <HeaderInput
                    type="text"
                    title="CIF"
                    name="poCif"
                    value={poCif}
                    onChange={this.handleChangeHeader}
                    sort={poSort}
                    toggleSort={this.poToggleSort}
                />
                <HeaderInput
                    type="text"
                    title="HeatNr"
                    name="poHeatNr"
                    value={poHeatNr}
                    onChange={this.handleChangeHeader}
                    sort={poSort}
                    toggleSort={this.poToggleSort}
                />
                <HeaderInput
                    type="number"
                    title="Qty"
                    name="poInspQty"
                    value={poInspQty}
                    onChange={this.handleChangeHeader}
                    sort={poSort}
                    toggleSort={this.poToggleSort}
                />                       
            </tr>
        );
    }

    generatePoBody() {
        const { refreshCifs } = this.props;
        const { poSelectAllRows, poCertificates } = this.state;
        let tempRows = [];
        if (poCertificates) {
            this.pofilterName(poCertificates).map(certificate => {
                tempRows.push(
                    <tr key={certificate._id}>
                        <TableSelectionRow
                            id={certificate._id}
                            selectAllRows={poSelectAllRows}
                            callback={this.updatePoSelectedIds}
                        />
                        <TableInput
                            collection="virtual"
                            objectId={certificate._id}
                            fieldName="cif"
                            fieldValue={certificate.cif}
                            disabled={true}
                            unlocked={false}
                            align="left"
                            fieldType="text"
                            textNoWrap={true}
                            key={certificate._id}
                            refreshStore={refreshCifs}
                        />
                        <TableInput
                            collection="virtual"
                            objectId={certificate._id}
                            fieldName="heatNr"
                            fieldValue={certificate.heatNr}
                            disabled={true}
                            unlocked={false}
                            align="left"
                            fieldType="text"
                            textNoWrap={true}
                            key={certificate._id}
                            refreshStore={refreshCifs}
                        />
                        <TableInput
                            collection="virtual"
                            objectId={certificate._id}
                            fieldName="inspQty"
                            fieldValue={certificate.inspQty}
                            disabled={true}
                            unlocked={false}
                            align="left"
                            fieldType="number"
                            textNoWrap={true}
                            key={certificate._id}
                            refreshStore={refreshCifs}
                        />
                    </tr>
                );
            });
        }
        return tempRows;
    }

    generateLocHeader() {
        const { locCif, locHeatNr, locInspQty, locSelectAllRows, locSort } = this.state;
        return (
            <tr>
                <TableSelectionAllRow
                    checked={locSelectAllRows}
                    onChange={this.locToggleSelectAllRow}
                />
                <HeaderInput
                    type="text"
                    title="CIF"
                    name="locCif"
                    value={locCif}
                    onChange={this.handleChangeHeader}
                    sort={locSort}
                    toggleSort={this.locToggleSort}
                />
                <HeaderInput
                    type="text"
                    title="HeatNr"
                    name="locHeatNr"
                    value={locHeatNr}
                    onChange={this.handleChangeHeader}
                    sort={locSort}
                    toggleSort={this.locToggleSort}
                />
                <HeaderInput
                    type="number"
                    title="Qty"
                    name="locInspQty"
                    value={locInspQty}
                    onChange={this.handleChangeHeader}
                    sort={locSort}
                    toggleSort={this.locToggleSort}
                />                       
            </tr>
        );
    }

    

    pofilterName(array){
        const { 
            poCif,
            poHeatNr,
            poInspQty,
            poSort
        } = this.state;

        if (array) {
            return arraySorted(array, poSort).filter(function (element) {
                return (
                    doesMatch(poCif, element.cif, 'String', false)
                    && doesMatch(poHeatNr, element.heatNr, 'String', false)
                    && doesMatch(poInspQty, element.inspQty, 'String', false)
                );
            });
        } else {
            return [];
        }
    }

    locfilterName(array){
        const { 
            locCif,
            locHeatNr,
            locInspQty,
            locSort
        } = this.state;

        if (array) {
            return arraySorted(array, locSort).filter(function (element) {
                return (
                    doesMatch(locCif, element.cif, 'String', false)
                    && doesMatch(locHeatNr, element.heatNr, 'String', false)
                    && doesMatch(locInspQty, element.inspQty, 'String', false)
                );
            });
        } else {
            return [];
        }
    }
    

    render() {
        const { toggleHeat } = this.props;
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;
        return (
            <div>
                <div className="ml-2 mt-2 mr-2">
                    {alert.message && 
                        <div className={`alert ${alert.type} mb-3`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className="row" style={{height: "400px"}}>
                        <div className="col full-height">
                            <div className="form-group full-height">
                                <label htmlFor="poLineHeatNrs" style={{height: '18px'}}>Order Line:</label>
                                <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: 'calc(100% - 18px)'}}>
                                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                        <table className="table table-bordered table-sm table-hover text-nowrap" id="poLineHeatNrs">
                                            <thead>
                                                {this.generatePoHeader()}
                                            </thead>
                                            <tbody>
                                                {this.generatePoBody()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-auto align-items-center full-height">
                            <div style={{position: 'relative', top: '50%', transform: 'translate(-50%,-50%)'}}>
                                <div className="row mb-3">
                                    <button title="Remove from location" className="btn btn-leeuwen-blue btn-lg">
                                        <span><FontAwesomeIcon icon="chevron-left" className="fa-lg"/></span>
                                    </button>
                                </div>
                                <div className="row">
                                    <button title="Add to location" className="btn btn-leeuwen-blue btn-lg">
                                        <span><FontAwesomeIcon icon="chevron-right" className="fa-lg"/></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col full-height">
                            <div className="form-group full-height">
                                <label htmlFor="locationHeatNrs" style={{height: '18px'}}>Location:</label>
                                <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: 'calc(100% - 18px)'}}>
                                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                        <table className="table table-bordered table-sm table-hover text-nowrap" id="locationHeatNrs">
                                            <thead>
                                                {this.generateLocHeader()}
                                            </thead>
                                            <tbody>
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-4">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => toggleHeat(event)}>
                            <span><FontAwesomeIcon icon="times" className="fa-lg mr-2"/>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default HeatLocation;