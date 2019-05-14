import React from 'react';
import { connect } from 'react-redux';
import { userActions, opcoActions } from '../../_actions';
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
            oldPassword:'',
            newPassword:'',
            confirmPassword:'',
            submitted:false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(userActions.getAll());
        this.props.dispatch(opcoActions.getAll());
    }

    handleChange(event){
        const { name, value } = event.target;
        this.setState({
                [name]:value
        });
    }

    handleSubmit(event){
        event.preventDefault();
        this.setState({ submitted: true });
        const { oldPassword, newPassword, confirmPassword} = this.state;
        const { dispatch } = this.props;
        if (
            oldPassword &&
            newPassword &&
            confirmPassword
          ) {
            dispatch(userActions.changePassword(oldPassword, newPassword, confirmPassword));
          }
    }

    render() {
        const { user, alert, updating, opcos } = this.props;
        const { tfa, submitted, oldPassword, newPassword, confirmPassword } = this.state
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
                <div id="user">
                    <h2>User: { user.email }</h2>
                    <div className="row">
                        <div className="col-md-6 col-sm-12 mb-3">
                            <div className="card mb-3">
                                <div className="card-header">User Details</div>
                                <div className="card-body">
                                    <address>
                                    <strong>{user.name}</strong><br />
                                    <abbr title="Initials">Initials:</abbr>{user.userName}<br />
                                    <abbr title="Operating Company">OPCO:</abbr>{user.opco.name}<br />
                                    <abbr title="Email Address">Email:</abbr>{user.email}
                                    </address>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">My Roles</div>
                                <div className="card-body">
                                    <ul>
                                        {/* {user.roles.map((role) => <li key={role.id}>{role}</li>)} */}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-12 mb-3">
                            <div className="card">
                                <div className="card-header">Change Password</div>
                                <div className="card-body">
                                    <form>
                                        <Input
                                            title="Current Password"
                                            name="oldPassword"
                                            type="text"
                                            value={oldPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Input
                                            title="New Password"
                                            name="newPassword"
                                            type="text"
                                            value={newPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <Input
                                            title="Confirm Password"
                                            name="confirmPassword"
                                            type="text"
                                            value={confirmPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                        />
                                        <button type="submit" className="btn btn-leeuwen btn-full btn-lg">
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
    const { authentication, alert, users, opcos } = state;
    const { user } = authentication;
    const { updating } = users;
    return {
        user,
        updating,
        alert,
        opcos
    };
}

const connectedUser = connect(mapStateToProps)(User);
export { connectedUser as User };