import React, {Component} from 'react';
import { SettingCheck } from './setting-check';

function generateLayout(settingsDisplay, handleCheckSettings) {
    let tempArray = [];
    if (!!settingsDisplay) {
        settingsDisplay.map(function (element, index){
            tempArray.push(
                <SettingCheck
                    key={index}
                    id={element._id}
                    title={element.custom}
                    isChecked={element.isChecked}
                    handleCheckSettings={handleCheckSettings}
                />
            );
        });
    }
    return (
        <div style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd', height: '400px', overflowY: 'auto'}}>
            <div className="row ml-2 mr-2 mt-4">
                {tempArray}
            </div>
        </div>
    );
}

export class TabDisplay extends Component{
    constructor(props) {
        super(props);
        this.handleCheckAll = this.handleCheckAll.bind(this);
    }

    handleCheckAll(event, bool) {
        event.preventDefault();
        const { handleCheckSettingsAll } = this.props;
        handleCheckSettingsAll(bool);
    }

    render() {
        const { settingsDisplay, handleCheckSettings,  } = this.props;
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button
                        className="btn btn btn-link mr-2"
                        style={{fontSize: '12.5px'}}
                        onClick={event => this.handleCheckAll(event, true)}
                    >
                        Select All
                    </button>
                    <span className="vertical-devider">/</span>
                    <button className="btn btn btn-link mr-2"
                        style={{fontSize: '12.5px'}}
                        onClick={event => this.handleCheckAll(event, false)}
                    >
                        Deselect All
                    </button>
                </div>
                {generateLayout(settingsDisplay, handleCheckSettings)}
            </div>

        );
    }
}

// export default TabDisplay;