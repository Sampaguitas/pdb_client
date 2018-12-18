import React, { Component } from 'react';
// import "./bootstrap.min.css";
import Header from "./Header"


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