'use strict';
const Actions = require('./actions');
const React = require('react');
const Store = require('./store');
const ContentForm = require('./content-form.jsx');
const Sidebar = require('../sidebar.jsx');

class CreateContent extends React.Component {
    constructor(props) {

        super(props);

        this.state = {};

        Actions.getUser();
        Actions.getSite(props.params.id);
        this.state = Store.getState();
        this.state.content = {
          // We are loading the form from scratch so no data lookup.
          hydrated: true,
          loading: false,
          proc: "new",
          showSaveSuccess: false,
          error: undefined,
          hasError: {},
          help: {},
          formData: {
              // TODO: These are required fields which we want to make swappable in map.yml.
              created: new Date(Date.now()).toISOString(),
              modified: new Date(Date.now()).toISOString(),
              title: "",
              identifier: ""
          }
        }
        this.state.formData = {
            // TODO: These are required fields which we want to make swappable in map.yml.
            created: new Date(Date.now()).toISOString(),
            modified: new Date(Date.now()).toISOString(),
            title: "",
            identifier: ""
        };
        this.state.collectionSchema.schema = {};
        this.state.collectionSchema.requested = false;
        this.state.collectionSchema.schema.title = '';

    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {
        // Don't show success alert if leaving page.
        this.state.site.showSaveSuccess = false;
        this.unsubscribeStore();
    }


    onStoreChange() {

        this.setState(Store.getState());

        console.log("store change");
        console.log(this.state);
        if (this.state.site.hydrated && !this.state.collectionSchema.requested) {
            Actions.getCollectionSchema(this.state.site.schema, this.props.params.collection);
        }

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
                      formData={this.state.formData}
                      content={this.state.content}
                      schema={this.state.collectionSchema}/>
              </div>
          </section>
        );
    }
}


module.exports = CreateContent;
