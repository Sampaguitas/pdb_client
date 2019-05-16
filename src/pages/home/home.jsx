//React
import React from 'react';
//Redux
import { connect } from 'react-redux';
import { opcoActions, projectActions } from '../../_actions';
//Components
import Layout from '../../_components/layout';
import ProjectRow from '../../_components/project-table/project-row.js';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Styles
import './home.css';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(projectActions.getAll());
    }

    render() {
        const { filter } = this.state;
        const { alert, opcos, projects } = this.props;
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <h2>Select your project</h2>
                <hr />
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Project No</th>
                            <th scope="col">Project</th>
                            <th scope="col">ERP</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.projects.items && this.props.projects.items
                        .sort(function(a,b){
                            if (a.number < b.number) {
                                return -1;
                            }
                            if (a.number > b.number) {
                                return 1;
                            }
                            return 0;
                        }).map((project) =>
                        <ProjectRow project={project} key={project._id} />
                        )}
                    </tbody>
                </table>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, opcos, projects } = state;
    return {
        alert,
        opcos,
        projects
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };
