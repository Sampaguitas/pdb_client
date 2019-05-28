import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { projectActions } from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Warehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            dispatch(projectActions.getById(qs.id));
        }
    }

    render() {
        const { projectId } = this.state
        const { alert, selection } = this.props;
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Warehouse: {selection.project && selection.project.name}</h2>
                <hr />
                <div id="warehouse">
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