'use strict';
const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const ReactRouter = require('react-router');


class Actions {

    static getTitles(siteId, type) {

        ApiActions.get(
            `/api/sites/${siteId}/contents/titles`,
            {"type": type},
            Store,
            Constants.GET_CONTENT_TITLES,
            Constants.GET_CONTENT_TITLES_RESPONSE
        );
    }


}


module.exports = Actions;
