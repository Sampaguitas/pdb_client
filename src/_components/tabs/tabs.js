import React, { Component } from 'react';
import './tabs.css'
class Tabs extends Component {
    constructor(props) {
        // const { tabs } = this.props
        super(props);
        this.state = {
            tabs: this.props.tabs,
        };
        this.handleClick=this.handleClick.bind(this);
    }
    componentDidMount(){
        this.setState({
            ...this.state,
            tabs: this.props.tabs,
        })
    }
    handleClick(event, tab){
        event.preventDefault();
        const { tabs } = this.state; // 1. Get tabs from state
        tabs.forEach((t) => {t.active = false}); //2. Reset all tabs
        tab.isLoaded = true; // 3. set current tab as active
        tab.active = true;
        this.setState({
            tabs // 4. update state
        })
    }
    render() {
        const { tabs  } = this.state
        const { currencies, customers, opcos, project, users } = this.props
        return (
            <div id="tabs">
                <ul className="nav nav-tabs">
                    {tabs.map((tab)=>
                        <li className={tab.active ? 'nav-item active' : 'nav-item'} key={tab.index}>
                            <a className="nav-link" href={'#'+ tab.id} data-toggle="tab" onClick={(e)=>{this.handleClick(e,tab)}} id={tab.id + '-tab'} aria-controls={tab.id} role="tab">
                                {tab.label}
                            </a>
                        </li>
                    )}
                </ul>
                
                <div className="tab-content" id="nav-tabContent">
                    {tabs.map((tab)=>
                        <div
                            className={tab.active ? "tab-pane fade show active" : "tab-pane fade"}
                            id={tab.id}
                            role="tabpanel"
                            aria-labelledby={tab.id + '-tab'}
                            key={tab.index}
                        >
                            <tab.component
                                tab={tab}
                                project={project}
                                currencies={currencies}
                                customers={customers}
                                opcos={opcos}
                                users={users}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
export default Tabs;