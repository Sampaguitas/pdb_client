import React, { Component } from 'react';
import Header from "./header-bar-menu.js"

import "../_styles/bootstrap.min.css";
class Layout extends Component {
    render() {
        return (
            <div>
                <div className="container-fluid">
                    <Header />
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export default Layout;