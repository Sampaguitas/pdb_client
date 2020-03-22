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

function generateLayout(settingsInput, callback) {
    let tempArray = [];
    settingsInput.map(function (input){
        tempArray.push(
            <InputSetting 
                type={getInputType(input.type)}
                title={input.custom}
                name={input._id}
                value={input.value}
                onchange={callback}
            />
        );
    });

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
        // const { settingsCheck } = this.props;
        let settingsInput = [
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', value: '', type: 'String' },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', value: '', type: 'Date' },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', value: '', type: 'Date' },
        ];
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button className="btn btn btn-link mr-2" style={{fontSize: '12.5px'}}>Clear All</button>
                </div>
                {generateLayout(settingsInput, callback)}
            </div>

        );
    }
}

export default TabForShow;