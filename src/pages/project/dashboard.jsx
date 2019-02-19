import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { projectActions } from '../../_actions';
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
                deliveryCondition: '',
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

    showModal(){
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
        const { alert, loading } = this.props;
        const { project, projectOrder, submitted, show } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="projectDashboard">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h3>Project : {project.name}</h3>
                        </div>
                        <div className="col-md-6 text-right">
                            <button className="btn btn-leeuwen" onClick={this.showModal}>
                                <FontAwesomeIcon icon="plus" /> New ProjectOrder
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 margin-bottom">
                            <Card 
                                color="blue-header"
                                header="Open Project Orders"
                            />
                        </div>
                        <div className="col-md-6 margin-bottom">
                            <Card
                                color="blue-header"
                                header="Late Project Orders"
                            />
                        </div>
                        <div className="col-md-12 margin-bottom">
                            <Card
                                color="blue-header"
                                header="Ready for shipping"
                            />
                        </div>
                    </div>
                    <Modal
                        show={show}
                        onHide={this.hideModal}
                        dialogClassName="modal-90w"
                        aria-labelledby="example-custom-modal-styling-title"
                        centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Custom Modal Styling
                        </Modal.Title>
                    </Modal.Header>
                    <ModalBody>
                    <Input
                        title="Customer Order Number"
                        name="customerOrderNo" 
                        type="text"
                        value={projectOrder.customerOrderNo}
                        onChange={this.handleProjectOrder}
                        submitted={submitted}
                        inline={false}
                        required={true}
                    />
                    <Input
                        title="Description"
                        name="description" 
                        type="text"
                        value={projectOrder.description}
                        onChange={this.handleProjectOrder}
                        submitted={submitted}
                        inline={false}
                        required={true}
                    />
                    {this.props.incoterms.items && 
                        <Select
                            title="Incoterm"
                            name="incoterm"
                            options={incoterms.items}
                            value={pprojectOrder.incoterm}
                            onChange={this.handleChange}
                            placeholder=""
                            submitted={submitted}
                            inline={false}
                            required={true}
                        />
                    }
                    </ModalBody>
                    </Modal>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, incoterms } = state;
    const { loading } = state.projects;
    return {
        alert,
        loading,
        incoterms
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };