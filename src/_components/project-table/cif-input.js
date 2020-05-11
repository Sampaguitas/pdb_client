import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';


const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const options = Intl.DateTimeFormat(locale, {'year': 'numeric', 'month': '2-digit', day: '2-digit'})
const myLocale = Intl.DateTimeFormat(locale, options);

function getLiteral(myLocale) {
    let firstLiteral = myLocale.formatToParts().find(function (element) {
      return element.type === 'literal';
    });
    if (firstLiteral) {
      return firstLiteral.value;
    } else {
      return '/';
    }
};

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

function TypeToString (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return String(moment(fieldValue).format(myDateFormat)); 
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function StringToType (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat).toDate();
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function isValidFormat (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(fieldValue, myDateFormat, true).isValid();
            default: return true;
        }
    } else {
        return true;
    }
    
}

class CifInput extends Component{
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            parentId: '', //<--------parentId
            fieldName: '',
            fieldValue: '',
            fieldType: '',
            fileName: '',
            inputKey: Date.now(),
            color: '#0070C0',
            isEditing: false,
            isSelected: false,
            isUploading: false,
            isDeleting: false,
            isDownloading: false
            // disabled: false
        }
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.callBack = this.callBack.bind(this);
        this.formatText = this.formatText.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleUploadCif = this.handleUploadCif.bind(this);
        this.handleDeleteCif = this.handleDeleteCif.bind(this);
        this.fileInput = React.createRef();
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
            fieldValue: TypeToString (fieldValue, fieldType, getDateFormat(myLocale)),
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
                fieldValue: TypeToString (fieldValue, fieldType, getDateFormat(myLocale)),
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

    handleUploadCif(event){
        event.preventDefault();
        const { objectId, refreshStore, setAlert } = this.props;
        if(!!this.fileInput.current.files[0] && !!objectId) {
            this.setState({
                isUploading: true
            }, () => {
                var data = new FormData()
                data.append('file', this.fileInput.current.files[0]);
                data.append('id', objectId);
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader()}, //, 'Content-Type': 'application/json'
                    body: data
                }
                return fetch(`${config.apiUrl}/certificate/upload`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            isUploading: false,
                            inputKey: Date.now()
                        }, () => {
                            setAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message),
                            refreshStore
                        });
                    }
                }));
            });
        }
    }

    handleDeleteCif(event){
        event.preventDefault();
        const { objectId, refreshStore, setAlert } = this.props;
        if(!!objectId) {
            this.setState({
                isDeleting: true
            }, () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { ...authHeader()},
                }
                return fetch(`${config.apiUrl}/certificate/deleteCif?id=${JSON.stringify(objectId)}`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            isDeleting: false,
                            // inputKey: Date.now()
                        }, () => {
                            setAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message),
                            refreshStore
                        });
                    }
                }));
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
                    color: _.isEqual(fieldValue, TypeToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale))) ? '#0070C0' : 'red',
                    fieldValue: this.props.fieldValue ? TypeToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)) : '',
                }, () => setTimeout( () => this.setState({ ...this.state, color: '#0070C0', }), 1000));

            } else if (_.isEqual(fieldValue, TypeToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)))){
                //inherit
                this.setState({ ...this.state, isEditing: false, isSelected: false, color: '#0070C0' });

            } else {

                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: `{"${fieldName}":"${encodeURI(StringToType (fieldValue, fieldType, getDateFormat(myLocale)))}"}` //encodeURI
                };

                return fetch(`${config.apiUrl}/${collection}/update?id=${encodeURI(objectId)}&parentId=${encodeURI(parentId)}`, requestOptions)
                .then( () => this.setState({ ...this.state, isEditing: false, isSelected: false }, refreshStore))
                //goes red for one second and inherit
                .catch( () => this.setState({
                        ...this.state, 
                        isEditing: false,
                        isSelected: false,
                        color: 'red',
                        fieldValue: this.props.fieldValue ? TypeToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)) : '',
                    }, () => setTimeout( () => this.setState({ ...this.state, color: '#0070C0' }), 1000))
                );
            }

        } else {
            //goes red for one second and inherit
            this.setState({
                ...this.state, 
                isEditing: false,
                isSelected: false,
                color: _.isEqual(fieldValue, TypeToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale))) ? '#0070C0' : 'red',
                fieldValue: this.props.fieldValue ? TypeToString (this.props.fieldValue, this.props.fieldType, getDateFormat(myLocale)) : '',
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
            maxLength,
            hasFile
        } = this.props;

        const {
            color,
            isEditing,
            isSelected,
            fieldValue,
            fieldType,
            inputKey,
            isUploading,
            isDownloading,
            isDeleting,
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
                // onClick={() => this.onClick()}
                style={{
                    color: isSelected ? 'inherit' : disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : 'inherit' : color,
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'normal'}`,
                    padding: isSelected ? '0px': '0px',
                    cursor: isSelected ? 'auto' : 'pointer'
                }}
                className={tdClasses}
                align={align ? align : 'left'}
            >    
                <div className="input-group">
                    {isSelected ?
                        <input
                            ref='input'
                            className="form-control table-input border-0"
                            type={fieldType === 'number' ? 'number' : 'text'}
                            name='fieldValue'
                            value={fieldValue}
                            onChange={this.onChange}
                            onBlur={event => this.onBlur(event)}
                            onKeyDown={event => this.onKeyDown(event)}
                            placeholder={fieldType === 'date' ? getDateFormat(myLocale) : ''}
                            maxLength={maxLength || 524288}
                            onClick={() => this.onClick()}
                        />
                    :
                        <label
                            type="text"
                            className="form-control text-left border-0"
                            style={{
                                display:'inline-block',
                                padding: '7px',
                                borderRadius: '0% !important',
                                color: isSelected ? 'inherit' : disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : 'inherit' : color
                            }}
                            onClick={() => this.onClick()}
                        >
                            
                            {this.formatText(fieldValue, fieldType)}
                        </label>
                    }
                    <div className="input-group-append">
                        <input
                            type="file"
                            name="fileInput"
                            id="fileInput"
                            ref={this.fileInput}
                            className="custom-file-input"
                            style={{opacity: 0, position: 'absolute', pointerEvents: 'none', width: '1px'}}
                            onChange={this.handleUploadCif}
                            key={inputKey}
                        />
                        <button type="button" title="Download File" className="btn btn-success btn-lg" disabled={hasFile ? false : true}><span><FontAwesomeIcon icon={isDownloading ? "spinner" : "download"} className={isDownloading ? "fa-pulse fa-fw" : "fa"}/></span></button>
                        <label type="button" className="btn btn-leeuwen-blue btn-lg" htmlFor="fileInput"><span><FontAwesomeIcon icon={isUploading ? "spinner" : "upload"} className={isUploading ? "fa-pulse fa-fw" : "fa"}/></span></label>
                        <button type="button" title="Delete File" className="btn btn-leeuwen btn-lg" disabled={hasFile ? false : true} onClick={this.handleDeleteCif}><span><FontAwesomeIcon icon={isDeleting ? "spinner" : "trash-alt"} className={isDeleting ? "fa-pulse fa-fw" : "fa"}/></span></button>
                    </div>
                </div>
            </td>
        );
    }
}

export default CifInput;