import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-check-box.css'
import classNames from 'classnames';

class TableCheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            fieldName: '',
            fieldValue: false,
            color: '#0070C0',
            isSelected: false,
            // disabled: false,
        }
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
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

    componentDidUpdate(prevProps, prevState) {
        const {
            collection,
            objectId,
            fieldName,
            fieldValue,
        } = this.props;

        if (fieldValue != prevProps.fieldValue) {
            this.setState({
                collection: collection,
                objectId: objectId,
                fieldName: fieldName,
                fieldValue: fieldValue ? fieldValue : false,
                isSelected: false,
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

    onClick() {
        const { isSelected } = this.state;
        this.setState({
            // isSelected: true
            isSelected: false 
        }, () => {
            setTimeout(() => {
                this.refs.input.focus();
            }, 1);
        });
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
                    body: `{"${fieldName}":${value}}`
                };
                return fetch(`${config.apiUrl}/${collection}/update?id=${objectId}`, requestOptions)
                .then( () => {
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
            isSelected,
        } = this.state;

        const tdClasses = classNames(
            'table-cell',
            {
                isSelected: isSelected,
            }
        );
        
        return (
            <td 
                onClick={() => this.onClick()}
                style={{width: `${width ? width : 'auto'}`}}
                className={tdClasses}
            >
                    <label className="fancy-table-checkbox">
                        <input
                            
                            ref="input"
                            type="checkbox"
                            name="fieldValue"
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
                                // height: '100%',
                                margin: '0px',
                                verticalAlign: 'middle',
                                cursor: unlocked ? 'pointer' : disabled ? 'auto' : 'pointer'
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
                                // height: '100%',
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

export default TableCheckBox;
