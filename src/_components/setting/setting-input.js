import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

class SettingInput extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.onChange = this.onChange.bind(this);
    }

    // componentWillMount() {
    //     const { value } = this.props;
    //     this.setState({
    //         value: value
    //     });
    // }
    componentDidMount() {
        const { value } = this.props;
        this.setState({
            value: value
        });
    }

    componentDidUpdate(prevProps) {
        const { value, isEqual } = this.props;
        if (prevProps.value != value) {
            this.setState({ value: value });
        }

        if (prevProps.isEqual != isEqual) {
            this.setState({ isEqual: isEqual });
        }
    }

    onChange(event) {
        const { id, handleInputSettings } = this.props;
        const { value } = event.target;
        this.setState({ value: value }, () => handleInputSettings(id, value));
    }

    render(){

        const { id, name, title, type, isEqual, handleIsEqualSettings } = this.props;
        const { value } = this.state;

        return (
            <div className="form-group col-4">
                <label htmlFor={name}>{title}</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        name={name}
                        value={value}
                        type={type === 'Number' ? 'number' : 'text'}
                        placeholder={type === 'Date' ? getDateFormat(myLocale) : ''}
                        onChange={this.onChange}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-leeuwen-blue"
                            title={isEqual ? 'Equal (Filters)' : 'Contain (Filters)'}
                            onClick={event => handleIsEqualSettings(event, id)}
                            style={{width: '40px'}}
                        >
                            <span><FontAwesomeIcon icon={isEqual ? 'equals' : 'brackets-curly'} className="far fa-2x"/></span>
                        </button>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default SettingInput;