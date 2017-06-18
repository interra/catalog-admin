'use strict';
const Actions = require('./actions');
const React = require('react');
const Store = require('./store');
const ContentForm = require('./content-form.jsx');
const Sidebar = require('../sidebar.jsx');
const ObjectAssign = require('object-assign');

class CreateContent extends React.Component {
    constructor(props) {

        super(props);

        this.state = {};

        Actions.getUser();
        Actions.getSite(props.params.id);
        this.state = Store.getState();
        this.state.formData = {};
        this.state.content = {
          // We are loading the form from scratch so no data lookup.
          hydrated: true,
          loading: false,
          proc: "new",
          showSaveSuccess: false,
          error: undefined,
          hasError: {},
          help: {}
        }

    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {
        // Don't show success alert if leaving page.
        this.state.site.showSaveSuccess = false;
        this.unsubscribeStore();
    }

    onChange(formData) {

        this.setState({
            formData: formData
        });
    }

    onStoreChange() {

        let newState = Store.getState();

        if (newState.site.hydrated && !newState.collectionSchema.requested) {
            Actions.getCollectionSchema(newState.site.schema, this.props.params.collection);
        }
        if (newState.collectionSchema.hydrated && Object.keys(this.state.formData).length === 0) {
            this.state.formData = {
                // TODO: These are required fields which we want to make swappable in map.yml.
                created: new Date(Date.now()).toISOString(),
                modified: new Date(Date.now()).toISOString(),
                title: "",
                identifier: ""
            };
        }
        newState.formData = ObjectAssign({}, this.state.formData, newState.formData);

        this.setState(newState);

    }

    render() {

        return (
          <section className="container site-admin">
              <div className="col-sm-2 left">
                  <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
              </div>
              <div className="col-sm-10 center">
                  <h1>Create {this.state.collectionSchema.schema.title}</h1>
                  <ContentForm user={this.state.user}
                      site={this.state.site}
                      onChange={this.onChange.bind(this)}
                      formData={this.state.formData}
                      content={this.state.content}
                      schema={this.state.collectionSchema}/>
              </div>
          </section>
        );
    }
}


module.exports = CreateContent;
