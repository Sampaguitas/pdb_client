import React from 'react';
import { connect } from 'react-redux';
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
    } else if (!array) {
        return true;
    } else {
        switch(type) {
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number': 
                return array == Number(search);
            case 'Boolean':
                if (Number(search) == 1) {
                return true; //any
                } else if (Number(search) == 2) {
                return !!array == 1; //true
                } else if (Number(search) == 3) {
                return !!array == 0; //false
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
                <div className="row full-height">
                    <div className="table-responsive full-height">
                        <table className="table table-hover table-bordered" >
                            <thead>
                                <tr>
                                    <th className="text-nowrap">Field Name<br/>
                                        <input className="form-control" name="name" value={name} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th className="text-nowrap">From Table<br/>
                                        <input className="form-control" name="fromTbl" value={fromTbl} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th className="text-nowrap">Type<br/>
                                        <input className="form-control" name="type" value={type} onChange={this.handleChangeHeader} />
                                    </th>
                                    <th className="text-nowrap">Custom Name<br/>
                                        <input className="form-control" name="custom" value={custom} onChange={this.handleChangeHeader} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="full-height" style={{overflowY:'auto'}}>
                                {selection && selection.project && this.filterName(selection.project.fields).map((s) =>
                                    <tr key={s._id}>
                                        <td className="text-nowrap">{s.name}</td>
                                        <td className="text-nowrap">{s.fromTbl}</td>
                                        <td className="text-nowrap">{s.type}</td>
                                        <TableInput 
                                            collection="field"
                                            objectId={s._id}
                                            fieldName="custom"
                                            fieldValue={s.custom}
                                            fieldType="text"
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