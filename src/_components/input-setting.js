import React, { Component } from 'react'
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './check-setting.css'

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function getDateFormat(myLocale) {
    let tempDateFormat = ''
    myLocale.formatToParts().map(function (element) {
        switch(element.type) {
            case 'month': 
                tempDateFormat = tempDateFormat + 'MM';
                break;
            case 'literal': 
                tempDateFormat = tempDateFormat + element.value;
                break;
            case 'day': 
                tempDateFormat = tempDateFormat + 'DD';
                break;
            case 'year': 
                tempDateFormat = tempDateFormat + 'YYYY';
                break;
        }
    });
    return tempDateFormat;
}

class InputSetting extends Component {

    render(){

        const { 
            type,
            title,
            name,
            value, 
            onChange, 
        } = this.props;

        return (
            <div className="form-group col-4">
                <label htmlFor={name}>{title}</label>
                <input
                    className="form-control"
                    type={type === 'number' ? 'number' : 'text'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={type === 'date' ? getDateFormat(myLocale) : ''}
                />
            </div>
        );
    }
}

export default InputSetting;