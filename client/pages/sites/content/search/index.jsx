'use strict';
const Actions = require('./actions');
const FilterForm = require('./filter-form.jsx');
const Paging = require('../../../../components/paging.jsx');
const React = require('react');
const Results = require('./results.jsx');
const Store = require('./store');
const Sidebar = require('../../sidebar.jsx');
const ReactRouter = require('react-router');


const Link = ReactRouter.Link;

const propTypes = {
    location: React.PropTypes.object
};

const Collections = (props) => {
    var items = [];
    for (var i = 0; i < props.items.collections.length; i++) {
        var name = props.items.collections[i];
        var extras = { };
        extras.to =  "/sites/" + props.siteId + "/" + name + "/new";
        items.push(<li key={i}><Link to=""{...extras}>{name}</Link></li>);
    }
    return <ul className="dropdown-menu">{items}</ul>;
}

class DatasetSearchPage extends React.Component {
    constructor(props) {

        super(props);

        Actions.getSite(this.props.params.id);
        Actions.getResults(this.props.params.id, this.props.location.query);

        this.els = {};
        this.state = Store.getState();
    }

    componentWillReceiveProps(nextProps) {

        Actions.getResults(nextProps.location.query);
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());

        if (this.state.site.hydrated && !this.state.collections.requested) {
            Actions.getCollections(this.state.site.schema);
        }

    }

    onFiltersChange(event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        Actions.changeSearchQuery(this.state.site.slug, this.els.filters.state);
    }

    onPageChange(page) {

        this.els.filters.changePage(page);
    }

    onNewClick() {

        Actions.showCreateNew();
    }


    render() {
        let createContent = "/sites/" + this.state.site.slug + "/content/new";

        return (
            <section className="container site-admin">
                <div className="col-sm-2 left">
                    <Sidebar name={this.state.site.name} id={this.props.params.id} location={this.props.location} />
                </div>
                <div className="col-sm-10 center">
                    <h1>Content</h1>
                      <div className="btn-group" role="group">
                          <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              Create New
                              <span className="caret"></span>
                          </button>
                          <Collections siteId={this.state.site.slug} items={this.state.collections} />
                      </div>
                    <FilterForm
                        ref={(c) => (this.els.filters = c)}
                        loading={this.state.results.loading}
                        query={this.props.location.query}
                        onChange={this.onFiltersChange.bind(this)}
                    />
                    <Results data={this.state.results.data} />
                    <Paging
                        ref={(c) => (this.els.paging = c)}
                        pages={this.state.results.pages}
                        items={this.state.results.items}
                        loading={this.state.results.loading}
                        onChange={this.onPageChange.bind(this)}
                    />
                </div>
            </section>
        );
    }
}

DatasetSearchPage.propTypes = propTypes;


module.exports = DatasetSearchPage;
