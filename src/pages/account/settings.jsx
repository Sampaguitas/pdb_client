import React from 'react';
import { connect } from 'react-redux';

import { userActions } from '../../_actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Components
import TableCheckBox from '../../_components/table-check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';
import { users } from '../../_reducers/users.reducer';


class Settings extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             show:false
         };
         this.showModal = this.showModal.bind(this);
         this.hideModal = this.hideModal.bind(this);
    }
    //         user: {
    //             firstName: '',
    //             lastName: '',
    //             phone: '',
    //             email: '',
    //             password: ''
    //         },
    //         submitted: false
    //     };

    //     // this.handleCheck = this.handleCheck.bind(this);
    componentDidMount() {
        this.props.dispatch(userActions.getAll());
    }
    showModal(){
        this.setState({ show: true });
    }
    hideModal() {
        this.setState({ show: false });
    }
    // handleChange(event) {
    //     const { name, value } = event.target;
    //     const { user } = this.state;
    //     this.setState({
    //         user: {
    //             ...user,
    //             [name]: value
    //         }
    //     });
    // }


    // handleSubmit(event) {
    //     event.preventDefault();

    //     this.setState({ submitted: true });
    //     const { user } = this.state;
    //     const { dispatch } = this.props;
    //     if (user.firstName && user.lastName && user.email && user.phone && user.password) {
    //         dispatch(userActions.register(user));
    //     }
    // }

    render() {
        const { users, alert } = this.props;
        return (
            <Layout alert={alert}>
                <div id="user">
                    <h2>User Settings</h2>
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
                                    <div className="row">
                                        <div className="col-8">
                                            <h5>Users</h5>
                                        </div>
                                        <div className="col-4 text-right">
                                            <div className="modal-link">
                                                <FontAwesomeIcon icon="plus" className="red fa-icon" />
                                            </div>
                                        </div>
                                    </div>
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
                                                users.items.map((u) => 
                                                <tr
                                                    key={u._id}
                                                    
                                                >
                                                    <td>{u.firstName + ' ' + u.lastName}</td>
                                                    <td>{u.email}</td>
                                                    <td>{u.phone}</td>
                                                    <td>
                                                            <TableCheckBox 
                                                                id={u._id}
                                                                checked={u.isAdmin}
                                                                onChange={this.handleInputChange}
                                                            />
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
    const { users, alert } = state;
    return {
        users
    };
}

const connectedSettings = connect(mapStateToProps)(Settings);
export { connectedSettings as Settings };