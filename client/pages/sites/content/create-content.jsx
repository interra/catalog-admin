'use strict';
const Actions = require('./actions');
const React = require('react');
const Store = require('./store');
const DatasetForm = require('./dataset-form.jsx');
const Sidebar = require('../sidebar.jsx');

class CreateDataset extends React.Component {
    constructor(props) {

        super(props);

        this.state = {};

        // 1. Add flag for not-checked-type
        // 2. If type checked and not valid then error message
        //    Maybe consider doing this on the server
        //

        Actions.getUser();
        Actions.getSite(props.params.id);
        this.state = Store.getState();
        this.state.dataset = {
          // We are loading the form from scratch so no data lookup.
          hydrated: true,
          loading: false,
          proc: "new",
          showSaveSuccess: false,
          error: undefined,
          hasError: {},
          help: {},
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


    onStoreChange() {

        this.setState(Store.getState());

        if (this.state.site.hydrated && !this.state.collectionSchema.requested) {
            Actions.getCollectionSchema(this.state.site.schema,this.props.params.collection);
        }

    }

    render() {

        return (
          <section className="container site-admin">
              <div className="col-sm-2 left">
                  <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
              </div>
              <div className="col-sm-10 center">
                  <h1>Create Dataset</h1>
                  <DatasetForm user={this.state.user} site={this.state.site} dataset={this.state.dataset} schema={this.state.collectionSchema}/>
              </div>
          </section>
        );
    }
}


module.exports = CreateDataset;
