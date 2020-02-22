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
    { id: 1, title: 'Data Upload File (DUF)', href: '/duf', icon: 'upload', roles: ['isAdmin', 'isSuperAdmin'] },
    { id: 2, title: 'Expediting', href: '/expediting', icon: 'stopwatch', roles: ['isAdmin', 'isSuperAdmin', 'isExpediting'], child:
        [
            { id: 0, title: 'Total Client PO Overview', href: '/overview', icon: 'table', roles: ['isAdmin', 'isSuperAdmin', 'isExpediting'] },
            { id: 1, title: 'Performance Reports', href: '/performance', icon: 'chart-line', roles: ['isAdmin', 'isSuperAdmin', 'isExpediting'] },
        ]
    },
    // { id: 2, title: 'Expediting', href: '/expediting', icon: 'stopwatch', roles: ['isAdmin', 'isSuperAdmin', 'isExpediting'] },
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

// function test(accesses, user, role) { 
//     const result = accesses.find(access => {
//         if (_.isEqual(access.userId, user.id)){
//             switch (role) {
//                 case 'isExpediting': return access.isExpediting === true;
//                 case 'isInspection': return access.isInspection === true;
//                 case 'isShipping': return access.isShipping === true;
//                 case 'isWarehouse': return access.isWarehouse === true;
//                 case 'isConfiguration': return access.isConfiguration === true;
//                 default: return false;
//             }
//         }
//     });
//     return result
// }

function isRole(accesses, user, role) {
    if (!_.isEmpty(accesses) && accesses.hasOwnProperty('items') && user && role) {
        return accesses.items.reduce(function (acc, curr){
            if (!acc && _.isEqual(curr.userId, user._id)) {
                acc = curr[role];
            }
            return acc;
        }, false);
    } else {
        return false
    }
}

// function isRole(accesses, user, role) {
//     if (_.isEmpty(accesses)) {
//         return false;
//     } else {
//         if (!_.isEmpty(test(accesses, user, role))) {
//             return true;
//         } else {
//             return false;
//         }
//     }
// }

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
                break;
            case '/dashboard':
            case '/duf':
            case '/expediting':
            case '/overview':
            case '/performance':
            case '/inspection':
            case '/releasedata':
            case '/certificates':
            case '/shipping':
            case '/transportdocs':
            case '/packingdetails':
            case '/warehouse':
            case '/goodsreceipt':
            case '/stockmanagement':
            case '/callofforder':
            case '/pickinglists':
            case '/outgoingshipments':
            case '/projectwarhouse':
            case '/configuration': 
                return false;
                break
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