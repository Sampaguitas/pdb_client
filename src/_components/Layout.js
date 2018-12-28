import React, { Component } from 'react';
import config from 'config';
import HeaderBarMenu from "./header-bar-menu/header-bar-menu.js"
import SideBarMenu from "./side-bar-menu/side-bar-menu.js"
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
        return (
            <div >
                    <HeaderBarMenu id="headerbar" className={this.state.collapsed ? "collapsed" : ''} collapsed={this.state.collapsed} toggleCollapse={this.toggleCollapse}/>
                <SideBarMenu className={this.state.collapsed ? "collapsed" : ''} collapsed={this.state.collapsed} toggleCollapse={this.toggleCollapse}/>
                    <div id="content" className={this.state.collapsed ? "collapsed " : ''} >
                    {this.props.children}
                    </div>
                    <footer className="footer fixed-bottom bg-light" >
                        <div className="text-right">
                            <span className="text-muted">© {(new Date().getFullYear())} - Van Leeuwen Pipe and Tube. All rights reserved (v0.1) - Development</span>
                        </div>
                    </footer>
                </div>
        )
    }
}
export default Layout;