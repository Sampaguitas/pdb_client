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

function getPoCertificates(certificates, heatlocs, poId, locationId, projectId) {
    if (certificates.hasOwnProperty('items') && !_.isEmpty(certificates.items)) {
        let tempArray = [];
        tempArray = certificates.items.reduce(function (acc, cur) {
            cur.heats.forEach(heat => {
                if (heat.poId === poId) {
                    let found = acc.find(element => element.cif === cur.cif && element.heatNr === heat.heatNr);
                    if (_.isUndefined(found)) {
                        acc.push({
                            _id: cur._id,
                            cif: cur.cif,
                            heatNr: heat.heatNr,
                            inspQty: heat.inspQty,
                            poId: poId,
                            locationId: locationId,
                            projectId: projectId
                        });
                    } else {
                        found.inspQty += heat.inspQty;
                    }
                }
            });
            return acc;
        }, []);
        if (heatlocs.hasOwnProperty('items') && !_.isEmpty(heatlocs.items)) {
            tempArray.forEach(temp => {
                let found = heatlocs.items.find(function (element) {
                    return element.poId === temp.poId && element.locationId === temp.locationId && element.cif === temp.cif && element.heatNr === temp.heatNr;
                });
                if (!_.isUndefined(found)) {
                    let qty = found.inspQty || 0;
                    temp.inspQty -= qty;
                }
            });
        }
        return tempArray;
    } else {
        return [];
    }
}

function getLocCertificates(heatlocs, poId, locationId) {
    if (heatlocs.hasOwnProperty('items') && !_.isEmpty(heatlocs.items)) {
        return heatlocs.items.reduce(function (acc, cur) {
            if (cur.poId === poId && cur.locationId === locationId) {
                acc.push({
                    _id: cur._id,
                    cif: cur.cif,
                    heatNr: cur.heatNr,
                    inspQty: cur.inspQty 
                });
            }
            return acc;
        }, []);
    } else {
        return [];
    }
}

