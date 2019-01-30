import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../_components/layout';

class ProjectOrders extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h2>Project Orders</h2>
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

const connectedProjectOrders = connect(mapStateToProps)(ProjectOrders);
export { connectedProjectOrders as ProjectOrders };