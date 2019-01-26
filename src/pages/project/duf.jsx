import React from 'react';
import { connect } from 'react-redux';
import Layout from '../../_components/layout';

class Duf extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="duf">
                    <h2>Upload DUF</h2>
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

const connectedDuf = connect(mapStateToProps)(Duf);
export { connectedDuf as Duf };