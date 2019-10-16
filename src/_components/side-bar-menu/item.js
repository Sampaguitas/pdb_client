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
        const { item, collapsed, projectId, show, handleItemOver } = this.props
        return (
            <li>
                {projectId ?
                    <NavLink to={{ 
                            pathname: item.href,
                            search: '?id=' + projectId
                        }} tag="a"
                    >
                        <FontAwesomeIcon icon={item.icon} className="item-icon" name={item.icon}/>
                        {/* {!collapsed && */}
                        <span className="item-text" onMouseEnter={event => handleItemOver(event, item.title)}>{item.title}
                                {item.child &&
                                <FontAwesomeIcon icon={show == item.title ? "angle-down" : "angle-right"} className="item-arrow float-right" style={{margin: '0px', verticalAlign: 'middle'}}/>
                                }
                        </span>
                        {/*}}*/}
                    </NavLink>
                :
                    <NavLink to={{ 
                            pathname: item.href
                        }} tag="a"
                    >
                        <FontAwesomeIcon icon={item.icon} className="item-icon" name={item.icon}/>
                        {!collapsed &&
                        <span className="item-text">{item.title}
                                {item.child &&
                                <FontAwesomeIcon icon={show == item.title ? "angle-down" : "angle-right"} className="item-arrow float-right" style={{margin: '0px', verticalAlign: 'middle'}}/>
                                }
                        </span>
                        }
                    </NavLink>              
                }
                {(!collapsed && item.child) &&
                    <div className="dropdown">
                    <div name="show-animation">
                        {show == item.title &&
                        <ul>
                            {item.child.map((subitem)=>
                                <SubItem key={subitem.id} item={subitem} projectId={projectId}/>
                            )}
                        </ul>
                        }
                        </div>
                    </div>
                }
            </li>
        ); 

    }
}

export default Item;

//<li item={subitem} key={subitem.id} />