class HeatPick extends Component {
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
            },
            isDeleting: false,
            isCreating: false,
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.poToggleSort = this.poToggleSort.bind(this);
        this.locToggleSort = this.locToggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        
        this.poToggleSelectAllRow = this.poToggleSelectAllRow.bind(this);
        this.locToggleSelectAllRow = this.locToggleSelectAllRow.bind(this);
        this.updatePoSelectedIds = this.updatePoSelectedIds.bind(this);
        this.updateLocSelectedIds = this.updateLocSelectedIds.bind(this);
        this.removeCertificates = this.removeCertificates.bind(this);
        this.AssignCertificates = this.AssignCertificates.bind(this);
        this.pofilterName = this.pofilterName.bind(this);
        this.locfilterName = this.locfilterName.bind(this);
    }

    componentDidMount() {
        
        const { certificates, heatlocs, poId, locationId, projectId } = this.props;
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        
        const poTable = document.getElementById('potable');
        const locTable = document.getElementById('loctable');
        
        poTable.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });

        locTable.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });

        this.setState({
            locCertificates: getLocCertificates(heatlocs, poId, locationId),
            poCertificates: getPoCertificates(certificates, heatlocs, poId, locationId, projectId)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // const { locCertificates } = this.state;
        const { certificates, heatlocs, poId, locationId, projectId } = this.props;
        if (heatlocs != prevProps.heatlocs) {
            this.setState({
                locCertificates: getLocCertificates(heatlocs, poId, locationId)
            });
        }

        if (certificates != prevProps.certificates || heatlocs != prevProps.heatlocs) {
            this.setState({
                poCertificates: getPoCertificates(certificates, heatlocs, poId, locationId, projectId)
            });
        }
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
        const { poSelectedIds, poSelectAllRows, poCertificates } = this.state;
        let tempRows = [];
        if (poCertificates) {
            this.pofilterName(poCertificates).map( (certificate, index) => {
                tempRows.push(
                    <tr key={index}>
                        <TableSelectionRow
                            id={certificate._id}
                            selectAllRows={poSelectAllRows}
                            selectedRows={poSelectedIds}
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
                            // key={certificate._id}
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
                            // key={certificate._id}
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
                            // key={certificate._id}
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

    generateLocBody() {
        const { refresHatLocs } = this.props;
        const { locSelectedIds, locSelectAllRows, locCertificates } = this.state;
        let tempRows = [];
        if (locCertificates) {
            this.locfilterName(locCertificates).map( (certificate, index) => {
                tempRows.push(
                    <tr key={index}>
                        <TableSelectionRow
                            id={certificate._id}
                            selectAllRows={locSelectAllRows}
                            selectedRows={locSelectedIds}
                            callback={this.updateLocSelectedIds}
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
                            // key={certificate._id}
                            refreshStore={refresHatLocs}
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
                            // key={certificate._id}
                            refreshStore={refresHatLocs}
                        />
                        <TableInput
                            collection="heatloc"
                            objectId={certificate._id}
                            fieldName="inspQty"
                            fieldValue={certificate.inspQty}
                            disabled={false}
                            unlocked={true}
                            align="left"
                            fieldType="number"
                            textNoWrap={true}
                            // key={certificate._id}
                            refreshStore={refresHatLocs}
                        />
                    </tr>
                );
            });
        }
        return tempRows;
    }

    removeCertificates(event) {
        event.preventDefault();
        const { refresHatLocs } = this.props;
        const { locSelectedIds } = this.state;
        if (_.isEmpty(locSelectedIds)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select HeatNr(s) to be removed.'
                }
            })
        } else {
            this.setState({
                isDeleting: true,
            }, () => {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedIds: locSelectedIds })
                }

                return fetch(`${config.apiUrl}/heatloc/delete`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            isDeleting: false,
                            locSelectAllRows: false,
                            locSelectedIds: [],
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, refresHatLocs());
                    }
                }));
            })
        }
    }

    AssignCertificates(event) {
        event.preventDefault();
        const { refresHatLocs } = this.props;
        const { poSelectedIds, poCertificates } = this.state;
        if (_.isEmpty(poSelectedIds)) {
            this.setState({
                alert: {
                    type:'alert-danger',
                    message:'Select HeatNr(s) to be alocated.' 
                }
            });
        } else {
            this.setState({
                isCreating: true, 
            }, () => {
                let documents = poCertificates.filter(element => poSelectedIds.includes(element._id));
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({documents: documents})
                }
                return fetch(`${config.apiUrl}/heatloc/create`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            isCreating: false,
                            poSelectAllRows: false,
                            poSelectedIds: [],
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, refresHatLocs());
                    }
                }));
            })
        }
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
        const { isDeleting, isCreating } = this.state;
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
                                        <table className="table table-bordered table-sm table-hover text-nowrap" id="potable">
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
                                    <button title="Add to location" className="btn btn-leeuwen-blue btn-lg" onClick={event => this.AssignCertificates(event)}>
                                        <span><FontAwesomeIcon icon={isCreating ? "spinner" : "chevron-right"} className={isCreating ? "fa-pulse fa-lg fa-fw" : "fa-lg"}/></span>
                                    </button>
                                </div>
                                <div className="row">
                                    
                                    <button title="Remove from location" className="btn btn-leeuwen-blue btn-lg" onClick={event => this.removeCertificates(event)}>
                                        <span><FontAwesomeIcon icon={isDeleting ? "spinner" : "chevron-left"} className={isDeleting ? "fa-pulse fa-lg fa-fw" : "fa-lg"}/></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col full-height">
                            <div className="form-group full-height">
                                <label htmlFor="locationHeatNrs" style={{height: '18px'}}>Location:</label>
                                <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: 'calc(100% - 18px)'}}>
                                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                        <table className="table table-bordered table-sm table-hover text-nowrap" id="loctable">
                                            <thead>
                                                {this.generateLocHeader()}
                                            </thead>
                                            <tbody>
                                                {this.generateLocBody()}
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
export default HeatPick;