import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { accessActions, alertActions, projectActions, sidemenuActions } from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Inspection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:'',
            menuItem: 'Inspection'
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount() {
        const { menuItem } = this.state;
        const { 
            dispatch,
            loadingAccesses,
            loadingSelection, 
            location 
        } = this.props;
        dispatch(sidemenuActions.select(menuItem));
        var qs = queryString.parse(location.search);
        if (qs.id) {
            //State items with projectId
            this.setState({projectId: qs.id});
            if (!loadingAccesses) {
                dispatch(accessActions.getAll(qs.id));
            }
            if (!loadingSelection) {
                dispatch(projectActions.getById(qs.id));
            }
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
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/dashboard', search: '?id=' + projectId }} tag="a">Dashboard</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Inspection:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa fa-fw" />}</span>
                    </ol>
                </nav>
                <div id="inspection" className={alert.message ? "main-section-alert" : "main-section"}>
                    <div className="row justify-content-center" style={{maxHeight: '100%', overflowY: 'auto'}}>
                        <NavLink to={{ 
                                pathname: "/releasedata",
                                search: '?id=' + projectId
                            }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
                        >
                            <div className="card-body">
                                <div className="text-center">
                                    <FontAwesomeIcon 
                                        icon="clipboard-check" 
                                        className="fa-5x mb-3" 
                                        name="clipboard-check"
                                    />
                                    <h3>Inspection & Release data</h3>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink to={{ 
                                pathname: "/certificates",
                                search: '?id=' + projectId
                            }} className="card col-lg-5 m-lg-4 col-md-12 m-md-0 p-5" tag="a"
                        >
                            <div className="card-body">
                                <div className="text-center">
                                    <FontAwesomeIcon 
                                        icon="file-certificate" 
                                        className="fa-5x mb-3" 
                                        name="file-certificate"
                                    />
                                    <h3>Certificates</h3>
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
    const { accesses, alert, selection, sidemenu } = state;
    const { loadingAccesses } = accesses;
    const { loadingSelection } = selection;
    return {
        accesses,
        alert,
        loadingAccesses,
        loadingSelection,
        selection,
        sidemenu
    };
}

const connectedInspection = connect(mapStateToProps)(Inspection);
export { connectedInspection as Inspection };