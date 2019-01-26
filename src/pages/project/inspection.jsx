import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../_components/layout';

class Inspection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="inspection">
                    <h2>Inspection</h2>
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

const connectedInspection = connect(mapStateToProps)(Inspection);
export { connectedInspection as Inspection };