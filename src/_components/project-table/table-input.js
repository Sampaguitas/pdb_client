import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import _ from 'lodash';
import classNames from 'classnames';
import {
    myLocale,
    getDateFormat,
    DateToString,
    StringToType,
    isValidFormat,
} from '../../_functions';

class TableInput extends Component{
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            parentId: '', //<--------parentId
            fieldName: '',
            fieldValue: '',
            fieldType: '',
            color: '#0070C0',
            isEditing: false,
            isSelected: false,
            // disabled: false
        }
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.callBack = this.callBack.bind(this);
        this.formatText = this.formatText.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

    }
    
    componentDidMount(){
        const { 
            collection,
            objectId,
            parentId,
            fieldName,
            fieldValue,
            fieldType,
        } = this.props;

        this.setState({
            collection: collection,
            objectId: objectId,
            parentId: parentId, //<--------parentId
            fieldName: fieldName,
            fieldValue: DateToString (fieldValue, fieldType, getDateFormat(myLocale)),
            fieldType: fieldType,
        });  
    }

    componentDidUpdate(prevProps, prevState) {
        const { 
            collection,
            objectId,
            parentId,
            fieldName,
            fieldValue,
            fieldType,
        } = this.props;

        if(fieldValue != prevProps.fieldValue) {

            this.setState({
                collection: collection,
                objectId: objectId,
                parentId: parentId, //<--------parentId
                fieldName: fieldName,
                fieldValue: DateToString (fieldValue, fieldType, getDateFormat(myLocale)),
                fieldType: fieldType,
                isEditing: false,
                isSelected: false,
                color: 'green',
            }, () => {
                setTimeout( () => {
                    this.setState({
                        ...this.state,
                        color: '#0070C0'
                    })
                }, 1000);
            });
        }
    }

    onKeyDown(event) {
        const { isEditing } = this.state;
        if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 9 || event.keyCode === 13){ //up //down //tab //enter
            this.onBlur(event);  
        } else if (!isEditing && (event.keyCode === 37 || event.keyCode === 39)) { //left //right
            this.onBlur(event);
        }
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            isEditing: true,
            [name]: value
        });
    }

    onClick() {
        const { disabled, unlocked } = this.props;
        const { isSelected, fieldValue, fieldType } = this.state;
        if(!isSelected) {
            this.setState({...this.state, isSelected: true}, () => setTimeout( () => this.refs.input.select(), 1));
        } else {
            this.setState({...this.state, isEditing: true }, () => setTimeout( () => this.refs.input.focus(), 1));
        }
    }

    onBlur(event) {
        event.preventDefault();
        
        this.setState({
            isEditing: false,
            isSelected: false,
        }, this.callBack)
    }

    callBack(){
        const { disabled, unlocked, refreshStore } = this.props;
        const { collection, objectId, parentId, fieldName, fieldValue, fieldType } = this.state;

        if ((!!unlocked || !disabled) && !!collection && (!!objectId || !!parentId) && !!fieldName) {

            if (!isValidFormat(fieldValue, fieldType, getDateFormat(myLocale)) || collection === 'virtual') {
                //goes red for one second and inherit
                this.setState({
                    ...this.state, 
                    isEditing: false,
                    isSelected: false,
                    color: _.isEqual(fieldValue, DateToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale))) ? '#0070C0' : 'red',
                    fieldValue: this.props.fieldValue ? DateToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)) : '',
                }, () => setTimeout( () => this.setState({ ...this.state, color: '#0070C0', }), 1000));

            } else if (_.isEqual(fieldValue, DateToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)))){
                //inherit
                this.setState({ ...this.state, isEditing: false, isSelected: false, color: '#0070C0' });

            } else {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: `{"${fieldName}":"${encodeURI(StringToType (fieldValue, fieldType, getDateFormat(myLocale)))}"}` //encodeURI
                };

                return fetch(`${config.apiUrl}/${collection}/update?id=${encodeURI(objectId)}&parentId=${encodeURI(parentId)}`, requestOptions)
                // .then(
                //     () => {
                //     this.setState({ ...this.state, isEditing: false, isSelected: false }, refreshStore)
                // })
                .then( responce => responce.text().then(text => {
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else if (responce.status === 400) {
                        this.setState({
                            ...this.state, 
                            isEditing: false,
                            isSelected: false,
                            color: _.isEqual(fieldValue, DateToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale))) ? '#0070C0' : 'red',
                            fieldValue: this.props.fieldValue ? DateToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)) : '',
                        }, () => setTimeout( () => this.setState({ ...this.state, color: '#0070C0', }), 1000));
                    } else {
                        this.setState({ ...this.state, isEditing: false, isSelected: false }, refreshStore)
                    }
                }))
                //goes red for one second and inherit
                .catch( () => {
                    this.setState({
                        ...this.state, 
                        isEditing: false,
                        isSelected: false,
                        color: 'red',
                        fieldValue: this.props.fieldValue ? DateToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)) : '',
                    }, () => setTimeout( () => this.setState({ ...this.state, color: '#0070C0' }), 1000))
                });
            }

        } else {
            //goes red for one second and inherit
            this.setState({
                ...this.state, 
                isEditing: false,
                isSelected: false,
                color: _.isEqual(fieldValue, DateToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale))) ? '#0070C0' : 'red',
                fieldValue: this.props.fieldValue ? DateToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)) : '',
            }, () => setTimeout( () => this.setState({...this.state, color: '#0070C0'}), 1000));
        
        }
    }

    formatText(fieldValue, fieldType){
        switch(fieldType){
            case "number":
                return fieldValue === '' ? '' : new Intl.NumberFormat().format(fieldValue);
            default: return fieldValue; //decodeURI
        }
    }

    render() {
        const {
            align,
            disabled,
            textNoWrap,
            unlocked,
            width,
            maxLength
        } = this.props;

        const {
            color,
            isEditing,
            isSelected,
            fieldValue,
            fieldType
        } = this.state;

        const tdClasses = classNames(
            'table-cell',
            {
                isEditing: isEditing,
                isSelected: isSelected
            }
        )

        return (
            <td
                onClick={() => this.onClick()}
                style={{
                    color: isSelected ? 'inherit' : disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : 'inherit' : color,
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'normal'}`,
                    padding: isSelected ? '0px': '5px',
                    cursor: isSelected ? 'auto' : 'pointer'
                }}
                className={tdClasses}
                align={align ? align : 'left'}
            >
                {isSelected ?
                    <input
                        ref='input'
                        className="form-control table-input"
                        type={fieldType === 'number' ? 'number' : 'text'}
                        name='fieldValue'
                        value={fieldValue}
                        onChange={this.onChange}
                        onBlur={event => this.onBlur(event)}
                        onKeyDown={event => this.onKeyDown(event)}
                        placeholder={fieldType === 'date' ? getDateFormat(myLocale) : ''}
                        maxLength={maxLength || 524288}
                    />
                :
                    <span>{this.formatText(fieldValue, fieldType)}</span>
                }

            </td>
        );
    }
}

export default TableInput;