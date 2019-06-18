import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { projectActions } from '../../../_actions';
import Layout from '../../../_components/layout';

class OutgoingShipments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            dispatch(projectActions.getById(qs.id));
        }
    }

    render() {
        const { alert, selection } = this.props;
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div>: <br />}
                <h2>Warehouse - Outgoing shipments : {selection.project && selection.project.name}</h2>
                <hr />
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

const connectedOutgoingShipments = connect(mapStateToProps)(OutgoingShipments);
export { connectedOutgoingShipments as OutgoingShipments };