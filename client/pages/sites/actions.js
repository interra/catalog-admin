'use strict';
const ApiActions = require('../../actions/api');
const Constants = require('./constants');
const Store = require('./store');


class Actions {
    static getSites() {

        ApiActions.get(
            '/api/sites',
            undefined,
            Store,
            Constants.GET_SITES,
            Constants.GET_SITES_RESPONSE
        );
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


    static saveSite(data) {

        ApiActions.post(
            '/api/sites',
            data,
            Store,
            Constants.SAVE_SITE,
            Constants.SAVE_SITE_RESPONSE
        );
    }

    static updateSite(id, data) {

        ApiActions.put(
            `/api/sites/${id}`,
            data,
            Store,
            Constants.UPDATE_SITE,
            Constants.UPDATE_SITE_RESPONSE
        );
    }

    static hideSitesSaveSuccess() {

        Store.dispatch({
            type: Constants.HIDE_SITE_SAVE_SUCCESS
        });
    }

    static getUser() {

        ApiActions.get(
            '/api/users/my',
            undefined,
            Store,
            Constants.GET_USER,
            Constants.GET_USER_RESPONSE
        );
    }

}


module.exports = Actions;
