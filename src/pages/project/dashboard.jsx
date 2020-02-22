import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { 
    accessActions,
    alertActions,
    docdefActions,
    docfieldActions,
    currencyActions,
    erpActions,
    fieldActions,
    fieldnameActions,
    opcoActions,
    poActions,
    projectActions,
    supplierActions,
    screenActions,
    userActions,
} from '../../_actions';
import Layout from '../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function isRole(accesses, user, role) {
    if (!_.isEmpty(accesses) && accesses.hasOwnProperty('items') && user && role) {
        return accesses.items.reduce(function (acc, curr){
            if (!acc && _.isEqual(curr.userId, user._id)) {
                acc = curr[role];
            }
            return acc;
        }, false);
    } else {
        return false
    }
}

function menuList(menu, accesses){
    var listMenu = []
    // const { accesses } = this.props
    let user = JSON.parse(localStorage.getItem('user'));
        menu.forEach(function(item) {
            if (!item.roles){
                listMenu.push(item);
            } else if (item.roles.indexOf('isAdmin') > -1 && user.isAdmin) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isSuperAdmin') > -1 && user.isSuperAdmin) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isExpediting') > -1 && isRole(accesses, user, 'isExpediting')) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isInspection') > -1 && isRole(accesses, user, 'isInspection')) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isShipping') > -1 && isRole(accesses, user, 'isShipping')) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isWarehouse') > -1 && isRole(accesses, user, 'isWarehouse')) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isConfiguration') > -1 && isRole(accesses, user, 'isConfiguration')) {
                listMenu.push(item);
            }
        });
    return listMenu;
}

function generateMenu(menuList, projectId) {
    if (_.isEmpty(menuList)) {
        return (
            <div>
                <h3 className="mt-3">You currently don't have access to any of the project modules.</h3>
                <p>Contact one of your administrators to be granted access...</p>
            </div>
        )
    } else {
        let tempScreen = []
        menuList.map(function (menu) {
            tempScreen.push(
                <NavLink
                    to={{ 
                    pathname: menu.href,
                    search: '?id=' + projectId
                    }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                >
                    <div className="card-body">
                        <div className="text-center">
                            <FontAwesomeIcon 
                                icon={menu.icon} 
                                className="fa-5x mb-3" 
                                name={menu.icon}
                            />
                            <h3>{menu.title}</h3>
                        </div>
                    </div>
                </NavLink>
            );
        });
        return tempScreen;
    }
}


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:''
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        // this.menuList = this.menuList.bind(this);
    }

    componentDidMount() {
        const { 
            currencies,
            erps,
            dispatch,
            loadingAccesses,
            loadingDocdefs,
            loadingDocfields,
            loadingFieldnames,
            loadingFields,
            loadingPos,
            loadingSelection,
            loadingSuppliers,
            location,
            opcos,
            screens,
            users
        } = this.props;

        var qs = queryString.parse(location.search);
        if (qs.id) {
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
            if (!loadingFields) {
                dispatch(fieldActions.getAll(qs.id));
            }
            if (!loadingFieldnames) {
                dispatch(fieldnameActions.getAll(qs.id));
            }
            if (!loadingPos) {
                dispatch(poActions.getAll(qs.id));
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

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        dispatch(alertActions.clear());
    }

    



    render() {

        const menu = [
            { id: 1, title: 'Data Upload File (DUF)', href: '/duf', icon: 'upload', roles: ['isAdmin', 'isSuperAdmin'] },
            { id: 2, title: 'Expediting', href: '/expediting', icon: 'stopwatch', roles: ['isAdmin', 'isSuperAdmin', 'isExpediting']},
            { id: 3, title: 'Inspection', href: '/inspection', icon: 'search', roles: ['isAdmin', 'isSuperAdmin', 'isInspection']},
            { id: 4, title: 'Shipping', href: '/shipping', icon: 'ship', roles: ['isAdmin', 'isSuperAdmin', 'isShipping']},
            { id: 5, title: 'Warehouse', href: '/warehouse', icon: 'warehouse', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse']},
            { id: 6, title: 'Configuration', href: '/configuration', icon: 'cog', roles: ['isAdmin', 'isSuperAdmin', 'isConfiguration']},
        ];

        const { projectId } = this.state
        const { accesses, alert, selection } = this.props;

        return (
            <Layout alert={alert} accesses={accesses}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Dashboard > {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="dashboard">
                    <div className="row justify-content-center">
                        {generateMenu(menuList(menu, accesses), projectId)}
                    {/* <NavLink to={{ 
                            pathname: "/duf",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="upload" 
                                    className="fa-5x mb-3" 
                                    name="upload"
                                />
                                <h3>Data Upload File (DUF)</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/expediting",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="stopwatch" 
                                    className="fa-5x mb-3" 
                                    name="stopwatch"
                                />
                                <h3>Expediting</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/inspection",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="search" 
                                    className="fa-5x mb-3" 
                                    name="search"
                                />
                                <h3>Inspection</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/shipping",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="ship" 
                                    className="fa-5x mb-3" 
                                    name="ship"
                                />
                                <h3>Shipping</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/warehouse",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="warehouse" 
                                    className="fa-5x mb-3" 
                                    name="warehouse"
                                />
                                <h3>Warehouse</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/configuration",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="cog" 
                                    className="fa-5x mb-3" 
                                    name="cog"
                                />
                                <h3>Configuration</h3>
                            </div>
                        </div>
                    </NavLink> */}
                    </div>
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
        pos, 
        selection,
        suppliers,
        users
    } = state;

    const { loadingAccesses } = accesses;
    const { loadingDocdefs } = docdefs;
    const { loadingDocfields } = docfields;
    const { loadingFieldnames } = fieldnames;
    const { loadingFields } = fields;
    const { loadingPos } = pos;
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
        loadingPos,
        loadingSelection,
        loadingSuppliers,
        opcos,
        pos,
        screens,
        selection,
        suppliers,
        users
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };