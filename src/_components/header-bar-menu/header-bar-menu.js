import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Style
import './header-bar-menu.css'


function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}
class HeaderBarMenu extends Component {

    logout() {
        window.location.href = "/login";
    }

    userPage(){
        // <Redirect to="/user" />
        window.location.href = "/user";
    }
        
    settingsPage() {
        // <Redirect to="/user" />
        window.location.href = "/settings";
    }
    render() {
        var isAdmin = false;
        try{
            isAdmin = JSON.parse(localStorage.getItem("user")).isAdmin;
        } catch(e){}
        return (
            <div>
                {isLoggedIn() ? 
                    <div className = { this.props.collapsed ? 'header-bar-menu collapsed' : 'header-bar-menu' } >
                        <nav className={this.props.collapsed ? "navbar navbar-expand-lg navbar-light bg-light sticky-top collapsed" : "navbar navbar-expand-lg navbar-light bg-light sticky-top"} >
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <span className={this.props.collapsed ? 'navbars collapsed' : 'navbars'} onClick={this.props.toggleCollapse} >
                                    <span><FontAwesomeIcon icon="bars" className="fa-2x" /></span>
                                </span>
                                <form className="form-inline ml-auto pull-right"> {/* "" */}
                                    <button onClick={this.userPage} className="btn btn-outline-leeuwen-blue btn-round header-button" type="button" title="User-Page">
                                        <span><FontAwesomeIcon icon="user" className="fa-2x"/></span>
                                    </button>
                                    <button onClick={this.settingsPage} className={isAdmin ? "btn btn-outline-leeuwen-blue btn-round header-button" : "hidden"} type="button">
                                        <span><FontAwesomeIcon icon="cog" className="fa-2x"/></span>
                                    </button>
                                        <button onClick={this.logout} className="btn btn-outline-leeuwen btn-round header-button" type="button" title="Log-Out">
                                        <span><FontAwesomeIcon icon="sign-out-alt" className="fa-2x"/></span>
                                    </button>
                                </form>

                            </div>
                        </nav>
                    </div>
                :
                ''
               }
            </div>  
            );
        }
    }
 export default HeaderBarMenu;

