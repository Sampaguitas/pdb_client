import React, { Component } from 'react';
import config from 'config';
import { authHeader } from '../../_helpers';
import propTypes from 'prop-types';
import _ from 'lodash';

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

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
        this.updatefield = this.updatefield.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
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
        const { collection, objectId, fieldName, fieldValue } = this.state      
        if (collection && objectId && fieldName) {
            this.updatefield(this.state)
            .then(
                field => {
                    this.setState({color:'green'}, () => {
                        setTimeout(() => {
                            this.setState({color: 'inherit'}),
                            this.setState({editing:false});
                        }, 1000);
                    });
                },
                error => {
                    this.setState({color:'red'}, () => {
                        setTimeout(() => {
                            this.setState({color: 'inherit'}),
                            this.setState({editing:false});
                        }, 1000);
                    });
                }
            );
        }
    }

    updatefield(args) {
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: `{"${args.fieldName}":"${args.fieldValue}"}`
        };
    
        return fetch(`${config.apiUrl}/${args.collection}/update?id=${args.objectId}`, requestOptions).then(this.handleResponse);
    }
    
    handleResponse(response) {
        return response.text().then(text => {
            if (text == 'Unauthorized') {
                logout();
                location.reload(true);
            }
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if (response.status === 401) {
                    // auto logout if 401 response returned from api
                    logout();
                    location.reload(true);
                }
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data;
        });
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
                    //     color: color,
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
        <td onClick={() => this.onFocus()}>{ this.selectedName(options, fieldValue)}</td> //onDoubleClick
        //options.find(( option) => _.isEqual(option._id,fieldValue))?options.find(( option) => _.isEqual(option._id,fieldValue)).name : "not selected"
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