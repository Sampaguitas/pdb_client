import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';

class PickingLists extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="pickinglists">
                    <h2>Warehouse - Picking Lists</h2>
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

const connectedPickingLists = connect(mapStateToProps)(PickingLists);
export { connectedPickingLists as PickingLists };