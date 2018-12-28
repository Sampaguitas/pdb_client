//React
import React from 'react';
import { Link } from 'react-router-dom';
//Redux
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
//Components
import Layout from '../../_components/layout';
import ProjectCard from '../../_components/project-card/project-card.js';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

//Styles
import './home.css';
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.switchView = this.switchView.bind(this)
        this.state = {
            filter: '',
            erps: [],
            opcos: [],
            customers: [],
            view: 'Customer',
            loading: true
        };
    }    
    
    // componentDidMount() {
    //     this.props.dispatch(userActions.getAll());
    // }
    switchView() {
        if (this.state.view == 'Customer') {
            this.setState({ view: 'Opco'});
        }else {
            this.setState({ view: 'Customer' });
        } 
    }
    filteredCustomers() {
        return this.customers.filter((c) => { return c.text.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 });
    }
    filteredOpcos() {
        return this.opcos.filter((c) => { return c.text.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0 });
    }

    render() {
        const { user, users } = this.props;
        return (
            <Layout>
                <div id="homeIndex" className="row">
                    <div className="col-md-12">
                        <div className="input-group input-group-lg mb-3">
                            <input className="form-control text-center" v-model="filter" placeholder={"Filter " + this.state.view + "'s..."} />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.switchView}>
                                    <span><FontAwesomeIcon icon={faEye} className="fa-lg"/> Switch View</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {this.state.view == 'Customer' ? <ProjectCard /> : <div>Opco</div>}
                </div >
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };


{/* <div className="col-md-6 col-md-offset-3">
    <h1>Hi {user.firstName}!</h1>
    <p>You're logged in with React!!</p>
    <h3>All registered users:</h3>
    {users.loading && <em>Loading users...</em>}
    {users.error && <span className="text-danger">ERROR: {users.error}</span>}
    {users.items &&
        <ul>
            {users.items.map((user, index) =>
                <li key={user._id}>
                    {user._id + ' ' + user.firstName + ' ' + user.lastName + ' ' + user.email}
                    {
                        user.deleting ? <em> - Deleting...</em>
                            : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                : <span> - <a onClick={this.handleDeleteUser(user._id)}>Delete</a></span>
                    }
                </li>
            )}
        </ul>
    }
    <p>
        <Link to="/login">Logout</Link>
    </p>
</div> */}