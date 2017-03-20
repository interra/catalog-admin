'use strict';
const Actions = require('./actions');
const Alert = require('../../../components/alert.jsx');
const Button = require('../../../components/form/button.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const LinkState = require('../../../helpers/link-state');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');
const TextControl = require('../../../components/form/text-control.jsx');
const TextAreaControl = require('../../../components/form/textarea-control.jsx');
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

class DatasetForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {};
        this.state.dataset = {
            name: props.dataset.name,
            slug: props.dataset.slug,
            description: props.dataset.description
        };

    }

    componentWillUpdate(nextProps, nextState) {

      if (this.props.dataset.proc == "new") {

        // Sets slug for ID field from name field.
        if (nextState.dataset.name != this.state.dataset.name) {
          nextState.dataset.slug = Slug(nextState.dataset.name).toLowerCase();
        }

        // Slugifies direct editing of the slug field.
        if (nextState.dataset.slug != this.state.dataset.slug) {
          nextState.dataset.slug = Slug(nextState.dataset.slug).toLowerCase();
        }
      }

    }

    componentWillReceiveProps(nextProps) {

      this.setState({
          name: nextProps.dataset.name,
          slug: nextProps.dataset.slug,
          description: nextProps.dataset.description
      });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        if (this.props.dataset.proc == "new") {

            Actions.saveDataset(this.props.site.slug, {
                _id: this.state.dataset.slug,
                siteId: this.props.site.slug,
                name: this.state.dataset.name,
                users: [{id: this.props.user.id}],
                description: this.state.dataset.description
            });

        }
        else {
            Actions.updateDataset(this.state.dataset.slug, {
              name: this.state.dataset.name,
              users: [{id: this.props.user.id}],
              description: this.state.dataset.description
            })

        }

    }

    render() {

        if (!this.props.dataset.hydrated) {
            return (
                <div className="alert alert-info">
                    Loading site data...
                </div>
            );
        }

        const alerts = [];

        if (this.props.dataset.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hideSitesSaveSuccess}
                message="Success. Changes have been saved."
            />);
        }

        if (this.props.dataset.error) {
            alerts.push(<Alert
                key="danger"
                type="danger"
                message={this.props.dataset.error}
            />);
        }
        let helpName = this.props.dataset.help['name'] ? this.props.dataset.help['name'] : "The name or title of the dataset."
        let helpSlug = this.props.dataset.help['slug'] ? this.props.dataset.help['slug'] : "A unique identifier for the dataset."
        let slugDisabled = this.props.dataset.proc == "edit" ? true : false;
        let buttonDescription = this.props.dataset.proc == "edit" ? "Edit dataset" : "Create dataset";

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <fieldset>
                    {alerts}
                    <TextControl
                        name="dataset.name"
                        label="Name"
                        hideHelp="false"
                        placeholder="Enter your site name"
                        value={this.state.dataset.name}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.dataset.hasError['name']}
                        help={helpName}
                        disabled={this.props.dataset.loading}
                    />
                    <TextControl
                        name="dataset.slug"
                        label="ID"
                        value={this.state.dataset.slug}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.dataset.hasError['slug']}
                        help={helpSlug}
                        disabled={slugDisabled}
                    />
                  <TextAreaControl
                        name="dataset.description"
                        label="Description"
                        value={this.state.dataset.description}
                        onChange={LinkState.bind(this)}
                        hasError={this.props.dataset.hasError['description']}
                        help={this.props.dataset.help['description']}
                        disabled={this.props.dataset.loading}
                    />
                    <ControlGroup hideLabel={true} hideHelp={true}>
                        <Button
                            type="submit"
                            inputClasses={{ 'btn-primary': true }}
                            disabled={this.props.dataset.loading}>
                            {buttonDescription}
                            <Spinner
                                space="left"
                                show={this.props.dataset.loading}
                            />
                        </Button>
                    </ControlGroup>
                </fieldset>
            </form>
        );
    }
}

DatasetForm.propTypes = propTypes;


module.exports = DatasetForm;
