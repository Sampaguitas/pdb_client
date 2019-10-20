import React from 'react';
import { connect } from 'react-redux';
import HeaderCheckBox from '../../../../_components/project-table/header-check-box';
import HeaderInput from '../../../../_components/project-table/header-input';
import TableInput from '../../../../_components/project-table/table-input'

//https://stackoverflow.com/questions/4244896/dynamically-access-object-property-using-variable
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

function doesMatch(search, array, type) {
    if (!search) {
        return true;
    } else if (!array && search != 'any' && search != 'false') {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, array);
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number':
                search = String(search).replace(/([()[{*+.$^\\|?])/g, "");
                return !!String(array).match(new RegExp(search, "i"));
                //return array == Number(search);
            case 'Boolean':
                if(search == 'any') {
                    return true; //any or equal
                } else if (search == 'true' && !!array) {
                    return true; //true
                } else if (search == 'false' && !array) {
                    return true; //true
                } else {
                    return false;
                }                
            case 'Select':
                if(search == 'any' || _.isEqual(search, array)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

class Fields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            custom: '',
            fromTbl: '',
            type: '',
            loaded: false,
            show: false,
        }
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    filterName(array){
        
        const { 
            name,
            custom,
            fromTbl,
            type,
        } = this.state;

        if (array) {
          return arraySorted(array, 'fromTbl.name').filter(function (element) {
            return (doesMatch(name, element.name, 'String')
            && doesMatch(custom, element.custom, 'String')
            && doesMatch(fromTbl, element.fromTbl, 'String') 
            && doesMatch(type, element.type, 'String'));
          });
        } else {
            return [];
        }
    }

    render() {

        const {
            selection, 
            tab,
        } = this.props;

        const {
            name,
            custom,
            fromTbl,
            type
        } = this.state;

        return ( 
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                    <div className="table-responsive custom-table-container">
                        <table className="table table-hover table-bordered table-sm" >
                            <thead>
                                <tr>
                                    <HeaderInput
                                        type="text"
                                        title="Field Name"
                                        name="name"
                                        value={name}
                                        onChange={this.handleChangeHeader}
                                        // width ="25%"
                                    />
                                    <HeaderInput
                                        type="text"
                                        title="From Table"
                                        name="fromTbl"
                                        value={fromTbl}
                                        onChange={this.handleChangeHeader}
                                        // width ="25%"
                                    />                                    
                                    <HeaderInput
                                        type="text"
                                        title="Type"
                                        name="type"
                                        value={type}
                                        onChange={this.handleChangeHeader}
                                        // width ="25%"
                                    />                                    
                                    <HeaderInput
                                        type="text"
                                        title="Custom Name"
                                        name="custom"
                                        value={custom}
                                        onChange={this.handleChangeHeader}
                                        // width ="25%"
                                    />                                      
                                </tr>
                            </thead>
                            <tbody className="full-height">
                                {selection && selection.project && this.filterName(selection.project.fields).map((s) =>
                                    <tr key={s._id}>
                                        <td>{s.name}</td>
                                        <td>{s.fromTbl}</td>
                                        <td>{s.type}</td>
                                        <TableInput 
                                            collection="field"
                                            objectId={s._id}
                                            fieldName="custom"
                                            fieldValue={s.custom}
                                            fieldType="text"
                                            // width="25%"
                                        />
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
        );
    }
}

export default Fields;