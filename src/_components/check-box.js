import React, { Component } from 'react'
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './check-box.css'

class CheckBox extends Component {
    render(){
        return (
            <div className="mt-4 mb-4" style={{lineHeight: '1.5', fontSize: '1.25rem'}}>
            <label className="fancy-checkbox">
            <input
                id="thisCheckBox"
                ref="input"
                name={this.props.name}
                type='checkbox'
                checked={this.props.checked}
                onChange={this.props.onChange}
                disabled={this.props.disabled}
                ClassName="form-check-input"
            />
            <FontAwesomeIcon icon="check-square" className="checked fa-lg mr-3" style={{color: '#0070C0'}}/>
            <FontAwesomeIcon icon={["far", "square"]} className="unchecked fa-lg mr-3" style={{color: '#adb5bd'}}/>
            {this.props.title}
            </label>
        </div>
        )
    }
}




export default CheckBox;
// const CheckBox = (props) => (
//     <div className="ml-4 mb-3">
//         <label className="checkbox-inline">
//             <input 
//                     className="form-check-input"
//                     id={props.id}
//                     name={props.name}
//                     type="checkbox"
//                     checked={props.checked}
//                     onChange={props.onChange}
//             />
//         {props.title}
//         </label><br />
//         <small>{props.small}<strong>{props.strong}</strong></small>
//     </div>
// );

// CheckBox.propTypes = {
//     title: propTypes.string.isRequired,
//     id: propTypes.string.isRequired,
//     name: propTypes.string.isRequired,
//     small: propTypes.string,
//     strong: propTypes.string,
//     checked: propTypes.bool.isRequired,
//     onChange: propTypes.func.isRequired
// };

// export default CheckBox;

{/* <input
    className="form-check-input"
    id={props.id}
    name={props.name}
    type="checkbox"
    checked={props.checked}
    onChange={props.onChange}
/>
    <label
        className="form-check-label"
        htmlFor={props.id}
    >{props.title}</label> <br /> */}