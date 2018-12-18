import React from 'react';
import propTypes from 'prop-types';

const Input = (props) => (
    <div className={'form-group' + (props.submitted && !props.value ? ' has-error' : '')}>
            <label htmlFor={props.name}>{props.title}</label>
            <input
                className="form-control"
                name={props.name}
                type={props.type}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder} 
            />
        {props.submitted && !props.value &&
            <div className="help-block">{props.title} is required</div>
        }
    </div>
);

Input.propTypes = {
    type: propTypes.oneOf(['text', 'number', 'email', 'password']).isRequired,
    title: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    value:propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
    ]).isRequired,
    placeholder:propTypes.string,
};

export default Input;