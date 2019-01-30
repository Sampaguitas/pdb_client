import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';

class CallOffOrder extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="callofforder">
                    <h2>Warehouse - Call-Off Order</h2>
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

const connectedCallOffOrder = connect(mapStateToProps)(CallOffOrder);
export { connectedCallOffOrder as CallOffOrder };