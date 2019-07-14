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
        this.setState({ editing: true }, () => {
            this.refs.input.focus();
        });
    }

    onBlur(event){
        event.preventDefault();
        this.setState({editing:false});
    }

    render() {
        return this.state.editing ? (
            <td className="text-nowrap" style={{padding:0}}>
                <input
                    ref='input'
                    className="form-control"
                    type={this.props.type}
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    onBlur={this.onBlur}
                    style={{
                        margin: 0,
                        borderRadius:0,
                        borderColor: 'white',
                        backgroundColor: 'inherit',
                        color: this.props.color ? this.props.color : 'inherit',
                        WebkitBoxShadow: 'none',
                        boxShadow: 'none',  
                    }}
                />
            </td>
        )
        :
        (<td onClick={() => this.onFocus()} style={{color: this.props.color}}>{this.props.value}</td>);
    }
}

export default NewRowInput;