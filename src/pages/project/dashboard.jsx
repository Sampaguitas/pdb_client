import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { authHeader } from '../../_helpers';
import { projectActions } from '../../_actions';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './dashboard.css';

import Line from '../../_components/chart/line';
// import Chart from 'chart.js';

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: '',
            unit: 'qty',
            period: 'week',
            clPo:'',
            clPoRev: '',
            data: {},
            error: '',
            loading: false      
        };
        this.fetchData = this.fetchData.bind(this);
        this.onElementsClick = this.onElementsClick.bind(this);
        this.getElementsAtEvent = this.getElementsAtEvent.bind(this);
        this.handleGenerateFile = this.handleGenerateFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.generateOptionClPo = this.generateOptionClPo.bind(this);
        this.generateOptionclPoRev = this.generateOptionclPoRev.bind(this);
    }

    componentDidMount() {
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}, this.fetchData);
            dispatch(projectActions.getById(qs.id));
        }
    }

    fetchData() {
        // event.preventDefault();
        const { projectId, clPo, clPoRev, unit, period } = this.state;
        this.setState({loading: true});
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${config.apiUrl}/dashboard/getLineChart?projectId=${projectId}&clPo=${clPo}&clPoRev=${clPoRev}&unit=${unit}&period=${period}`, requestOptions)
        .then(responce => responce.text().then(text => {
            const data = text && JSON.parse(text);
            if (!responce.ok) {
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                const error = (data && data.message) || Response.statusText;
                this.setState({
                    loading: false,
                    error: error
                });
            } else {
                this.setState({
                    loading: false,
                    data: data
                });
            }
        }));
    }

    handleGenerateFile(event) {
        event.preventDefault();
    }

    onElementsClick(elems) {
        console.log('onElementsClick')
        elems.map(elem => console.log('elem:', elem));
    }

    getElementsAtEvent(elems) {
        console.log('getElementsAtEvent')
        elems.map(elem => console.log('elem:', elem));
    }

    handleChange(event) {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'clPo') {
            this.setState({clPoRev: '', clPo: value}, this.fetchData);
        } else {
            this.setState({ [name]: value}, this.fetchData);
        }
    }

    generateOptionClPo(selection) {
        if (selection.project) {
            let clPos = selection.project.pos.reduce(function (accumulator, currentValue) {
                if (accumulator.indexOf(currentValue.clPo) === -1) {
                    accumulator.push(currentValue.clPo)
                }
                return accumulator;
            }, []);
            if (!_.isEmpty(clPos)) {
                let filteredPos = clPos.sort(function(a, b) {
                    if (a < b) {
                        return -1;
                    } else if (a > b) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return filteredPos.map(po => {
                    return (
                        <option
                            key={po}
                            value={po}>{po}
                        </option>
                    );
                });
            }

        }
    }

    generateOptionclPoRev(selection, clPo) {
        if (selection.project) {
            let clPoRevs = selection.project.pos.reduce(function (accumulator, currentValue) {
                if (accumulator.indexOf(currentValue.clPoRev) === -1 && (clPo ? currentValue.clPo === clPo : true)) {
                    accumulator.push(currentValue.clPoRev)
                }
                return accumulator;
            }, []);
            if (!_.isEmpty(clPoRevs)) {
                let filteredPoRevs = clPoRevs.sort(function(a, b) {
                    if (a < b) {
                        return -1;
                    } else if (a > b) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return filteredPoRevs.map(rev => {
                    return (
                        <option
                            key={rev}
                            value={rev}>{rev}
                        </option>
                    );
                });
            }
        }
    }

    render() {
        const { projectId, unit, period, clPo, clPoRev, data, loading } = this.state;
        const { alert, selection } = this.props;

        return (
            <Layout alert={this.props.alert} accesses={selection.project && selection.project.accesses }>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Dashboard : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="dashboard" className="full-height">
                    <div className="action-row row ml-1 mb-5 mr-1" style={{height: '34px'}}>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" style={{width: '95px'}}>Select Units</span>
                            </div>
                            <select className="form-control" name="clPo" value={clPo} onChange={this.handleChange}>
                                <option key="0" value="">Select Po...</option>
                                {this.generateOptionClPo(selection)}
                            </select>
                            <select className="form-control" name="clPoRev" value={clPoRev} onChange={this.handleChange}>
                                <option key="0" value="">Select Revision...</option>
                                {this.generateOptionclPoRev(selection, clPo)}
                            </select>
                            <select className="form-control" name="unit" value={unit} onChange={this.handleChange}>
                                <option key="0" value="qty">Quantity</option>
                                <option key="1" value="value">Value</option>
                            </select>
                            <select className="form-control" name="period" value={period} onChange={this.handleChange}>
                                <option key="0" value="day">Days</option>
                                <option key="1" value="week">Weeks</option>
                                <option key="2" value="fortnight">Fortnights</option>
                                <option key="3" value="month">Months</option>
                                <option key="4" value="quarter">Quarters</option>
                            </select>
                            <div className="input-group-append">
                                <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.handleGenerateFile(event)}>
                                    <span><FontAwesomeIcon icon={loading ? 'spinner' : 'file-chart-line'} className={loading ? 'fa-pulse fa-1x fa-fw' : 'fa-lg mr-2'}/>Generate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        <Line data={data} height={100} onElementsClick={this.onElementsClick} getElementsAtEvent={this.getElementsAtEvent}/>
                    </div>
                </div> 
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, selection } = state;
    return {
        alert,
        selection,
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };