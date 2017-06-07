'use strict';
const Moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('./actions');
const Store = require('./store');
const Sidebar = require('../sidebar.jsx');

const Link = ReactRouter.Link;

class ViewSite extends React.Component {
    constructor(props) {

        super(props);

        Actions.getSite(props.params.id);
        Actions.getContent(props.params.id, props.params.collection, props.params.contentId);

        this.state = Store.getState();
    }
    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    render() {

        if (!this.state.site.hydrated) {
            return (
              <section className="container site-admin">
                  <div className="col-sm-2 left">
                      <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
                  </div>
                  <div className="col-sm-10 center">
                      <div className="row">
                          <h1 className="page-header">Dataset</h1>
                          <div className="alert alert-info">
                            loading...
                          </div>
                      </div>
                  </div>
              </section>

            );
        }

        if (this.state.site.showFetchFailure) {
            return (
                <section className="section-account-details container">
                    <h1 className="page-header">
                        <Link to="/sites">Sites</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.site.error}
                    </div>
                </section>
            );
        }

        return (
            <section className="container site-admin">
                <div className="col-sm-2 left">
                      <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
                </div>
                <div className="col-sm-10 center">
                    <div className="row">
                        <h1>{this.state.content.formData.title}</h1>
                        <p>{this.state.content.formData.description}</p>
                    </div>

                </div>
            </section>
        );
    }
}


module.exports = ViewSite;
