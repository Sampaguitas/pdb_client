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
            },
            projtInspection: true,
            projectShipping: true,
            projectWarehouse: true,
            submitted: false
        };
        this.getById=this.getById.bind(this);
        this.handleResponse=this.handleResponse.bind(this);

    }
    componentDidMount(){
        const { location } = this.props
        this.props.dispatch(currencyActions.getAll());
        this.props.dispatch(customerActions.getAll());
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(projectActions.getAll());
        this.props.dispatch(userActions.getAll());
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
                ...this.state,
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
        const { alert, currencies, customers, opcos, users } = this.props;
        const { project } = this.state;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="configuration">
                    <h2>Project Configuration</h2>
                    <Tabs 
                        tabs={tabs}
                        project={project}
                        currencies={currencies}
                        customers={customers}
                        opcos={opcos}
                        users={users}
                    />
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { loading } = state.projects;
    const { alert, currencies, customers, opcos, users  } = state;
    return {
        alert,
        currencies,
        customers,
        opcos,
        users
    };
}

const connectedConfiguration = connect(mapStateToProps)(Configuration);
export { connectedConfiguration as Configuration };