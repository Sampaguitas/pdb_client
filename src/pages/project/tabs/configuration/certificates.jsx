import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Certificates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dpattern: '',
            dpatternDeleting: false,
            dpatternUpdating: false

        }
        this.onChange = this.onChange.bind(this);
        this.handlePushField = this.handlePushField.bind(this);
        this.handleDeleteDpattern = this.handleDeleteDpattern.bind(this);
        this.handleUpdateDpattern = this.handleUpdateDpattern.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    handlePushField(event, field) {
        event.preventDefault();
        const { dpattern } = this.state;
        // if (!dpattern) {
        //     this.setState({dpattern: field});
        // } else {
            this.setState({dpattern: dpattern.concat(field)});
        // }
    }

    handleDeleteDpattern(event) {
        event.preventDefault();
        this.setState({dpatternDeleting: true});
        setTimeout(() => {
            this.setState({
                dpattern: '', 
                dpatternDeleting: false
            })
        }, 1000);
    }

    handleUpdateDpattern(event) {
        event.preventDefault();
        console.log('toto');
        this.setState({dpatternUpdating: true});
        setTimeout(() => {
            this.setState({
                dpatternUpdating: false
            })
        }, 1000);
    }

    onKeyDown(event) {
        let patt = new RegExp(/[\w\s\_\-\[\]]/);
        if (!patt.test(event.key)) {
            event.preventDefault();
        }
    }

    render() {
        const {
            tab,
        } = this.props;

        const {
            dpattern,
            dpatternDeleting,
            dpatternUpdating,
        } = this.state;

        return ( 
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
                <div className="col-12 p-2">
                    <div className="card">
                        <div className="card-header">
                            <h5>Custom File Name</h5>
                        </div>
                        <div className="card-body">
                            
                            <div className="form-group">
                                <label htmlFor="dpattern">Designation Pattern</label>
                                <p>Click on the Tags below and add some text in between...</p>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="dpattern"
                                    value={dpattern}
                                    placeholder="Pattern"
                                    aria-describedby="dpatternHelp"
                                    onChange={event => this.onChange(event)}
                                    onKeyDown={event => this.onKeyDown(event)}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                />
                                <small
                                    id="dpatternHelp"
                                    className="form-text text-muted"
                                >
                                    Only alphanumeric characters, spaces, underscores and minus symbols are allowed.
                                </small>
                            </div>
                            <p className="heading">Available Pattern Tags are:</p>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[clPo]')}>clPo</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[clPoItem]')}>clPoItem</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[clPoRev]')}>clPoRev</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[vlPo]')}>vlPo</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[vlPoItem]')}>vlPoItem</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[vlPoX]')}>vlPoX</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[vlPoItemX]')}>vlPoItemX</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[nfi]')}>nfi</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[cif]')}>cif</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[heatNr]')}>heatNr</span>
                            <div className="text-right">
                                <button
                                    className="btn btn-leeuwen btn-lg"
                                    onClick={(event) => this.handleDeleteDpattern(event)} 
                                    style={{ marginRight: 10 }}
                                >
                                    {dpatternDeleting ?
                                        <span><FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw"/> </span> 
                                    :
                                        <span><FontAwesomeIcon icon="trash-alt" className="fa-lg"/> </span> 
                                    }
                                    Delete
                                </button>
                                <button
                                    className="btn btn-leeuwen-blue btn-lg"
                                    onClick={(event) => this.handleUpdateDpattern(event)}
                                >
                                    {dpatternUpdating ?
                                        <span><FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw"/> </span>
                                    :
                                        <span><FontAwesomeIcon icon="edit" className="fa-lg"/> </span>
                                    }
                                    Update
                                </button>
                            </div>   
                        </div>
                    </div>
                </div> 
            </div>
        );
    }
}

export default Certificates;