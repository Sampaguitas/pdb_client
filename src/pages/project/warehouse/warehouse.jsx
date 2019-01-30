import React from 'react';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Warehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: ''
        }
    }
    componentDidMount(){
        var qs = queryString.parse(window.location.search);
        if (qs.id) {
            this.setState({projectId: qs.id})
        }
    }

    render() {
        const { projectId } = this.state
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="warehouse">
                    <h2>Warehouse - Warehouse</h2>
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
    const { alert } = state;
    return {
        alert,
    };
}

const connectedWarehouse = connect(mapStateToProps)(Warehouse);
export { connectedWarehouse as Warehouse };