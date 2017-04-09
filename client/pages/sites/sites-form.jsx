'use strict';
const Actions = require('./actions');
const Alert = require('../../components/alert.jsx');
const Button = require('../../components/form/button.jsx');
const ControlGroup = require('../../components/form/control-group.jsx');
const SelectControl = require('../../components/form/select-control.jsx');
const LinkState = require('../../helpers/link-state');
const React = require('react');
const Spinner = require('../../components/form/spinner.jsx');
const TextControl = require('../../components/form/text-control.jsx');
const TextAreaControl = require('../../components/form/textarea-control.jsx');
const Slug = require('slug');
const Navigatable = require('react-router-component').NavigatableMixin

const propTypes = {
    hydrated: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    showSaveSuccess: React.PropTypes.bool,
    error: React.PropTypes.string,
    proc: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object,
    slug: React.PropTypes.string,
    name: React.PropTypes.string,
    slugSuccess: React.PropTypes.bool,
    description: React.PropTypes.string
};

class SitesForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            name: props.name,
            slug: props.slug,
            schema: props.schema,
            description: props.description
        };

    }

    componentWillUpdate(nextProps, nextState) {

      if (this.props.proc == "new") {

        // Sets slug for ID field from name field.
        if (nextState.name != this.state.name) {
          nextState.slug = Slug(nextState.name).toLowerCase();
        }

        // Slugifies direct editing of the slug field.
        if (nextState.slug != this.state.slug) {
          nextState.slug = Slug(nextState.slug).toLowerCase();
        }
      }

    }

    componentWillReceiveProps(nextProps) {

      this.setState({
          name: nextProps.name,
          slug: nextProps.slug,
          schema: nextProps.schema,
          description: nextProps.description
      });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        if (this.props.proc == "new") {

            Actions.saveSite({
                name: this.state.name,
                _id: this.state.slug,
                schema: this.state.schema,
                users: [this.props.user.id],
                description: this.state.description
            });
        }
        else {
            Actions.updateSite(this.state.slug, {
              name: this.state.name,
              users: [this.props.user.id],
              schema: this.state.schema,
              description: this.state.description
            })

        }

    }

    render() {

        if (!this.props.hydrated) {

            return (
                <div className="alert alert-info">
                    Loading site data...
                </div>
            );
        }

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hideSitesSaveSuccess}
                message="Success. Changes have been saved."
            />);
        }

        if (this.props.error) {
            alerts.push(<Alert
                key="danger"
                type="danger"
                message={this.props.error}
            />);
        }
        let helpName = this.props.help['name'] ? this.props.help['name'] : "The name of your agency or organization."
        let helpSlug = this.props.help['slug'] ? this.props.help['slug'] : "A unique identifier for your site."
        let slugDisabled = this.props.proc == "edit" ? true : false;
        let buttonDescription = this.props.proc == "edit" ? "Edit site" : "Create Site";

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <fieldset>
                    {alerts}
                    <TextControl
                        name="name"
                        label="Name"
                        hideHelp="false"
                        placeholder="Enter your site name"
                        value={this.state.name}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['name']}
                        help={helpName}
                        disabled={this.props.loading}
                    />
                    <TextControl
                        name="slug"
                        label="ID"
                        value={this.state.slug}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['slug']}
                        help={helpSlug}
                        disabled={slugDisabled}
                    />
                  <TextAreaControl
                        name="description"
                        label="Description"
                        value={this.state.description}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.hasError['description']}
                        help={this.props.help['description']}
                        disabled={this.props.loading}
                    />
                    <SelectControl
                        name="schema"
                        label="Schema"
                        value={this.state.schema}
                        onChange={LinkState.bind(this)}
                        disabled={this.props.loading}>

                        <option value="simple">Simple</option>
                        <option value="pod">Project Open Data</option>
                        <option value="datapackages">Data Packages</option>
                    </SelectControl>

                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.loading}>
                            {buttonDescription}
                            <Spinner
                                space="left"
                                show={this.props.loading}
                            />
                        </Button>
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
}

SitesForm.propTypes = propTypes;


module.exports = SitesForm;
