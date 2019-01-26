import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../_components/layout';

class Configuration extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="configuration">
                    <h2>Project Configuration</h2>
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

const connectedConfiguration = connect(mapStateToProps)(Configuration);
export { connectedConfiguration as Configuration };