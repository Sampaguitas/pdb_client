import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { authHeader } from '../../_helpers';
import { arrayRemove, doesMatch, copyObject } from '../../_functions';
import { HeaderInput, TableInput, TableSelectionAllRow, TableSelectionRow } from '../project-table';
import _ from 'lodash';

function arraySorted(array, sort) {
    let tempArray = array.slice(0);
    switch(sort.name) {
        case 'pickCif':
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
        case 'pickHeatNr':
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
        case 'pickInspQty':
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

function getLocCertificates(heatlocs, heatpicks, locationId, pickitemId, poId) {
    if (heatlocs.hasOwnProperty('items') && heatpicks.hasOwnProperty('items') && !_.isEmpty(heatlocs.items)) {
        return heatlocs.items.reduce(function (acc, cur) {
            if (_.isEqual(cur.poId, poId) && _.isEqual(cur.locationId, locationId)) {
                let pickQty = cur.heatpicks.reduce(function (accPick, curPick) {
                    accPick = accPick + (curPick.inspQty || 0)
                    return accPick;
                }, 0);
                acc.push({
                    _id: cur._id,
                    cif: cur.cif,
                    heatNr: cur.heatNr,
                    inspQty: (cur.inspQty || 0) - pickQty,
                    heatlocId: cur._id,
                    pickitemId: pickitemId,
                    locationId: locationId,
                    poId: poId,
                    projectId: cur.projectId
                });
            }
            return acc;
        }, []);
    } else {
        return [];
    }
}

function getPickCertificates(heatpicks, pickitemId) {
    if (heatpicks.hasOwnProperty('items') && !_.isEmpty(heatpicks.items)) {
        return heatpicks.items.reduce(function (acc, cur) {
            if (_.isEqual(cur.pickitemId, pickitemId)) {
                acc.push({
                    _id: cur._id,
                    cif: cur.heatloc.cif,
                    heatNr: cur.heatloc.heatNr,
                    inspQty: cur.inspQty,
                    heatlocId: cur.heatlocId,
                    pickitemId: cur.pickitemId,
                    projectId: cur.projectId,
                });
            }
            return acc;
        }, [])
    }
}

export class SplitHeatPick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickCif: '',
            pickHeatNr: '',
            pickInspQty: '',
            locCif: '',
            locHeatNr: '',
            locInspQty: '', 
            pickSelectAllRows: '',
            locSelectAllRows: '',
            pickSelectedIds: [],
            locSelectedIds: [],
            pickCertificates: [],
            locCertificates: [],
            locSort: {
                name: '',
                isAscending: true, 
            },
            pickSort: {
                name: '',
                isAscending: true, 
            },
            alert: {
                type:'',
                message:''
            },
            isDeleting: false,
            isCreating: false,
            settingsColWidth: {}
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.pickToggleSort = this.pickToggleSort.bind(this);
        this.locToggleSort = this.locToggleSort.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.pickToggleSelectAllRow = this.pickToggleSelectAllRow.bind(this);
        this.locToggleSelectAllRow = this.locToggleSelectAllRow.bind(this);
        this.updatePickSelectedIds = this.updatePickSelectedIds.bind(this);
        this.updateLocSelectedIds = this.updateLocSelectedIds.bind(this);
        this.removeCertificates = this.removeCertificates.bind(this);
        this.AssignCertificates = this.AssignCertificates.bind(this);
        this.pickfilterName = this.pickfilterName.bind(this);
        this.locfilterName = this.locfilterName.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const { heatlocs, heatpicks, locationId, pickitemId, poId, isProcessed } = this.props;
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        
        const locTable = document.getElementById('loctable');
        const pickTable = document.getElementById('picktable');

        locTable.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });

        pickTable.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });

        this.setState({
            locCertificates: getLocCertificates(heatlocs, heatpicks, locationId, pickitemId, poId),
            pickCertificates: getPickCertificates(heatpicks, pickitemId),
            alert: isProcessed ? { type:'alert-warning', message:'This picking ticket has been closed! Re-open it to add/remove HeatNrs and edit quantities'} : { type:'', message:''}
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { heatlocs, heatpicks, locationId, pickitemId, poId, isProcessed } = this.props;
        if (heatlocs != prevProps.heatlocs || heatpicks != prevProps.heatpicks) {
            this.setState({
                locCertificates: getLocCertificates(heatlocs, heatpicks, locationId, pickitemId, poId),
            });
        }

        if (heatpicks != prevProps.heatpicks) {
            this.setState({
                pickCertificates: getPickCertificates(heatpicks, pickitemId)
            });
        }

        if (isProcessed != prevProps.isProcessed) {
            this.setState({
                alert: isProcessed ? { type:'alert-warning', message:'This picking ticket has been closed! Re-open it to add/remove HeatNrs and edit quantities'} : { type:'', message:''}
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

    pickToggleSort(event, name) {
        event.preventDefault();
        const { pickSort } = this.state;
        if (pickSort.name != name) {
            this.setState({
                pickSort: {
                    name: name,
                    isAscending: true
                }
            });
        } else if (!!pickSort.isAscending) {
            this.setState({
                pickSort: {
                    name: name,
                    isAscending: false
                }
            });
        } else {
            this.setState({
                pickSort: {
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

    pickToggleSelectAllRow() {
        const { pickSelectAllRows, pickCertificates } = this.state;
        if (pickCertificates) {
            if (pickSelectAllRows) {
                this.setState({
                    pickSelectedIds: [],
                    pickSelectAllRows: false
                });
            } else {
                this.setState({
                    pickSelectedIds: this.pickfilterName(pickCertificates).map(s => s._id),
                    pickSelectAllRows: true
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
                    locSelectedIds: this.pickfilterName(locCertificates).map(s => s._id),
                    locSelectAllRows: true
                });
            }         
        }
    }

    updatePickSelectedIds(id) {
        const { pickSelectedIds } = this.state;
        if (pickSelectedIds.includes(id)) {
            this.setState({
                pickSelectedIds: arrayRemove(pickSelectedIds, id)
            });
        } else {
            this.setState({
                pickSelectedIds: [...pickSelectedIds, id]
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
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [name]: value });
    }

    generateLocHeader() {
        const { locCif, locHeatNr, locInspQty, locSelectAllRows, locSort, settingsColWidth } = this.state;
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
                    index="0"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />
                <HeaderInput
                    type="text"
                    title="HeatNr"
                    name="locHeatNr"
                    value={locHeatNr}
                    onChange={this.handleChangeHeader}
                    sort={locSort}
                    toggleSort={this.locToggleSort}
                    index="1"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />
                <HeaderInput
                    type="number"
                    title="Qty"
                    name="locInspQty"
                    value={locInspQty}
                    onChange={this.handleChangeHeader}
                    sort={locSort}
                    toggleSort={this.locToggleSort}
                    index="2"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />                       
            </tr>
        );
    }

    generateLocBody() {
        const { refresHeatLocs } = this.props;
        const { locSelectedIds, locSelectAllRows, locCertificates, settingsColWidth } = this.state;
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
                            refreshStore={refresHeatLocs}
                            index="0"
                            settingsColWidth={settingsColWidth}
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
                            refreshStore={refresHeatLocs}
                            index="1"
                            settingsColWidth={settingsColWidth}
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
                            refreshStore={refresHeatLocs}
                            index="2"
                            settingsColWidth={settingsColWidth}
                        />
                    </tr>
                );
            });
        }
        return tempRows;
    }

    generatePickHeader() {
        const { pickCif, pickHeatNr, pickInspQty, pickSelectAllRows, pickSort, settingsColWidth } = this.state;
        return (
            <tr>
                <TableSelectionAllRow
                    checked={pickSelectAllRows}
                    onChange={this.pickToggleSelectAllRow}
                />
                <HeaderInput
                    type="text"
                    title="CIF"
                    name="pickCif"
                    value={pickCif}
                    onChange={this.handleChangeHeader}
                    sort={pickSort}
                    toggleSort={this.pickToggleSort}
                    index="3"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />
                <HeaderInput
                    type="text"
                    title="HeatNr"
                    name="pickHeatNr"
                    value={pickHeatNr}
                    onChange={this.handleChangeHeader}
                    sort={pickSort}
                    toggleSort={this.pickToggleSort}
                    index="4"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />
                <HeaderInput
                    type="number"
                    title="Qty"
                    name="pickInspQty"
                    value={pickInspQty}
                    onChange={this.handleChangeHeader}
                    sort={pickSort}
                    toggleSort={this.pickToggleSort}
                    index="5"
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />                       
            </tr>
        );
    }

    generatePickBody() {
        const { refreshHeatPicks, isProcessed } = this.props;
        const { pickSelectedIds, pickSelectAllRows, pickCertificates } = this.state;
        let tempRows = [];
        if (pickCertificates) {
            this.pickfilterName(pickCertificates).map( (certificate, index) => {
                tempRows.push(
                    <tr key={index}>
                        <TableSelectionRow
                            id={certificate._id}
                            selectAllRows={pickSelectAllRows}
                            selectedRows={pickSelectedIds}
                            callback={this.updatePickSelectedIds}
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
                            refreshStore={refreshHeatPicks}
                            index="3"
                            settingsColWidth={settingsColWidth}
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
                            refreshStore={refreshHeatPicks}
                            index="4"
                            settingsColWidth={settingsColWidth}
                        />
                        <TableInput
                            collection="heatpick"
                            objectId={certificate._id}
                            fieldName="inspQty"
                            fieldValue={certificate.inspQty}
                            disabled={isProcessed ? true : false}
                            unlocked={isProcessed ? false : true}
                            align="left"
                            fieldType="number"
                            textNoWrap={true}
                            refreshStore={refreshHeatPicks}
                            index="5"
                            settingsColWidth={settingsColWidth}
                        />
                    </tr>
                );
            });
        }
        return tempRows;
    }

    removeCertificates(event) {
        event.preventDefault();
        const { refreshHeatPicks } = this.props;
        const { pickSelectedIds } = this.state;
        if (_.isEmpty(pickSelectedIds)) {
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
                    body: JSON.stringify({ selectedIds: pickSelectedIds })
                }

                return fetch(`${config.apiUrl}/heatpick/delete`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            isDeleting: false,
                            pickSelectAllRows: false,
                            pickSelectedIds: [],
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, refreshHeatPicks());
                    }
                }));
            })
        }
    }

    AssignCertificates(event) {
        event.preventDefault();
        const { refreshHeatPicks } = this.props;
        const { locSelectedIds, locCertificates } = this.state;
        if (_.isEmpty(locSelectedIds)) {
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
                let documents = locCertificates.filter(element => locSelectedIds.includes(element._id));
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        documents: documents
                        
                    })
                }
                return fetch(`${config.apiUrl}/heatpick/create`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            isCreating: false,
                            locSelectAllRows: false,
                            locSelectedIds: [],
                            alert: {
                                type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                                message: data.message
                            }
                        }, refreshHeatPicks());
                    }
                }));
            })
        }
    }

    pickfilterName(array){
        const { 
            pickCif,
            pickHeatNr,
            pickInspQty,
            pickSort
        } = this.state;

        if (array) {
            return arraySorted(array, pickSort).filter(function (element) {
                return (
                    doesMatch(pickCif, element.cif, 'String', false)
                    && doesMatch(pickHeatNr, element.heatNr, 'String', false)
                    && doesMatch(pickInspQty, element.inspQty, 'String', false)
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
        const { toggleHeat, isProcessed } = this.props;
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
                                <label htmlFor="poLineHeatNrs" style={{height: '18px'}}>Location:</label>
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
                        <div className="col-md-auto align-items-center full-height">
                            <div style={{position: 'relative', top: '50%', transform: 'translate(-50%,-50%)'}}>
                                <div className="row mb-3">
                                    <button title="Add to location" className="btn btn-leeuwen-blue btn-lg" onClick={event => this.AssignCertificates(event)} disabled={isProcessed ? true : false}>
                                        <span><FontAwesomeIcon icon={isCreating ? "spinner" : "chevron-right"} className={isCreating ? "fa-pulse fa fa-fw" : "fa"}/></span>
                                    </button>
                                </div>
                                <div className="row">
                                    
                                    <button title="Remove from location" className="btn btn-leeuwen-blue btn-lg" onClick={event => this.removeCertificates(event)} disabled={isProcessed ? true : false}>
                                        <span><FontAwesomeIcon icon={isDeleting ? "spinner" : "chevron-left"} className={isDeleting ? "fa-pulse fa fa-fw" : "fa"}/></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col full-height">
                            <div className="form-group full-height">
                                <label htmlFor="locationHeatNrs" style={{height: '18px'}}>Picking Line:</label>
                                <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: 'calc(100% - 18px)'}}>
                                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                        <table className="table table-bordered table-sm table-hover text-nowrap" id="picktable">
                                            <thead>
                                            {this.generatePickHeader()}
                                            </thead>
                                            <tbody>
                                                {this.generatePickBody()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-4">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => toggleHeat(event)}>
                            <span><FontAwesomeIcon icon="times" className="fa mr-2"/>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
// export default SplitHeatPick;