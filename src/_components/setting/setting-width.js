import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SettingWidth extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
    }

    componentDidMount() {
        const { value } = this.props;
        this.setState({
            value: value
        });
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        
        if (prevProps.value != value) {
            this.setState({ value: value });
        }
    }

    render(){

        const { id, name, title, clearWidth } = this.props;
        const { value } = this.state;

        return (
            <div className="form-group col-4">
                <label htmlFor={name}>{title}</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        name={name}
                        value={`${value}px`}
                        type="text"
                        disabled
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-leeuwen-blue"
                            title="Clear"
                            onClick={event => clearWidth(event, name)}
                            style={{width: '40px'}}
                        >
                            <span><FontAwesomeIcon icon="trash-alt" className="far fa-2x"/></span>
                        </button>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default SettingWidth;