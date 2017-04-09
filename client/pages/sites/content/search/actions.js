/* global window */
'use strict';
const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const ReactRouter = require('react-router');
const Store = require('./store');


class Actions {

    static getSite(id) {

        ApiActions.get(
            `/api/sites/${id}`,
            undefined,
            Store,
            Constants.GET_SITE,
            Constants.GET_SITE_RESPONSE
        );
    }

    static getResults(siteId, data) {

        ApiActions.get(
            `/api/sites/${siteId}/datasets`,
            data,
            Store,
            Constants.GET_RESULTS,
            Constants.GET_RESULTS_RESPONSE
        );
    }

    static changeSearchQuery(id, data) {

        ReactRouter.browserHistory.push({
            pathname: `/sites/${id}/datasets`,
            query: data
        });

        window.scrollTo(0, 0);
    }


    static getCollections(schema) {
        console.log(schema);

        ApiActions.get(
            `/api/schemas/${schema}`,
            undefined,
            Store,
            Constants.GET_COLLECTIONS,
            Constants.GET_COLLECTIONS_RESPONSE
        );
    }
}


module.exports = Actions;
