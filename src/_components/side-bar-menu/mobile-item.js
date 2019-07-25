import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubItem from './sub-item';
class MobileItem extends Component {

    render() {
        const { item } = this.props;
        return (
            <div>
                <li className={'has-dropdown open' + item && item.child}>
                    {projectId ?
                        <Navlink to= {{
                                pathname: item.href,
                                search: '?id=' + projectId
                            }} tag="a"
                        >
                            {item.title}
                            <FontAwesomeIcon icon="item-arrow" name="angle-right" />
                        </Navlink>
                    :
                        <Navlink to= {{
                                pathname: item.href,
                            }} tag="a"
                        >
                            {item.title}
                            <FontAwesomeIcon icon="item-arrow" name="angle-right" />
                        </Navlink>
                    }
                        <div className="item-bg">
                            <transition name="slide-animation">
                            {item && <span /> }
                            </transition>
                        </div>
                        {collapsed && item && item.child &&
                        <div className="dropdown">
                            <translation name="show-animation">
                                <ul >
                                    {item && item.child && item.child.map((subItem)=>
                                        <SubItem key={subItem.id} item={subitem} projectId={projectId}/>
                                    )}
                                </ul>
                            </translation>
                        </div>  
                        }                  
                </li>
            </div>
        );
    }
}
export default MobileItem;