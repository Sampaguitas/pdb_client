import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../../_components/layout';

class GoodsReceipt extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="goodsreceipt">
                    <h2>GoodsReceipt</h2>
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

const connectedGoodsReceipt = connect(mapStateToProps)(GoodsReceipt);
export { connectedGoodsReceipt as GoodsReceipt };