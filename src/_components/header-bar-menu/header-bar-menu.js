import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
// Style
import './header-bar-menu.css'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faCog, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}
class HeaderBarMenu extends Component {
    constructor(props){
        super(props);
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.state = {
            collapsed: false
        }
    }

    logout() {
        window.location.href = "/login";
    }
    toggleCollapse(){
        this.setState({ collapsed: !this.state.collapsed});
    }

    render() {
        return (
            <div>
                {isLoggedIn() ? 
                <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <span className={this.state.collapsed ? 'navbars collapsed' : 'navbars'} onClick={this.toggleCollapse} >
                            <span><FontAwesomeIcon icon={faBars} /></span>
                        </span>
                    
                        <form className="form-inline ml-auto">
                        <div title="Languages" className="dropdown">
                                    <button 
                                        className="btn btn-outline-leeuwen-blue dropdown-toggle"
                                        id="dropdownMenuButton"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                        type="button"
                                        data-toggle="dropdown"
                                    >
                                    EN
                                    </button>
                        </div>
                                <button className="btn btn-outline-leeuwen-blue btn-round" id="icon" type="button">
                                    <span><FontAwesomeIcon icon={faUser} /></span>
                            </button>
                                <button className="btn btn-outline-leeuwen-blue btn-round" type="button">
                                    <span><FontAwesomeIcon icon={faCog} /></span>
                            </button>
                            <button onClick={this.logout} className="btn btn-outline-leeuwen btn-round" type="button" title="Log-Out">
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
 export default HeaderBarMenu;

