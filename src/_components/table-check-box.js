import React, { Component } from 'react';
import propTypes from 'prop-types';

class TableCheckBox extends Component {
    render(){
        return (
            <div className="form-check">
                <input
                    name={this.props.id}
                    type="checkbox"
                    className="form-check-input"
                    checked={this.props.checked}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                />
            </div>
        );
    }
};
TableCheckBox.propTypes = {
    id:propTypes.string.isRequired,
    checked:propTypes.bool.isRequired
};

export default TableCheckBox;
