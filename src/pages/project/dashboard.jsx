import React from 'react';
import { connect } from 'react-redux';
import { projectActions } from '../../_actions';
import queryString from 'query-string';
import config from 'config';
import { authHeader } from '../../_helpers';
import Layout from '../../_components/layout';
import CheckBox from '../../_components/check-box';
import Select from '../../_components/select';
import './dashboard.css';
import {Line} from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
        {
        label: 'Contractual',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(75,192,75,0.4)',
        borderColor: 'rgba(75,192,75,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,75,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,75,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [0, 0, 0, 0, 40, 40, 40, 40, 80, 80, 80, 80]
        },
      {
        label: 'RFI',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [10, 10, 30, 30, 30, 60, 60, 60, 60, 80, 80, 80]
      },
      {
        label: 'Released',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(192,75,192,0.4)',
        borderColor: 'rgba(192,75,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(192,75,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(192,75,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [0, 10, 10, 30, 30, 30, 60, 60, 60, 60, 80, 80]
      },      
      {
        label: 'Shipped',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(192,75,75,0.4)',
        borderColor: 'rgba(192,75,75,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(192,75,75,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(192,75,75,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [0, 0, 10, 10, 30, 30, 30, 60, 60, 60, 60, 80]
      }
    ]
  };

  const period = [
      { _id: '1', name: 'Day' },
      { _id: '2', name: 'Week' },
      { _id: '3', name: 'Fortnight' },
      { _id: '4', name: 'Month' },
      { _id: '5', name: 'Quarter' },
  ];

  const Base = [
    { _id: 1, name: 'Lines' },
    { _id: 2, name: 'Weight' },
    { _id: 3, name: 'Pieces' },
    { _id: 4, name: 'Meters' },
    { _id: 5, name: 'Feet' },
  ]

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            graph:{
                contractual: false,
                rfi: false,
                released: false,
                shipped: false,
                periodId: '4',
                startDate: new Date(),
                endDate: new Date()
            },
            submitted: false,
            show: false
        };
        this.getById = this.getById.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
    }

    componentDidMount() {
        const { location } = this.props
        this.props.dispatch(projectActions.getAll());
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.getById(qs.id);
        }
    }

    getById(id) {
        const { project } = this.state;
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        return fetch(`${config.apiUrl}/project/findOne/?id=${id}`, requestOptions)
            .then(this.handleResponse)
            .then(
                data => this.setState({
                project: data
            }));
    }

    handleCheck(event) {
        const { graph } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            graph: {
                ...graph,
                [name]: value
            }
        });
    }

    handleChange(event) {
        const { graph } = this.state;
        const { name, value } = event.target;
        this.setState({
            graph: {
                ...graph,
                [name]: value
            }
        });
    }

    handleChangeStart(date) {
        const { graph } = this.state;
        this.setState({
            graph: {
                ...graph,
                startDate: date
            }
        });
    }

    handleChangeEnd(date) {
        const { graph } = this.state;
        this.setState({
            graph: {
                ...graph,
                endDate: date
            }
        });
    }

    handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    logout();
                    location.reload(true);
                }
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data;
        });
    }

    render() {
        const { project, graph } = this.state;
        const { alert } = this.props;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="projectDashboard">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h3>Dashboard : {project.name}</h3>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <Select
                                title="Period"
                                name="periodId"
                                options={period}
                                value={graph.periodId}
                                onChange={this.handleChange}
                                placeholder=""
                                submitted={false}
                                inline={true}
                                required={true}
                            />
                        </div>
                        <div className="col-4">
                            <DatePicker
                                className="form-control"
                                selected={graph.startDate}
                                selectsStart
                                startDate={graph.startDate}
                                endDate={graph.endDate}
                                onChange={this.handleChangeStart}
                                isClearable={true}
                                showWeekNumbers
                                dateFormat="MMMM d, yyyy"
                            />
                        </div>
                        <div className="col-4">
                            <DatePicker
                                className="form-control"
                                selected={graph.endDate}
                                selectsEnd
                                startDate={graph.startDate}
                                endDate={graph.endDate}
                                onChange={this.handleChangeEnd}
                                isClearable={true}
                                showWeekNumbers
                                dateFormat="MMMM d, yyyy"
                            />
                        </div>                            
                    </div>
                    <div className="row">
                        <div className="col-10">
                                <Line data={data} />
                        </div>
                        <div className="col-2 align-self-center">
                            <div className="row">
                                <CheckBox
                                    title="Contractual"
                                    id="contractual"
                                    name="contractual"
                                    checked={graph.contractual}
                                    onChange={this.handleCheck}
                                />
                            </div>
                            <div className="row">
                                <CheckBox
                                    title="RFI"
                                    id="rfi"
                                    name="rfi"
                                    checked={graph.rfi}
                                    onChange={this.handleCheck}
                                />
                            </div>
                            <div className="row">
                                <CheckBox
                                    title="Released"
                                    id="released"
                                    name="released"
                                    checked={graph.released}
                                    onChange={this.handleCheck}
                                />
                            </div>
                            <div className="row">
                                <CheckBox
                                    title="Shipped"
                                    id="shipped"
                                    name="shipped"
                                    checked={graph.shipped}
                                    onChange={this.handleCheck}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert,
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };