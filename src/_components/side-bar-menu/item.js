//React
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
//FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import './side-bar-menu.scss';
//Components
import SubItem from './sub-item.js'
import { itemMixin } from './mixin'
class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    render() {
        const { menuItem, item, sidemenu, projectId, show, handleItemOver } = this.props
        return (
            <li>
                {projectId ?
                    <NavLink 
                        to={{  pathname: item.href, search: '?id=' + projectId }} 
                        tag="a"
                        className={`${item.title == menuItem ? "menu-item__selected" : "menu-item"}`}
                    >
                        <FontAwesomeIcon icon={item.icon} className="item-icon" name={item.icon}/>
                        <span className="item-text" onMouseEnter={event => handleItemOver(event, item.title)}>{item.title}
                            {item.child &&
                                <FontAwesomeIcon icon="angle-right" className={`item-arrow ${show == item.title && "expand"} float-right`} style={{margin: '0px', verticalAlign: 'middle'}}/>
                            }
                        </span>
                    </NavLink>
                :
                    <NavLink
                        to={{  pathname: item.href }}
                        tag="a"
                        className={`${item.title == menuItem ? "menu-item__selected" : "menu-item"}`}
                    >
                        <FontAwesomeIcon icon={item.icon} className="item-icon" name={item.icon}/>
                        <span className="item-text">{item.title}
                            {item.child &&
                                <FontAwesomeIcon icon="angle-right" className={`item-arrow ${show == item.title && "expand"} float-right`} style={{margin: '0px', verticalAlign: 'middle'}}/>
                            }
                        </span>
                    </NavLink>              
                }
                {(!sidemenu.collapsed && item.child) &&
                    <div className="dropdown">
                        <div className={`show-animation ${show == item.title && 'active'}`}>
                            <ul className={`${show == item.title ? "show-animation-enter-active" : "show-animation-leave-active"}`}>
                                {item.child && item.child.map((subitem)=>
                                    <SubItem key={subitem.id} item={subitem} menuItem={menuItem} projectId={projectId}/>
                                )}
                            </ul>
                        </div>
                    </div>
                }
            </li>
        ); 

    }
}

export default Item;

//<li item={subitem} key={subitem.id} />