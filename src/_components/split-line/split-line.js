import React, { Component } from 'react';
import TableSelectionRow from '../project-table/table-selection-row';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SplitInput from './split-input';
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

function getScreenTbls (headersForSelect) {
    if (!_.isUndefined(headersForSelect) && !_.isEmpty(headersForSelect)) {
        return headersForSelect.reduce(function (acc, curr) {
            if(!acc.includes(curr.fields.fromTbl)) {
                acc.push(curr.fields.fromTbl)
            }
            return acc;
        },[]);
    } else {
        return [];
    }
}

function getPackItemFields (screenHeaders) {
    if (screenHeaders) {
        let tempArray = [];
        screenHeaders.reduce(function (acc, curr) {
            if (curr.fields.fromTbl === 'packitem' && !acc.includes(curr.fields._id)) {
                tempArray.push(curr.fields);
                acc.push(curr.fields._id);
            }
            return acc;
        },[]);
        return tempArray;
    } else {
        return [];
    }
}

function virtuals(packitems, uom, packItemFields) {
    let tempVirtuals = [];
    let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(uom.toUpperCase()) ? 'mtrs' : 'pcs';
    let tempObject = {_id: '0'}
    packitems.map(function (packitem){
        if (packitem.plNr) {
            if (!tempObject.hasOwnProperty('shippedQty')) {
                tempObject['shippedQty'] = packitem[tempUom];
            } else {
                tempObject['shippedQty'] += packitem[tempUom];
            }
            packItemFields.map(function (packItemField) {
                if (!tempObject.hasOwnProperty(packItemField.name)) {
                    tempObject[packItemField.name] = [TypeToString(packitem[packItemField.name], packItemField.type, getDateFormat(myLocale))]
                } else if(!tempObject[packItemField.name].includes(TypeToString(packitem[packItemField.name], packItemField.type, getDateFormat(myLocale)))) {
                    tempObject[packItemField.name].push(TypeToString(packitem[packItemField.name], packItemField.type, getDateFormat(myLocale)));
                }
            });
        }
    });
    tempVirtuals.push(tempObject);
    return tempVirtuals;
}

