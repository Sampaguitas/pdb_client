import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { authHeader } from '../../_helpers';
import { projectActions } from '../../_actions';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './dashboard.css';

import { Line } from 'react-chartjs-2';

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
        return fetch(`${config.apiUrl}/dashboard/getLineChart?projectId=${projectId}`, requestOptions)
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

    onLegendClick(event) {

    }

    // handleResponse(response) {
    //     return response.text().then(text => {
    //         if (text == 'Unauthorized') {
    //             logout();
    //             location.reload(true);
    //         }
    //         const data = text && JSON.parse(text);
    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 // auto logout if 401 response returned from api
    //                 logout();
    //                 location.reload(true);
    //             }
    //             const error = (data && data.message) || response.statusText;
    //             return Promise.reject(error);
    //         }
    //         return data;
    //     });
    // }

    
    render() {
        const { projectId, data } = this.state;
        const { alert, selection } = this.props;

        const options = {
            legend: {
                display: true,
                position: 'right',
                // onClick: this.onLegendClick(event)
                },
            tooltips: {
               mode: 'label',
               label: 'mylabel',
               callbacks: {
                   label: function(tooltipItem, data) {
                       return Intl.NumberFormat().format(tooltipItem.yLabel); }, },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(label, index, labels) { return Intl.NumberFormat().format(label); },
                        beginAtZero:true,
                        fontSize: 10,
                    },
                    gridLines: {
                        display: true
                    },
                    // scaleLabel: { 
                    //     display: true,
                    //     labelString: '000\'s',
                    //     fontSize: 10,
                    // }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 10
                    },
                    gridLines: {
                        display:true
                    },
                    scaleLabel: {
                        display: true,
                        fontSize: 10,
                   }
                }]
            }
        }

        return (
            <Layout alert={this.props.alert} accesses={selection.project && selection.project.accesses }>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <h2>Dashboard : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <Line data={data} height={100} options={options}/>
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