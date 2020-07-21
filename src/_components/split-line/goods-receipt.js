import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../project-table/header-input';
import TableInput from '../project-table/table-input';
import TableSelectionRow from '../project-table/table-selection-row';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import {
    myLocale,
    getDateFormat,
    arrayRemove,
    sortCustom,
    doesMatch,
    getTableIds,
    copyObject
} from '../../_functions';
import _ from 'lodash';

class GoodsReceipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: {},
            sort: {
                name: '',
                isAscending: true,
            },
            selectedRows: [],
            selectAllRows: false,
            isEqual: false,
            alert: {
                type:'',
                message:''
            },
            settingsColWidth: {}
        }
        this.toggleSort = this.toggleSort.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        
        this.handleChangeHeader = this.handleChangeHeader.bind(this); //
        this.handleClearAlert = this.handleClearAlert.bind(this); //

        this.updateSelectedRows = this.updateSelectedRows.bind(this);

        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.filterName = this.filterName.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidMount() {
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const table = document.getElementById('goodsReceipt');
        table.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandler(e);
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { selectedRows } = this.state;
        const { isRemaining, screenBodys, updateSelectedIds } = this.props;

        if (selectedRows != prevState.selectedRows || screenBodys != prevProps.screenBodys) {
            
            let tableIds = getTableIds(selectedRows, screenBodys);
            if (_.isEmpty(tableIds.tableIds)) {
                this.setState({ selectAllRows: false });
            }
            updateSelectedIds(tableIds.tableIds, tableIds.isRemaining);
        }

        if (isRemaining != prevProps.isRemaining) {
            this.setState({
                alert: {
                    type: !isRemaining ? 'alert-warning' : '',
                    message: !isRemaining ? 'Goods selected have already been received!' : '',
                }
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

    toggleSelectAllRow() {
        const { selectAllRows } = this.state;
        const { screenBodys } = this.props;
        if (!_.isEmpty(screenBodys)) {
            if (selectAllRows) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    selectAllRows: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: this.filterName(screenBodys).map(s => s._id),
                    selectAllRows: true
                });
            }         
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

    filterName(screenBodys){
        const {header, isEqual, sort} = this.state;
        const { screenHeaders, settingsFilter } = this.props
        if (screenBodys) {
            return sortCustom(screenBodys, screenHeaders, sort).filter(function (element) {
                return screenHeaders.reduce(function(acc, cur){
                    if (!!acc) {
                        let matchingCol = element.fields.find(e => _.isEqual(e.fieldName, cur.fields.name));
                        let matchingFilter = settingsFilter.find(e => _.isEqual(e.name, cur.fields.name));
                        if (!_.isUndefined(matchingCol) && !doesMatch(header[cur._id], matchingCol.fieldValue, cur.fields.type, isEqual)) {
                            acc = false;
                        }

                        if (!_.isUndefined(matchingCol) && !_.isUndefined(matchingFilter) && !doesMatch(matchingFilter.value, matchingCol.fieldValue, matchingFilter.type, matchingFilter.isEqual)) {
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
        const {header, sort, selectAllRows, settingsColWidth} = this.state;
        const tempInputArray = []
        
        screenHeaders.map((screenHeader, screenHeaderIndex) => {
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
                    index={screenHeaderIndex}
                    colDoubleClick={this.colDoubleClick}
                    setColWidth={this.setColWidth}
                    settingsColWidth={settingsColWidth}
                />
            );
        });

        return (
            <tr>
                <TableSelectionAllRow
                    checked={selectAllRows}
                    onChange={this.toggleSelectAllRow}
                />
                {tempInputArray}
            </tr>
        );
    }

    generateBody(screenBodys) {
        const { unlocked, refreshStore } = this.props;
        const { selectedRows, selectAllRows, settingsColWidth } = this.state;
        let tempRows = [];

        this.filterName(screenBodys).map(screenBody => {
            let tempCol = [];
            screenBody.fields.map(function (field, index) {
                if (field.objectId || field.parentId) {
                    tempCol.push(
                        <TableInput
                            collection={field.collection}
                            objectId={field.objectId}
                            parentId={field.parentId}
                            fieldName={field.fieldName}
                            fieldValue={field.fieldValue}
                            disabled={field.disabled}
                            unlocked={unlocked}
                            align={field.align}
                            fieldType={field.fieldType}
                            textNoWrap={true}
                            key={index}
                            refreshStore={refreshStore}
                            index={index}
                            settingsColWidth={settingsColWidth}
                            
                        />
                    );                        
                } else {
                    tempCol.push(<td key={index}></td>) 
                }
            });
            tempRows.push(
                <tr key={screenBody._id}>
                    <TableSelectionRow
                        id={screenBody._id}
                        selectAllRows={selectAllRows}
                        selectedRows={selectedRows}
                        callback={this.updateSelectedRows}
                    />
                    {tempCol}
                </tr>
            );
        });
        return tempRows;
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
        const { selectedRows } = this.state;

        const { 
            screenHeaders, 
            screenBodys,
            transQty,
            qtyPlaceHolder,
            toWarehouse,
            toArea,
            toLocation,
            transDate,
            handleGoodsReceipt,
            isReceiving,
            myRoute,
            handleChange,
            whOptions,
            areaOptions,
            locOptions,
            isReturned,
            toggleIsReturned,
        } = this.props;

        const alert = this.state.alert.message ? this.state.alert : this.props.alert;
        return (
            <div>
                <div className="ml-2 mr-2">
                    <div className="text-right mb-3">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => toggleIsReturned(event)}>
                            <span><FontAwesomeIcon icon="eye" className="fa mr-2"/>{`${isReturned ? "Hide" : "Show"} Returns`}</span>
                        </button>
                    </div>
                    {alert.message && 
                        <div className={`alert ${alert.type} mb-3`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className="mt-2" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '300px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row" >
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="goodsReceipt">
                                <thead>
                                    {screenHeaders && this.generateHeader(screenHeaders)}
                                </thead>
                                <tbody>
                                    {screenBodys && this.generateBody(screenBodys)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={event => handleGoodsReceipt(event, myRoute)}>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" style={{width: '70px'}}>Quantity:</label>
                                    </div>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="transQty"
                                        value={transQty}
                                        onChange={handleChange}
                                        placeholder={qtyPlaceHolder}
                                        disabled={selectedRows.length != 1 ? true : false}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" style={{width: '70px'}}>Warehouse:</label>
                                    </div>
                                    <select
                                        className="form-control"
                                        name="toWarehouse"
                                        value={toWarehouse}
                                        placeholder="Select Warehouse..."
                                        onChange={handleChange}
                                        required
                                    >
                                        <option key="0" value="">Select Warehouse...</option>
                                        {whOptions}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" style={{width: '70px'}}>Area:</label>
                                    </div>
                                    <select
                                        className="form-control"
                                        name="toArea"
                                        value={toArea}
                                        placeholder="Select Area..."
                                        onChange={handleChange}
                                        required
                                    >
                                        <option key="0" value="">Select Area...</option>
                                        {areaOptions}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" style={{width: '70px'}}>Location:</label>
                                    </div>
                                    <select
                                        className="form-control"
                                        name="toLocation"
                                        value={toLocation}
                                        placeholder="Select Warehouse..."
                                        onChange={handleChange}
                                        required
                                    >
                                        <option key="0" value="">Select Location...</option>
                                        {locOptions}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" style={{width: '70px'}}>Date:</label>
                                    </div>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="transDate"
                                        value={transDate}
                                        onChange={handleChange}
                                        placeholder={getDateFormat(myLocale)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="text-right mt-2">
                                <button type="submit" className="btn btn-leeuwen-blue btn-lg">
                                    <span><FontAwesomeIcon icon={isReceiving ? "spinner" : "hand-point-right"} className={isReceiving ? "fa-pulse fa-fw mr-2" : "fa mr-2"}/>Add to Stock</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default GoodsReceipt;