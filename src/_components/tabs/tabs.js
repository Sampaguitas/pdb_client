import React, { Component } from 'react';
import './tabs.css'

class Tabs extends Component {
    constructor(props) {
        super(props);
        const { tabs } = this.props
        this.state = {
            tabs: tabs
        };
        this.handleClick=this.handleClick.bind(this);
    }
    componentDidMount(){
        const { tabs } = this.props
        this.setState({
            ...this.state,
            tabs: tabs
        })
    }
    handleClick(event, tab){
        event.preventDefault();
        // const { handleSelectionReload } = this.props
        const { tabs } = this.state; // 1. Get tabs from state
        tabs.forEach((t) => {t.active = false}); //2. Reset all tabs
        tab.isLoaded = true; // 3. set current tab as active
        tab.active = true;
        this.setState({
            tabs // 4. update state
        })
        // handleSelectionReload(event); //reload selection state

    }
    render() {
        const { tabs  } = this.state
        
        const {
            //Functions
            // handleSelectionReload,
            handleSubmitProject,
            handleDeleteProject,
            handleSubmitSupplier,
            handleDeleteSupplier,
            //refreshStore
            refreshProject,
            refreshDocdefs,
            refreshDocfields,
            refreshFieldnames,
            refreshFields,
            refreshSuppliers,
            //Props
            accesses,
            currencies,
            docdefs,
            docfields,
            erps,
            fieldnames,
            fields,
            opcos,
            screens,
            selection,
            suppliers,
            users,
            //State
            projectId,
            submittedProject,
            projectUpdating,
            projectDeleting,

            submittedSupplier,
            supplierUpdating,
            supplierDeleting
        } = this.props

        return (
            <div id="tabs" style={{height: '95%'}}>
                <ul className="nav nav-tabs">
                    {tabs.map((tab)=>
                        <li className={tab.active ? 'nav-item active' : 'nav-item'} key={tab.index}>
                            <a className="nav-link" href={'#'+ tab.id} data-toggle="tab" onClick={(e)=>{this.handleClick(e,tab)}} id={tab.id + '-tab'} aria-controls={tab.id} role="tab">
                                {tab.label}
                            </a>
                        </li>
                    )}
                </ul>
                
                <div className="tab-content full-height" id="nav-tabContent">
                    {tabs.map((tab)=>
                        <div
                            className={tab.active ? "tab-pane fade show active full-height" : "tab-pane fade full-height"}
                            id={tab.id}
                            role="tabpanel"
                            aria-labelledby={tab.id + '-tab'}
                            key={tab.index}
                        >
                            <tab.component
                                tab={tab}
                                //Functions
                                // handleSelectionReload={handleSelectionReload}
                                handleSubmitProject={handleSubmitProject}
                                handleDeleteProject={handleDeleteProject}
                                handleSubmitSupplier={handleSubmitSupplier}
                                handleDeleteSupplier={handleDeleteSupplier}
                                //refreshStore
                                refreshProject={refreshProject}
                                refreshDocdefs={refreshDocdefs}
                                refreshDocfields={refreshDocfields}
                                refreshFieldnames={refreshFieldnames}
                                refreshFields={refreshFields}
                                refreshSuppliers={refreshSuppliers}
                                //Props
                                accesses={accesses}
                                currencies={currencies}
                                docdefs={docdefs}
                                docfields={docfields}
                                erps={erps}
                                fieldnames={fieldnames}
                                fields={fields}
                                opcos={opcos}
                                screens={screens}
                                selection={selection}
                                suppliers={suppliers}
                                users={users}
                                //State
                                projectId={projectId}
                                submittedProject={submittedProject}
                                projectUpdating={projectUpdating}
                                projectDeleting={projectDeleting}

                                submittedSupplier={submittedSupplier}
                                supplierUpdating={supplierUpdating}
                                supplierDeleting={supplierDeleting}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
export default Tabs;