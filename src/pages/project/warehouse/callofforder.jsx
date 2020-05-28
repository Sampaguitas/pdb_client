import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { accessActions, alertActions, projectActions } from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CallOffOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mir: '',
            dateReceived: '',
            dateExpected: '',
            items: '',
            weight: '',
            projectId:'',

        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
    }

    componentDidMount() {
        const { 
            dispatch,
            loadingAccesses,
            loadingSelection, 
            location 
        } = this.props;

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

    // toggleSort() {

    // }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        dispatch(alertActions.clear());
    }

    render() {
        const { accesses, alert, selection } = this.props;
        const { projectId } = this.state;
        return (
            <Layout alert={alert} accesses={accesses} selection={selection}>
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
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/warehouse', search: '?id=' + projectId }} tag="a">Warehouse</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Call-off order:</li>
                        <span className="ml-3 project-title">{selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-lg fa-fw" />}</span>
                    </ol>
                </nav>
                <hr />
                <div id="calloff" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <div className="ml-auto pull-right">
                            <button title="Create MIR" className="btn btn-leeuwen-blue btn-lg" style={{height: '34px'}}>
                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Create</span>
                            </button>
                        </div>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>   
                        <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                            <div className="table-responsive custom-table-container" >
                                <table className="table table-hover table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            {/* <HeaderInput
                                                type="text"
                                                title="MIR"
                                                name="mir"
                                                value={mir}
                                                onChange={this.handleChange}
                                                // width="10%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Date Received"
                                                name="dateReceived"
                                                value={dateReceived}
                                                onChange={this.handleChange}
                                                // width="40%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Date Expected"
                                                name="dateExpected"
                                                value={dateExpected}
                                                onChange={this.handleChange}
                                                // width="40%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="number"
                                                title="Items"
                                                name="items"
                                                value={items}
                                                onChange={this.handleChange}
                                                // width="40%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            />
                                            <HeaderInput
                                                type="number"
                                                title="Weight"
                                                name="weight"
                                                value={weight}
                                                onChange={this.handleChange}
                                                // width="10%"
                                                sort={sort}
                                                toggleSort={this.toggleSort}
                                            /> */}
                                        </tr>
                                    </thead>
                                    <tbody className="full-height">
                                        {/* {projects.items && this.withoutProjectMaster(projects.items).map((project) =>
                                            <tr key={project._id} style={{cursor: 'pointer'}} onClick={(event) => this.handleOnclick(event, project)}>
                                                <td className="no-select">{project.number}</td>
                                                <td className="no-select">{project.name}</td>
                                                <td className="no-select">{project.opco.name}</td>
                                                <td className="no-select">{project.erp.name}</td>
                                            </tr>
                                        )} */}
                                    </tbody>
                                    
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { accesses, alert, selection } = state;
    const { loadingAccesses } = accesses;
    const { loadingSelection } = selection;
    
    return {
        accesses,
        alert,
        loadingAccesses,
        loadingSelection,
        selection
    };
}

const connectedCallOffOrder = connect(mapStateToProps)(CallOffOrder);
export { connectedCallOffOrder as CallOffOrder };