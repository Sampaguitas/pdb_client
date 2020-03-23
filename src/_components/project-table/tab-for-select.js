import React, {Component} from 'react';
import CheckSetting from '../check-setting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function callback() {

}

function generateLayout(settingsForSelect, callback) {
    let tempArray = [];
    
    if (!!settingsForSelect) {
        settingsForSelect.map(function (element){
            tempArray.push(
                <CheckSetting
                    id={element._id}
                    title={element.custom}
                    isChecked={element.isChecked}
                    callback={callback}
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

class TabForSelect extends Component{
    render() {
        const { settingsForSelect } = this.props;
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button className="btn btn btn-link mr-2" style={{fontSize: '12.5px'}}>Select All</button><span className="vertical-devider">/</span>{ /* onClick={event => this.toggleSplitLine(event)} */}
                    <button className="btn btn btn-link mr-2" style={{fontSize: '12.5px'}}>Deselect All</button> { /* onClick={event => this.toggleSplitLine(event)} */}
                </div>
                {generateLayout(settingsForSelect, callback)}
            </div>

        );
    }
}

export default TabForSelect;