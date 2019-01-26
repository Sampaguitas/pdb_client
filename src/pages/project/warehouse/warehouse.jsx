import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';

class Warehouse extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="warehouse">
                    <h2>Warehouse</h2>
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

const connectedWarehouse = connect(mapStateToProps)(Warehouse);
export { connectedWarehouse as Warehouse };