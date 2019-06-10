import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { currencyActions, customerActions, opcoActions, projectActions, userActions, erpActions  } from '../../_actions';
import { authHeader } from '../../_helpers';
import Layout from '../../_components/layout';
import Tabs from '../../_components/tabs/tabs'

import General from './tabs/configuration/general';
import Suppliers from './tabs/configuration/suppliers';
import Translations from './tabs/configuration/translations';
import Grids from './tabs/configuration/grids';
import Templates from './tabs/configuration/templates';


const tabs = [
    {index: 0, id: 'general', label: 'General', component: General, active: true, isLoaded: false},
    {index: 1, id: 'suppliers', label: 'Suppliers', component: Suppliers, active: false, isLoaded: false},
    {index: 2, id: 'translations', label: 'Translations', component: Translations, active: false, isLoaded: false},
    {index: 3, id: 'fields', label: 'Grids', component: Grids, active: false, isLoaded: false},
    {index: 4, id: 'templates', label: 'Templates', component: Templates, active: false, isLoaded: false}
]

const _ = require('lodash');

class Configuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false
        }
        this.handleSubmitProject=this.handleSubmitProject.bind(this);
        this.handleDelete=this.handleDelete.bind(this);

    }
    componentDidMount(){
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            dispatch(projectActions.getById(qs.id));
        }
        dispatch(currencyActions.getAll());
        dispatch(erpActions.getAll());
        dispatch(opcoActions.getAll());
        dispatch(userActions.getAll());
        dispatch(projectActions.getAll());
    }

    handleSubmitProject(event, project) {
        event.preventDefault();
        // const { project } = this.state;
        const { dispatch } = this.props;
        this.setState({ submitted: true });
        if (project._id, project.name && project.erpId && project.currencyId && project.opcoId) {
            dispatch(projectActions.update(project));
            this.setState({submitted: false})
        }
    }

    handleDelete(event, id) {
        event.preventDefault();
        const { dispatch } = this.props
        dispatch(projectActions.delete(id));
    }
    
    render() {
        const { 
                alert, 
                deleting, 
                loading,
                erps,
                opcos,
                currencies,
                selection,
                users,
            } = this.props;
        
            const { submitted } = this.state

        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Configuration : {selection.project && selection.project.name}</h2>
                <hr />
                <div id="configuration">
                    <Tabs
                        handleDelete={this.handleDelete}
                        handleSubmitProject={this.handleSubmitProject}                    
                        tabs={tabs}
                        erps={erps}
                        opcos={opcos}
                        currencies={currencies}
                        selection={selection}
                        users={users}
                        loading={loading}
                        deleting={deleting}
                        submitted = {submitted}
                    />
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, opcos, users, selection, erps  } = state;
    const { loading, deleting } = state.projects;
    return {
        alert,
        currencies,
        deleting,
        loading,
        opcos,
        users,
        selection,
        erps
    };
}

const connectedConfiguration = connect(mapStateToProps)(Configuration);
export { connectedConfiguration as Configuration };