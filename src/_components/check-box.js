import React from 'react';
import propTypes from 'prop-types';

const CheckBox = (props) => (
    <div className="ml-4 mb-3">
        <label className="checkbox-inline">
            <input 
                    className="form-check-input"
                    id={props.id}
                    name={props.name}
                    type="checkbox"
                    checked={props.checked}
                    onChange={props.onChange}
            />
        {props.title}
        </label><br />
        <small>{props.small}<strong>{props.strong}</strong></small>
    </div>
);

CheckBox.propTypes = {
    title: propTypes.string.isRequired,
    id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    small: propTypes.string,
    strong: propTypes.string,
    checked: propTypes.bool.isRequired,
    onChange: propTypes.func.isRequired
};

export default CheckBox;

{/* <input
    className="form-check-input"
    id={props.id}
    name={props.name}
    type="checkbox"
    checked={props.checked}
    onChange={props.onChange}
/>
    <label
        className="form-check-label"
        htmlFor={props.id}
    >{props.title}</label> <br /> */}