import React, { Component } from 'react';

class NewRowInput extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        }
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onFocus() {
        this.setState({
            editing: true
        }, () => {
            this.refs.input.focus();
        });
    }

    onBlur(event){
        event.preventDefault();
        this.setState({
            editing:false
        });
    }

    render() {
        const {
            color,
            disabled,
            type,
            name, 
            onChange,
            textNoWrap,
            value, 
            width
        } = this.props;

        const { editing } = this.state;

        return editing ? (
            <td 
                style={{
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`,
                    padding: '0px' 
                }}
            >
                <input
                    ref='input'
                    className="form-control"
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={this.onBlur}
                    disabled={disabled}
                    // style={{
                    //     margin: 0,
                    //     borderRadius:0,
                    //     borderColor: 'white',
                    //     backgroundColor: 'inherit',
                    //     color: this.props.color ? this.props.color : 'inherit',
                    //     WebkitBoxShadow: 'none',
                    //     boxShadow: 'none',  
                    // }}
                />
            </td>
        )
        :
        (
            <td
                onClick={() => this.onFocus()}
                style={{
                    color: disabled ? 'inherit' : color,
                    width: `${width ? width : 'auto'}`,
                    whiteSpace: `${textNoWrap ? 'nowrap' : 'auto'}`
                }}
            >
                {value}
            </td>
        );
    }
}

export default NewRowInput;