import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'config';
import { opcoActions } from '../../_actions';
import { authHeader } from '../../_helpers';
import Layout from '../../_components/layout';
import Card from '../../_components/card/card';
import './dashboard.css';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    // componentDidMount() {
    //     const { location } = this.props
    //     this.props.dispatch(userActions.getAll());
    //     var qs = queryString.parse(location.search);
    //     if (qs.id) {
    //         this.getById(qs.id);
    //     }
    // }


    render() {
        const { alert } = this.props;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="projectDashboard">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h3>Project : </h3>
                        </div>
                        <div className="col-md-6 text-right">
                            <button className="btn btn-leeuwen">
                                <FontAwesomeIcon icon="plus" /> New ProjectOrder
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 margin-bottom">
                            <Card 
                                color="blue-header"
                                header="Open Project Orders"
                            />
                        </div>
                        <div className="col-md-6 margin-bottom">
                            <Card
                                color="blue-header"
                                header="Late Project Orders"
                            />
                        </div>
                        <div className="col-md-12 margin-bottom">
                            <Card
                                color="blue-header"
                                header="Ready for shipping"
                            />
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

const connectedDashboard = connect(mapStateToProps)(Dashboard);
export { connectedDashboard as Dashboard };