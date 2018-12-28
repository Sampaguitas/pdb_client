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
        return (
            <li>
                <NavLink to={{ pathname: this.props.item.href }} tag="a">
                    <FontAwesomeIcon icon={this.props.item.icon} className="item-icon" name={this.props.item.icon}/>
                    <span className="item-text">{this.props.item.title}
                        {this.props.item.child &&
                            <FontAwesomeIcon icon="angle-right" />
                        }
                    </span>
                </NavLink>
                {this.props.item.child &&
                    <div className="dropdown">
                        <transition name="show-animation">
                            {this.state.show &&
                                <ul>
                                    {this.props.item.child.map((subitem) =>
                                        <Item key={subitem.id} item={subitem} />
                                    )}
                                </ul>
                            }
                        </transition>
                    </div>
                }
            </li>
        );
    }
}
export default SubItem;