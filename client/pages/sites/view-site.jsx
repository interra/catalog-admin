'use strict';
const Moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const Actions = require('./actions');
const Store = require('./store');
const Sidebar = require('./sidebar.jsx');

const Link = ReactRouter.Link;

class ViewSite extends React.Component {
    constructor(props) {

        super(props);

        Actions.getSite(props.params.id);
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

        return (
            <section className="container site-admin">
                  <div className="col-sm-2 left">
                      <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
                  </div>
              <div className="col-sm-10 center">
                    <div className="row">
                        <h1>Dashboard</h1>
                        <p>None of this is functional yet.</p>
                        <p>This needs a working site and analytics and comments etc.</p>
                          <div className="row cards">



                  <div className="col-lg-3 col-md-6">
                      <div className="panel panel-default">
                          <div className="panel-heading">Datasets</div>
                          <div className="panel-content">
                              <div className="huge">46</div>
                          </div>
                          <a href="#">
                              <div className="panel-footer">
                                  <span className="pull-left">View Details</span>
                                  <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                                  <div className="clearfix"></div>
                              </div>
                          </a>
                      </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                      <div className="panel panel-default">
                          <div className="panel-heading">Page Visits</div>
                          <div className="panel-content">
                            <div className="huge">58,342</div>
                        </div>
                        <a href="#">
                              <div className="panel-footer">
                                  <span className="pull-left">View Details</span>
                                  <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                                  <div className="clearfix"></div>
                              </div>
                          </a>
                      </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                        <div className="panel panel-default">
                            <div className="panel-heading">Asset Downloads</div>
                            <div className="panel-content">
                              <div className="huge">231</div>
                          </div>
                          <a href="#">
                              <div className="panel-footer">
                                  <span className="pull-left">View Details</span>
                                  <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                                  <div className="clearfix"></div>
                              </div>
                          </a>
                      </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                      <div className="panel panel-default">
                          <div className="panel-heading">Comments</div>
                          <div className="panel-content">
                              <div className="huge">12</div>
                        </div>
                          <a href="#">
                              <div className="panel-footer">
                                  <span className="pull-left">View Details</span>
                                  <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                                  <div className="clearfix"></div>
                              </div>
                          </a>
                      </div>
                  </div>
              </div>
                    </div>
              </div>
            </section>
        );
    }
}


module.exports = ViewSite;
