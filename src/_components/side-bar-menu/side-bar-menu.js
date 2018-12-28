//React
import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
//FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Icons
import logo from '../../_assets/logo.svg';
import icon from '../../_assets/icon.svg';

//Components
import Item from './item.js'
import SubItem from './sub-item.js'
import MobileItem from './mobile-item.js'
//Styles
import './side-bar-menu.scss'

const home_menu = [
    { id: 0, title: 'Overview', href: '/', icon: 'home' },
    { id: 1, title: 'Add Customer', href: '/customer', icon: 'plus', roles: ['Admin', 'ProjectAdmin'] },
    { id: 2, title: 'Add Operation Company', href: '/opco', icon: 'plus', roles: ['Admin'] },
    { id: 3, title: 'Add Project', href: '/project', icon: 'plus', roles: ['Admin', 'ProjectAdmin'] }
]

const project_menu = [
    { id: 0, title: 'Dashboard', href: '/project/', icon: 'tachometer-alt' },
    { id: 1, title: 'Upload DUF', href: '/project/', icon: 'upload', roles: ['Admin', 'SuperUser'] },
    { id: 2, title: 'ProjectOrders', href: '/project/', icon: 'clipboard-list', roles: ['Admin', 'SuperUser'] },
    { id: 3, title: 'Expediting', href: '/project/', icon: 'stopwatch', roles: ['Admin', 'Expediter'] },
    { id: 4, title: 'Inspection', href: '/project/', icon: 'search', roles: ['Admin', 'Inspector'] },
    { id: 5, title: 'Shipping', href: '/project/', icon: 'ship', roles: ['Admin', 'Shipper'] },
    { id: 6, title: 'Warehouse', href: '/project/', icon: 'warehouse', roles: ['Admin', 'SuperUser', 'Warehouse'], child: 
        [
            { id: 0, title: 'Goods Receipt', href: '/project/', icon: 'cubes', roles: ['Admin', 'SuperUser', 'Warehouse'] },
            { id: 1, title: 'Stock Management', href: '/project/', icon: 'cubes', roles: ['Admin', 'SuperUser', 'Warehouse'] },
            { id: 2, title: 'Call-Off Order', href: '/project/', icon: 'clipboard-list', roles: ['Admin', 'SuperUser', 'Warehouse'] }, 
            { id: 3, title: 'PickingLists', href: '/project/', icon: 'clipboard-list', roles: ['Admin', 'SuperUser', 'Warehouse'] },
            { id: 4, title: 'Outgoing Shipments', href: '/project/', icon: 'ship', roles: ['Admin', 'SuperUser', 'Warehouse'] }, 
            { id: 5, title: 'Project Warehouses', href: '/project/', icon: 'industry', roles: ['Admin', 'SuperUser'] } 
        ] 
    },
    { id: 7, title: 'Configuration', href: '/project/', icon: 'cog', roles: ['Admin', 'ProjectAdmin', 'SuperUser'] }
]

function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}
class SideBarMenu extends Component {

    render() {
        return (
            <div>
                {isLoggedIn() && 
                    <div id="sidebar-menu" className={this.props.collapsed ? 'collapsed' : undefined} onMouseLeave={this.onMouseLeave}>
                        <NavLink to={{ pathname: '/' }} tag="div" className="sidebar-logo">
                            <img src={this.props.collapsed ? icon : logo} />
                        </NavLink>
                        <ul className="default-list menu-list">
                        {home_menu.map((item) => <Item item={item} key={item.id} collapsed={this.props.collapsed} />)}
                        </ul>
                        <button className="collapse-btn" onClick={this.props.toggleCollapse}>
                        <FontAwesomeIcon icon="arrows-alt-h" name="arrows-alt-h" />
                        </button>

                    </div>
                }
            </div>
        );
    }
}
export default SideBarMenu;