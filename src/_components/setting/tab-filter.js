import React, {Component} from 'react';
import SettingInput from './setting-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function getInputType(dbFieldType) {
    switch(dbFieldType) {
        case 'Number': return 'number';
        case 'Date': return 'date';
        default: return 'text'
    }
}


function generateLayout(settingsFilter, handleInputSettings, handleIsEqualSettings) {
    let tempArray = [];
    
    if (!!settingsFilter) {
        settingsFilter.map(function (element, index){
            tempArray.push(
                <SettingInput
                    key={index}
                    id={element._id}
                    name={element.name}
                    title={element.custom}
                    value={element.value}
                    type={element.type} //{getInputType(element.type)}
                    isEqual={element.isEqual}
                    handleInputSettings={handleInputSettings}
                    handleIsEqualSettings={handleIsEqualSettings}
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

class TabFilter extends Component{
    constructor(props) {
        super(props);
        this.handleClear = this.handleClear.bind(this);
    }

    handleClear(event) {
        event.preventDefault();
        const { handleClearInputSettings } = this.props;
        handleClearInputSettings();
    }

    render() {
        const { settingsFilter, handleInputSettings, handleIsEqualSettings } = this.props;
        return (
            <div>
                <div className="row modal-btn-links mb-3">
                    <button
                        className="btn btn btn-link mr-2"
                        style={{fontSize: '12.5px'}}
                        onClick={event => this.handleClear(event)}
                    >
                        Clear All
                    </button>
                </div>
                {generateLayout(settingsFilter, handleInputSettings, handleIsEqualSettings)}
            </div>

        );
    }
}

export default TabFilter;