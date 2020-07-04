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
    projectActions,
    sidemenuActions
} from '../../../_actions';
import Layout from '../../../_components/layout';
import Modal from '../../../_components/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Line from '../../../_components/chart/line';

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
            showParams: false,
            loadingChart: false,
            loadingProject: false,
            alert: {
                type:'',
                message:''
            },
            menuItem: 'Expediting'

        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.toggleParams = this.toggleParams.bind(this);
        this.downloadLineChart = this.downloadLineChart.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.generateOptionClPo = this.generateOptionClPo.bind(this);
        this.generateOptionclPoRev = this.generateOptionclPoRev.bind(this);
        this.onLegendClick = this.onLegendClick.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount() {
        const { menuItem } = this.state;
        const {  
            dispatch,  
            loadingAccesses,
            loadingPos, 
            loadingSelection,
            location, 
        } = this.props;
        dispatch(sidemenuActions.select(menuItem));
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

    toggleParams(event) {
        const { showParams } = this.state;
        this.setState({
            showParams: !showParams
        });
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

    toggleCollapse() {
        const { dispatch } = this.props;
        dispatch(sidemenuActions.toggle());
    }

    render() {
        const { menuItem, unit, period, clPo, clPoRev, data, loadingChart, projectId, showParams } = this.state;
        const { accesses, pos, selection, sidemenu } = this.props;
        const alert = this.props.alert ? this.props.alert : this.state.alert;

        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
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
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="performance" className={alert.message ? "main-section-alert" : "main-section"}>
                    <div className="action-row row">
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Edit Params" onClick={event => this.toggleParams(event)}>
                            <span><FontAwesomeIcon icon="edit" className="fa mr-2"/>Edit Params</span>
                        </button>
                        <button className="btn btn-leeuwen-blue btn-lg mr-2" title="Generate Performance Report" onClick={event => this.downloadLineChart(event)}>
                            <span><FontAwesomeIcon icon={loadingChart ? "spinner" : "file-chart-line"} className={loadingChart ? "fa-pulse fa-fw fa mr-2" : "fa mr-2"}/>Generate PR</span>
                        </button>
                    </div>
                    <div className="body-section">
                        <Line
                            data={data}
                            width={100}
                            height={100}
                            onLegendClick={this.onLegendClick}
                            clPo={clPo}
                            clPoRev={clPoRev}
                            unit={unit}
                            period={period}
                        />
                    </div>
                </div>
                <Modal
                    show={showParams}
                    hideModal={this.toggleParams}
                    title="Parameters"
                    // size="modal-xl"
                >
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="clPo">Client Po</label>
                            <select
                                className="form-control"
                                id="clPo"
                                name="clPo"
                                value={clPo}
                                placeholder="Select field..."
                                onChange={this.handleChange}
                            >
                                <option key="0" value="">Select Po...</option>
                                {this.generateOptionClPo(pos)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="clPoRev">Revision</label>
                            <select
                                className="form-control"
                                id="clPoRev"
                                name="clPoRev"
                                value={clPoRev}
                                placeholder="Select revision..."
                                onChange={this.handleChange}
                            >
                                <option key="0" value="">Select Revision...</option>
                                {this.generateOptionclPoRev(pos, clPo)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="unit">Unit</label>
                            <select
                                className="form-control"
                                id="unit"
                                name="unit"
                                value={unit}
                                onChange={this.handleChange}
                            >
                                <option key="0" value="value">Value</option>
                                <option key="1" value="pcs">Qty (Pcs)</option>
                                <option key="2" value="mtr">Qty (Mtr/Ft)</option>
                                <option key="3" value="weight">Weight (Kgs/Lbs)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="period">Period</label>
                            <select
                                className="form-control"
                                id="period"
                                name="period"
                                value={period}
                                onChange={this.handleChange}
                            >
                                <option key="0" value="day">Days</option>
                                <option key="1" value="week">Weeks</option>
                                <option key="2" value="fortnight">Fortnights</option>
                                <option key="3" value="month">Months</option>
                                <option key="4" value="quarter">Quarters</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <button className="btn btn-leeuwen-blue btn-lg" onClick={this.toggleParams}>
                                <span><FontAwesomeIcon icon="times" className="fa mr-2"/>Close</span>
                            </button>
                        </div>                   
                    </div>
                </Modal>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, pos, selection, sidemenu } = state;
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
        selection,
        sidemenu
    };
}

const connectedPerformance = connect(mapStateToProps)(Performance);
export { connectedPerformance as Performance };