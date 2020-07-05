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
    { id: 0, title: 'Home', href: '/', icon: 'home' },
    { id: 1, title: 'Add operation company', href: '/opco', icon: 'plus', roles: ['isSuperAdmin'] },
    { id: 2, title: 'Add project', href: '/project', icon: 'plus', roles: ['isAdmin', 'isSuperAdmin'] }
]

const project_menu = [
    { id: 0, title: 'Dashboard', href: '/dashboard', icon: 'tachometer-alt' },
    { id: 1, title: 'Data Upload File (DUF)', href: '/duf', icon: 'upload', roles: ['isAdmin', 'isSuperAdmin'] },
    { id: 2, title: 'Expediting', href: '/expediting', icon: 'stopwatch', roles: ['isAdmin', 'isSuperAdmin', 'isExpediting'] },
    { id: 3, title: 'Inspection', href: '/inspection', icon: 'search', roles: ['isAdmin', 'isSuperAdmin', 'isInspection'], child:
        [
            { id: 0, title: 'Inspection & Release data', href: '/releasedata', icon: 'clipboard-check', roles: ['isAdmin', 'isSuperAdmin', 'isInspection'] },
            { id: 1, title: 'Certificates', href: '/certificates', icon: 'file-certificate', roles: ['isAdmin', 'isSuperAdmin', 'isInspection'] },
        ]
    },
    { id: 4, title: 'Shipping', href: '/shipping', icon: 'ship', roles: ['isAdmin', 'isSuperAdmin', 'isShipping'], child:
        [
            { id: 0, title: 'Prepare transport docs', href: '/transportdocs', icon: 'passport', roles: ['isAdmin', 'isSuperAdmin', 'isShipping'] },
            { id: 1, title: 'Complete packing details', href: '/packingdetails', icon: 'box-open', roles: ['isAdmin', 'isSuperAdmin', 'isShipping'] },            
        ]
    },
    { id: 5, title: 'Warehouse', href: '/warehouse', icon: 'warehouse', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'], child: 
        [
            { id: 0, title: 'Certificates', href: '/whcertificates', icon: 'file-certificate', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] },
            { id: 1, title: 'Stock management', href: '/stockmanagement', icon: 'forklift', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] },
            { id: 2, title: 'Material issue record', href: '/materialissuerecord', icon: 'phone-square', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] }, 
            { id: 3, title: 'Picking ticket', href: '/pickingticket', icon: 'clipboard-list', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] },
            { id: 4, title: 'Shipping', href: '/whshipping', icon: 'ship', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] }, 
            { id: 5, title: 'Locations', href: '/locations', icon: 'map-marked-alt', roles: ['isAdmin', 'isSuperAdmin', 'isWarehouse'] } 
        ] 
    },
    { id: 6, title: 'Configuration', href: '/configuration', icon: 'cog', roles: ['isAdmin', 'isSuperAdmin', 'isConfiguration'] }
]

