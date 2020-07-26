import React, { Component } from 'react';
// import propTypes from 'prop-types';

export class Select extends Component {
    render() {
        return (
            <div className={'form-group' + (this.props.inline ? ' row' : '') + (this.props.submitted && this.props.required && !this.props.value ? ' has-error' : '')}>
                <label 
                    htmlFor={this.props.name} 
                    className={this.props.inline ? "col-sm-2 col-form-label" : ''}
                >{this.props.title}</label>
                <div className={this.props.inline ? "col-sm-10" : ''}>
                    <select
                        className="form-control"
                        type="text"
                        id={this.props.name}
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        disabled={this.props.disabled}
                        style={{cursor: 'pointer'}}
                    >
                        <option defaultValue="" disabled hidden>{this.props.placeholder}</option>
                        {this.props.options && this.props.options.map(option => {
                            return (
                                <option
                                    key={option._id}
                                    value={option._id}>{option.name}
                                </option>
                            );
                        })}
                    </select>
                </div>

            </div>
        );
    }
}

// Select.propTypes = {
//     title: propTypes.string.isRequired,
//     name: propTypes.string.isRequired,
//     // options: propTypes.array.isRequired,
//     value: propTypes.string,
//     placeholder: propTypes.string,
//     onChange: propTypes.func.isRequired,
//     inline: propTypes.bool,
//     required: propTypes.bool
// };

// export default Select;
