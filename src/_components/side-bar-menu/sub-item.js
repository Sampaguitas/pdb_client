//React
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
//FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//Components
import Item from './sub-item.js'
import { itemMixin } from './mixin'

class SubItem extends Component {

    render() {
        const { item, projectId } = this.props
        return (
            <li>
                {projectId ?
                    <NavLink to={{ 
                            pathname: item.href,
                            search: '?id=' + projectId
                        }} tag="a"
                    >
                        <FontAwesomeIcon icon={item.icon} className="item-icon" name={item.icon}/>
                        <span className="item-text">{item.title}
                            {item.child &&
                                <FontAwesomeIcon icon="angle-right" />
                            }
                        </span>
                    </NavLink>
                :
                    <NavLink to={{ 
                            pathname: item.href
                        }} tag="a"
                    >
                        <FontAwesomeIcon icon={item.icon} className="item-icon" name={item.icon}/>
                        <span className="item-text">{item.title}
                            {item.child &&
                                <FontAwesomeIcon icon="angle-right" />
                            }
                        </span>
                    </NavLink>
                }
                {item.child &&
                    <div className="dropdown">
                        <div name="show-animation"> {/*transition */}
                            {this.state.show &&
                                <ul>
                                    {item.child.map((subitem) =>
                                        <Item key={subitem.id} item={subitem} projectId={projectId}/>
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
export default SubItem;