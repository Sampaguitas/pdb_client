import React from 'react';
import propTypes from 'prop-types';

const TableCheckBox = (props) => (
<div className="form-check">
        <input 
            type="checkbox" 
            className="form-check-input" 
            id={this.props.id} 
            checked={props.checked}
            onChange={props.onChange}
        />
</div>
);

TableCheckBox.propTypes = {
    id: propTypes.string.isRequired,
   checked: propTypes.bool.isRequired,
   onChange: propTypes.func.isRequired
};

export default TableCheckBox;