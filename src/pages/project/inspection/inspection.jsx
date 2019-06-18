import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { projectActions } from '../../../_actions';
import Layout from '../../../_components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Inspection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId:''
        };
    }

    componentDidMount() {
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            dispatch(projectActions.getById(qs.id));
            this.setState({projectId: qs.id})
        }
    }

    render() {
        const { projectId } = this.state
        const { alert, selection } = this.props;
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div>: <br />}
                <h2>Inspection : {selection.project && selection.project.name}</h2>
                <hr />
                <div id="inspection">
                    <div className="row justify-content-center">
                    <NavLink to={{ 
                            pathname: "/releasedata",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="clipboard-check" 
                                    className="fa-5x" 
                                    name="clipboard-check"
                                />
                                <h3>Release data</h3>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to={{ 
                            pathname: "/certificates",
                            search: '?id=' + projectId
                        }} className="card col-lg-4 m-lg-5 col-md-12 m-md-0 p-5" tag="a"
                    >
                        <div className="card-body">
                            <div className="text-center">
                                <FontAwesomeIcon 
                                    icon="file-certificate" 
                                    className="fa-5x" 
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
    const { alert, selection } = state;
    return {
        alert,
        selection
    };
}

const connectedInspection = connect(mapStateToProps)(Inspection);
export { connectedInspection as Inspection };