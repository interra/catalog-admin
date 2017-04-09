'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const ReactRouter = require('react-router');


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

    static getCollectionSchema(schema, collection) {

        ApiActions.get(
            `/api/schemas/${schema}/${collection}`,
            undefined,
            Store,
            Constants.GET_COLLECTION_SCHEMA,
            Constants.GET_COLLECTION_SCHEMA_RESPONSE
        );
    }

    static getDataset(siteId,id) {

        ApiActions.get(
            `/api/sites/${siteId}/datasets/${id}`,
            undefined,
            Store,
            Constants.GET_DATASET,
            Constants.GET_DATASET_RESPONSE
        );
    }


    static saveDataset(siteId, data) {

        ApiActions.post(
            `/api/sites/${siteId}/datasets`,
            data,
            Store,
            Constants.SAVE_DATASET,
            Constants.SAVE_DATASET_RESPONSE,
            (err, response) => {

                if (!err) {
                    ReactRouter.browserHistory.push('/sites/' + siteId + '/datasets/' + data._id);

                    window.scrollTo(0, 0);
                }
            }
        );


    }

    static updateDataset(siteId, id, data) {

        ApiActions.put(
            `/api/sites/${siteId}/datasets/${id}`,
            data,
            Store,
            Constants.UPDATE_DATASET,
            Constants.UPDATE_DATASET_RESPONSE
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
