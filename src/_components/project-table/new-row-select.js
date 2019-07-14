import React, { Component } from 'react';
import _ from 'lodash';

function resolve(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}


function arraySorted(array, field) {
    if (array) {
        const newArray = array
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

class NewRowSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        }
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.selectedName = this.selectedName.bind(this);
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

    selectedName(arr, search) {
        console.log('props:', this.props);
        const { optionText } = this.props;
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
        return this.state.editing ? (
            <td className="text-nowrap" style={{padding:0}}>
                <select
                    ref='input'
                    className="form-control"
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    onBlur={this.onBlur}
                    // style={{
                    //     margin: 0,
                    //     borderRadius:0,
                    //     borderColor: 'white',
                    //     backgroundColor: 'inherit',
                    //     color: color,
                    //     WebkitBoxShadow: 'none',
                    //     boxShadow: 'none',  
                    // }}
                >
                    <option>Select...</option>
                    {this.props.options && arraySorted(this.props.options, this.props.optionText).map(option => {
                        return (
                            <option
                                key={option._id}
                                value={option._id}>{option[this.props.optionText]}
                            </option>
                        );
                    })}                    
                </select>
            </td>
        )
        :
        (<td onClick={() => this.onFocus()} style={{color: this.props.color}}>{ this.selectedName(this.props.options, this.props.value)}</td>);
    }
}

export default NewRowSelect;