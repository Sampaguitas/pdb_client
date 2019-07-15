import React, { Component } from 'react';
import propTypes from 'prop-types';

class Input extends Component{
    render() {
        return(
            <div className={'form-group' + (this.props.inline ? ' row' : '') + (this.props.submitted && this.props.required && !this.props.value ? ' has-error' : '')}>
                <label
                    htmlFor={this.props.name}
                    className={this.props.inline ? "col-sm-2 col-form-label" : ''}
                >{this.props.title}</label>
                <div className={this.props.inline ? "col-sm-10" : ''}>
                    <input
                        className="form-control"
                        id={this.props.name}
                        name={this.props.name}
                        type={this.props.type}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        placeholder={this.props.placeholder}
                        disabled={this.props.disabled}
                        autocomplete={this.props.autocomplete}
                    />
                    {this.props.submitted && !this.props.value && this.props.required &&
                        <div className="help-block">{this.props.title} is required</div>
                    }
                </div>

            </div>
        );
    }
}

Input.propTypes = {
    type: propTypes.oneOf(['text', 'number', 'email', 'tel','password']).isRequired,
    title: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    value:propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
    ]),
    placeholder:propTypes.string,
    inline: propTypes.bool,
    required: propTypes.bool
};

export default Input;