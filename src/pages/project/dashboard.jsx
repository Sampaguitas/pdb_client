import React from 'react';
import { connect } from 'react-redux';
import { projectActions, incotermActions } from '../../_actions';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { authHeader } from '../../_helpers';
import Layout from '../../_components/layout';
import Card from '../../_components/card/card';
import Input from '../../_components/input';
import Select from '../../_components/select';
import { Modal, ModalBody } from 'react-bootstrap';
import './dashboard.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            projectOrder:{
                customerOrderNo:'',
                description:'',
                incoterm: '',
                projectId: '',
            },
            submitted: false,
            show: false
        };
        this.getById = this.getById.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleProjectOrder = this.handleProjectOrder.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal= this.hideModal.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(projectActions.getAll());
    }

    handleProjectOrder(event) {
        const { name, value } = event.target;
        const { projectOrder } = this.state;
        this.setState({
            projectOrder: {
                ...projectOrder,
                [name]: value
            }
        });
    }

    _handleChange(event) {
        const { selected, value } = event.target;
        const { projectOrder } = this.state;
        this.setState({
            projectOrder: {
                ...projectOrder,
                [selected]: value
            }
        });
    }

    showModal(){
        this.props.dispatch(incotermActions.getAll());
        this.setState({ show: true });
    };

    hideModal() {
        this.setState({ show: false });
    };

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
        const { project, submitted, show } = this.state;
        const { alert, loading } = this.props;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="projectDashboard">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h3>Project : {project.name}</h3>
                        </div>
                    </div>
                    <div className="row">

                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    const { loading } = state.projects;
    return {
        alert,
        loading,
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };