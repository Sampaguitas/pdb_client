import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { projectActions } from '../../../_actions';
import Layout from '../../../_components/layout';

class Inspection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            dispatch(projectActions.getById(qs.id));
        }
    }

    render() {
        const { alert, selection } = this.props;
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Inspection : {selection.project && selection.project.name}</h2>
                <hr />
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, selection } = state;
    return {
        alert,
        selection
    };
}

const connectedInspection = connect(mapStateToProps)(Inspection);
export { connectedInspection as Inspection };