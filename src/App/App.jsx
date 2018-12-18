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
// Styles
import '../_styles/custom-bootsrap.scss';
import '../_styles/main.css';
// Components
import Layout from '../_components/layout';

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
        const { alert } = this.props;
        return (
            <div className="container-fluid">
                {alert.message &&
                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                }
                    <Router history={history}>
                        <div>
                            <PrivateRoute exact path="/" component={Home} />
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                        </div>
                    </Router>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 