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
            data: {},
            error: ''      
        };
        this.fetchData = this.fetchData.bind(this);
        this.onElementsClick = this.onElementsClick.bind(this);
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
        const { projectId } = this.state;
        console.log('projectId:', projectId);
        const requestOptions = {
            method: 'GET',
            headers: { ...authHeader(), 'Content-Type': 'application/json'},
        };
        return fetch(`${config.apiUrl}/dashboard/getLineChart?projectId=${projectId}&unit=value`, requestOptions)
        .then(responce => responce.text().then(text => {
            const data = text && JSON.parse(text);
            if (!responce.ok) {
                if (responce.status === 401) {
                    localStorage.removeItem('user');
                    location.reload(true);
                }
                const error = (data && data.message) || Response.statusText;
                this.setState({error: error})
            } else {
                this.setState({data: data});
            }
        }));
    }

    onElementsClick(elems) {
        console.log('elems:', elems);
    }

    render() {
        const { projectId, data } = this.state;
        const { alert, selection } = this.props;

        return (
            <Layout alert={this.props.alert} accesses={selection.project && selection.project.accesses }>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Dashboard : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="dashboard" className="full-height">
                    <div className="action-row row ml-1 mb-2" style={{height: '34px', marginRight: '45px'}}>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        <Line data={data} height={100} onElementsClick={this.onElementsClick}/>
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