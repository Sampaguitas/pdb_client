//React
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
//Icons
import logo from '../../_assets/logo.svg';
import icon from '../../_assets/icon.svg';
//FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons';
//Components
import Item from './item.js'
import SubItem from './sub-item.js'
import MobileItem from './mobile-item.js'
//Styles
import '../../_styles/main.scss'

class SideBarMenu extends Component {
    constructor(props) {
        super(props);
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.state = {
            menu: [],
            collapsed: false
        }
    }
    toggleCollapse() {
        this.setState({ collapsed: !this.state.collapsed });
    }
    mouseLeave(){
        this.mobileItem = null
    }
    isInRole(tab) {
        return true;
        // if (!!this.$store.getters.project) {
        //     if (tab.title.toLowerCase() == "inspection" && !this.$store.getters.project.isInspectionModuleEnabled)
        //         return false;

        //     if (tab.title.toLowerCase() == "shipping" && !this.$store.getters.project.isShippingModuleEnabled)
        //         return false;

        //     if (tab.title.toLowerCase() == "warehouse" && !this.$store.getters.project.isWarehouseModuleEnabled)
        //         return false;
        // }
        // if (tab.roles != null) {
        //     if (tab.roles.some((r) => { return this.roles.indexOf(r) >= 0 })) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
        // return true;
    }

    render() {
        var menu = ['Overview', 'Add Operation Company', 'Add Project', 'Add Project']
        return (
            <div 
                id="sidebar-menu" 
                className={this.state.collapsed ? 'collapsed' : ''} 
                onMouseLeave={this.onMouseLeave}
            >
                <Redirect to={{ pathname: '/' }} tag="div" className="sidebar-logo">
                    <img src={this.state.collapsed ? icon : logo} />
                </Redirect>
                <ul className="default-list menu-list">
                    {menu.map(function (item, index) {
                        if (isInRole(item)) {
                            return <item key={index} item={item} firstItem="true" isCollapsed="collapsed" />;
                        }
                    })}
                </ul>
                <ul 
                    className={this.state.collapsed ? "mobile-list menu-list" : ''} 
                    style={this.state.collapsed ? '' : "{'top' : `${mobileItemPos}px`}"}
                >
                    <mobile-item item="mobileItem" mobileItemPos="mobileItemPos" />
                </ul>
                <button className="collapse-btn" onClick={this.toggleCollapse}>
                    <FontAwesomeIcon icon={faArrowsAltH} />
                </button>
            </div>
        );
    }
}
export default SideBarMenu;