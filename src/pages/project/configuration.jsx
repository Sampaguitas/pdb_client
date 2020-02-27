import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { 
    accessActions, 
    alertActions, 
    docdefActions,
    docfieldActions, 
    currencyActions, 
    erpActions,
    fieldnameActions, 
    fieldActions, 
    opcoActions, 
    projectActions, 
    supplierActions, 
    screenActions, 
    userActions  
} from '../../_actions';
import { authHeader, history } from '../../_helpers';
import Layout from '../../_components/layout';
import Tabs from '../../_components/tabs/tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import General from './tabs/configuration/general';
import Suppliers from './tabs/configuration/suppliers';
import Fields from './tabs/configuration/fields';
import Screens from './tabs/configuration/screens';
import Documents from './tabs/configuration/documents';
import Duf from './tabs/configuration/duf';
import Certificates from './tabs/configuration/certificates';
// import { EventEmitter } from 'events';

const tabs = [
    {index: 0, id: 'general', label: 'General', component: General, active: true, isLoaded: false},
    {index: 1, id: 'suppliers', label: 'Suppliers', component: Suppliers, active: false, isLoaded: false},
    {index: 2, id: 'fields', label: 'Fields', component: Fields, active: false, isLoaded: false},
    {index: 3, id: 'screens', label: 'Screens', component: Screens, active: false, isLoaded: false},
    {index: 4, id: 'documents', label: 'Documents', component: Documents, active: false, isLoaded: false},
    {index: 5, id: 'duf', label: 'DUF', component: Duf, active: false, isLoaded: false},
    {index: 6, id: 'certificates', label: 'Certificates', component: Certificates, active: false, isLoaded: false}
]

const _ = require('lodash');

class Configuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submittedProject: false,
            projectUpdating: false,
            projectDeleting: false,
            projectId: '',
            alert: {
                type:'',
                message:''
            }
        }
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleSubmitProject=this.handleSubmitProject.bind(this);
        this.handleDeleteProject=this.handleDeleteProject.bind(this);
        this.refreshProject = this.refreshProject.bind(this);
        this.refreshDocfields = this.refreshDocfields.bind(this);
        this.refreshFieldnames = this.refreshFieldnames.bind(this);
        this.refreshFields = this.refreshFields.bind(this);
        this.refreshSuppliers = this.refreshSuppliers.bind(this);
    }

    componentDidMount(){
        const { 
            currencies,
            erps,
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingDocfields,
            loadingFieldnames,
            loadingFields,
            loadingSelection,
            loadingSuppliers,
            location,
            opcos,
            screens,
            users
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingDocdefs) {
                dispatch(docdefActions.getAll(qs.id));
            }
            if (!loadingDocfields) {
                dispatch(docfieldActions.getAll(qs.id));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
            if (!loadingSuppliers) {
                dispatch(supplierActions.getAll(qs.id));
            }
        }
        //State items without projectId
        if (!currencies.items) {
            dispatch(currencyActions.getAll());
        }
        if (!erps.items) {
            dispatch(erpActions.getAll());
        }
        if (!opcos.items) {
            dispatch(opcoActions.getAll());
        }
        if (!screens.items) {
            dispatch(screenActions.getAll());
        }
        if (!users.items) {
            dispatch(userActions.getAll());
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { fields } = this.props;
        if (fields != prevProps.fields){
            this.refreshFieldnames;
            this.refreshDocfields;
        }
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        this.setState({ 
            alert: {
                type:'',
                message:'' 
            } 
        });
        dispatch(alertActions.clear());
    }

    refreshProject() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(projectActions.getById(projectId)); //loadingSelection
            dispatch(accessActions.getAll(projectId)); //loadingAccesses
        }
    }

    refreshDocdefs() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(docdefActions.getAll(projectId)); //loadingDocdefs
        }
    }

    refreshDocfields() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(docfieldActions.getAll(projectId)); //loadingDocfields
        }
    }

    refreshFieldnames() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(fieldnameActions.getAll(projectId)); //loadingFieldnames
        }
    }

    refreshFields() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(fieldActions.getAll(projectId)); //loadingFields
        }
    }

    refreshSuppliers() {
        const { dispatch } = this.props;
        const { projectId } = this.state;
        if (projectId) {
            dispatch(supplierActions.getAll(projectId)); //loadingSuppliers
        }
    }

    handleSubmitProject(event, project) {
        event.preventDefault();
        this.setState({submittedProject: true});
        if (project._id, project.name && project.erpId && project.opcoId) {
            this.setState({ submittedProject: false, projectUpdating: true });
            const requestOptions = {
                method: 'PUT',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify(project)
            };
        
            return fetch(`${config.apiUrl}/project/update?id=${project.id}`, requestOptions)
            .then(responce => responce.text().then(text => {
                const data = text && JSON.parse(text);
                if (!responce.ok) {
                    if (responce.status === 401) {
                        localStorage.removeItem('user');
                        location.reload(true);
                    }
                    this.setState({
                        projectUpdating: false,
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshProject);
                } else {
                    this.setState({
                        projectUpdating: false,
                        alert: {
                            type: responce.status === 200 ? 'alert-success' : 'alert-danger',
                            message: data.message
                        }
                    }, this.refreshProject);
                }
            }));
        }
    }

    handleDeleteProject(event, id) {
        event.preventDefault();
        if (id) {
            this.setState({projectDeleting: true})
            const requestOptions = {
                method: 'DELETE',
                headers: authHeader()
            };
            return fetch(`${config.apiUrl}/project/delete?id=${id}`, requestOptions)
            .then(function (responce) {
                responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (!responce.ok) {
                        if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                        } else {
                            this.setState({
                                projectDeleting: false,
                                alert: {
                                    type: 'alert-danger',
                                    message: data.message
                                }  
                            }, this.refreshProject);
                        }
                    } else if (responce.status === 200){
                        dispatch(alertActions.success('Project successfully deleted'));
                        history.push('/');
                    } else {
                        this.setState({
                            projectDeleting: false,
                            alert: {
                                type: 'alert-danger',
                                message: 'Project could not be deleted'
                            }
                        }, this.refreshProject);
                    }
                });
            });
        }
    }

    render() {
        const {
                accesses, 
                // alert,
                currencies,
                docdefs,
                docfields,
                erps,
                fieldnames,
                fields,
                opcos,
                screens,
                selection,
                suppliers,
                users,
            } = this.props;
        
            const {
                projectId,
                submittedProject,
                projectUpdating,
                projectDeleting,
                
            } = this.state

            const alert = this.state.alert.message ? this.state.alert : this.props.alert;    

        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Configuration > {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="configuration" className="full-height">
                    <Tabs
                        tabs={tabs}
                        //Functions
                        handleSubmitProject={this.handleSubmitProject}
                        handleDeleteProject={this.handleDeleteProject}
                        
                        //refreshStore
                        refreshProject={this.refreshProject}
                        refreshDocdefs={this.refreshDocdefs}
                        refreshDocfields={this.refreshDocfields}
                        refreshFieldnames={this.refreshFieldnames}
                        refreshFields={this.refreshFields}
                        refreshSuppliers={this.refreshSuppliers}

                        //Props
                        accesses={accesses}
                        currencies={currencies}
                        docdefs={docdefs}
                        docfields={docfields}
                        erps={erps}
                        fieldnames={fieldnames}
                        fields={fields}
                        opcos={opcos}
                        screens={screens}
                        selection={selection}
                        suppliers={suppliers}
                        users={users}

                        //State
                        projectId={projectId}
                        submittedProject={submittedProject}
                        projectUpdating={projectUpdating}
                        projectDeleting={projectDeleting}
                        
                    />
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { 
        accesses, 
        alert, 
        currencies, 
        docdefs,
        docfields,
        erps,
        fieldnames,
        fields, 
        opcos, 
        screens, 
        selection, 
        suppliers, 
        users 
    } = state;

    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingDocfields } = docfields;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingSelection } = selection;
    const { loadingSuppliers } = suppliers;
    return {
        accesses,
        alert,
        currencies,
        docdefs,
        docfields,
        erps,
        fieldnames,
        fields,
        loadingAccesses,
        loadingDocdefs,
        loadingDocfields,
        loadingFieldnames,
        loadingFields,
        loadingSelection,
        loadingSuppliers,
        opcos,
        screens,
        selection,
        suppliers,
        users,
    };
}

const connectedConfiguration = connect(mapStateToProps)(Configuration);
export { connectedConfiguration as Configuration };