import React, { Component } from 'react';
import HeaderBarMenu from "./header-bar-menu/header-bar-menu.js";
import SideBarMenu from "./side-bar-menu/side-bar-menu.js";
import Footer from "./footer.js";
import "../_styles/bootstrap.min.css";
import { callbackify, inherits } from 'util';

export class Layout extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const { accesses, menuItem, selection, sidemenu, toggleCollapse } = this.props;
        return (
            <div className="full-height">
                <div className="full-height">
                    <HeaderBarMenu id="headerbar" className={sidemenu.collapsed ? "collapsed" : ''} sidemenu={sidemenu} toggleCollapse={toggleCollapse}/>
                    <SideBarMenu className={sidemenu.collapsed ? "collapsed" : ''} menuItem={menuItem} sidemenu={sidemenu} toggleCollapse={toggleCollapse} accesses={accesses} selection={selection}/>
                    <div id="content" className={sidemenu.collapsed ? "collapsed" : ''} style={{height: `calc(100% - 100px)`}}>
                        {this.props.children}
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}

// export default Layout;