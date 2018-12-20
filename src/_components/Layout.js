import React, { Component } from 'react';
import HeaderBarMenu from "./header-bar-menu/header-bar-menu.js"

import "../_styles/bootstrap.min.css";
class Layout extends Component {
    render() {
        return (
            <div>
                <div className="container-fluid">
                    <HeaderBarMenu />
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export default Layout;