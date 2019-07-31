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
        this.getTblBound = this.getTblBound.bind(this);
        this.getScrollWidthY = this.getScrollWidthY.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
    }

    getTblBound() {
        const tblContainer = document.getElementById("tblFieldsContainer");
        if (!tblContainer) {
            return {};
        }
        const rect = tblContainer.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top + window.scrollY,
            width: rect.width || rect.right - rect.left,
            height: rect.height || rect.bottom - rect.top
        };
    }    

    getScrollWidthY() {
        var scroll = document.getElementById("tblFieldsBody");
        if (!scroll) {
            return 0;
        } else {
            if(scroll.clientHeight == scroll.scrollHeight){
                return 0;
            } else {
                return 15;
            }
        }
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

        const tblBound = this.getTblBound();
        const tblScrollWidth = this.getScrollWidthY();

        return ( 
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="row full-height">
                    <div className="table-responsive full-height" id="tblFieldsContainer"> {/* table-responsive */}
                        <table className="table table-striped table-bordered table-sm" > {/* table-hover */}
                            <thead>
                                <tr style={{display: tblBound.width ? 'block' : 'table-row', height: '62px'}}>
                                    <HeaderInput
                                        type="text"
                                        title="Field Name"
                                        name="name"
                                        value={name}
                                        onChange={this.handleChangeHeader}
                                        width ={tblBound.width ? `${tblBound.width*0.25+ 'px'}`: '25%'}
                                    />
                                    <HeaderInput
                                        type="text"
                                        title="From Table"
                                        name="fromTbl"
                                        value={fromTbl}
                                        onChange={this.handleChangeHeader}
                                        width ={tblBound.width ? `${tblBound.width*0.25+ 'px'}`: '25%'}
                                    />                                    
                                    <HeaderInput
                                        type="text"
                                        title="Type"
                                        name="type"
                                        value={type}
                                        onChange={this.handleChangeHeader}
                                        width ={tblBound.width ? `${tblBound.width*0.25+ 'px'}`: '25%'}
                                    />                                    
                                    <HeaderInput
                                        type="text"
                                        title="Custom Name"
                                        name="custom"
                                        value={custom}
                                        onChange={this.handleChangeHeader}
                                        width ={tblBound.width ? `${tblBound.width*0.25+ 'px'}`: '25%'}
                                    />                                      
                                </tr>
                            </thead>
                            {tblBound.width ?
                                <tbody style={{display:'block', height: `${tblBound.height-20-62 + 'px'}`, overflow:'auto'}}  id="tblFieldsBody">
                                    {selection && selection.project && this.filterName(selection.project.fields).map((s) =>
                                        <tr key={s._id}>
                                            <td style={{width: tblBound.width ? `${tblBound.width*0.25 + 'px'}`: '25%'}}>{s.name}</td>
                                            <td style={{width: tblBound.width ? `${tblBound.width*0.25 + 'px'}`: '25%'}}>{s.fromTbl}</td>
                                            <td style={{width: tblBound.width ? `${tblBound.width*0.25 + 'px'}`: '25%'}}>{s.type}</td>
                                            <TableInput 
                                                collection="field"
                                                objectId={s._id}
                                                fieldName="custom"
                                                fieldValue={s.custom}
                                                fieldType="text"
                                                width={tblBound.width ? `${tblBound.width*0.25-tblScrollWidth + 'px'}`: '25%'}
                                            />
                                        </tr>
                                    )}
                                </tbody>
                            :
                                <tbody />
                            }
                        </table>
                    </div>
                </div> 
            </div>
        );
    }
}

export default Fields;