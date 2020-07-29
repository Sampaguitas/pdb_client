import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const InputIcon = (props) => (
    <div className={'form-group' + (props.submitted && !props.value ? ' has-error' : '')}>
        <div className="input-group input-group-lg">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    <FontAwesomeIcon icon={props.icon} />
                </div>
            </div>
            <input
                className="form-control"
                name={props.name}
                type={props.type}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                autoComplete={props.autoComplete}
            />
        </div>
        {props.submitted && !props.value &&
            <div className="help-block">{props.title} is required</div>
        }
    </div>
);

// export default InputIcon;