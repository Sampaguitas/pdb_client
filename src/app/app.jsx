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
import { User } from '../pages/account/user.jsx';
import { Settings } from '../pages/account/settings.jsx';
import { Customer } from '../pages/home/customer.jsx';
import { Opco } from '../pages/home/opco.jsx';
import { Project } from '../pages/home/project.jsx';
import { Dashboard } from '../pages/project/dashboard.jsx';
import { Duf } from '../pages/project/duf.jsx';
import { ProjectOrders } from '../pages/project/projectorders.jsx';
import { Expediting } from '../pages/project/expediting.jsx';
import { Inspection } from '../pages/project/inspection.jsx';
import { Shipping } from '../pages/project/shipping.jsx';
import { Warehouse } from '../pages/project/warehouse/warehouse.jsx';
import { GoodsReceipt } from '../pages/project/warehouse/goodsreceipt.jsx';
import { StockManagement } from '../pages/project/warehouse/stockmanagement.jsx';
import { CallOffOrder } from '../pages/project/warehouse/callofforder.jsx';
import { PickingLists } from '../pages/project/warehouse/pickinglists.jsx';
import { OutgoingShipments } from '../pages/project/warehouse/outgoingshipments.jsx';
import { ProjectWarhouse } from '../pages/project/warehouse/projectwarhouse.jsx';
import { Configuration } from '../pages/project/configuration.jsx';


// Styles
import '../_styles/custom-bootsrap.scss';
import '../_styles/main.css';

//Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas)


class App extends React.Component {
    constructor(props) {
        super(props);
        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });
    }

    render() {
        return (
            <Router history={history}>
                <div>
                    <Route path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/user" component={User} />
                    <PrivateRoute path="/settings" component={Settings} />
                    <PrivateRoute path="/customer" component={Customer} />
                    <PrivateRoute path="/opco" component={Opco} />
                    <PrivateRoute path="/project" component={Project} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />
                    <PrivateRoute path="/duf" component={Duf} />
                    <PrivateRoute path="/projectorders" component={ProjectOrders} /> 
                    <PrivateRoute path="/expediting" component={Expediting} />
                    <PrivateRoute path="/inspection" component={Inspection} />
                    <PrivateRoute path="/shipping" component={Shipping} />
                    <PrivateRoute path="/warehouse" component={Warehouse} />
                    <PrivateRoute path="/goodsreceipt" component={GoodsReceipt} />
                    <PrivateRoute path="/stockmanagement" component={StockManagement} />
                    <PrivateRoute path="/callofforder" component={CallOffOrder} />
                    <PrivateRoute path="/pickinglists" component={PickingLists} />
                    <PrivateRoute path="/outgoingshipments" component={OutgoingShipments} />
                    <PrivateRoute path="/projectwarhouse" component={ProjectWarhouse} />
                    <PrivateRoute path="/configuration" component={Configuration} />
                </div>
            </Router>
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