function getBodys(selectedPo, headersForSelect){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let hasPackitems = getScreenTbls(headersForSelect).includes('packitem');
    let screenHeaders = headersForSelect;
    
    let i = 1;

    if (!_.isEmpty(selectedPo) && selectedPo.subs) {
        selectedPo.subs.map(sub => {
                if (!_.isEmpty(sub.packitems) && hasPackitems) {
                    virtuals(sub.packitems, selectedPo.uom, getPackItemFields(screenHeaders)).map(virtual => {
                        arrayRow = [];
                        screenHeaders.map(screenHeader => {
                            switch(screenHeader.fields.fromTbl) {
                                case 'po':
                                    arrayRow.push({
                                        collection: 'po',
                                        objectId: selectedPo._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: selectedPo[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                    break;
                                case 'sub':
                                    if (screenHeader.fields.name === 'shippedQty') {
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: sub._id,
                                            fieldName: 'shippedQty',
                                            fieldValue: virtual.shippedQty,
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    } else {
                                        arrayRow.push({
                                            collection: 'sub',
                                            objectId: sub._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: sub[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    }
                                    break;
                                case 'packitem':
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: virtual._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: virtual[screenHeader.fields.name].join(' | '),
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: 'text',
                                        });
                                    break;
                                default: arrayRow.push({
                                    collection: 'virtual',
                                        objectId: '0',
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: '',
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                }); 
                            }
                        });
                        objectRow  = {
                            _id: i,
                            tablesId: {
                                poId: selectedPo._id,
                                subId: sub._id,
                                certificateId: '',
                                packItemId: '',
                                colliPackId: ''
                            },
                            isPacked: true,
                            fields: arrayRow
                        };
                        arrayBody.push(objectRow);
                        i++;
                    });
                } else {
                    arrayRow = [];
                    screenHeaders.map(screenHeader => {
                        switch(screenHeader.fields.fromTbl) {
                            case 'po':
                                arrayRow.push({
                                    collection: 'po',
                                    objectId: selectedPo._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: selectedPo[screenHeader.fields.name],
                                    disabled: screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                                });
                                break;
                            case 'sub':
                                arrayRow.push({
                                    collection: 'sub',
                                    objectId: sub._id,
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: sub[screenHeader.fields.name],
                                    disabled: screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                                });
                                break;
                            default: arrayRow.push({
                                collection: 'virtual',
                                    objectId: '0',
                                    fieldName: screenHeader.fields.name,
                                    fieldValue: '',
                                    disabled: screenHeader.edit,
                                    align: screenHeader.align,
                                    fieldType: getInputType(screenHeader.fields.type),
                            }); 
                        }
                    });
                    objectRow  = {
                        _id: i,
                        tablesId: {
                            poId: selectedPo._id,
                            subId: sub._id,
                            certificateId: '',
                            packItemId: '',
                            colliPackId: ''
                        },
                        isPacked: _.isEmpty(sub.packitems) ? false : true,
                        fields: arrayRow
                    };
                    arrayBody.push(objectRow);
                    i++;
                }
            });
        return arrayBody;
    } else {
        return [];
    }
    
}

function getFirstVirtual(selectedPo, screenBody, headersForShow) {
    if (!_.isEmpty(selectedPo) && !_.isEmpty(screenBody) && !_.isEmpty(headersForShow)){
        let selectedSub = selectedPo.subs.find(sub => sub._id === screenBody.tablesId.subId);
        return headersForShow.reduce(function (acc, curr){
            if (curr.fields.fromTbl === 'po') {
                acc[curr.fields.name] = DateToString(selectedPo[curr.fields.name], getInputType(curr.fields.type), getDateFormat(myLocale));
            } else if (curr.fields.fromTbl === 'sub'){
                acc[curr.fields.name] = DateToString(selectedSub[curr.fields.name], getInputType(curr.fields.type), getDateFormat(myLocale));
            } else {
                acc[curr.fields.name] = '';
            }
            return acc;
        },{});
    } else {
        return {}; 
    }
}


function generateHeaderForSelect(screenHeaders) {
    let tempArray = [];
    if (!_.isEmpty(screenHeaders)) { 
        screenHeaders.map(function (screenHeader, index) {
            tempArray.push(<th key={index}>{screenHeader.fields.custom}</th>);
        });
        if (!_.isEmpty(tempArray)) {
            return (
                <tr>
                    {tempArray}
                </tr>
            );
        }
    }
}

function generateBodyForSelect(screenBodys, selectedLine, selectedIds, handleClickLine) {
    let tempRows = [];
    if (!_.isEmpty(screenBodys)) {
        screenBodys.map(function (screenBody) {
            let tempCol = [];
            screenBody.fields.map(function (field, index) {
                if (field.objectId) {
                    tempCol.push(
                        <td key={index}>
                            {TypeToString(field.fieldValue, field.fieldType, getDateFormat(myLocale))}
                        </td>
                    );
                } else {
                    tempCol.push(<td key={index}></td>);
                }
            });
            
            tempRows.push(
                <tr
                    key={screenBody._id}
                    style={selectedLine === screenBody._id ? {backgroundColor: '#A7A9AC', color: 'white', cursor: 'pointer'} : screenBody.tablesId.subId === selectedIds.subId ? {backgroundColor: '#C9DDE1', cursor: 'pointer'} : {cursor: 'pointer'}} 
                    onClick={event => handleClickLine(event, screenBody)}>
                    {tempCol}
                </tr>
            );
        
        });
        return tempRows;
    }
}

function generateHeaderForShow(screenHeaders, IsAll, toggleAllRow) {
    let tempArray = [];
    if (!_.isEmpty(screenHeaders)) { 
        screenHeaders.map(function (screenHeader, index) {
            tempArray.push(
                <th
                    key={index}
                >
                    {screenHeader.fields.custom}
                </th>
            );
        });
        if (!_.isEmpty(tempArray)) {
            return (
                <tr>
                    < TableSelectionAllRow
                        checked={IsAll}
                        onChange={toggleAllRow}
                    />
                    {tempArray}
                </tr>
            );
        }
    }
}

function generateBodyForShow(virtuals, headersForShow, IsAll, toggleRow, handleChangeVirtuals) {
    let tempRows = [];
    if (!_.isEmpty(virtuals)) {
        virtuals.map(function (screenBody, indexBody) {
            let tempCol = [];
            headersForShow.map(function (headerForShow, indexHeader) {
                tempCol.push(
                    <SplitInput
                        key={indexHeader} 
                        indexBody={indexBody}
                        fieldName={headerForShow.fields.name}
                        fieldValue={virtuals[indexBody][headerForShow.fields.name]}
                        fieldType={getInputType(headerForShow.fields.type)}
                        callback={handleChangeVirtuals}
                    />
                );
            });
            tempRows.push(
                <tr key={indexBody}>
                    < TableSelectionRow
                        id={indexBody}
                        selectAllRows={IsAll}
                        callback={toggleRow}
                    />
                    {tempCol}
                </tr>
            );
        
        });
        return tempRows;
    }
}

function getSelectedSubIndex(selectedIds, bodysForSelect) {
    if (!_.isEmpty(selectedIds) && !_.isEmpty(bodysForSelect)){
        let found = bodysForSelect.find(function (b) {
            return b.tablesId.subId === selectedIds.subId;
        });
        if (!_.isUndefined(found)) {
            return found._id
        } else {
            return '';
        }
    } else {
        return '';
    }
}



class SplitLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bodysForSelect: [],
            selectedLine: '',
            virtuals: [],
            forShowSelectedRows:[],
            forShowIsAll: false,
            alert: {
                type: '',
                message: ''
            }
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleClickLine = this.handleClickLine.bind(this);


        this.handleChangeVirtuals = this.handleChangeVirtuals.bind(this);
        this.keyHandlerForShow = this.keyHandlerForShow.bind(this);
        this.toggleForShowAllRows = this.toggleForShowAllRows.bind(this);
        this.toggleForShowRow = this.toggleForShowRow.bind(this);

        this.handleSave = this.handleSave.bind(this);
        this.handleNewSubLine = this.handleNewSubLine.bind(this);
    }

    componentDidMount() {
        const { selectedPo, headersForSelect } = this.props;
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const tableForShow = document.getElementById('forShow');
        tableForShow.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandlerForShow(e);
            }
        });
        

        this.setState({
            bodysForSelect: getBodys(selectedPo, headersForSelect),
            selectedLine: '',
            virtuals: [],
            forShowSelectedRows:[],
            forShowIsAll: false,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForSelect, headersForShow, selectedIds, selectedPo } = this.props;
        const { selectedLine, bodysForSelect } = this.state;
        if (prevProps.selectedPo != selectedPo || prevProps.headersForSelect != headersForSelect) {
            this.setState({
                bodysForSelect: getBodys(selectedPo, headersForSelect),
                selectedLine: '',
                virtuals: [],
                forShowSelectedRows:[],
                forShowIsAll: false,
                alert: {
                    type: '',
                    message: ''
                }
            });
        }

        if (_.isEmpty(prevState.bodysForSelect) && prevState.bodysForSelect != bodysForSelect) {
            this.setState({
                selectedLine: getSelectedSubIndex(selectedIds, bodysForSelect),
            });
        }

        if (prevState.selectedLine != selectedLine) {
            if (selectedLine === '') {
                this.setState({
                    virtuals: [],
                    forShowSelectedRows:[],
                    forShowIsAll: false,
                    alert: {
                        type: '',
                        message: ''
                    }
                });
            } else {
                let screenBody = bodysForSelect.find(function (s) {
                    return s._id === selectedLine;
                });

                if (!_.isUndefined(screenBody)) {
                    let tempObject = getFirstVirtual(selectedPo, screenBody, headersForShow);
                    this.setState({
                        virtuals: _.isEmpty(tempObject) ? [] : [tempObject],
                        forShowSelectedRows:[],
                        forShowIsAll: false,
                        alert: {
                            type: screenBody.isPacked ? 'alert-warning' : '',
                            message: screenBody.isPacked ? 'Line contains packed item(s)' : ''
                        }
                    });
                } else {
                    this.setState({
                        virtuals: [],
                        forShowSelectedRows:[],
                        forShowIsAll: false,
                        alert: {
                            type: '',
                            message: ''
                        }
                    }); 
                }
            }
        }
    }

    keyHandlerForShow(e) {

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
        event.preventDefault;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            } 
        });
    }

    handleClickLine(event, screenBody) {
        event.preventDefault();
        const { selectedLine } = this.state;
        
        if (selectedLine === screenBody._id) {
            this.setState({
                selectedLine: '',
            });
        } else {
            this.setState({
                selectedLine: screenBody._id,
            });
        }
    }

    handleChangeVirtuals(event, index) {
        event.preventDefault();
        const { name, value }  = event.target;
        const { virtuals } = this.state;
        let tempArray = virtuals;
        tempArray[index][name] = value;
        this.setState({
            virtuals: tempArray,
            alert: {
                type: '',
                message: ''
            }
        });
    }

    toggleForShowAllRows(){
        const { forShowIsAll } = this.state;
        const { virtuals } = this.state;
        if (!_.isEmpty(virtuals)) {
            if (forShowIsAll) {
                this.setState({
                    ...this.state,
                    forShowSelectedRows: [],
                    forShowIsAll: false,
                    alert: {
                        type: '',
                        message: ''
                    }
                });
            } else {
                this.setState({
                    ...this.state,
                    forShowSelectedRows: virtuals.map( (s, index) => index),
                    forShowIsAll: true,
                    alert: {
                        type: '',
                        message: ''
                    }
                });
            }         
        }
    }

    toggleForShowRow(id) {
        const { forShowSelectedRows } = this.state;
        if (forShowSelectedRows.includes(id)) {
            this.setState({
                ...this.state,
                forShowSelectedRows: forShowSelectedRows.filter( ele => ele != id),
                alert: {
                    type: '',
                    message: ''
                }
            });
        } else {
            this.setState({
                ...this.state,
                forShowSelectedRows: [...forShowSelectedRows, id],
                alert: {
                    type: '',
                    message: ''
                }
            });
        }
    }

    handleSave() {
        const { selectedPo, selectedIds, headersForSelect } = this.props;
        const { selectedLine, bodysForSelect } = this.state;
        console.log('selectedLine:', selectedLine);
        console.log('bodysForSelect:', bodysForSelect);
        console.log('bodysForSelect.length:', bodysForSelect.length);
    }

    handleNewSubLine(event) {
        event.preventDefault();
        const { virtuals, selectedLine } = this.state;
        const { headersForShow } = this.props;
        if (selectedLine === '') {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select a line to split.'
                }
            });
        } else if (headersForShow) {
            let tempArray = headersForShow.reduce(function (acc, curr){
                acc.push({ [curr.fields.name]: ''});
                return acc;
            }, []);
            this.setState({
                virtuals: [...virtuals, tempArray],
                alert: {
                    type: '',
                    message: ''
                }
            });
        }
    }

    handleDeleteSubLine(event) {
        event.preventDefault();
        const { virtuals, forShowSelectedRows  } = this.state;
        if (_.isEmpty(forShowSelectedRows)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Select sub line(s) to be deleted.'
                }
            });
        } else {
            let tempArray = virtuals;
            for (var i = forShowSelectedRows.length -1; i >= 0; i--) {
                tempArray.splice(forShowSelectedRows[i], 1);
            }

            this.setState({
                ...this.state,
                virtuals: tempArray,
                forShowSelectedRows: [],
                forShowIsAll: false,
                alert: {
                    type: '',
                    message: ''
                }
            });
        }
    }

    render() {

        const { headersForShow, headersForSelect, selectedIds } = this.props;
        const { alert, bodysForSelect, virtuals, forShowIsAll, selectedLine } =this.state;

        return (
            <div id='splitLine'>
                <div className="ml-2 mr-2">
                    {alert.message && 
                        <div className={`alert ${alert.type}`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className="row">
                        <div className="col">
                            <h3>Select a line to split:</h3>
                        </div>
                        <div className="col text-right mr-1">
                            <strong>Remaining Qty:</strong> 0
                        </div>
                    </div> 
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '200px'}}>
                        <div className="table-responsive custom-table-container">
                            <table className="table table-bordered table-sm table-hover text-nowrap" id="forSelect">
                                <thead>
                                    {generateHeaderForSelect(headersForSelect)}
                                </thead>
                                <tbody>
                                    {generateBodyForSelect(bodysForSelect, selectedLine, selectedIds, this.handleClickLine)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row mt-4 mb-2">
                        <div className="col"> 
                            <h3>Sub line(s) information:</h3>
                        </div>
                        <div className="col text-right">
                            <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={event => this.handleNewSubLine(event)}>
                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add Sub Line</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleDeleteSubLine(event)}>
                                <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete Sub Line(s)</span>
                            </button>
                        </div>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '200px'}}>
                        <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                            <table className="table table-bordered table-sm text-nowrap table-striped" id="forShow">
                                <thead>
                                    {generateHeaderForShow(headersForShow, forShowIsAll, this.toggleForShowAllRows)}
                                </thead>
                                <tbody>
                                    {generateBodyForShow(virtuals, headersForShow, forShowIsAll, this.toggleForShowRow, this.handleChangeVirtuals)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={this.handleSave}>
                            <span><FontAwesomeIcon icon="save" className="fa-lg mr-2"/>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default SplitLine;