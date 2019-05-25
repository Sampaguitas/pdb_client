import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { currencyActions, customerActions, opcoActions, projectActions, userActions  } from '../../_actions';
import { authHeader } from '../../_helpers';
import Layout from '../../_components/layout';
import Tabs from '../../_components/tabs/tabs'

import General from './tabs/configuration/general';
import Translations from './tabs/configuration/translations';
import ProjectUsers from './tabs/configuration/projectusers';
import Grids from './tabs/configuration/grids';
import Templates from './tabs/configuration/templates';


const tabs = [
    {index: 0, id: 'general', label: 'General', component: General, active: true, isLoaded: false},
    {index: 1, id: 'translations', label: 'Translations', component: Translations, active: false, isLoaded: false},
    {index: 2, id: 'project-users', label: 'Project Users', component: ProjectUsers, active: false, isLoaded: false},
    {index: 3, id: 'fields', label: 'Grids', component: Grids, active: false, isLoaded: false},
    {index: 4, id: 'templates', label: 'Templates', component: Templates, active: false, isLoaded: false}
]

class Configuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                name: '',
                customer: '',
                opco: '',
                currency:'',
                projtInspection: true,
                projectShipping: true,
                projectWarehouse: true,
            },
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.getById=this.getById.bind(this);
        this.handleResponse=this.handleResponse.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleDelete=this.handleDelete.bind(this);

    }
    componentDidMount(){
        const { location, dispatch } = this.props
        dispatch(currencyActions.getAll());
        dispatch(customerActions.getAll());
        dispatch(opcoActions.getAll());
        dispatch(projectActions.getAll());
        dispatch(userActions.getAll());
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.getById(qs.id);
        }
    }
    handleCheck(event) {
        const { project } = this.state;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
    }
    handleChange(event) {
        const { name, value } = event.target;
        const { project } = this.state;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
    }
    getById(id) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        return fetch(`${config.apiUrl}/project/findOne/?id=${id}`, requestOptions)
            .then(this.handleResponse)
            .then(
                data =>{
                    this.setState({
                        project: data
                    });
                } );
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
    handleSubmit(event) {
        event.preventDefault();
        const { project } = this.state;
        const { dispatch } = this.props;
        this.setState({ submitted: true });
        // console.log(project._id);
        // console.log(project)
        if (project.name && project.customer && project.opco && project.currency) {
            dispatch(projectActions.update(project));
        }
    }

    handleDelete(id) {
        const { project } = this.state;
        const { dispatch } = this.props
        return (event) => dispatch(projectActions.delete(id));
        // .then(dispatch(projectActions.getAll()));
    }
    render() {
        const { 
                alert, 
                currencies, 
                customers,
                deleting, 
                loading, 
                opcos, 
                users 
            } = this.props;
        const { project } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="configuration">
                    <h2>Project Configuration</h2>
                    <Tabs 
                        currencies={currencies}
                        customers={customers}
                        deleting={deleting}
                        handleChange={this.handleChange}
                        handleCheck={this.handleCheck}
                        handleDelete={this.handleDelete}
                        handleSubmit={this.handleSubmit}
                        loading={loading}
                        opcos={opcos}
                        project={project}
                        tabs={tabs}
                        users={users}
                    />
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, customers, opcos, users  } = state;
    const { loading, deleting } = state.projects;
    return {
        alert,
        currencies,
        customers,
        deleting,
        loading,
        opcos,
        users
    };
}

const connectedConfiguration = connect(mapStateToProps)(Configuration);
export { connectedConfiguration as Configuration };