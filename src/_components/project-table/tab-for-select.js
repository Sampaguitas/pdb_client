import React, {Component} from 'react';
import CheckSetting from '../check-setting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function callback() {

}

function generateLayout(settingsCheck, callback) {
    let tempArray = [];
    settingsCheck.map(function (check){
        tempArray.push(
            <CheckSetting
                id={check._id}
                title={check.custom}
                // fieldValue={true}
                callback={callback}
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

class TabForSelect extends Component{
    render() {
        let settingsCheck = [
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', isChecked: true },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', isChecked: true },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', isChecked: true },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', isChecked: true },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', isChecked: true },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', isChecked: true },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', isChecked: true },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', isChecked: true },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', isChecked: true },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', isChecked: true },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', isChecked: true },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', isChecked: true },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', isChecked: true },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', isChecked: true },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', isChecked: true },
            { _id: '5e285fff70466e00163afd56', custom: 'Material code', isChecked: true },
            { _id: '5e28600270466e00163afe56', custom: 'Exp Ready/Del date', isChecked: true },
            { _id: '5e28600270466e00163afe59', custom: 'RFS Date', isChecked: true },
        ];
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button className="btn btn btn-link mr-2" style={{fontSize: '12.5px'}}>Select All</button><span className="vertical-devider">/</span>{ /* onClick={event => this.toggleSplitLine(event)} */}
                    <button className="btn btn btn-link mr-2" style={{fontSize: '12.5px'}}>Deselect All</button> { /* onClick={event => this.toggleSplitLine(event)} */}
                </div>
                {generateLayout(settingsCheck, callback)}
            </div>

        );
    }
}

export default TabForSelect;