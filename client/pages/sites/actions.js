'use strict';
const ApiActions = require('../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const ReactRouter = require('react-router');


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

    static getDatasetCount(siteId) {

        ApiActions.get(
            `/api/sites/${siteId}/contents/count`,
            undefined,
            Store,
            Constants.GET_COUNT,
            Constants.GET_COUNT_RESPONSE
        );
    }


    static saveSite(data) {
        console.log("SIIIIITEEEEE", data);

        ApiActions.post(
            '/api/sites',
            data,
            Store,
            Constants.SAVE_SITE,
            Constants.SAVE_SITE_RESPONSE,
            (err, response) => {

                if (!err) {
                    ReactRouter.browserHistory.push('/sites/' + data._id);

                    window.scrollTo(0, 0);
                }
            }
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

    static delete(id) {

        ApiActions.delete(
            `/api/sites/${id}`,
            undefined,
            Store,
            Constants.DELETE,
            Constants.DELETE_RESPONSE,
            (err, response) => {

                if (!err) {
                    ReactRouter.browserHistory.push('/sites');

                    window.scrollTo(0, 0);
                }
            }
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
