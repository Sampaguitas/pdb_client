import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderInput from '../project-table/header-input';
import {
    getDateFormat,
    TypeToString,
    sortCustom,
    doesMatch,
    copyObject
} from '../../_functions';
import _ from 'lodash';

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
            qtyRequired: 0,
            qtyRemaining: 0,
            selectedLine: '',
            containsPo: false,
            alert: {
                type: '',
                message: ''
            },
            settingsColWidth: {}
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
        this.generateBody = this.generateBody.bind(this);
        this.handleClickLine = this.handleClickLine.bind(this);
        this.colDoubleClick = this.colDoubleClick.bind(this);
        this.setColWidth = this.setColWidth.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        let { mir, pos } = this.props;
        let { selectedLine, containsPo, qtyRequired, qtyRemaining } = this.state;

        if (selectedLine != prevState.selectedLine) {
            this.setState({
                alert: {
                    type: '',
                    message: ''
                }
            });
        }

        if (selectedLine != prevState.selectedLine || pos != prevProps.pos) {
            let selectedPo = pos.find(element => element._id === selectedLine);
            if (!_.isUndefined(selectedPo)) {
                this.setState({
                    qtyRequired: selectedPo.stock - selectedPo.mirQty,
                    qtyRemaining: selectedPo.stock - selectedPo.mirQty 
                });
            } else {
                this.setState({
                    qtyRequired: 0,
                    qtyRemaining: 0,
                });
            }
        }

        if (selectedLine != prevState.selectedLine || mir != prevProps.mir) {
            if (!!selectedLine && mir.miritems.some(element => element.poId === selectedLine)) {
                this.setState({ containsPo: true });
            } else {
                this.setState({ containsPo: false });
            }
        }

        if (containsPo != prevState.containsPo) {
            if (containsPo) {
                this.setState({
                    alert: {
                        type: 'alert-warning',
                        message: 'This line has already been added, MIR cannot contain twice the same item!'
                    }
                });
            }
        }

        if (qtyRequired != prevState.qtyRequired || qtyRemaining != prevState.qtyRemaining) {
            if (qtyRequired > qtyRemaining) {
                this.setState({
                    alert: {
                        type: 'alert-warning',
                        message: !qtyRemaining ? 'No units remaining!' : `There is only ${qtyRemaining} units remaining!`
                    }
                });
            }
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

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [name]: value });
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const { header } = this.state;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
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
        const {header, sort, settingsColWidth} = this.state;
        const tempInputArray = [];
        if (!_.isEmpty(screenHeaders)) {
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
    
            return <tr>{tempInputArray}</tr>;
        }
    }

    generateBody(screenBodys, selectedLine, handleClickLine) {
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
                        style={selectedLine === screenBody.tablesId.poId ? {backgroundColor: '#A7A9AC', color: 'white', cursor: 'pointer'} : {cursor: 'pointer'}} 
                        onClick={event => handleClickLine(event, screenBody)}
                    >
                        {tempCol}
                    </tr>
                );
            });
            return tempRows;
        }
    }

    handleClickLine(event, screenBody) {
        event.preventDefault();
        const { selectedLine } = this.state;
        if (selectedLine === screenBody.tablesId.poId) {
            this.setState({ selectedLine: '' });
        } else {
            this.setState({ selectedLine: screenBody.tablesId.poId });
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

        const { creating, screenHeaders, screenBodys, handleSplitLine } = this.props;
        const { containsPo, qtyRequired, selectedLine, qtyRemaining } = this.state;
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
                    <div className="col text-right mb-2">
                        <strong>
                            Remaining Qty:
                            <span
                                style={qtyRemaining > 0 ? {color: 'green'} : {color: '#A8052C'}}
                                className="ml-1"
                            >
                                {qtyRemaining}
                            </span>
                        </strong>
                    </div>
                    <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: '400px'}}>
                        <div className="table-responsive custom-table-container">
                            <table className="table table-bordered table-sm table-hover text-nowrap" id="forSelect">
                                <thead>
                                    {this.generateHeader(screenHeaders)}
                                </thead>
                                <tbody>
                                    {this.generateBody(screenBodys, selectedLine, this.handleClickLine)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={event => handleSplitLine(event, containsPo, qtyRequired, selectedLine)}>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text">Qty Required:</label>
                                    </div>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="qtyRequired"
                                        value={qtyRequired}
                                        onChange={this.handleChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                            </div>
                            <div className="text-right mt-2">
                                <button type="submit" className="btn btn-leeuwen-blue btn-lg" title="Add Line to MIR">
                                    <span><FontAwesomeIcon icon={creating ? "spinner" : "plus"} className={creating ? "fa-pulse fa fa-fw mr-2" : "fa mr-2"}/>Add Line</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default SplitLine;