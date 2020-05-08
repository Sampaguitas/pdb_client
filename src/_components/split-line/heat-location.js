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

class HeatLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: {
                type:'',
                message:''
            }
        }
        this.handleClearAlert = this.handleClearAlert.bind(this); //
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

    render() {

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
                    <div className="row" style={{height: "300px"}}>
                        <div className="col full-height">
                            <div className="form-group full-height">
                                <label htmlFor="poLineHeatNrs" style={{height: '18px'}}>heatNr (Order line)</label>
                                <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: 'calc(100% - 18px)'}}>
                                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                        <table className="table table-bordered table-sm table-hover text-nowrap" id="poLineHeatNrs">
                                        <thead></thead>
                                        <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-auto align-items-center full-height">
                            <div style={{position: 'relative', top: '50%', transform: 'translate(-50%,-50%)'}}>
                                <div className="row mb-3">
                                    <button className="btn btn-leeuwen-blue btn-lg">
                                        <span><FontAwesomeIcon icon="chevron-left" className="fa-lg"/></span>
                                    </button>
                                </div>
                                <div className="row">
                                    <button className="btn btn-leeuwen-blue btn-lg">
                                        <span><FontAwesomeIcon icon="chevron-right" className="fa-lg"/></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col full-height">
                            <div className="form-group full-height">
                                <label htmlFor="locationHeatNrs" style={{height: '18px'}}>heatNr (Location)</label>
                                <div style={{borderStyle: 'solid', borderWidth: '2px', borderColor: '#ddd', height: 'calc(100% - 18px)'}}>
                                    <div className="table-responsive custom-table-container custom-table-container__fixed-row">
                                        <table className="table table-bordered table-sm table-hover text-nowrap" id="locationHeatNrs">
                                        <thead></thead>
                                        <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-4">
                        <button className="btn btn-leeuwen-blue btn-lg">
                            <span><FontAwesomeIcon icon="hand-point-right" className="fa-lg mr-2"/>Submit</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default HeatLocation;