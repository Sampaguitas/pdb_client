import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { authHeader } from '../../../_helpers';
import config from 'config';
import { projectActions } from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class ProjectWarhouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: ''
        }
        this.showUpload=this.showUpload.bind(this);
    }
    componentDidMount(){
        const { location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.getById(qs.id);
            this.props.dispatch(projectActions.getById(qs.id));
            this.setState({projectId: qs.id})
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

    showUpload(){

    }
    render() {
        const { projectId } = this.state
        const { alert, selection } = this.props;
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="projectwarhouse">
                    <h2>Warehouse - Warehouse Locations</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Warehouses</h5>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <FontAwesomeIcon 
                                                        icon="industry" 
                                                        className="fa-2x" 
                                                        name="industry"
                                                    />
                                                </span>
                                            </div>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Type here the name of the warehouse..."
                                            />
                                            <div className="input-group-append">
                                                <button 
                                                    className="btn btn-outline-leeuwen"
                                                    type="submit"
                                                > Add Warehouse</button>
                                                <button
                                                    className="btn btn-leeuwen"
                                                    type="button"
                                                    onClick={this.showUpload}
                                                >
                                                    <FontAwesomeIcon 
                                                        icon="file-excel" 
                                                        className="fa-2x" 
                                                        name="file-excel"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
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
        selection
    };
}

const connectedProjectWarhouse = connect(mapStateToProps)(ProjectWarhouse);
export { connectedProjectWarhouse as ProjectWarhouse };