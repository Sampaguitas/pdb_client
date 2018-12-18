import React from 'react';
import propTypes from 'prop-types';

const CheckboxAsync = (props) => (
    <div>
        <label className="form-label">{props.title}</label>
        <div className="checkbox-group">
        {props.options.map(opt => {
            return (
                <label key={opt} className="form-label capitalize">
                    <input
                        className="form-checkbox"
                        name={props.setName}
                        onChange={props.controlFunc}
                        value={opt}
                        checked={props.selectedOptions.indexOf(opt) > - }
                        type={props.type} 
                    /> {opt}
                </label>
            );
        })}
        </div>
    </div>
);

CheckboxAsync.propTypes = {
    title: propTypes.string.isRequired,
    type:propTypes.oneOf(['checkbox', 'radio']).isRequired,
    setName: propTypes.string.isRequired,
    options: propTypes.array.isRequired,
    selectedOptions: propTypes.array,
    controlFunc: propTypes.func.isRequired
};

export default CheckboxAsync;