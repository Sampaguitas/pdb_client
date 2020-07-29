import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import _ from 'lodash';
import classNames from 'classnames';
import { resolve } from '../../_functions';

function arraySorted(array, field, fromTbls) {
    if (array) {
        let newArray = [];
        if (!_.isEmpty(fromTbls)) {
            newArray = array.reduce(function (acc, cur) {
                if (fromTbls.indexOf(cur.fromTbl) != -1){
                    acc.push(cur)
                }
                return acc
            },[]);
        } else {
            newArray = array;
        }

        newArray.sort(function(a,b){
            if (resolve(field, a) < resolve(field, b)) {
                return -1;
            } else if ((resolve(field, a) > resolve(field, b))) {
                return 1;
            } else {
                return 0;
            }
        });
        return newArray;             
    }
}

class TableSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            fieldName: '',
            fieldValue: '',
            color: '#0070C0',
            isSelected: false,
            options:[],
            optionText: '',
            // fromTbls: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.selectedName = this.selectedName.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    componentDidMount(){
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: this.props.fieldValue ? this.props.fieldValue: '',
            options: this.props.options,
            optionText: this.props.optionText,
            // fromTbls: this.props.fromTbls
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { 
            collection, 
            objectId, 
            fieldName, 
            fieldValue, 
            options, 
            optionText, 
            // fromTbls 
        } = this.props;

        if (fieldValue != prevProps.fieldValue) {
            this.setState({
                collection: collection,
                objectId: objectId,
                fieldName: fieldName,
                fieldValue: fieldValue ? fieldValue: '',
                options: options,
                optionText: optionText,
                // fromTbls: fromTbls,
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

    onKeyDown(event) {
        if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40 || event.keyCode === 9 || event.keyCode === 13){ //left //up //wright //down //tab //enter
            this.onBlur(event);  
        }
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    onClick() {
        const { disabled, unlocked } = this.props;
        if(unlocked || !disabled){
            this.setState({isSelected: true }, () => {
                setTimeout(() => {
                this.refs.select.focus();
                }, 1);
            });
        }
    }

    onFocus() {
        const { disabled, unlocked } = this.props;
        if(unlocked || !disabled){
            this.setState({ isSelected: true }, () => {
                this.refs.select.focus();
            });
        }
    }

    onBlur(event){
        event.preventDefault();
        const {disabled, unlocked, refreshStore} = this.props;
        const { collection, objectId, fieldName, fieldValue } = this.state;
        if ((unlocked || !disabled) && collection && objectId && fieldName && objectId) {
            if (_.isEqual(fieldValue, this.props.fieldValue)) {
                this.setState({
                    ...this.state,
                    isSelected: false,
                    color: '#0070C0',
                });
            } else {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: `{"${fieldName}":"${fieldValue}"}`
                };
                return fetch(`${config.apiUrl}/${collection}/update?id=${objectId}`, requestOptions)
                .then( () => {
                    this.setState({
                        ...this.state,
                        isSelected: false,
                    }, () => {
                        refreshStore();
                    });
                })
                .catch( () => {
                    this.setState({
                        ...this.state,
                        isSelected: false,
                        color: 'red',
                        fieldValue: this.props.fieldValue ? this.props.fieldValue: '',
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
        }
    }

    selectedName(arr, search) {
        const { optionText } = this.state;
        if (arr && search) {
            const foundOption = arr.find((option) => {
                return _.isEqual(option._id, search);
            })
            if(foundOption){
                return foundOption[optionText];
            } else {
                "";
            }
        } else {
            return '';
        }
    }

    render() {
        const {
            align,
            disabled,
            textNoWrap,
            unlocked,
            width,
            fromTbls,
        } = this.props;

        const {
            color,
            isSelected,
            fieldValue,
            options,
            optionText,
        } = this.state;

        const tdClasses = classNames(
            'table-cell',
            {
                isSelected: isSelected,
            }
        );

        return ( 
            <td
                onClick={() => this.onClick()}/////
                style={{
                    color: isSelected ? 'inherit' : disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : 'inherit' : color, ////
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    padding: isSelected ? '0px': '5px',/////
                    cursor: isSelected ? 'auto' : 'pointer'/////
                }}
                className={tdClasses}
                align={align ? align : 'left'}
            >
                {isSelected ?
                    <select
                        ref='select'
                        className="form-control"
                        name='fieldValue'
                        value={fieldValue}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        disabled={unlocked ? false : disabled}
                        onKeyDown={event => this.onKeyDown(event)}
                    >
                            {options && arraySorted(options, optionText, fromTbls).map(option => {
                                return (
                                    <option
                                        key={option._id}
                                        value={option._id}>{option[optionText]}
                                    </option>
                                );
                            })}                    
                    </select>
                :
                    <span>{this.selectedName(options, fieldValue)}</span>
                }
            </td>
        );
    }
}

export default TableSelect;