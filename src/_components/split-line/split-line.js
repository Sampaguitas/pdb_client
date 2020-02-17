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

function getSelecetedSubId(bodysForSelect, selectedLine) {
    let found = bodysForSelect.find(function (b) {
        return b._id === selectedLine;
    });
    if (!_.isUndefined(found)) {
        return found.tablesId.subId;
    } else {
        return '';
    }
}

function getPoQty(selectedPo) {
    return Number(selectedPo.qty) || 0;
}

function getSubsQty(selectedPo) {
    if (selectedPo.hasOwnProperty('subs') && !_.isEmpty(selectedPo.subs)) {
        return selectedPo.subs.reduce(function(acc, curr) {
            return acc += Number(curr.splitQty) || 0;
        }, 0);
    } else {
        return 0;
    }
    
}

function getSelectionQty(selectedPo, subId) {
    let selectedSub = selectedPo.subs.find(sub => sub._id === subId);
    if (!_.isUndefined(selectedSub)) {
        return Number(selectedSub.splitQty) || 0;
    } else {
        return 0;
    }
}

function getVirturalsQty(virtuals) {
    return virtuals.reduce(function(acc, curr) {
        return acc += Number(curr.splitQty) || 0
    }, 0);
}

function getRemainingQty(selectedPo, bodysForSelect, selectedLine, virtuals) {
    let subId = getSelecetedSubId(bodysForSelect, selectedLine);
    let poQty = getPoQty(selectedPo);
    let subsQty = getSubsQty(selectedPo);
    let selectionQty = getSelectionQty(selectedPo, subId);
    let virturalsQty = getVirturalsQty(virtuals);
    return poQty - ( subsQty - selectionQty + virturalsQty);
}

function isValidArray(virtuals, headersForShow) {
    return virtuals.reduce(function (acc, curr) {
        if (acc) {
            return headersForShow.every(h => {
                return isValidFormat(curr[h.fields.name], getInputType(h.fields.type), getDateFormat(myLocale))
            });
        } else {
            return acc;
        }
    }, true);
}

function formatArray(virtuals, headersForShow) {
    return virtuals.reduce(function (acc, curr) {
        
        let tempObject = {};
        
        headersForShow.map(function (h) {
            if (h.fields.fromTbl === 'sub'){
                tempObject[h.fields.name] = StringToDate (curr[h.fields.name], getInputType(h.fields.type), getDateFormat(myLocale));
            }
        });

        if (!_.isEmpty(tempObject)) {
            acc.push(tempObject);
        }
        
        return acc;

    },[]);
}

function selectedScreenBody(bodysForSelect, selectedLine) {
    return bodysForSelect.find(function (s) {
        return s._id === selectedLine;
    });
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
        this.handleNextLine = this.handleNextLine.bind(this);
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
                // let screenBody = bodysForSelect.find(function (s) {
                //     return s._id === selectedLine;
                // });

                let screenBody = selectedScreenBody(bodysForSelect, selectedLine);

                if (!_.isUndefined(screenBody)) {
                    let tempObject = getFirstVirtual(selectedPo, screenBody, headersForShow);
                    this.setState({
                        virtuals: _.isEmpty(tempObject) ? [] : [tempObject],
                        forShowSelectedRows:[],
                        forShowIsAll: false,
                        alert: {
                            type: screenBody.isPacked ? 'alert-warning' : '',
                            message: screenBody.isPacked ? 'Line contains packed item(s) and cannot be splet! First delete packed items in the shipping module to proceed' : ''
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
                    this.handleNextLine(target);
                }
                break;
            case 13: //enter
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                    this.handleNextLine(target);
                }
                break;
            case 37: //left
                if(colIndex > 1 && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.previousSibling.click();
                    this.handleNextLine(target);
                } 
                break;
            case 38: //up
                if(rowIndex > 1) {
                    target.parentElement.parentElement.previousSibling.childNodes[colIndex].click();
                    this.handleNextLine(target);
                }
                break;
            case 39: //right
                if(target.parentElement.nextSibling && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.nextSibling.click();
                    this.handleNextLine(target);
                }
                break;
            case 40: //down
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                    this.handleNextLine(target);
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

    handleSave(event) {
        const { selectedPo, headersForShow, handleSplitLine } = this.props;
        const { selectedLine, bodysForSelect, virtuals } = this.state;
        let remainingQty = getRemainingQty(selectedPo, bodysForSelect, selectedLine, virtuals);
        let screenBody = selectedScreenBody(bodysForSelect, selectedLine);
        

        if (_.isEmpty(virtuals)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'No lines to be saved.'
                }
            });
        } else if (!virtuals.every(curr => Number(curr.splitQty) > 0)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Split Quantities should be greater than 0.'
                }
            });
        } else if (!isValidArray(virtuals, headersForShow)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Some dates are not properly formated.'
                }
            });
        } else if (!_.isUndefined(screenBody) && screenBody.isPacked) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'Line contains packed item(s) and cannot be splet! First delete packed items in the shipping module and try again'
                }
            });
        } else if (remainingQty != 0) {
            if (confirm(`${remainingQty} ${selectedPo.uom} remaining, would you like to proceed?`)){
                handleSplitLine(event, getSelecetedSubId(bodysForSelect, selectedLine), formatArray(virtuals, headersForShow));
            }   
        } else {
            handleSplitLine(event, getSelecetedSubId(bodysForSelect, selectedLine), formatArray(virtuals, headersForShow));
        }
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
                acc[curr.fields.name] = '';
                return acc;
            }, {});
            this.setState({
                virtuals: [...virtuals, tempArray],
                alert: {
                    type: '',
                    message: ''
                }
            });
        }
    }

    handleNextLine(target) {

        const { selectedPo, headersForShow } = this.props;
        const { selectedLine, bodysForSelect, virtuals } = this.state;
        let remainingQty = getRemainingQty(selectedPo, bodysForSelect, selectedLine, virtuals);

        if (target.name === 'splitQty' && target.value != '' && remainingQty > 0 && !_.isEmpty(headersForShow)) {
            let tempObject = headersForShow.reduce(function (acc, curr){
                if (curr.fields.name === 'splitQty') {
                    acc.splitQty = remainingQty;
                } else {
                    acc[curr.fields.name] = '';
                }
                return acc;
            }, {});
            this.setState({
                virtuals: [...virtuals, tempObject],
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

        const { headersForShow, headersForSelect, selectedIds, selectedPo } = this.props;
        const { bodysForSelect, virtuals, forShowIsAll, selectedLine } =this.state;

        let remainingQty = getRemainingQty(selectedPo, bodysForSelect, selectedLine, virtuals);
        const alert = this.state.alert.message ? this.state.alert : this.props.alert;

        return (
            <div id='splitLine'>
                <div className="ml-2 mr-2">
                    <div className="row">
                        <div className="col">
                            <h3>Select a line to split:</h3>
                        </div>
                        <div className="col text-right mr-1">
                            <strong>
                                Remaining Qty:
                                <span
                                    style={remainingQty === 0 ? {color: 'green'} : {color: '#A8052C'}}
                                    className="ml-1"
                                >
                                    {remainingQty}
                                </span>
                            </strong>
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
                    {alert.message && 
                        <div className={`alert ${alert.type} mt-3`}>{alert.message}
                            <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                                <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                            </button>
                        </div>
                    }
                    <div className={`row ${alert.message ? "mt-1" : "mt-5"} mb-2`}>
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
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => this.handleSave(event)}>
                            <span><FontAwesomeIcon icon="save" className="fa-lg mr-2"/>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default SplitLine;