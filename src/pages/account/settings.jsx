import React from 'react';
import { connect } from 'react-redux';

import { userActions } from '../../_actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Components
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';
import { users } from '../../_reducers/users.reducer';


class Settings extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     user: {
        //         firstName: '',
        //         lastName: '',
        //         phone: '',
        //         email: '',
        //         password: ''
        //     },
        //     submitted: false
        // };

        // this.handleCheck = this.handleCheck.bind(this);
    }
    componentDidMount() {

        this.props.dispatch(userActions.getAll());

    }
    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { user } = this.state;
        const { dispatch } = this.props;
        if (user.firstName && user.lastName && user.email && user.phone && user.password) {
            dispatch(userActions.register(user));
        }
    }

    render() {
        const { user, users } = this.props;
        return (
            <Layout>
                <div id="user">
                    <h2>Settings</h2>
                    <div className="row">
                        {/* <div className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-header">
                                    <h5>New User</h5>
                                </div>
                                <div className="card-body">
                                    <form name="form" onSubmit={this.handleSubmit}>
                                        <Input
                                            title="User Name"
                                            name="userName"
                                            type="email"
                                            value={user.email}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Input
                                            title="Password"
                                            name="password"
                                            type="password"
                                            value={user.password}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <button type="submit" className="btn btn-leeuwen btn-full btn-lg">
                                            Register {registering ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Users</h5>
                                </div>
                                <div className="card-body table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Admin</th>
                                            </tr>
                                        </thead>
                                        {users.items &&
                                        <tbody>
                                            {
                                                users.items.map((user, index) => 
                                                <tr
                                                    key={user.id}
                                                >
                                                    <td>{user.firstName + ' ' + user.lastName}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone}</td>
                                                    <td>
                                                            {/* <TableCheckBox 
                                                                id='isAdmin'
                                                                checked={user.isAdmin}
                                                                onChange={this.handleCheck}
                                                            /> */}
                                                    </td>
                                                </tr>
                                               ) 
                                            }
                                            
                                        </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

const connectedSettings = connect(mapStateToProps)(Settings);
export { connectedSettings as Settings };