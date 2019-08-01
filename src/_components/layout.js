import React, { Component } from 'react';
import HeaderBarMenu from "./header-bar-menu/header-bar-menu.js";
import SideBarMenu from "./side-bar-menu/side-bar-menu.js";
import Footer from "./footer.js";
import "../_styles/bootstrap.min.css";
import Background from '../_assets/background.jpg';
import { callbackify, inherits } from 'util';
// import "../_styles/main.css";

function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        }
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    toggleCollapse() {
        const { collapsed } = this.state;
        this.setState({
            collapsed: !collapsed
        });
    }

    render() {
        const { alert, background } = this.props;
        const { collapsed } = this.state;
        return (
            <div className="full-height">
                {background?
                    <div
                        id="content"
                        className="full-height"
                        style={{
                            backgroundImage: `url(${Background})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            width:'100%',
                            padding:'0px',
                            margin: '0px',
                        }}
                    >
                        {this.props.children}
                    </div>
                :
                <div className="full-height">
                    <HeaderBarMenu id="headerbar" className={collapsed ? "collapsed" : ''} collapsed={collapsed} toggleCollapse={this.toggleCollapse}/>
                    <SideBarMenu className={collapsed ? "collapsed" : ''} collapsed={collapsed} toggleCollapse={this.toggleCollapse} accesses={this.props.accesses}/>
                    <div id="content" className={collapsed ? "collapsed" : ''} style={{height: `calc(100% - ${alert.message ? '190px' : '145px'})`}}>
                        {this.props.children}
                    </div>
                    <Footer />
                </div>
                }
            </div>
        )
    }
}

export default Layout;