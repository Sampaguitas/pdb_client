import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';

class StockManagement extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="stockmanagement">
                    <h2>Warehouse - Stock Management</h2>
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

const connectedStockManagement = connect(mapStateToProps)(StockManagement);
export { connectedStockManagement as StockManagement };