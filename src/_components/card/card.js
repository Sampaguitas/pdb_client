import React, { Component } from 'react';
import propTypes from 'prop-types';
import './card.css'

class Card extends Component {
    render() {
        const { color, header } = this.props;
        return (
            <div className="card">
                <h5 className="card-header" className={color}>
                    {header}
                </h5>
                <div className="card-body">

                </div>
            </div>
        );
    }
}

Card.propTypes = {
    color: propTypes.string.isRequired,
    header: propTypes.string.isRequired
};

export default Card;

