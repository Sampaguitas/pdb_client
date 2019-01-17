import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
import { authHeader } from '../../_helpers';
import config from 'config';
//Components
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';


class User extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tfa: '',
            oldPassword:'',
            newPassword:'',
            confirmPassword:'',
            submitted:false
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event){
        const { name, value } = event.target;
        this.setState({
            [name]:value
        });
    }

    render() {
        const { user, alert, updating } = this.props;
        const { tfa, submitted, oldPassword, newPassword, confirmPassword } = this.state
        return (
            <Layout>
                {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}
                <br />
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
                                    <ul>
                                        {/* {user.roles.map((role) => <li key={role.id}>{role}</li>)} */}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
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
                                            Update
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-header">Two Way Authentication</div>
                                <div className="card-body">
                                    <p>For security reasons it is required to set two factor authentication first. This means you need to confirm the login with another device.</p>
                                    <p>To use an authenticator app go through the following steps:</p>
                                    <ol className="list">
                                        <li>
                                            <p>
                                                Download a two-factor authenticator app like Microsoft Authenticator for
                                                <a href="https://go.microsoft.com/fwlink/?Linkid=825071">Windows Phone</a>,
                                                <a href="https://go.microsoft.com/fwlink/?Linkid=825072">Android</a> and
                                                <a href="https://go.microsoft.com/fwlink/?Linkid=825073">iOS</a> or
                                                Google Authenticator for
                                                <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en">Android</a> and
                                                <a href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8">iOS</a>.
                                            </p>
                                        </li>
                                        <li>
                                            <p>Scan the QR Code or enter this key <kbd>blablabla</kbd> into your two factor authenticator app. Spaces and casing do not matter.</p>
                                            <div className="text-center">
                                                <canvas id="qrCode"></canvas>
                                            </div>
                                        </li>
                                        <li>
                                            <p>
                                                Once you have scanned the QR code or input the key above, your two factor authentication app will provide you
                                                with a unique code. Enter the code in the confirmation box below.
                                            </p>
                                            <form>
                                                <Input
                                                    title="Verification Code"
                                                    name="tfa"
                                                    type="text"
                                                    value={tfa}
                                                    onChange={this.handleChange}
                                                    submitted={submitted}
                                                    inline={false}
                                                    required={true}
                                                />
                                                <button type="submit" className="btn btn-leeuwen btn-full btn-lg">
                                                    {updating ? <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" /> : ''}
                                                    Verify 2FA
                                                </button>
                                            </form>
                                        </li>                                   
                                    </ol> 
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