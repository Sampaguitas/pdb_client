//React
import React, { Component } from 'react';
const _ = require('lodash');
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
// import '../../_styles/main.css'

const home_menu = [
    { id: 0, title: 'Overview', href: '/', icon: 'home' },
    { id: 1, title: 'Add operation company', href: '/opco', icon: 'plus', roles: ['isSuperAdmin'] },
    { id: 2, title: 'Add project', href: '/project', icon: 'plus', roles: ['isAdmin', 'isSuperAdmin'] }
]

const project_menu = [
    { id: 0, title: 'Dashboard', href: '/dashboard', icon: 'tachometer-alt' },
    { id: 1, title: 'Upload DUF', href: '/duf', icon: 'upload', roles: ['isAdmin', 'isSuperAdmin'] },
    { id: 2, title: 'Expediting', href: '/expediting', icon: 'stopwatch', roles: ['isAdmin', 'isSuperAdmin', 'isExpediting'] },
    { id: 3, title: 'Inspection', href: '/inspection', icon: 'search', roles: ['isAdmin', 'isSuperAdmin', 'isInspection'], child:
        [
            { id: 0, title: 'Release data', href: '/releasedata', icon: 'clipboard-check', roles: ['isAdmin', 'isSuperAdmin', 'isInspection'] },
            { id: 1, title: 'Certificates', href: '/certificates', icon: 'file-certificate', roles: ['isAdmin', 'isSuperAdmin', 'isInspection'] },
        ]
    },
    { id: 4, title: 'Shipping', href: '/shipping', icon: 'ship', roles: ['isAdmin', 'isSuperAdmin', 'isShipping'], child:
        [
            { id: 0, title: 'Transport docs', href: '/transportdocs', icon: 'passport', roles: ['isAdmin', 'isSuperAdmin', 'isShipping'] },
            { id: 1, title: 'Packing details', href: '/packingdetails', icon: 'box-open', roles: ['isAdmin', 'isSuperAdmin', 'isShipping'] },            
        ]
    },
    { id: 5, title: 'Warehouse', href: '/warehouse', icon: 'warehouse', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'], child: 
        [
            { id: 0, title: 'Goods receipt', href: '/goodsreceipt', icon: 'cubes', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] },
            { id: 1, title: 'Stock management', href: '/stockmanagement', icon: 'forklift', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] },
            { id: 2, title: 'Call-off order', href: '/callofforder', icon: 'phone-square', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] }, 
            { id: 3, title: 'Picking lists', href: '/pickinglists', icon: 'clipboard-list', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] },
            { id: 4, title: 'Outgoing shipments', href: '/outgoingshipments', icon: 'ship', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] }, 
            { id: 5, title: 'Warehouse locations', href: '/projectwarhouse', icon: 'inventory', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] } 
        ] 
    },
    { id: 6, title: 'Configuration', href: '/configuration', icon: 'cog', roles: ['isAdmin', 'isSuperAdmin', 'isConfiguration'] }
]

function test(access, user, role) { 
    const result = access.find(toto => {
        if (_.isEqual(toto.userId,user.id)){
            switch (role) {
                case 'isExpediting': return toto.isExpediting === true;
                case 'isInspection': return toto.isInspection === true;
                case 'isShipping': return toto.isShipping === true;
                case 'isWarehouse': return toto.isWarehouse === true;
                case 'isConfiguration': return toto.isConfiguration === true;
                default: return false;
            }
        }
    });
    return result
}

function isRole(accesses, user, role) {
    if (_.isEmpty(accesses)) {
        return false;
    } else {
        if (!_.isEmpty(test(accesses, user, role))) {
            return true;
        } else {
            return false;
        }
    }
}

class SideBarMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: '',
            show: '',
            // mobileItem: null,
        }
        this.isHome=this.isHome.bind(this);
        this.isLoggedIn=this.isLoggedIn.bind(this);
        this.mouseLeave=this.mouseLeave.bind(this);
        this.menuList = this.menuList.bind(this);
        this.handleItemOver = this.handleItemOver.bind(this);
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
            case '/opco': return true;
            case '/project': return true;
            case '/dashboard': return false;
            case '/duf': return false;
            case '/expediting': return false;
            case '/inspection': return false;
            case '/releasedata': return false;
            case '/shipping': return false;
            case '/transportdocs': return false;
            case '/packingdetails': return false;
            case '/warehouse': return false;
            case '/goodsreceipt': return false;
            case '/stockmanagement': return false;
            case '/callofforder': return false;
            case '/pickinglists': return false;
            case '/outgoingshipments': return false;
            case '/projectwarhouse': return false;
            case '/configuration': return false;
            default: true
        }
    }
    mouseLeave(){
        this.MobileItem = null
    }

    handleItemOver(event, title){
        event.preventDefault();
        this.setState({
            show: title
        });
    }

    menuList(menu){
        var listMenu = []
        const { accesses } = this.props
        let user = JSON.parse(localStorage.getItem('user'));
        menu.forEach(function(item) {
            if (!item.roles){
                listMenu.push(item);
            } else if (item.roles.indexOf('isAdmin') > -1 && user.isAdmin) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isSuperAdmin') > -1 && user.isSuperAdmin) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isExpediting') > -1 && isRole(accesses, user, 'isExpediting')) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isInspection') > -1 && isRole(accesses, user, 'isInspection')) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isShipping') > -1 && isRole(accesses, user, 'isShipping')) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isWarehouse') > -1 && isRole(accesses, user, 'isWarehouse')) {
                listMenu.push(item);
            } else if (item.roles.indexOf('isConfiguration') > -1 && isRole(accesses, user, 'isConfiguration')) {
                listMenu.push(item);
            }
        });
        return listMenu;
    }

    render() {
        const { collapsed } = this.props;
        const { projectId, show, mobileItem } = this.state
        return (
            <div>
                {this.isLoggedIn() && 
                    <div id="sidebar-menu" className={collapsed ? 'collapsed' : undefined} onMouseLeave={this.mouseLeave}>
                        <NavLink to={{ pathname: '/' }} tag="div" className="sidebar-logo">
                            <img src={collapsed ? icon : logo} />
                        </NavLink>
                        <ul className="default-list menu-list">
                        {
                            this.isHome() ?
                                this.menuList(home_menu).map((item) => 
                                    <Item item={item} key={item.id} projectId={projectId} collapsed={collapsed} show={show} handleItemOver={this.handleItemOver}/>
                                )
                            :
                                this.menuList(project_menu).map((item) => 
                                    <Item item={item} key={item.id} projectId={projectId} collapsed={collapsed} show={show} handleItemOver={this.handleItemOver}/>
                                )
                        }
                        </ul>
                        {/* {collapsed && 
                            <ul className="mobile-list menu-list" style={{top: `${mobileItemPos}px`}}> 
                                <MobileItem
                                item={mobileItem}/>
                            </ul>                        
                        } */}

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