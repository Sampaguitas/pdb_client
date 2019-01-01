import React from 'react';
import { connect } from 'react-redux';
//Components
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';


class User extends React.Component {

    render() {
        const { user, alert } = this.props;
        return (
            <Layout alert={alert}>
                <div id="user">
                    <h2>User: { user.email }</h2>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <div className="card mb-3">
                                <div className="card-header">User Details</div>
                                <div className="card-body">
                                    <address>
                                        <strong>{user.firstName + ' ' + user.lastName}</strong><br />
                                        <abbr title="Phone Number">P:</abbr> {user.phone}<br />
                                        <abbr title="Email Address">E:</abbr> {user.email}<br />
                                        <abbr title="ID">ID:</abbr> { user.id }
                                    </address>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">My Roles</div>
                                <div className="card-body">
                                    {/* <ul>
                                        {user.roles.map((role) => <li key={role.id}>{role}</li>)}
                                    </ul> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-header">Change Password</div>
                                <div className="card-body">
                                    <p className="red">To be implemented...</p>
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
    const { authentication, alert } = state;
    const { user } = authentication;
    return {
        user,
        alert
    };
}

const connectedUser = connect(mapStateToProps)(User);
export { connectedUser as User };