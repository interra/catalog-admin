'use strict';
const App = require('./app.jsx');
const Home = require('./home.jsx');
const NotFound = require('./not-found.jsx');
const React = require('react');
const ReactRouter = require('react-router');
const CreateSite = require('./create-site.jsx');
const ViewSite = require('./view-site.jsx');
const EditSite = require('./edit-site.jsx');
const CreateContent = require('./content/create-content.jsx');
const EditDataset = require('./content/edit-dataset.jsx');
const DatasetView = require('./content/dataset-view.jsx');
const DatasetSearchPage = require('./content/search/index.jsx');


const IndexRoute = ReactRouter.IndexRoute;
const Route = ReactRouter.Route;
const Router = ReactRouter.Router;
const browserHistory = ReactRouter.browserHistory;


const Routes = (
    <Router history={browserHistory}>
        <Route path="/sites" component={App}>
            <IndexRoute component={Home} />
            <Route path="new" component={CreateSite} />
            <Route path=":id" component={ViewSite} />
            <Route path=":id/edit" component={EditSite} />
            <Route path=":id/content" component={DatasetSearchPage} />
            <Route path=":id/:collection/new" component={CreateContent} />
            <Route path=":id/:collection/:datasetId" component={DatasetView} />
            <Route path=":id/:collection/:datasetId/edit" component={EditDataset} />
            <Route path="*" component={NotFound} />
        </Route>
        <Route path="*" component={NotFound} />
    </Router>
);


module.exports = Routes;
