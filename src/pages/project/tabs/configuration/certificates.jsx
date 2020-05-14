import React from 'react';
import config from 'config';
import { authHeader } from '../../../../_helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Certificates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cifName: '',
            updating: false
        }
        this.onChange = this.onChange.bind(this);
        this.handlePushField = this.handlePushField.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidMount() {
        const { selection } = this.props;
        if (selection.project && selection.project.hasOwnProperty('cifName')) {
            this.setState({
                cifName: selection.project.cifName || ''
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { selection } = this.props;
        if (selection != prevProps.selection && selection.project && selection.project.hasOwnProperty('cifName')) {
            this.setState({
                cifName: selection.project.cifName || ''
            });
        }
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
        const { cifName } = this.state;
            this.setState({cifName: cifName.concat(field)});
    }

    handleUpdate(event) {
        event.preventDefault();
        const { cifName } = this.state;
        const { selection, refreshProject, handleSetAlert } = this.props;
        if (selection.project) {
            this.setState({
                updating: true
            }, () => {
                const requestOptions = {
                    method: 'PUT',
                    headers: { ...authHeader(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({cifName: cifName})
                };
                return fetch(`${config.apiUrl}/project/updateCifName?id=${selection.project._id}`, requestOptions)
                .then(responce => responce.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (responce.status === 401) {
                            localStorage.removeItem('user');
                            location.reload(true);
                    } else {
                        this.setState({
                            updating: false
                        }, handleSetAlert(responce.status === 200 ? 'alert-success' : 'alert-danger', data.message, refreshProject));
                    }
                }));
            });
        }
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
            cifName,
            updating,
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
                                <label htmlFor="cifName">Designation Pattern</label>
                                <p>Click on the Tags below and add some text in between...</p>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="cifName"
                                    value={cifName}
                                    placeholder="Pattern"
                                    aria-describedby="cifNameHelp"
                                    onChange={event => this.onChange(event)}
                                    onKeyDown={event => this.onKeyDown(event)}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                />
                                <small
                                    id="cifNameHelp"
                                    className="form-text text-muted"
                                >
                                    Only alphanumeric characters, spaces, underscores and minus symbols are allowed.
                                </small>
                            </div>
                            <p className="heading">Available Pattern Tags are:</p>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[clPo]')}>clPo</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[clPoRev]')}>clPoRev</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[clPoItem]')}>clPoItem</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[clCode]')}>clCode</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[vlSo]')}>vlSo</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[vlSoItem]')}>vlSoItem</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[nfi]')}>nfi</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[cif]')}>cif</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[heatNr]')}>heatNr</span>
                            <span className="badge badge-secondary" onClick={event => this.handlePushField(event, '[inspQty]')}>inspQty</span>
                            <div className="text-right">
                                <button className="btn btn-leeuwen-blue btn-lg mr-2" onClick={(event) => this.handleUpdate(event)}>
                                        <span><FontAwesomeIcon icon={updating ? "spinner" : "edit"} className={updating ? "fa-pulse fa-fw fa-lg mr-2" : "fa-lg mr-2"}/>Update</span>
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