import React, { Component } from 'react';
function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}
class Footer extends Component {
    render() {
        return (
            <div>
                {isLoggedIn() &&
                    <footer className="footer fixed-bottom bg-light" >
                        <div className="text-right">
                            <span className="text-muted">© {(new Date().getFullYear())} - Van Leeuwen Pipe and Tube. All rights reserved (v0.1) - Development</span>
                        </div>
                    </footer>
                }
            </div>

        )
    }
}

export default Footer;