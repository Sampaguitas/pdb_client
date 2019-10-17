import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { saveAs } from 'file-saver';
import { authHeader } from '../../_helpers';
import { accessActions } from '../../_actions';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import './dashboard.css';

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
            projectName: '',
            unit: 'value',
            period: 'quarter',
            clPo:'',
            clPoRev: '',
            revisions: [],
            lines: ['contract', 'rfiExp', 'rfiAct', 'released', 'shipExp', 'shipAct', 'delExp', 'delAct'],
            data: {},
            // error: '',
            loadingChart: false,
            loadingProject: false,
            alert: {}

        };
        this.getProject = this.getProject.bind(this);
        this.getRevisions = this.getRevisions.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.downloadLineChart = this.downloadLineChart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.generateOptionClPo = this.generateOptionClPo.bind(this);
        this.generateOptionclPoRev = this.generateOptionclPoRev.bind(this);
        this.onLegendClick = this.onLegendClick.bind(this);
    }

    componentDidMount() {
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({
                projectId: qs.id,
                alert: {
                    type:'',
                    message:''
                }
            });
            this.getProject(qs.id); 
            this.fetchData(qs.id);
            this.getRevisions(qs.id);
            dispatch(accessActions.getAll(qs.id));
        }
    }

    getProject(projectId) {
        this.setState({
            loadingProject: true,
        });

        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        return fetch(`${config.apiUrl}/project/findOne/?id=${projectId}`, requestOptions)
        .then(responce => responce.text().then(text => {
            const data = text && JSON.parse(text);
            if (!responce.ok) {
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                const error = (data && data.message) || Response.statusText;
                this.setState({
                    loadingProject: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: error  
                    }
                });
            } else {
                this.setState({
                    loadingProject: false,
                    projectName: data.name
                });
            }
        }));
    }

    getRevisions(projectId) {
        const { revisions } = this.state;
        this.setState({loadingProject: true});

        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        return fetch(`${config.apiUrl}/po/getRevisions?projectId=${projectId}`, requestOptions)
        .then(responce => responce.text().then(text => {
            const data = text && JSON.parse(text);
            if (!responce.ok) {
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                const error = (data && data.message) || Response.statusText;
                this.setState({
                    loadingProject: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: error  
                    }
                });
            } else {
                console.log('revisions:', revisions);
                this.setState({
                    loadingProject: false,
                    revisions: data
                });
            }
        }));
    }

    fetchData(projectId) {
        const { unit, period, clPo, clPoRev, lines } = this.state;
        this.setState({loadingChart: true});
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${config.apiUrl}/dashboard/getLineChart?projectId=${projectId}&unit=${unit}&period=${period}&clPo=${clPo}&clPoRev=${clPoRev}&lines=${lines}`, requestOptions)
        .then(responce => responce.text().then(text => {
            const data = text && JSON.parse(text);
            if (!responce.ok) {
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                const error = (data && data.message) || Response.statusText;
                this.setState({
                    loadingChart: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: error  
                    }
                });
            } else {
                this.setState({
                    loadingChart: false,
                    data: data
                });
            }
        }));
    }

    downloadLineChart(event) {
        event.preventDefault();
        const { projectId, unit, period, clPo, clPoRev, lines } = this.state;
        this.setState({loadingChart: true});
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${config.apiUrl}/dashboard/downloadLineChart?projectId=${projectId}&unit=${unit}&period=${period}&clPo=${clPo}&clPoRev=${clPoRev}&lines=${lines}`, requestOptions)
        .then(responce => {
            if (!responce.ok) {
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                this.setState({
                    loadingChart: false,
                    alert: {
                        type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                        message: 'an error has occured'  
                    }
                });
            } else {
                this.setState({loadingChart: false});
                responce.blob().then(blob => saveAs(blob, 'Chart.xlsx'));
            }
        });
    }


    handleChange(event) {
        event.preventDefault();
        const { projectId } = this.state;
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'clPo') {
            this.setState({clPoRev: '', clPo: value}, () => {
                this.fetchData(projectId);
            });
            
        } else {
            this.setState({ [name]: value}, () => {
                this.fetchData(projectId);
            });
        }
    }

    generateOptionClPo(revisions) {
        if (revisions) {
            let clPos = revisions.reduce(function (accumulator, currentValue) {
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
                return filteredPos.map(function (po, index){
                    return (
                        <option
                            key={index}
                            value={po}>{po}
                        </option>
                    );
                });
            }

        }
    }

    generateOptionclPoRev(revisions, clPo) {
        if (revisions) {
            let clPoRevs = revisions.reduce(function (accumulator, currentValue) {
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
                return filteredPoRevs.map(function (rev, index){
                    return (
                        <option
                            key={index}
                            value={rev}>{rev}
                        </option>
                    );
                });
            }
        }
    }

    onLegendClick(legendItem){
        let { lines } = this.state;
        if (!legendItem.hidden && lines.indexOf(legendItem.text) > -1) {
            let tempArray = lines;
            let index = tempArray.indexOf(legendItem.text);
            tempArray.splice(index, 1);
            this.setState({lines: tempArray});
        } else if (legendItem.hidden && lines.indexOf(legendItem.text) === -1) {
            let tempArray = lines;
            tempArray.push(legendItem.text);
            this.setState({lines: tempArray});
        }
    }

    render() {
        const { projectName, unit, period, clPo, clPoRev, revisions, data, loadingChart } = this.state;
        const { accesses } = this.props; //alert
        const alert = this.props.alert ? this.props.alert : this.state.alert;

        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Dashboard : {projectName ? projectName : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="dashboard" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" style={{width: '95px'}}>Select Params</span>
                            </div>
                            <select className="form-control" name="clPo" value={clPo} onChange={this.handleChange}>
                                <option key="0" value="">Select Po...</option>
                                {this.generateOptionClPo(revisions)}
                            </select>
                            <select className="form-control" name="clPoRev" value={clPoRev} onChange={this.handleChange}>
                                <option key="0" value="">Select Revision...</option>
                                {this.generateOptionclPoRev(revisions, clPo)}
                            </select>
                            <select className="form-control" name="unit" value={unit} onChange={this.handleChange}>
                                <option key="0" value="value">Value</option>
                                <option key="1" value="pcs">Qty (Pcs)</option>
                                <option key="2" value="mtr">Qty (Mtr/Ft)</option>
                                <option key="3" value="weight">Weight (Kgs/Lbs)</option>
                            </select>
                            <select className="form-control" name="period" value={period} onChange={this.handleChange}>
                                <option key="0" value="day">Days</option>
                                <option key="1" value="week">Weeks</option>
                                <option key="2" value="fortnight">Fortnights</option>
                                <option key="3" value="month">Months</option>
                                <option key="4" value="quarter">Quarters</option>
                            </select>
                            <div className="input-group-append">
                                <button className="btn btn-outline-leeuwen-blue btn-lg" onClick={event => this.downloadLineChart(event)}>
                                    <span><FontAwesomeIcon icon={loadingChart ? 'spinner' : 'file-chart-line'} className={loadingChart ? 'fa-pulse fa-1x fa-fw' : 'fa-lg mr-2'}/>Generate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        <Line
                            data={data}
                            height={100}
                            onLegendClick={this.onLegendClick}
                        />
                    </div>
                </div> 
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, accesses } = state;
    return {
        alert,
        accesses,
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };