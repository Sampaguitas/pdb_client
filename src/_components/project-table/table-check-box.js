import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-check-box.css'

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

class TableCheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            fieldName: '',
            fieldValue: false,
            color: '#0070C0',
            // disabled: false,
        }
        this.onChange = this.onChange.bind(this);
    }
    
    componentDidMount(){
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: this.props.fieldValue ? this.props.fieldValue : false,
            // disabled: this.props.disabled ? this.props.disabled : false
        });
    }

    componentWillReceiveProps(nextProps) {
        // const { unlocked, disabled } = this.props;
        if(!_.isEqual(nextProps.fieldValue, this.props.fieldValue)) {
            this.setState({
                collection: nextProps.collection,
                objectId: nextProps.objectId,
                fieldName: nextProps.fieldName,
                fieldValue: nextProps.fieldValue ? nextProps.fieldValue : false,
                // isEditing: false,
                // isSelected: false,
                color: 'green',
            }, () => {
                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        color: '#0070C0',
                    });
                }, 1000);
            });
        }
    }

    onChange(event) {
        const { collection, objectId, fieldName, fieldValue } = this.state;
        const { refreshStore } = this.props;
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        }, () => {
            if (collection && objectId && fieldName) {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: `{"${fieldName}":${fieldValue}}`
                };
                return fetch(`${config.apiUrl}/${collection}/update?id=${objectId}`, requestOptions)
                .then( () => {
                    // this.setState({
                    //     ...this.state,
                    //     color: 'green',
                    // }, () => {
                    //     setTimeout(() => {
                    //         this.setState({
                    //             ...this.state,
                    //             color: '#0070C0',
                    //         });
                    //     }, 1000);                         
                    // });
                    refreshStore();
                })
                .catch( () => {
                    this.setState({
                        ...this.state,
                        color: 'red',
                        fieldValue: this.props.fieldValue ? this.props.fieldValue: false,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                ...this.state,
                                color: '#0070C0',
                            });
                        }, 1000);
                    }); 
                });
            }            
        });
    }

    render(){
        const {
            disabled,
            unlocked,
            width
        } = this.props;
        
        const {
            color,
            fieldValue,
        } = this.state;
        
        return (
            <td 
            style={{
                width: `${width ? width : 'auto'}`,
                // whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                // padding: '0px'
            }}            
            >
                    <label className="fancy-table-checkbox">
                        <input
                            ref="input"
                            type='checkbox'
                            name='fieldValue'
                            checked={fieldValue}
                            onChange={this.onChange}
                            disabled={unlocked ? false : disabled}
                        />
                        <FontAwesomeIcon
                            icon="check-square"
                            className="checked fa-lg"
                            style={{
                                color: disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : '#adb5bd' : color,
                                padding: 'auto',
                                textAlign: 'center',
                                width: '100%',
                                margin: '0px',
                                verticalAlign: 'middle'
                            }}
                        />
                        <FontAwesomeIcon
                            icon={["far", "square"]}
                            className="unchecked fa-lg"
                            style={{
                                color: disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : '#adb5bd' : color,
                                padding: 'auto',
                                textAlign: 'center',
                                width: '100%',
                                margin: '0px',
                                verticalAlign: 'middle',
                                cursor: unlocked ? 'pointer' : disabled ? 'auto' : 'pointer'
                            }}
                        />                
                    </label>
            </td>
        );
    }
};
TableCheckBox.propTypes = {
    fieldName: propTypes.string.isRequired,
    fieldValue:propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
        propTypes.bool,
        propTypes.instanceOf(Date),
    ])

};

export default TableCheckBox;
