import React from 'react';
import { Router, Route } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
// pages
import { PrivateRoute } from '../_components';
import { Home } from '../pages/home/home.jsx';

import { Login } from '../pages/account/login.jsx';
import { Register } from '../pages/account/register.jsx';
import { User } from '../pages/account/user.jsx';
import { Settings } from '../pages/account/settings.jsx';
import { Customer } from '../pages/home/customer.jsx';
import { Opco } from '../pages/home/opco.jsx';
import { Project } from '../pages/home/project.jsx';


// Styles
import '../_styles/custom-bootsrap.scss';
import '../_styles/main.css';
// Components
import Layout from '../_components/layout';
//Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas)


class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    render() {
        // const { alert } = this.props;
        return (
            <div>
                {/* {alert.message &&
                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                } */}
                    <Router history={history}>
                        <div>
                            <PrivateRoute exact path="/" component={Home} />
                            <PrivateRoute path="/user" component={User} />
                            <PrivateRoute path="/settings" component={Settings} />
                            <PrivateRoute path="/customer" component={Customer} />
                            <PrivateRoute path="/opco" component={Opco} />
                            <PrivateRoute path="/project" component={Project} />
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                        </div>
                    </Router>
            </div>
        );
    }
}
//<div className="container-fluid">

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 