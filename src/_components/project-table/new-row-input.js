import React, { Component } from 'react';
import classNames from 'classnames';


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

function StirngToCache(fieldValue, myDateFormat) {
    if (!!fieldValue) {
        let separator = getLiteral(myLocale);
        let cache = myDateFormat.replace('DD','00').replace('MM', '00').replace('YYYY', (new Date()).getFullYear()).split(separator);
        let valueArray = fieldValue.split(separator);
        return cache.reduce(function(acc, cur, idx) {
            if (valueArray.length > idx) {
              let curChars = cur.split("");
                let valueChars = valueArray[idx].split("");
              let tempArray = curChars.reduce(function(accChar, curChar, idxChar) {
                  if (valueChars.length >= (curChars.length - idxChar)) {
                    accChar += valueChars[valueChars.length - curChars.length + idxChar];
                  } else {
                    accChar += curChar;
                  }
                return accChar;
              }, '')
              acc.push(tempArray);
            } else {
              acc.push(cur);
            }
            return acc;
          }, []).join(separator);
    } else {
        return fieldValue;
    } 
}

function StringToType (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(StirngToCache(fieldValue, myDateFormat), myDateFormat).toDate();
            default: return fieldValue;
        }
    } else {
        return '';
    }
}

function isValidFormat (fieldValue, fieldType, myDateFormat) {
    if (fieldValue) {
        switch (fieldType) {
            case 'date': return moment(StirngToCache(fieldValue, myDateFormat), myDateFormat, true).isValid();
            default: return true;
        }
    } else {
        return true;
    }
    
}

class NewRowInput extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            isSelected: false,
        }
        // this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.formatText = this.formatText.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onKeyDown(event) {
        const { isEditing } = this.state;
        if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 9 || event.keyCode === 13){ //up //down //tab //enter
            this.onBlur(event);  
        } else if (!isEditing && (event.keyCode === 37 || event.keyCode === 39)) { //left //right
            this.onBlur(event);
        }
    }

    onClick() {
        const { isSelected } = this.state;
        if(!isSelected) {
            this.setState({isSelected: true}, () => {
                setTimeout(() => {
                this.refs.input.select();
                }, 1);
            });
        } else {
            this.setState({isEditing: true }, () => {
                setTimeout(() => {
                this.refs.input.focus();
                }, 1);
            });
        }
    }

    // onFocus() {
    //     this.setState({
    //         isEditing: true
    //     }, () => {
    //         this.refs.input.focus();
    //     });
    // }

    onBlur(event){
        event.preventDefault();
        this.setState({
            isEditing: false,
            isSelected: false,
        });
    }

    formatText(fieldValue, fieldType){
        switch(fieldType){
            case "number":
                return fieldValue === '' ? '' : new Intl.NumberFormat().format(fieldValue);
            //     break;
            // case "date":
            //     return fieldValue ? new Intl.DateTimeFormat().format(new Date(fieldValue)) : '';
            //     break;
            default: return fieldValue; //decodeURI
        }
    }
    

    render() {
        const {
            align,
            color,
            disabled,
            fieldType,
            fieldName, 
            onChange,
            textNoWrap,
            fieldValue, 
            width,
            maxLength
        } = this.props;

        const { isEditing, isSelected } = this.state;

        const tdClasses = classNames(
            'table-cell',
            {
                isEditing: isEditing,
                isSelected: isSelected
            }
        )

        return (
        // isEditing ? (
            <td 
                onClick={() => this.onClick()}
                style={{
                    // color: isSelected ? 'inherit' : disabled ? unlocked ? color!='#0070C0' ? color : '#A8052C' : 'inherit' : color, /////
                    color: isSelected ? 'inherit' : color,
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    // padding: '0px' 
                    padding: isSelected ? '0px': '5px', /////
                    cursor: isSelected ? 'auto' : 'pointer' //////
                }}
                className={tdClasses}
                align={align ? align : 'left'}
            >
                {isSelected ?
                    <input
                        ref='input'
                        className="form-control"
                        type={fieldType}
                        name={fieldName}
                        value={fieldValue}
                        onChange={onChange}
                        onBlur={this.onBlur}
                        // disabled={disabled}
                        onKeyDown={event => this.onKeyDown(event)}
                        placeholder={fieldType === 'date' ? getDateFormat(myLocale) : ''}
                        maxLength={maxLength || 524288}
                    />
                :
                    <span>{this.formatText(fieldValue, fieldType)}</span>
                }
            </td>
        // )
        // :
        // (
        //     <td
        //         onClick={() => this.onFocus()}
        //         style={{
        //             color: disabled ? 'inherit' : color,
        //             width: `${width ? width : 'auto'}`,
        //             whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`
        //         }}
        //     >
        //         {value}
        //     </td>
        // );
        );
    }
}

export default NewRowInput;