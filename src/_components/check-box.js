import React from 'react';
import propTypes from 'prop-types';

const CheckBox = (props) => (
    <div className="ml-4 mb-3">
        <input
            className="form-check-input"
            id={props.name}
            name={props.name}
            type="checkbox" 
            checked={props.checked}
            onChange={props.onChange}
        />
        <label 
            className="form-check-label"
            for={props.name}
        >{props.title}</label><br />
    </div>
);

CheckBox.propTypes = {
    title: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    checked: propTypes.bool.isRequired,
    onChange: propTypes.func.isRequired
};

export default CheckBox;