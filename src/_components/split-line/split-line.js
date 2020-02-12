import React, { Component } from 'react';
import TableSelectionRow from '../project-table/table-selection-row';
import TableSelectionAllRow from '../project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

function getHeaders(fieldnames, screenId, forWhat) {
    if (!_.isUndefined(fieldnames) && fieldnames.hasOwnProperty('items') && !_.isEmpty(fieldnames.items)) {
        let tempArray = fieldnames.items.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element[forWhat]); 
        });
        if (!tempArray) {
            return [];
        } else {
            return tempArray.sort(function(a,b) {
                return a[forWhat] - b[forWhat];
            });
        }
    } else {
        return [];
    }
}



class SplitLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            splitHeadersForShow: [],
            splitHeadersForSelect: [],
            splitVirtuals: [
                {splitQty: 12, vlDelDateExp: '', supReadyDateExp: '', rfiDateExp: ''},
                {splitQty: 10, vlDelDateExp: '', supReadyDateExp: '', rfiDateExp: ''},
                {splitQty: 13, vlDelDateExp: '', supReadyDateExp: '', rfiDateExp: ''},
                {splitQty: 14, vlDelDateExp: '', supReadyDateExp: '', rfiDateExp: ''},
            ],
            ForSelectSelectedRows:[],
            ForSelectIsAll: false,
        }
        this.handleChangesplitVirtuals = this.handleChangesplitVirtuals.bind(this);
        this.updateSplitRows = this.updateSplitRows.bind(this);
        this.toggleForSelect = this.toggleForSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.generateHeader = this.generateHeader.bind(this);
    }

    componentDidMount() {
        let {fieldnames, screenId } = this.props;
        this.setState({
            splitHeadersForShow: getHeaders(fieldnames, screenId, 'forShow'),
            splitHeadersForSelect: getHeaders(fieldnames, screenId, 'forSelect'),
        })
    }

    componentDidUpdate(prevProps) {
        let {fieldnames, screenId } = this.props;
        if (fieldnames != prevProps.fieldnames) {
            this.setState({
                splitHeadersForShow: getHeaders(fieldnames, screenId, 'forShow'),
                splitHeadersForSelect: getHeaders(fieldnames, screenId, 'forSelect'), 
            });
        }
    }

    handleChangesplitVirtuals(event, index) {
        event.preventDefault();
        const { name, value }  = event.target;
        const { splitVirtuals } = this.state;
        let tempArray = splitVirtuals;
        tempArray[index][name] = value;
        this.setState({
            splitVirtuals: tempArray
        });
    }

    updateSplitRows(id) {
        // event.preventDefault();
        const { ForSelectSelectedRows } = this.state;
        if (ForSelectSelectedRows.includes(id)) {
            this.setState({
                ...this.state,
                ForSelectSelectedRows: ForSelectSelectedRows.map( (e, index) => index != id)
            });
        } else {
            this.setState({
                ...this.state,
                ForSelectSelectedRows: [...ForSelectSelectedRows, id]
            });
        }
    }

    toggleForSelect(){
        const { ForSelectIsAll } = this.state;
        const { splitVirtuals } = this.state;
        if (!_.isEmpty(splitVirtuals)) {
            if (ForSelectIsAll) {
                this.setState({
                    ...this.state,
                    selectedRows: [],
                    ForSelectIsAll: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    selectedRows: splitVirtuals.map( (s, index) => index),
                    ForSelectIsAll: true
                });
            }         
        }
    }

    handleSave() {
        // event.preventDefault();
        const { fieldnames, screenId } = this.props;
        console.log('forShow:', getHeaders(fieldnames, screenId, 'forShow'));
        console.log('forSelect:', getHeaders(fieldnames, screenId, 'forSelect'));
        // console.log('toto');
    }

    generateHeader(screenHeaders, IsAll, toggleAllRow) {
        let tempArray = []
        screenHeaders.map(function (screenHeader) {
            tempArray.push(<th>{screenHeader.fields.custom}</th>);
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

    // generateBodyForShow()

    render() {

        const { fieldnames, screenId } = this.props;
        const { splitHeadersForShow, ForSelectIsAll } =this.state;

        return (
            <div id='splitLine'>
                <div className="col">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={this.handleSave}>
                            <span><FontAwesomeIcon icon="save" className="fa-lg mr-2"/>Save</span>
                        </button>
                        <button className="btn btn-warning btn-lg mr-2">
                            <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Add Line</span>
                        </button>
                        <button className="btn btn-leeuwen btn-lg">
                            <span><FontAwesomeIcon icon="trash-alt" className="fa-lg mr-2"/>Delete Line</span>
                        </button>
                </div>
                <div className="ml-2 mr-2">
                    <div className="form-group table-resonsive">
                        <hr />
                        <strong>Remaining:</strong> 0
                        <hr />
                    </div>
                    <div className="table-responcive custom-table-container custom-table-container__fixed-row mb-5 mt-2">
                        <table className="table table-bordered table-sm text-nowrap">
                            <thead>
                                {this.generateHeader(splitHeadersForShow, ForSelectIsAll, this.toggleForSelect)}
                                {/* {this.generateBodyForShow()} */}
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <TableSelectionRow />
                                    <td>Client PO</td>
                                    <td>Material</td>
                                    <td>Item</td>
                                    <td>Size</td>
                                    <td>Sch/WT</td>
                                    <td>Description</td>
                                    <td>Client PO</td>
                                    <td>Material</td>
                                    <td>VL SO</td>
                                    <td>VL SO Item</td>
                                    <td>VL PO</td>
                                    <td>VL PO Item</td>
                                    <td>Contr Delivery Date</td>
                                    <td>Supplier Contractual Delivery Date</td>
                                    <td>Split PO</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                    <div className="table-responcive custom-table-container custom-table-container__fixed-row">
                        <table className="table table-bordered table-sm text-nowrap table-striped">
                            <thead>
                                <tr>
                                    <TableSelectionAllRow
                                        checked={this.state.ForSelectIsAll}
                                        onChange={this.toggleForSelect}
                                    />
                                    <th>Split PO Qty</th>
                                    <th>Exp Ready/Del date</th>
                                    <th>Exp RFI Date</th>
                                    <th>Exp Ready Date Suppl</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <TableSelectionRow
                                        id={0}
                                        selectAllRows={this.state.ForSelectIsAll}
                                        callback={this.updateSplitRows}
                                    />
                                    <td><input type='text' name="splitQty" value={this.state.splitVirtuals[0].splitQty} onChange={event => this.handleChangesplitVirtuals(event, 0)}/></td>
                                    <td><input type='text' name="vlDelDateExp" value={this.state.splitVirtuals[0].vlDelDateExp} onChange={event => this.handleChangesplitVirtuals(event, 0)}/></td>
                                    <td><input type='text' name="supReadyDateExp" value={this.state.splitVirtuals[0].supReadyDateExp} onChange={event => this.handleChangesplitVirtuals(event, 0)}/></td>
                                    <td><input type='text' name="rfiDateExp" value={this.state.splitVirtuals[0].rfiDateExp} onChange={event => this.handleChangesplitVirtuals(event, 0)}/></td>
                                </tr>
                                <tr>
                                    <TableSelectionRow 
                                        id={1}
                                        selectAllRows={this.state.ForSelectIsAll}
                                        callback={this.updateSplitRows}
                                    />
                                    <td><input type='text' name="splitQty" value={this.state.splitVirtuals[1].splitQty} onChange={event => this.handleChangesplitVirtuals(event, 1)}/></td>
                                    <td><input type='text' name="vlDelDateExp" value={this.state.splitVirtuals[1].vlDelDateExp} onChange={event => this.handleChangesplitVirtuals(event, 1)}/></td>
                                    <td><input type='text' name="supReadyDateExp" value={this.state.splitVirtuals[1].supReadyDateExp} onChange={event => this.handleChangesplitVirtuals(event, 1)}/></td>
                                    <td><input type='text' name="rfiDateExp" value={this.state.splitVirtuals[1].rfiDateExp} onChange={event => this.handleChangesplitVirtuals(event, 1)}/></td>
                                </tr>
                                <tr>
                                    <TableSelectionRow 
                                        id={2}
                                        selectAllRows={this.state.ForSelectIsAll}
                                        callback={this.updateSplitRows}
                                    />
                                    <td><input type='text' name="splitQty" value={this.state.splitVirtuals[2].splitQty} onChange={event => this.handleChangesplitVirtuals(event, 2)}/></td>
                                    <td><input type='text' name="vlDelDateExp" value={this.state.splitVirtuals[2].vlDelDateExp} onChange={event => this.handleChangesplitVirtuals(event, 2)}/></td>
                                    <td><input type='text' name="supReadyDateExp" value={this.state.splitVirtuals[2].supReadyDateExp} onChange={event => this.handleChangesplitVirtuals(event, 2)}/></td>
                                    <td><input type='text' name="rfiDateExp" value={this.state.splitVirtuals[2].rfiDateExp} onChange={event => this.handleChangesplitVirtuals(event, 2)}/></td>
                                </tr>
                                <tr>
                                    <TableSelectionRow
                                        id={3}
                                        selectAllRows={this.state.ForSelectIsAll}
                                        callback={this.updateSplitRows}
                                    />
                                    <td><input type='text' name="splitQty" value={this.state.splitVirtuals[3].splitQty} onChange={event => this.handleChangesplitVirtuals(event, 3)}/></td>
                                    <td><input type='text' name="vlDelDateExp" value={this.state.splitVirtuals[3].vlDelDateExp} onChange={event => this.handleChangesplitVirtuals(event, 3)}/></td>
                                    <td><input type='text' name="supReadyDateExp" value={this.state.splitVirtuals[3].supReadyDateExp} onChange={event => this.handleChangesplitVirtuals(event, 3)}/></td>
                                    <td><input type='text' name="rfiDateExp" value={this.state.splitVirtuals[3].rfiDateExp} onChange={event => this.handleChangesplitVirtuals(event, 3)}/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
export default SplitLine;