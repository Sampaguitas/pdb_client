import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import propTypes from 'prop-types';
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

class TableSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            collection: '',
            objectId: '',
            fieldName: '',
            fieldValue: '',
            color: 'inherit',
            editing: false,
            options:[],
            optionText: '',
        }
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.selectedName = this.selectedName.bind(this);
    }
    componentDidMount(){
        this.setState({
            collection: this.props.collection,
            objectId: this.props.objectId,
            fieldName: this.props.fieldName,
            fieldValue: this.props.fieldValue ? this.props.fieldValue: '',
            options: this.props.options,
            optionText: this.props.optionText
        });
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

    onFocus() {
        this.setState({ editing: true }, () => {
            this.refs.input.focus();
        });
    }

    onBlur(event){
        event.preventDefault();
        this.setState({editing:false});
        const { collection, objectId, fieldName, fieldValue } = this.state      
        if (collection && objectId && fieldName && objectId) {
            const requestOptions = {
                method: 'PUT',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: `{"${fieldName}":"${fieldValue}"}`
            };
            return fetch(`${config.apiUrl}/${collection}/update?id=${objectId}`, requestOptions)
            .then( () => {
                this.setState({
                    ...this.state,
                    editing: false,
                    color: 'green',                    
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            ...this.state,
                            color: 'inherit',
                        });
                    }, 1000);                    
                });
            })
            .catch( () => {
                this.setState({
                    ...this.state,
                    editing: false,
                    color: 'red',
                    fieldValue: this.props.fieldValue ? this.props.fieldValue: '',
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            ...this.state,
                            color: 'inherit',
                        });
                    }, 1000);
                });                
            });
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
        const { fieldValue, color, options, optionText } = this.state

        return this.state.editing ? (
            <td className="text-nowrap" style={{padding:0}}>
                <select
                    ref='input'
                    className="form-control"
                    name='fieldValue'
                    value={fieldValue}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    // style={{
                    //     margin: 0,
                    //     borderRadius:0,
                    //     borderColor: 'white',
                    //     backgroundColor: 'inherit',
                    //     color: 'inherit',
                    //     WebkitBoxShadow: 'none',
                    //     boxShadow: 'none',  
                    // }}
                >
                        {options && arraySorted(options, optionText).map(option => {
                            return (
                                <option
                                    key={option._id}
                                    value={option._id}>{option[optionText]}
                                </option>
                            );
                        })}                    
                </select>
            </td>
        ):
        (
        <td onClick={() => this.onFocus()} style={{color: color}}>{ this.selectedName(options, fieldValue)}</td> //onDoubleClick
        );
    }
}

TableSelect.propTypes = {
    fieldName: propTypes.string.isRequired,
    fieldValue:propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
        propTypes.bool,
        propTypes.instanceOf(Date),
    ])
};

export default TableSelect;