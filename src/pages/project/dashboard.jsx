import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    settingActions,
    screenActions,
    sidemenuActions,
    userActions,
} from '../../_actions';
import {
    Layout
} from '../../_components';
import _ from 'lodash';

function isRole(accesses, user, role) {
    if (!_.isUndefined(accesses) && accesses.hasOwnProperty('items') && user && role) {
        return accesses.items.reduce(function (acc, curr){
            if (!acc && curr.userId === user.id && curr[role] === true) {
                acc = true;
            }
            return acc;
        }, false);
    } else {
        return false
    }
}

function menuList(menu, accesses, selection){
    let enabledMenus = [];
    let listMenu = [];
    // const { accesses } = this.props
    let user = JSON.parse(localStorage.getItem('user'));
    if (!!selection && selection.hasOwnProperty('project') && !_.isEmpty(selection.project)) {
        
        menu.forEach(function (item) {
            switch(item.title) {
                case 'Expediting':
                    if (!!selection.project.enableInspection || !!selection.project.enableShipping) {
                        enabledMenus.push(item);
                    }
                    break;
                case 'Inspection':
                    if (!!selection.project.enableInspection) {
                        enabledMenus.push(item);
                    }
                    break;
                case 'Shipping':
                    if (!!selection.project.enableShipping) {
                        enabledMenus.push(item);
                    }
                    break;
                case 'Warehouse':
                    if (!!selection.project.enableWarehouse) {
                        enabledMenus.push(item);
                    }
                    break;
                default: enabledMenus.push(item);
            }
        });

        enabledMenus.forEach(function(item) {
            if (!item.roles){
                listMenu.push(item);
            } else if (item.roles.includes('isAdmin') && user.isAdmin) {
                listMenu.push(item);
            } else if (item.roles.includes('isSuperAdmin') && user.isSuperAdmin) {
                listMenu.push(item);
            } else if (item.roles.includes('isExpediting') && isRole(accesses, user, 'isExpediting')) {
                listMenu.push(item);
            } else if (item.roles.includes('isInspection') && isRole(accesses, user, 'isInspection')) {
                listMenu.push(item);
            } else if (item.roles.includes('isShipping') && isRole(accesses, user, 'isShipping')) {
                listMenu.push(item);
            } else if (item.roles.includes('isWarehouse') && isRole(accesses, user, 'isWarehouse')) {
                listMenu.push(item);
            } else if (item.roles.includes('isConfiguration') && isRole(accesses, user, 'isConfiguration')) {
                listMenu.push(item);
            }
        });

    } 
    return listMenu;
}

function generateMenu(menuList, projectId, accesses, selection) {
    if (_.isEmpty(menuList) && accesses.items && selection.project) {
        return (
            <div>
                <h3 className="mt-3">You currently don't have access to any of the enabled project modules.</h3>
                <p>Contact one of your administrators to be granted access...</p>
            </div>
        )
    } else {
        let tempScreen = []
        menuList.map(function (menu, index) {
            tempScreen.push(
                <NavLink
                    key={index}
                    to={{ 
                    pathname: menu.href,
                    search: '?id=' + projectId
                    }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
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
            projectId:'',
            menuItem: 'Dashboard'
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount() {
        const { menuItem } = this.state;
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
            loadingSettings,
            loadingSuppliers,
            location,
            opcos,
            screens,
            users
        } = this.props;

        var qs = queryString.parse(location.search);
        let userId = JSON.parse(localStorage.getItem('user')).id;
        dispatch(sidemenuActions.select(menuItem));
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
            if (!loadingSettings) {
                dispatch(settingActions.getAll(qs.id, userId));
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

    toggleCollapse() {
        const { dispatch } = this.props;
        dispatch(sidemenuActions.toggle());
    }


    render() {

        const menu = [
            { id: 1, title: 'Data Upload File (DUF)', href: '/duf', icon: 'upload', roles: ['isAdmin', 'isSuperAdmin', 'isConfiguration'] },
            { id: 2, title: 'Expediting', href: '/expediting', icon: 'stopwatch', roles: ['isAdmin', 'isSuperAdmin', 'isExpediting']},
            { id: 3, title: 'Inspection', href: '/inspection', icon: 'search', roles: ['isAdmin', 'isSuperAdmin', 'isInspection']},
            { id: 4, title: 'Shipping', href: '/shipping', icon: 'ship', roles: ['isAdmin', 'isSuperAdmin', 'isShipping']},
            { id: 5, title: 'Warehouse', href: '/warehouse', icon: 'warehouse', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse']},
            { id: 6, title: 'Configuration', href: '/configuration', icon: 'cog', roles: ['isAdmin', 'isSuperAdmin', 'isConfiguration']},
        ];

        const { projectId, menuItem } = this.state
        const { accesses, alert, selection, sidemenu } = this.props;

        return (
            <Layout accesses={accesses} selection={selection} sidemenu={sidemenu} toggleCollapse={this.toggleCollapse} menuItem={menuItem}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">Dashboard:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="dashboard" className={alert.message ? "main-section-alert" : "main-section"}>
                    <div className="row justify-content-center" style={{maxHeight: '100%', overflowY: 'auto'}}>
                        {generateMenu(menuList(menu, accesses, selection), projectId, accesses, selection)}
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
        settings,
        sidemenu,
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
    const { loadingSettings } = settings;
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
        loadingSettings,
        opcos,
        pos,
        screens,
        selection,
        settings,
        sidemenu,
        suppliers,
        users
    };
}

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };