import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    getInputType,
    getDateFormat,
    TypeToString,
    isValidFormat,
    DateToString,
    StringToDate,
} from '../../_functions';
import { TableSelectionAllRow, TableSelectionRow } from '../project-table';
import SplitInput from './split-input';
import _ from 'lodash';

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

function virtuals(packitems, uom) {
    let tempVirtuals = [];
    let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(uom.toUpperCase()) ? 'mtrs' : 'pcs';
    return  tempVirtuals = packitems.reduce(function(acc, cur) {
        if(cur[tempUom]) {
            cur['shippedQty'] = cur[tempUom];   
        } else {
            cur['shippedQty'] = '';  
        }
        acc.push(cur);
        return acc;
    }, []);
}

function getBodys(selectedPo, selection, headersForSelect, selectedIds){
    let arrayBody = [];
    let arrayRow = [];
    let objectRow = {};
    let hasPackitems = getScreenTbls(headersForSelect).includes('packitem');
    let screenHeaders = headersForSelect;
    let subId = selectedIds.subId;
    let project = selection.project || { _id: '0', name: '', number: '' };
    let enableInspection = selection.project ? selection.project.enableInspection : false;
    
    let i = 1;

    if (!_.isEmpty(selectedPo) && selectedPo.subs) {
        selectedPo.subs.map(sub => {
            if(sub._id === subId) {
                if (!_.isEmpty(sub.packitems)) {
                    virtuals(sub.packitems, selectedPo.uom).map(packitem => {
                        arrayRow = [];
                        screenHeaders.map(screenHeader => {
                            switch(screenHeader.fields.fromTbl) {
                                case 'po':
                                    if (['project', 'projectNr'].includes(screenHeader.fields.name)) {
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: project._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: screenHeader.fields.name === 'project' ? project.name || '' : project.number || '',
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    } else {
                                        arrayRow.push({
                                            collection: 'po',
                                            objectId: selectedPo._id,
                                            fieldName: screenHeader.fields.name,
                                            fieldValue: selectedPo[screenHeader.fields.name],
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    }
                                    break;
                                case 'sub':
                                    if (screenHeader.fields.name === 'shippedQty') {
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: sub._id,
                                            fieldName: 'shippedQty',
                                            fieldValue: packitem.shippedQty || '',
                                            disabled: screenHeader.edit,
                                            align: screenHeader.align,
                                            fieldType: getInputType(screenHeader.fields.type),
                                        });
                                    } else if (_.isEqual(screenHeader.fields.name, 'relQty') && !enableInspection){
                                        arrayRow.push({
                                            collection: 'virtual',
                                            objectId: sub._id,
                                            fieldName: 'splitQty',
                                            fieldValue: sub.splitQty,
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
                                        collection: 'packitem',
                                        objectId: packitem._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: packitem[screenHeader.fields.name],
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
                                packitemId: packitem._id,
                                collipackId: ''
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
                                if (['project', 'projectNr'].includes(screenHeader.fields.name)) {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: project._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: screenHeader.fields.name === 'project' ? project.name || '' : project.number || '',
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                } else {
                                    arrayRow.push({
                                        collection: 'po',
                                        objectId: selectedPo._id,
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: selectedPo[screenHeader.fields.name],
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                }
                                break;
                            case 'sub':
                                if (_.isEqual(screenHeader.fields.name, 'shippedQty') || _.isEqual(screenHeader.fields.name, 'heatNr')) {
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: '0',
                                        fieldName: screenHeader.fields.name,
                                        fieldValue: '',
                                        disabled: screenHeader.edit,
                                        align: screenHeader.align,
                                        fieldType: getInputType(screenHeader.fields.type),
                                    });
                                } else if (_.isEqual(screenHeader.fields.name, 'relQty') && !enableInspection){
                                    arrayRow.push({
                                        collection: 'virtual',
                                        objectId: sub._id,
                                        fieldName: 'splitQty',
                                        fieldValue: sub.splitQty,
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
                            packitemId: '',
                            collipackId: ''
                        },
                        isPacked: _.isEmpty(sub.packitems) ? false : true,
                        fields: arrayRow
                    };
                    arrayBody.push(objectRow);
                    i++;
                } 
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
        let selectedPackitem = selectedSub.packitems.find(packitem => packitem._id === screenBody.tablesId.packitemId);
        
        return headersForShow.reduce(function (acc, curr){
            if (curr.fields.fromTbl === 'po') {
                acc[curr.fields.name] = DateToString(selectedPo[curr.fields.name], getInputType(curr.fields.type), getDateFormat());
            } else if (curr.fields.fromTbl === 'sub'){
                acc[curr.fields.name] = DateToString(selectedSub[curr.fields.name], getInputType(curr.fields.type), getDateFormat());
            } else if (curr.fields.fromTbl === 'packitem' && !_.isUndefined(selectedPackitem)){
                acc[curr.fields.name] = DateToString(selectedPackitem[curr.fields.name], getInputType(curr.fields.type), getDateFormat());
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
                            {TypeToString(field.fieldValue, field.fieldType, getDateFormat())}
                        </td>
                    );
                } else {
                    tempCol.push(<td key={index}></td>);
                }
            });
            
            tempRows.push(
                <tr
                    key={screenBody._id}
                    style={selectedLine === screenBody._id ? {backgroundColor: '#A7A9AC', color: 'white', cursor: 'pointer'} : screenBody.tablesId.packitemId === selectedIds.packitemId ? {backgroundColor: '#C9DDE1', cursor: 'pointer'} : {cursor: 'pointer'}} 
                    onClick={event => handleClickLine(event, screenBody)}>
                    {tempCol}
                </tr>
            );
        
        });
        return tempRows;
    }
}

function generateHeaderForShow(screenHeaders, selectAllRows, toggleAllRow) {
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
                        checked={selectAllRows}
                        onChange={toggleAllRow}
                    />
                    {tempArray}
                </tr>
            );
        }
    }
}

function generateBodyForShow(virtuals, headersForShow, selectedRows, selectAllRows, toggleRow, handleChangeVirtuals) {
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
                        selectAllRows={selectAllRows}
                        selectedRows={selectedRows}
                        callback={toggleRow}
                    />
                    {tempCol}
                </tr>
            );
        
        });
        return tempRows;
    }
}

function getSelectedPackItemIndex(selectedIds, bodysForSelect) {
    if (!_.isEmpty(selectedIds) && !_.isEmpty(bodysForSelect)){
        let found = bodysForSelect.find(function (b) {
            return b.tablesId.packitemId === selectedIds.packitemId;
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

function getSelecetionIds(bodysForSelect, selectedLine) {
    let found = bodysForSelect.find(function (b) {
        return b._id === selectedLine;
    });
    if (!_.isUndefined(found)) {
        return found.tablesId;
    } else {
        return {
            poId: '',
            subId: '',
            certificateId: '',
            packitemId: '',
            collipackId: ''
        };
    }
}

function getRelQty(selectedPo, selectedIds, enableInspection) {
    if (selectedPo.hasOwnProperty('subs') && !_.isEmpty(selectedPo.subs)) {
        let selectedSub = selectedPo.subs.find(sub => sub._id === selectedIds.subId);
        if (!_.isUndefined(selectedSub)) {
            return Number(enableInspection ? selectedSub.relQty : selectedSub.splitQty) || 0;
        }
    }
    return 0;
}

function getPackitemsQty(selectedPo, selectedIds, tempUom) {
    if (selectedPo.hasOwnProperty('subs') && !_.isEmpty(selectedPo.subs)) {
        let selectedSub = selectedPo.subs.find(sub => sub._id === selectedIds.subId);
        if (!_.isUndefined(selectedSub) && selectedSub.hasOwnProperty('packitems')) {
            return selectedSub.packitems.reduce(function (acc, curr) {
                return acc += curr[tempUom] || 0;
            }, 0);
        }
    }
    return 0;
}

function getSelectionQty(selectedPo, selectionIds, tempUom) {
    
    if (selectedPo.hasOwnProperty('subs') && !_.isEmpty(selectedPo.subs)) {
        let selectedSub = selectedPo.subs.find(sub => sub._id === selectionIds.subId);
        if (!_.isUndefined(selectedSub)) { //&& selectedSub.hasOwnProperty('packitems') && !_.isEmpty(selectedSub)
            let selectedPackitem = selectedSub.packitems.find(packitem => packitem._id === selectionIds.packitemId);
            if (!_.isUndefined(selectedPackitem)) {
                return Number(selectedPackitem[tempUom]) || 0;
            } else {
                return Number(selectedSub.relQty) || 0;
            }
        }
    }

    return 0;
}

function getVirturalsQty(virtuals, tempUom) {
    return virtuals.reduce(function(acc, curr) {
        return acc += Number(curr[tempUom]) || 0;
    }, 0);
}

function getRemainingQty(selectedPo, selectedIds, bodysForSelect, selectedLine, virtuals, selection) {
    let enableInspection = selection.project ? selection.project.enableInspection : false;
    let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(selectedPo.uom.toUpperCase()) ? 'mtrs' : 'pcs';
    let selectionIds = getSelecetionIds(bodysForSelect, selectedLine);
    let relQty = getRelQty(selectedPo, selectedIds, enableInspection);
    let packitemsQty = getPackitemsQty(selectedPo, selectedIds, tempUom);
    let selectionQty = getSelectionQty(selectedPo, selectionIds, tempUom);
    let virturalsQty = getVirturalsQty(virtuals, tempUom);
    // console.log('relQty:', relQty);
    // console.log('packitemsQty:', packitemsQty);
    // console.log('selectionQty:', selectionQty);
    // console.log('virturalsQty:', virturalsQty);
    if (!packitemsQty) {
        return relQty - virturalsQty;
    } else {
        return relQty - (packitemsQty - selectionQty + virturalsQty);
    }
}

function isValidArray(virtuals, headersForShow) {
    return virtuals.reduce(function (acc, curr) {
        if (acc) {
            return headersForShow.every(h => {
                return isValidFormat(curr[h.fields.name], getInputType(h.fields.type), getDateFormat())
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
            if (h.fields.fromTbl === 'packitem'){
                tempObject[h.fields.name] = StringToDate (curr[h.fields.name], getInputType(h.fields.type), getDateFormat());
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

export class SplitPackItem extends Component {
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
        const { headersForSelect, selectedIds, selectedPo, selection } = this.props;
        const arrowKeys = [9, 13, 37, 38, 39, 40]; //tab, enter, left, up, right, down
        const nodes = ["INPUT", "SELECT", "SPAN"];
        const tableForShow = document.getElementById('forShow');
        tableForShow.addEventListener('keydown', (e) => { 
            if(arrowKeys.some((k) => { return e.keyCode === k }) && nodes.some((n) => { return document.activeElement.nodeName.toUpperCase() === n })) {
                return this.keyHandlerForShow(e);
            }
        });
        

        this.setState({
            bodysForSelect: getBodys(selectedPo, selection, headersForSelect, selectedIds),
            selectedLine: '',
            virtuals: [],
            forShowSelectedRows:[],
            forShowIsAll: false,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { headersForSelect, headersForShow, selectedIds, selectedPo, selection } = this.props;
        const { selectedLine, bodysForSelect } = this.state;
        if (prevProps.selectedPo != selectedPo || prevProps.selection != selection || prevProps.headersForSelect != headersForSelect) {
            this.setState({
                bodysForSelect: getBodys(selectedPo, selection, headersForSelect, selectedIds),
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
                selectedLine: getSelectedPackItemIndex(selectedIds, bodysForSelect),
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
                let screenBody = selectedScreenBody(bodysForSelect, selectedLine);
                
                if (!_.isUndefined(screenBody)) {
                    let tempObject = getFirstVirtual(selectedPo, screenBody, headersForShow);
                    this.setState({
                        virtuals: _.isEmpty(tempObject) ? [] : [tempObject],
                        forShowSelectedRows:[],
                        forShowIsAll: false,
                        alert: {
                            type: '',
                            message: ''
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
                if(rowIndex === nRows) {
                    this.handleNextLine(target);
                }
                if(target.parentElement.nextSibling) {
                    target.parentElement.nextSibling.click(); 
                }
                break;
            case 13: //enter
                if(rowIndex === nRows) {
                    this.handleNextLine(target);
                }
                if(rowIndex < nRows) {
                    target.parentElement.parentElement.nextSibling.childNodes[colIndex].click();
                }
                break;
            case 37: //left
                if (rowIndex === nRows && !target.parentElement.classList.contains('isEditing')) {
                    this.handleNextLine(target);
                }
                if(colIndex > 1 && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.previousSibling.click();
                } 
                break;
            case 38: //up
                if(rowIndex === nRows) {
                    this.handleNextLine(target);
                }
                if(rowIndex > 1) {
                    target.parentElement.parentElement.previousSibling.childNodes[colIndex].click();    
                }
                break;
            case 39: //right
                if (rowIndex === nRows && !target.parentElement.classList.contains('isEditing')) {
                    this.handleNextLine(target);
                }
                if(target.parentElement.nextSibling && !target.parentElement.classList.contains('isEditing')) {
                    target.parentElement.nextSibling.click();
                }
                break;
            case 40: //down
                if(rowIndex === nRows) {
                    this.handleNextLine(target);
                }
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

    handleClickLine(event, screenBody) {
        
        event.preventDefault();
        const { selectedLine } = this.state;
        const { headersForSelect } = this.props;
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
        const { selectedPo, selectedIds, headersForShow, handleSplitLine, selection } = this.props;
        const { selectedLine, bodysForSelect, virtuals } = this.state;
        let remainingQty = getRemainingQty(selectedPo, selectedIds, bodysForSelect, selectedLine, virtuals, selection);

        let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(selectedPo.uom.toUpperCase()) ? 'mtrs' : 'pcs';

        let screenBody = selectedScreenBody(bodysForSelect, selectedLine);
        

        if (_.isEmpty(virtuals)) {
            this.setState({
                alert: {
                    type: 'alert-danger',
                    message: 'No lines to be saved.'
                }
            });
        } else if (!virtuals.every(curr => Number(curr[tempUom]) > 0)) {
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
        } else if (remainingQty != 0) {
            if (confirm(`${remainingQty} ${selectedPo.uom} remaining, would you like to proceed?`)){
                handleSplitLine(event, getSelecetionIds(bodysForSelect, selectedLine), formatArray(virtuals, headersForShow));
            }   
        } else {
            handleSplitLine(event, getSelecetionIds(bodysForSelect, selectedLine), formatArray(virtuals, headersForShow));
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

        const { selectedPo, selectedIds, headersForShow, selection } = this.props;
        const { selectedLine, bodysForSelect, virtuals } = this.state;
        let tempUom = ['M', 'MT', 'MTR', 'MTRS', 'F', 'FT', 'FEET', 'LM'].includes(selectedPo.uom.toUpperCase()) ? 'mtrs' : 'pcs';

        let remainingQty = getRemainingQty(selectedPo, selectedIds, bodysForSelect, selectedLine, virtuals, selection);
        
        if (target.name === tempUom && target.value != '' && remainingQty > 0 && !_.isEmpty(headersForShow)) {
            let tempObject = headersForShow.reduce(function (acc, curr){
                if (curr.fields.name === tempUom) {
                    acc[tempUom] = remainingQty;
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

        const { headersForShow, headersForSelect, selectedIds, selectedPo, selection } = this.props;
        const { bodysForSelect, virtuals, forShowSelectedRows, forShowIsAll, selectedLine } =this.state;

        let remainingQty = getRemainingQty(selectedPo, selectedIds, bodysForSelect, selectedLine, virtuals, selection);
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
                                    style={remainingQty == 0 ? {color: 'green'} : {color: '#A8052C'}}
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
                                <span><FontAwesomeIcon icon="plus" className="fa mr-2"/>Add Sub Line</span>
                            </button>
                            <button className="btn btn-leeuwen btn-lg" onClick={event => this.handleDeleteSubLine(event)}>
                                <span><FontAwesomeIcon icon="trash-alt" className="fa mr-2"/>Delete Sub Line(s)</span>
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
                                    {generateBodyForShow(virtuals, headersForShow, forShowSelectedRows, forShowIsAll, this.toggleForShowRow, this.handleChangeVirtuals)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-right mt-2">
                        <button className="btn btn-leeuwen-blue btn-lg" onClick={event => this.handleSave(event)}>
                            <span><FontAwesomeIcon icon="save" className="fa mr-2"/>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
// export default SplitPackItem;