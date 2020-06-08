import React, { Component } from 'react'
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './warehouse-check.css';
import _ from 'lodash';

class WarehouseCheck extends Component {
    constructor(props) {
        super(props);
        this.state = { isChecked: false };
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        const { isChecked } = this.props;
        this.setState({
            isChecked: isChecked
        });
    }

    componentDidUpdate(prevProps) {
        const { isChecked } = this.props;
        if (prevProps.isChecked != isChecked) {
            this.setState({
                isChecked: isChecked
            });
        }
    }

    onChange(event) {
        const { handleCheck, id } = this.props;
        this.setState({
            isChecked: event.target.checked
        }, () => handleCheck(id))
    }

    render(){
        const { isChecked } = this.state;
        const { title } = this.props;
        return (
            <div className="col-4 mb-2" style={{lineHeight: '1.5', fontSize: '1.25rem'}}> {/*marginBottom: '10px'*/}
            <label className="fancy-checkbox" style={{padding: '0px', margin: '0px'}}>  {/*'19.5px'*/}
                <input
                    type="checkbox"
                    name="isChecked"
                    checked={isChecked}
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

export default WarehouseCheck;