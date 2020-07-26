import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}
class HeaderBarMenu extends Component {

    render() {
        var isAdmin = false;
        try{
            isAdmin = JSON.parse(localStorage.getItem("user")).isAdmin;
        } catch(e){}
        const { sidemenu } = this.props;
        return (
            <div>
                {isLoggedIn() ? 
                    <div className = { sidemenu.collapsed ? 'header-bar-menu collapsed' : 'header-bar-menu' } >
                        <nav className={sidemenu.collapsed ? "navbar navbar-expand-lg navbar-light bg-light sticky-top collapsed" : "navbar navbar-expand-lg navbar-light bg-light sticky-top"} >
                            {/* <div className="collapse navbar-collapse" id="navbarSupportedContent"> */}
                                <span className={sidemenu.collapsed ? 'navbars collapsed' : 'navbars'} onClick={this.props.toggleCollapse} >
                                    <span><FontAwesomeIcon icon="bars" className="fa-2x"/></span>
                                </span>
                                <form className="form-inline ml-auto pull-right">
                                    <NavLink to="/user">
                                        <button className="btn btn-outline-leeuwen-blue btn-round header-button" title="User-Page">
                                            <span><FontAwesomeIcon icon="user" className="fa-2x"/></span>
                                        </button>
                                    </NavLink>
                                    <NavLink to="/settings">
                                        <button className={isAdmin ? "btn btn-outline-leeuwen-blue btn-round header-button" : "hidden"} title="Settings">
                                            <span><FontAwesomeIcon icon="cog" className="fa-2x"/></span>
                                        </button>
                                    </NavLink>
                                    <NavLink to="/login">
                                        <button className="btn btn-outline-leeuwen btn-round header-button" title="Log-Out">
                                            <span><FontAwesomeIcon icon="sign-out-alt" className="fa-2x"/></span>
                                        </button>
                                    </NavLink>
                                </form>
                            {/* </div> */}
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

