import React, { Component } from 'react';
import { connect } from 'react-redux';

import config from 'config';
import HeaderBarMenu from "./header-bar-menu/header-bar-menu.js"
import SideBarMenu from "./side-bar-menu/side-bar-menu.js"
import Alert from "./alert.js"
import Footer from "./footer.js"
import "../_styles/bootstrap.min.css";



class Layout extends Component {
    constructor(props) {
        super(props);
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.state = {
            collapsed: false
        }
    }
    toggleCollapse() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const { alert } = this.props
        return (
            <div >
                <HeaderBarMenu id="headerbar" className={this.state.collapsed ? "collapsed" : ''} collapsed={this.state.collapsed} toggleCollapse={this.toggleCollapse}/>
                <SideBarMenu className={this.state.collapsed ? "collapsed" : ''} collapsed={this.state.collapsed} toggleCollapse={this.toggleCollapse}/>
                    <div id="content" className={this.state.collapsed ? "collapsed " : ''} >
                    {this.props.children}
                    </div>
                <Alert className={this.state.collapsed ? "collapsed" : ''} collapsed={this.state.collapsed} toggleCollapse={this.toggleCollapse} alert={alert} />
                <Footer />
            </div>
        )
    }
}

export default Layout;