import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';

class OutgoingShipments extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="outgoingshipments">
                    <h2>Warehouse - Outgoing Shipments</h2>
                    <div className="form-group">
                    
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

const connectedOutgoingShipments = connect(mapStateToProps)(OutgoingShipments);
export { connectedOutgoingShipments as OutgoingShipments };