import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../../../_components/layout';

class ProjectWarhouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: ''
        }
        this.showUpload=this.showUpload.bind(this);
    }
    componentDidMount(){
        var qs = queryString.parse(window.location.search);
        if (qs.id) {
            this.setState({projectId: qs.id})
        }
    }
    showUpload(){

    }
    render() {
        const { projectId } = this.state
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="projectwarhouse">
                    <h2>Warehouse - Warehouse Locations</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Warehouses</h5>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <FontAwesomeIcon 
                                                        icon="industry" 
                                                        className="fa-2x" 
                                                        name="industry"
                                                    />
                                                </span>
                                            </div>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Type here the name of the warehouse..."
                                            />
                                            <div className="input-group-append">
                                                <button 
                                                    className="btn btn-outline-leeuwen"
                                                    type="submit"
                                                > Add Warehouse</button>
                                                <button
                                                    className="btn btn-leeuwen"
                                                    type="button"
                                                    onClick={this.showUpload}
                                                >
                                                    <FontAwesomeIcon 
                                                        icon="file-excel" 
                                                        className="fa-2x" 
                                                        name="file-excel"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
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

const connectedProjectWarhouse = connect(mapStateToProps)(ProjectWarhouse);
export { connectedProjectWarhouse as ProjectWarhouse };