import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { saveAs } from 'file-saver';
import { authHeader } from '../../../_helpers';
import { 
    accessActions, 
    alertActions,
    poActions,
    projectActions 
} from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Line from '../../../_components/chart/line';

function logout() {
    localStorage.removeItem('user');
}

class Performance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: '',
            unit: 'value',
            period: 'quarter',
            clPo:'',
            clPoRev: '',
            lines: ['contract', 'rfiExp', 'rfiAct', 'released', 'shipExp', 'shipAct', 'delExp', 'delAct'],
            data: {},
            loadingChart: false,
            loadingProject: false,
            alert: {
                type:'',
                message:''
            }

        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.downloadLineChart = this.downloadLineChart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.generateOptionClPo = this.generateOptionClPo.bind(this);
        this.generateOptionclPoRev = this.generateOptionclPoRev.bind(this);
        this.onLegendClick = this.onLegendClick.bind(this);
    }

    componentDidMount() {
        const {  
            dispatch,  
            loadingAccesses,
            loadingPos, 
            loadingSelection,
            location, 
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({
                projectId: qs.id,
                alert: {
                    type:'',
                    message:''
                }
            });
            this.fetchData(qs.id);
            if (!loadingAccesses){
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingPos) {
                dispatch(poActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
        }
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            } 
        });
        dispatch(alertActions.clear());
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

    generateOptionClPo(pos) {
        if (pos.items) {
            let clPos = pos.items.reduce(function (accumulator, currentValue) {
                if (!!currentValue.clPo && accumulator.indexOf(currentValue.clPo) === -1) {
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

    generateOptionclPoRev(pos, clPo) {
        if (pos.items) {
            let clPoRevs = pos.items.reduce(function (accumulator, currentValue) {
                if (!!currentValue.clPoRev && accumulator.indexOf(currentValue.clPoRev) === -1 && (clPo ? currentValue.clPo === clPo : true)) {
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
        const { unit, period, clPo, clPoRev, data, loadingChart, projectId } = this.state;
        const { accesses, pos, selection } = this.props;
        const alert = this.props.alert ? this.props.alert : this.state.alert;

        return (
            <Layout alert={alert} accesses={accesses} selection={selection}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/dashboard', search: '?id=' + projectId }} tag="a">Dashboard</NavLink>
                        </li>
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/expediting', search: '?id=' + projectId }} tag="a">Expediting</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Performance Reports:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</span>
                    </ol>
                </nav>
                <hr />
                <div id="performance" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" style={{width: '95px'}}>Select Params</span>
                            </div>
                            <select className="form-control" name="clPo" value={clPo} onChange={this.handleChange}>
                                <option key="0" value="">Select Po...</option>
                                {this.generateOptionClPo(pos)}
                            </select>
                            <select className="form-control" name="clPoRev" value={clPoRev} onChange={this.handleChange}>
                                <option key="0" value="">Select Revision...</option>
                                {this.generateOptionclPoRev(pos, clPo)}
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
    const { accesses, alert, pos, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingPos } = pos;
    const { loadingSelection } = selection;
    return {
        accesses,
        alert,
        loadingAccesses,
        loadingPos,
        loadingSelection,
        pos,
        selection
    };
}

const connectedPerformance = connect(mapStateToProps)(Performance);
export { connectedPerformance as Performance };