import React from 'react';
import propTypes from 'prop-types';

const Input = (props) => (
    <div className={'form-group' + (props.inline ? ' row' : '') + (props.submitted && !props.value ? ' has-error' : '')}>
            <label 
                htmlFor={props.name} 
                className={props.inline && "col-sm-2 col-form-label"}
            >{props.title}</label>
            <div className={props.inline && "col-sm-10"}>
                <input
                    className="form-control"
                    id={props.name}
                    name={props.name}
                    type={props.type}
                    value={props.value}
                    onChange={props.onChange}
                    placeholder={props.placeholder} 
                />
            </div>
        {props.submitted && !props.value && props.required &&
            <div className="help-block">{props.title} is required</div>
        }
    </div>
);

Input.propTypes = {
    type: propTypes.oneOf(['text', 'number', 'email', 'tel','password']).isRequired,
    title: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    value:propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
    ]).isRequired,
    placeholder:propTypes.string,
    inline: propTypes.bool,
    required: propTypes.bool
};

export default Input;