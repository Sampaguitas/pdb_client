import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';
import queryString from 'query-string';
import { authHeader } from '../../../_helpers';
import config from 'config';
import { projectActions } from '../../../_actions';

class Inspection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getById = this.getById.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    componentDidMount() {
        const { location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.getById(qs.id);
            this.props.dispatch(projectActions.getById(qs.id));
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
        const { alert, selection } = this.props;
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="inspection">
                    <h2>Inspection</h2>
                    <div className="form-group">
                    
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

const connectedInspection = connect(mapStateToProps)(Inspection);
export { connectedInspection as Inspection };