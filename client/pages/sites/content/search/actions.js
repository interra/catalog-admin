/* global window */
'use strict';
const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const ReactRouter = require('react-router');
const Store = require('./store');


class Actions {

    static clearData() {

        Store.dispatch({
            type: Constants.CLEAR_DATA
        });

    }    

    static getSite(id) {

        ApiActions.get(
            `/api/sites/${id}`,
            undefined,
            Store,
            Constants.GET_SITE,
            Constants.GET_SITE_RESPONSE
        );
    }


    static getMap(schema) {

        ApiActions.get(
            `/api/schemas/${schema}/map`,
            undefined,
            Store,
            Constants.GET_MAP,
            Constants.GET_MAP_RESPONSE
        );
    }

    static getResults(siteId, data) {

        ApiActions.get(
            `/api/sites/${siteId}/contents`,
            data,
            Store,
            Constants.GET_RESULTS,
            Constants.GET_RESULTS_RESPONSE
        );
    }

    static changeSearchQuery(id, data) {

        ReactRouter.browserHistory.push({
            pathname: `/sites/${id}/content`,
            query: data
        });

        window.scrollTo(0, 0);
    }


    static getCollections(schema) {

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
