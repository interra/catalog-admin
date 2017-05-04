'use strict';
const Actions = require('./actions');
const React = require('react');
const Store = require('./store');
const SitesForm = require('./sites-form.jsx');

class CreateSite extends React.Component {
    constructor(props) {

        super(props);

        this.state = {};

        Actions.getUser();
        this.state = Store.getState();
        this.state.site = {
          // We are loading the form from scratch so no data lookup.
          hydrated: true,
          loading: false,
          proc: "new",
          showSaveSuccess: false,
          schema: "simple",
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
    }

    render() {

        return (
          <section className="container site-admin">
              <div className="col-sm-2 left">
                  <div className="sidebar">
                      <div id="hello-card">
                        <p>Create a site to get started.</p>
                      </div>
                  </div>
              </div>
              <div className="col-sm-10 center">
                <h1 className="page-header">Create Site</h1>
                <SitesForm user={this.state.user} {...this.state.site} />
              </div>
          </section>
        );
    }
}


module.exports = CreateSite;
