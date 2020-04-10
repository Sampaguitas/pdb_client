import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
    accessActions,
    collitypeActions,
    docdefActions,
    docfieldActions,
    fieldActions,
    fieldnameActions,
    poActions,
    projectActions, 
    supplierActions,
    userActions 
} from '../../_actions';
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
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        //Clear Selection
        dispatch(accessActions.clear());
        dispatch(collitypeActions.clear());
        dispatch(docdefActions.clear());
        dispatch(docfieldActions.clear());
        dispatch(fieldActions.clear());
        dispatch(fieldnameActions.clear());
        dispatch(poActions.clear());
        dispatch(projectActions.clearSelection());
        dispatch(supplierActions.clear());
        //Get users
        dispatch(userActions.getAll());
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        dispatch(alertActions.clear());
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
            dispatch(userActions.changePwd(encodeURI(stateUser)));
          }
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
          event.preventDefault();
        }
    }

    render() {
        const { user, alert, userUpdating } = this.props;
        const { submitted, stateUser } = this.state
        return (
            <Layout alert={alert}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <NavLink to={{ pathname: '/' }} tag="a">Home</NavLink>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">User Page</li>
                    </ol>
                </nav>
                <hr />
                <div id="user" className="full-height">
                    <div className="row">
                        <div className="col-md-8 col-sm-12 mb-sm-3 pr-md-0">
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
                                        { user.isAdmin && <li>Admin ({user.region})</li> }
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
                                    <form
                                    onKeyPress={this.onKeyPress}
                                    >
                                        <Input
                                            title="Current Password"
                                            name="oldPassword"
                                            type="password"
                                            value={stateUser.oldPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                            autocomplete="current-password"
                                        />
                                        <Input
                                            title="New Password"
                                            name="newPassword"
                                            type="password"
                                            value={stateUser.newPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                            autocomplete="new-password"
                                        />
                                        <Input
                                            title="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            value={stateUser.confirmPassword}
                                            onChange={this.handleChange}
                                            submitted={submitted}
                                            inline={false}
                                            required={true}
                                            autocomplete="new-password"
                                        />
                                        <button type="submit" className="btn btn-leeuwen-blue btn-full btn-lg mb-3" onClick={this.handleSubmit}>
                                            {userUpdating ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
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
    const { alert } = state;
    const { userUpdating } = state.users;
    const { user } = state.authentication;
    return {
        user,
        userUpdating,
        alert
    };
}

const connectedUser = connect(mapStateToProps)(User);
export { connectedUser as User };