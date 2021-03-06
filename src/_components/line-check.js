import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './line-check.css';
import _ from 'lodash';

export class LineCheck extends Component {
    constructor(props) {
        super(props);
        this.state = { isChecked: false };
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
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
            <div className="mb-4" style={{lineHeight: '1.5', fontSize: '1.25rem'}}> {/*marginBottom: '10px'*/}
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

// export default LineCheck;