function isRole(accesses, user, role) {
    if (!_.isUndefined(accesses) && accesses.hasOwnProperty('items') && user && role) {
        return accesses.items.reduce(function (acc, curr){
            if (!acc && curr.userId === user.id && curr[role] === true) {
                acc = true;
            }
            return acc;
        }, false);
    } else {
        return false
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
            case '/':
            case '/user':
            case '/settings':
            case '/opco':
            case '/project':
                return true;
            case '/dashboard':
            case '/duf':
            case '/expediting':
            case '/inspection':
            case '/releasedata':
            case '/certificates':
            case '/shipping':
            case '/transportdocs':
            case '/packingdetails':
            case '/warehouse':
            case '/stockmanagement':
            case '/materialissuerecord':
            case '/pickingticket':
            case '/whshipping':
            case '/locations':
            case '/configuration': 
                return false;
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

    menuList(menu, accesses, selection, isHome){
        let enabledMenus = [];
        var listMenu = []
        let user = JSON.parse(localStorage.getItem('user'));
        if (isHome) {
            menu.forEach(function(item) {
                if (!item.roles){
                    listMenu.push(item);
                } else if (item.roles.includes('isAdmin') && user.isAdmin) {
                    listMenu.push(item);
                } else if (item.roles.includes('isSuperAdmin') && user.isSuperAdmin) {
                    listMenu.push(item);
                } else if (item.roles.includes('isExpediting') && isRole(accesses, user, 'isExpediting')) {
                    listMenu.push(item);
                } else if (item.roles.includes('isInspection') && isRole(accesses, user, 'isInspection')) {
                    listMenu.push(item);
                } else if (item.roles.includes('isShipping') && isRole(accesses, user, 'isShipping')) {
                    listMenu.push(item);
                } else if (item.roles.includes('isWarehouse') && isRole(accesses, user, 'isWarehouse')) {
                    listMenu.push(item);
                } else if (item.roles.includes('isConfiguration') && isRole(accesses, user, 'isConfiguration')) {
                    listMenu.push(item);
                }
            });  
        } else if (!!selection && selection.hasOwnProperty('project') && !_.isEmpty(selection.project)) {

            menu.forEach(function (item) {
                switch(item.title) {
                    case 'Expediting':
                        if (!!selection.project.enableInspection || !!selection.project.enableShipping) {
                            enabledMenus.push(item);
                        }
                        break;
                    case 'Inspection':
                        if (!!selection.project.enableInspection) {
                            enabledMenus.push(item);
                        }
                        break;
                    case 'Shipping':
                        if (!!selection.project.enableShipping) {
                            enabledMenus.push(item);
                        }
                        break;
                    case 'Warehouse':
                        if (!!selection.project.enableWarehouse) {
                            enabledMenus.push(item);
                        }
                        break;
                    default: enabledMenus.push(item);
                }
            });

            enabledMenus.forEach(function(item) {
                if (!item.roles){
                    listMenu.push(item);
                } else if (item.roles.includes('isAdmin') && user.isAdmin) {
                    listMenu.push(item);
                } else if (item.roles.includes('isSuperAdmin') && user.isSuperAdmin) {
                    listMenu.push(item);
                } else if (item.roles.includes('isExpediting') && isRole(accesses, user, 'isExpediting')) {
                    listMenu.push(item);
                } else if (item.roles.includes('isInspection') && isRole(accesses, user, 'isInspection')) {
                    listMenu.push(item);
                } else if (item.roles.includes('isShipping') && isRole(accesses, user, 'isShipping')) {
                    listMenu.push(item);
                } else if (item.roles.includes('isWarehouse') && isRole(accesses, user, 'isWarehouse')) {
                    listMenu.push(item);
                } else if (item.roles.includes('isConfiguration') && isRole(accesses, user, 'isConfiguration')) {
                    listMenu.push(item);
                }
            });
        }
        return listMenu;
    }

    render() {
        const { projectId, show, mobileItem } = this.state;
        const { accesses, menuItem, sidemenu, selection } = this.props;
        return (
            <div>
                {this.isLoggedIn() && 
                    <div id="sidebar-menu" className={sidemenu.collapsed ? 'collapsed' : undefined} onMouseLeave={this.mouseLeave}>
                        <NavLink to={{ pathname: '/' }} tag="div" className="sidebar-logo">
                            <img src={sidemenu.collapsed ? icon : logo} />
                        </NavLink>
                        <ul className="default-list menu-list">
                        {
                            this.isHome() ?
                                this.menuList(home_menu, accesses, selection, true).map((item) => 
                                    <Item item={item} key={item.id} projectId={projectId} menuItem={menuItem} sidemenu={sidemenu} show={show} handleItemOver={this.handleItemOver}/>
                                )
                            :
                                this.menuList(project_menu, accesses, selection, false).map((item) => 
                                    <Item item={item} key={item.id} projectId={projectId} menuItem={menuItem} sidemenu={sidemenu} show={show} handleItemOver={this.handleItemOver}/>
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