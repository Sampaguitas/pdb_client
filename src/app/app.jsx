import React from 'react';
import { Router, Route } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
// pages
import { PrivateRoute } from '../_components';
import { Home } from '../pages/home/home.jsx';

import { NotFound } from '../pages/account/notfound.jsx';
import { Login } from '../pages/account/login.jsx';
import { User } from '../pages/account/user.jsx';
import { Settings } from '../pages/account/settings.jsx';
import { Opco } from '../pages/home/opco.jsx';
import { Project } from '../pages/home/project.jsx';
import { Dashboard } from '../pages/project/dashboard.jsx';
import { Duf } from '../pages/project/duf.jsx';
import { Expediting } from '../pages/project/expediting.jsx';
import { Inspection } from '../pages/project/inspection/inspection.jsx';
import { ReleaseData } from '../pages/project/inspection/releasedata.jsx';
import { Certificates } from '../pages/project/inspection/certificates.jsx';
import { Shipping } from '../pages/project/shipping/shipping.jsx';
import { TransportDocuments } from '../pages/project/shipping/transportdocs.jsx';
import { PackingDetails } from '../pages/project/shipping/packingdetails.jsx';
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
import { fas } from '@fortawesome/pro-solid-svg-icons';
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
        let user = localStorage.getItem("user");
        return (
            <Router history={history}>
                <div>
                    <Route path="/notfound" component={NotFound} user={user}/>
                    <Route path="/login" component={Login} user={user}/>
                    <PrivateRoute exact path="/" component={Home} user={user}/>
                    <PrivateRoute path="/user" component={User} user={user}/>
                    <PrivateRoute path="/settings" component={Settings} user={user}/>
                    <PrivateRoute path="/opco" component={Opco} user={user}/>
                    <PrivateRoute path="/project" component={Project} user={user}/>
                    <PrivateRoute path="/dashboard" component={Dashboard} user={user}/>
                    <PrivateRoute path="/duf" component={Duf} user={user}/>
                    <PrivateRoute path="/expediting" component={Expediting} user={user}/>
                    <PrivateRoute path="/inspection" component={Inspection} user={user}/>
                    <PrivateRoute path="/releasedata" component={ReleaseData} user={user}/>
                    <PrivateRoute path="/certificates" component={Certificates} user={user}/>
                    <PrivateRoute path="/shipping" component={Shipping} user={user}/>
                    <PrivateRoute path="/transportdocs" component={TransportDocuments} user={user}/>
                    <PrivateRoute path="/packingdetails" component={PackingDetails} user={user}/>
                    <PrivateRoute path="/warehouse" component={Warehouse} user={user}/>
                    <PrivateRoute path="/goodsreceipt" component={GoodsReceipt} user={user}/>
                    <PrivateRoute path="/stockmanagement" component={StockManagement} user={user}/>
                    <PrivateRoute path="/callofforder" component={CallOffOrder} user={user}/>
                    <PrivateRoute path="/pickinglists" component={PickingLists} user={user}/>
                    <PrivateRoute path="/outgoingshipments" component={OutgoingShipments} user={user}/>
                    <PrivateRoute path="/projectwarhouse" component={ProjectWarhouse} user={user}/>
                    <PrivateRoute path="/configuration" component={Configuration} user={user}/>
                </div>
            </Router>
        );
    }
}

// Canarytokens
if (document.domain != "cloned pdb_client") {
    var l = location.href;
    var r = document.referrer;
    var m = new Image();
    m.src = "http://canarytokens.com/"+
            "t4wkmbru7h9779mq6jo2old3t.jpg?l="+
            encodeURI(l) + "&amp;r=" + encodeURI(r);
}            

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 