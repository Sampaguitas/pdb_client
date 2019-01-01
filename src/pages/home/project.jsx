import React from 'react';
import { connect } from 'react-redux';
//Components
import CheckBox from '../../_components/check-box';
import Input from '../../_components/input';
import Layout from '../../_components/layout';


class Project extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {
                name: '', //ok
                customer: '', //ok
                opco: '', //ok
                currency:'',

            },
            projectInspection: true,
            projectShipping: true,
            projectWarehouse: true,
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleCheck(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }
    handleChange(event) {
        const { name, value } = event.target;
        const { project } = this.state;
        this.setState({
            project: {
                ...project,
                [name]: value
            }
        });
    }
    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { project } = this.state;
        const { dispatch } = this.props;
        if (
            project.name &&
            project.customer &&
            project.opco &&
            project.currency
        ) {
            dispatch(projectActions.create(project));
        }
    }
    handleDeletProject(id) {
        return (event) => this.props.dispatch(projectActions.delete(id));
    }
    render() {
        const { alert, loading } = this.props;
        const { project, projectInspection, projectShipping, projectWarehouse, submitted } = this.state;
        return (
            <Layout alert={alert}>
                <h2>Add or Edit Project:</h2>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <Input
                        title="Name"
                        name="projectName"
                        type="text"
                        value={project.name}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Customer"
                        name="projectCustomer"
                        type="text"
                        value={project.customer}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Operating Company"
                        name="projectOpco"
                        type="text"
                        value={project.opco}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <Input
                        title="Currency"
                        name="projectCurrency"
                        type="text"
                        value={project.currency}
                        onChange={this.handleChange}
                        submitted={submitted}
                        inline={true}
                        required={true}
                    />
                    <div className="col-sm-10 offset-md-2">
                        <CheckBox
                            title="Enable Inspection Module"
                            id="projectInspection"
                            name="projectInspection"
                            checked={projectInspection}
                            onChange={this.handleCheck}
                        />
                        <CheckBox
                            title="Enable Shipping Module"
                            id="projectShipping"
                            name="projectShipping"
                            checked={projectShipping}
                            onChange={this.handleCheck}
                        />
                        <CheckBox
                            title="Enable Warehouse Module"
                            id="projectWarehouse"
                            name="projectWarehouse"
                            checked={projectWarehouse}
                            onChange={this.handleCheck}
                        />
                    </div>
                </form>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    const { loading } = state.projects;
    return {
        alert,
        loading
    };
}

const connectedProject = connect(mapStateToProps)(Project);
export { connectedProject as Project };