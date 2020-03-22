import React, { Component } from 'react'
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './check-setting.css'

class CheckSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldValue: true,
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        const { callback } = this.props;
        this.setState({fieldValue: event.target.checked}, callback(event.target.checked))
    }

    render(){
        const { fieldValue } = this.state;
        const { title } = this.props;
        return (
            <div className="col-4" style={{lineHeight: '1.5', fontSize: '1.25rem'}}> {/*marginBottom: '10px'*/}
            <label className="fancy-checkbox" style={{padding: '10px'}}>  {/*'19.5px'*/}
                <input
                    type="checkbox"
                    name="fieldValue"
                    checked={fieldValue}
                    onChange={this.onChange}
                />
                <FontAwesomeIcon icon="check-square" className="checked fa-lg mr-3" style={{color: '#0070C0', cursor: 'pointer'}}/>
                <FontAwesomeIcon icon={["far", "square"]} className="unchecked fa-lg mr-3" style={{color: '#adb5bd', cursor: 'pointer'}}/>
                {title}
            </label>
        </div>
        )
    }
}

export default CheckSetting;