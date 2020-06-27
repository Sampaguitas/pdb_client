import React, { Component } from 'react';
import HeaderBarMenu from "./header-bar-menu/header-bar-menu.js";
import SideBarMenu from "./side-bar-menu/side-bar-menu.js";
import Footer from "./footer.js";
import "../_styles/bootstrap.min.css";
import { callbackify, inherits } from 'util';
// import "../_styles/main.css";

function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}

class Layout extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     collapsed: true
        // }
        // this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    // toggleCollapse() {
    //     const { dispatch, sidemenuActions } = this.props;
    //     dispatch(sidemenuActions.toggle());
    // }

    render() {

        const { accesses, selection, sidemenu, toggleCollapse } = this.props;
        const { collapsed } = sidemenu;
        return (
            <div className="full-height">
                <div className="full-height">
                    <HeaderBarMenu id="headerbar" className={collapsed ? "collapsed" : ''} collapsed={collapsed} toggleCollapse={toggleCollapse}/>
                    <SideBarMenu className={collapsed ? "collapsed" : ''} collapsed={collapsed} toggleCollapse={toggleCollapse} accesses={accesses} selection={selection}/>
                    <div id="content" className={collapsed ? "collapsed" : ''} style={{height: `calc(100% - 100px)`}}>
                        {this.props.children}
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default Layout;