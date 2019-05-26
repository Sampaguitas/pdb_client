import React from 'react';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import config from 'config';
import { authHeader } from '../../../_helpers';
import Layout from '../../../_components/layout';
import { projectActions } from '../../../_actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Warehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: ''
        }
        this.getById = this.getById.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }
    componentDidMount(){
        const { location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.getById(qs.id);
            this.props.dispatch(projectActions.getById(qs.id));
            this.setState({projectId: qs.id});
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
        const { projectId } = this.state
        const { alert, selection } = this.props;
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="warehouse">
                    <h2>Warehouse - Warehouse</h2>
                    <div className="col-md-4 offset-md-3">
                        <NavLink to={{ 
                                pathname: "/projectwarhouse",
                                search: '?id=' + projectId
                            }} className="card" tag="a"
                        >
                            <div className="card-body">
                                <div className="text-center">
                                    <FontAwesomeIcon 
                                        icon="industry" 
                                        className="fa-5x" 
                                        name="industry"
                                    />
                                    <h3>Project Warehouses</h3>
                                </div>
                            </div>
                        </NavLink>
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

const connectedWarehouse = connect(mapStateToProps)(Warehouse);
export { connectedWarehouse as Warehouse };