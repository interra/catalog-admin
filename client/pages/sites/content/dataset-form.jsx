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
const Form = require('react-jsonschema-form').default;
require('./dataset-form.js');


class Referenced extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {props.formData};
  }
  // Reference field:
//
//1. Add to local components
//	/client/components/form
//
//2. Add
//	- Actions
//	- Reducer
//	- Store
//	-> Calls content API (/sites/[siteId]/content/[type]
//	-> Intially just select list
//  -> Post-MVP add create link

  //
  //

  onChange(name) {
    return (event) => {
      this.setState({
        [name]: parseFloat(event.target.value)
      }, () => this.props.onChange(this.state));
    };
  }

  render() {
    return (
      <div>
        This will be a select list for referenced collections.
      </div>
    );
  }
}


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


// Define the custom field component to use for the root object
const uiSchema = {"ui:field": "referenced"};

// Define the custom field components to register; here our "geo"
// custom field component
const fields = {referenced: Referenced};


class DatasetForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {};

        // This would be a prop once everything is wired.
        this.state.editedformData = props.formData;

    }

    componentWillUpdate(nextProps, nextState) {

      if (this.props.content.proc == "new") {

        // Sets slug for ID field from name field.
//        if (nextState.dataset.name != this.state.dataset.name) {
//          nextState.dataset.slug = Slug(nextState.dataset.name).toLowerCase();
//        }

        // Slugifies direct editing of the slug field.
  //      if (nextState.dataset.slug != this.state.dataset.slug) {
  //        nextState.dataset.slug = Slug(nextState.dataset.slug).toLowerCase();
    //    }
      }

    }

    componentWillReceiveProps(nextProps) {
        console.log("MAYBE NEW PROPS HERE", nextProps);
        // Don't pass the formData until we have a schema.
        if (nextProps.schema.requested == true && nextProps.schema.loading == false) {
            this.state.formData = nextProps.content.formData;
        }

    }

    handleSubmit(data) {
        console.log("DATA IS FIRED", data);
        console.log(this);

        // TODO: Add to state.
        let collection = window.location.pathname.split('/')[3];

        event.preventDefault();
        event.stopPropagation();

        if (this.props.content.proc == "new") {
            Actions.saveContent(this.props.site.slug, collection, this.state.formData);

        }
        else {
            Actions.updateContent(this.props.site.slug, collection, this.state.formData.identifier, this.state.formData);
        }

    }

    onChange (data) {

      console.log("ON CHANGE GETTING FIRED", this.state);

      this.setState({"formData": data.formData});


//       data.formData.description = data.formData.title;


     };

    render() {

      const uiSchema = {
        "description": {
          "ui:widget": "textarea"
        },
        "organization": {
          "ui:field": "referenced"
        }

      }

      console.log("STATEY MATEY", this.state);
      console.log("PROPS", this.props);



        const log = (type) => console.log.bind(console, type);

        return (
          <Form schema={this.props.schema.schema}
            uiSchema={uiSchema}
            fields={fields}
            formData={this.state.formData}
            onChange={this.onChange.bind(this)}
            onSubmit={this.handleSubmit.bind(this)}
            onError={log("errors")} />

        );
    }
}

DatasetForm.propTypes = propTypes;


module.exports = DatasetForm;
