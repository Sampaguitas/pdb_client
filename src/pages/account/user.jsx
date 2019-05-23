import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
import { authHeader } from '../../_helpers';
import config from 'config';
//Components
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Select from '../../_components/select';
import Layout from '../../_components/layout';


class User extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            stateUser: {
                oldPassword:'',
                newPassword:'',
                confirmPassword:'',  
            },
            submitted:false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(userActions.getAll());
    }

    handleChange(event){
        const { name, value } = event.target;
        const { stateUser } = this.state
        this.setState({
            stateUser: {
                ...stateUser,
                [name]:value
            }
        });
    }

    handleSubmit(event){
        event.preventDefault();
        const { stateUser } = this.state
        const { dispatch } = this.props;
        this.setState({
            submitted: true
        });
        if (
            stateUser.oldPassword &&
            stateUser.newPassword &&
            stateUser.confirmPassword
          ) {
            dispatch(userActions.changePwd(stateUser));
          }
    }

    render() {
        const { user, alert, updating } = this.props;
        const { submitted, stateUser } = this.state
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="user">
                    <h2>User Information</h2>
                    <hr />
                    <div className="row">
                        <div className="col-md-8 col-sm-12 mb-sm-3">
                            <div className="card mb-3">
                                <div className="card-header">User Details</div>
                                <div className="card-body">
                                    <address>
                                    <strong>{user.name}, {user.userName}</strong><br />
                                    {user.opco}<br />
                                    {user.email}
                                    </address>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">My Roles</div>
                                <div className="card-body">
                                    <ul>
                                        { user.isAdmin && <li>Admin</li> }
                                        { user.isSuperAdmin && <li>Super Admin</li> }
                                        { !user.isSuperAdmin && !user.isAdmin && <li>Regular User</li> }
                                        {/* {user.roles.map((role) => <li key={role.id}>{role}</li>)} */}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-12">
                            <div className="card">
                                <div className="card-header">Change Password</div>
                                <div className="card-body">
                                    <form>
                                        <Input
                                            title="Current Password"
                                            name="oldPassword"
                                            type="text"
                                            value={stateUser.oldPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Input
                                            title="New Password"
                                            name="newPassword"
                                            type="text"
                                            value={stateUser.newPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Input
                                            title="Confirm Password"
                                            name="confirmPassword"
                                            type="text"
                                            value={stateUser.confirmPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <button type="submit" className="btn btn-leeuwen btn-full btn-lg mb-3" onClick={this.handleSubmit}>
                                            {updating ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                                            Change Password
                                        </button>
                                    </form>
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
    const { authentication, alert, users } = state;
    const { user } = authentication;
    const { updating } = users;
    return {
        user,
        updating,
        alert
    };
}

const connectedUser = connect(mapStateToProps)(User);
export { connectedUser as User };