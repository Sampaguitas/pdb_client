//React
import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import queryString from 'query-string';
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
    { id: 0, title: 'Dashboard', href: '/dashboard', icon: 'tachometer-alt' },
    { id: 1, title: 'Upload DUF', href: '/duf', icon: 'upload', roles: ['Admin', 'SuperUser'] },
    { id: 2, title: 'ProjectOrders', href: '/projectorders', icon: 'clipboard-list', roles: ['Admin', 'SuperUser'] },
    { id: 3, title: 'Expediting', href: '/expediting', icon: 'stopwatch', roles: ['Admin', 'Expediter'] },
    { id: 4, title: 'Inspection', href: '/inspection', icon: 'search', roles: ['Admin', 'Inspector'] },
    { id: 5, title: 'Shipping', href: '/shipping', icon: 'ship', roles: ['Admin', 'Shipper'] },
    { id: 6, title: 'Warehouse', href: '/warehouse', icon: 'warehouse', roles: ['Admin', 'SuperUser', 'Warehouse'], child: 
        [
            { id: 0, title: 'Goods Receipt', href: '/goodsreceipt', icon: 'cubes', roles: ['Admin', 'SuperUser', 'Warehouse'] },
            { id: 1, title: 'Stock Management', href: '/stockmanagement', icon: 'cubes', roles: ['Admin', 'SuperUser', 'Warehouse'] },
            { id: 2, title: 'Call-Off Order', href: '/callofforder', icon: 'clipboard-list', roles: ['Admin', 'SuperUser', 'Warehouse'] }, 
            { id: 3, title: 'PickingLists', href: '/pickinglists', icon: 'clipboard-list', roles: ['Admin', 'SuperUser', 'Warehouse'] },
            { id: 4, title: 'Outgoing Shipments', href: '/outgoingshipments', icon: 'ship', roles: ['Admin', 'SuperUser', 'Warehouse'] }, 
            { id: 5, title: 'Project Warehouses', href: '/projectwarhouse', icon: 'industry', roles: ['Admin', 'SuperUser'] } 
        ] 
    },
    { id: 7, title: 'Configuration', href: '/configuration', icon: 'cog', roles: ['Admin', 'ProjectAdmin', 'SuperUser'] }
]

class SideBarMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: ''
        }
        this.isHome=this.isHome.bind(this);
        this.isLoggedIn=this.isLoggedIn.bind(this);
    }
    componentDidMount(){
        var qs = queryString.parse(window.location.search);
        if (qs.id) {
            this.setState({projectId: qs.id})
        }
    }
    isLoggedIn() {
        return localStorage.getItem("user") !== null;
    }
    isHome(){
        switch (window.location.pathname){
            case '/': return true;
            case '/user': return true;
            case '/settings': return true;
            case '/customer': return true;
            case '/opco': return true;
            case '/project': return true;
            case '/dashboard': return false;
            case '/duf': return false;
            default: true
        }
    }
    render() {
        const { projectId } = this.state
        return (
            <div>
                {this.isLoggedIn() && 
                    <div id="sidebar-menu" className={this.props.collapsed ? 'collapsed' : undefined} onMouseLeave={this.onMouseLeave}>
                        <NavLink to={{ pathname: '/' }} tag="div" className="sidebar-logo">
                            <img src={this.props.collapsed ? icon : logo} />
                        </NavLink>
                        <ul className="default-list menu-list">
                        {this.isHome() ?
                            home_menu.map((item) => <Item item={item} key={item.id} projectId={projectId} collapsed={this.props.collapsed} />)
                        :
                            project_menu.map((item) => <Item item={item} key={item.id} projectId={projectId} collapsed={this.props.collapsed} />)
                        }
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