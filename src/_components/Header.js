import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

import "./bootstrap.min.css";
import '../_styles/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faCog, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}
class Header extends Component {
    logout() {
        window.location.href = "/login";
    }
    render() {
        return (
            <div>
                {isLoggedIn() ? 
                <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <span className="navbars collapsed">
                            <span><FontAwesomeIcon icon={faBars} /></span>
                        </span>
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item dropdown">
                                <a 
                                    className="nav-link dropdown-toggle" 
                                    href="#" 
                                    id="customersDropdown" 
                                    role="button" 
                                    data-toggle="dropdown" 
                                    aria-haspopup="true" 
                                    aria-expanded="false"
                                >Customers</a>
                            </li>
                        </ul>
                    
                        <form className="form-inline ml-auto">
                            <button className="btn btn-outline-leeuwen-blue btn-round" type="button">
                                <span><FontAwesomeIcon icon={faUser} /></span>
                            </button>
                            <button className="btn btn-outline-leeuwen-blue btn-round" type="button">
                                <span><FontAwesomeIcon icon={faCog} /></span>
                            </button>
                            <button onClick={this.logout} className="btn btn-outline-leeuwen btn-round" type="button">
                                <span><FontAwesomeIcon icon={faSignOutAlt} /></span>
                            </button>
                        </form>

                    </div>
                </nav>
               :'' 
               }
            </div>  
            );
        }
    }
 export default Header;

