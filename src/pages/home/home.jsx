//React
import React from 'react';
import { Link } from 'react-router-dom';
//Redux
import { connect } from 'react-redux';
import { currencyActions, customerActions, opcoActions, projectActions } from '../../_actions';
//Components
import Layout from '../../_components/layout';
import ProjectCard from '../../_components/project-card/project-card.js';
// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Styles
import './home.css';
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter:'',
            view:'Customer',
            opcos: this.props.opcos.items,
            customers: this.props.customers.items,
            loading: true
        };
        this.switchView = this.switchView.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterView = this.filterView.bind(this);

    }    
    
    componentDidMount() {
        this.props.dispatch(currencyActions.getAll());
        this.props.dispatch(customerActions.getAll());
        this.props.dispatch(opcoActions.getAll());
        this.props.dispatch(projectActions.getAll());
    }
    switchView() {
        if (this.state.view == 'Customer') {
            this.setState({ view: 'Opco'});
        }else {
            this.setState({ view: 'Customer' });
        } 
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
        this.filterView(value, this.state.view);
    }
    filterView(value, view){
        if (view == 'Customer'){
            if (!value) {
                this.setState({
                    customers: this.props.customers.items 
                });
            } else {
                value = value.replace(/\W/g, "");
                this.setState({
                    customers: this.props.customers.items.filter((customer) => !!customer.name.match(new RegExp(value, "i")))
                }); 
            }

        } else {
            if (!value) {
                this.setState({
                    opcos: this.props.opcos.items
                });
            } else {
                this.setState({
                    opcos: this.props.opcos.items.filter((opco) => !!opco.name.match(new RegExp(value, "i")))
                });
            }
        }
    }

    render() {
        const { filter } = this.state;
        const { alert, customers, opcos, projects } = this.props;
        return (
            <Layout>
                { alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div> }
                <div id="homeIndex" className="row">
                    <div className="col-md-12">
                        <div className="input-group input-group-lg mb-3">
                            <input className="form-control text-center" name="filter" value={filter} onChange={this.handleChange} placeholder={"Filter " + this.state.view + "'s..."} />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.switchView}>
                                    <span><FontAwesomeIcon icon="eye" className="fa-lg"/> Switch View</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {this.state.view == 'Customer' ?
                        this.state.customers ?
                            this.state.customers && this.state.customers.map((customer) => <ProjectCard property={customer} type="/customer" key={customer._id} />)
                            : customers.items && customers.items.map((customer) => <ProjectCard property={customer} type="/customer" key={customer._id} />)
                    :
                        this.state.opcos ?
                            this.state.opcos && this.state.opcos.map((opco) => <ProjectCard property={opco} type="/opco" key={opco._id} />)
                            : opcos.items && opcos.items.map((opco) => <ProjectCard property={opco} type="/opco" key={opco._id} />)
                    }
                </div >
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, customers, opcos, projects } = state;
    return {
        alert,
        currencies,
        customers,
        opcos,
        projects
    };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };
