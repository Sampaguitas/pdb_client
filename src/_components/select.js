import React from 'react';
import propTypes from 'prop-types';

const Select = (props) => (
    <div className="form-group">
        <select
            name={props.name}
            value={props.selectedOption}
            onChange={props.controlFunc}
            className="from-select">
            <option value="">{props.placeholder}</option>
            {props.options.map(opt => {
                return(
                    <option
                    key={opt}
                    value={opt}>{opt}</option>
                );
            })}
        </select>
    </div>
);

Select.propTypes = {
    name: propTypes.string.isRequired,
    options: propTypes.array.isRequired,
    selectOption: propTypes.string,
    controlFunc: propTypes.func.isRequired,
    placeholder: propTypes.string
};

export default Select;
