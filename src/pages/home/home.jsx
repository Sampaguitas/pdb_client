//React
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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
        this.state = {
            filter:'',
            // view:'Customer',
            opcos: this.props.opcos.items,
            loading: true
        };
        // this.switchView = this.switchView.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterView = this.filterView.bind(this);

    }    
    
    componentDidMount() {
        // this.props.dispatch(customerActions.getAll());
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(projectActions.getAll());
    }
    // switchView() {
    //     if (this.state.view == 'Customer') {
    //         this.setState({ view: 'Opco'});
    //     }else {
    //         this.setState({ view: 'Customer' });
    //     } 
    // }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
        this.filterView(value, this.state.view);
    }
    filterView(value, view){
        if (view == 'Customer'){
            if (!value) {
                this.setState({
                    customers: this.props.customers.items 
                });
            } else {
                value = value.replace(/([()[{*+.$^\\|?])/g, ""); ///([()[{*+.$^\\|?])/g
                this.setState({
                    customers: this.props.customers.items.filter((customer) => !!customer.name.match(new RegExp(value, "i")))
                }); 
            }

        } else {
            if (!value) {
                this.setState({
                    opcos: this.props.opcos.items
                });
            } else {
                this.setState({
                    opcos: this.props.opcos.items.filter((opco) => !!opco.name.match(new RegExp(value, "i")))
                });
            }
        }
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
                        .map((project) =><ProjectRow project={project} key={project._id} />)
                        }
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
