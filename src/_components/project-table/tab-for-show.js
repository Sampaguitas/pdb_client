import React, {Component} from 'react';
import InputSetting from '../input-setting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


//callback;
//fieldValue
//title

function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
    }
}


function callback() {

}

function generateLayout(settingsForShow, callback) {
    let tempArray = [];
    
    if (!!settingsForShow) {
        settingsForShow.map(function (element){
            tempArray.push(
                <InputSetting 
                    type={getInputType(element.type)}
                    title={element.custom}
                    name={element._id}
                    value={element.value}
                    onchange={callback}
                />
            );
        });
    }
    
    return (
        <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '300px', overflowY: 'auto'}}>
            <div className="row ml-2 mr-2 mt-4">
                {tempArray}
            </div>
        </div>
    );
}

class TabForShow extends Component{
    render() {
        const { settingsForShow } = this.props;
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button className="btn btn btn-link mr-2" style={{fontSize: '12.5px'}}>Clear All</button>
                </div>
                {generateLayout(settingsForShow, callback)}
            </div>

        );
    }
}

export default TabForShow;