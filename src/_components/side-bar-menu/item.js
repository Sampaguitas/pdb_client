//React
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
//FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

        return (
            <li>
                <NavLink to={{ pathname: this.props.item.href }} tag="a">
                    <FontAwesomeIcon icon={this.props.item.icon} className="item-icon" name={this.props.item.icon}/>
                    {!this.props.collapsed &&
                    <span className="item-text">{this.props.item.title}
                            {this.props.item.child &&
                            <FontAwesomeIcon icon="angle-right" className="item-arrow" />
                            }
                    </span>
                    }
                </NavLink>
                {(!this.props.collapsed && this.props.item.child) &&
                    <div className="dropdown">
                        <transition name="show-animation">
                        {this.state.show &&
                        <ul>
                            {this.props.item.child.map((subitem)=>
                                <SubItem key={subitem.id} item={subitem}/>
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

export default Item;

//<li item={subitem} key={subitem.id} />