'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const ReactRouter = require('react-router');


class Actions {

    static updateFormData(formData) {

            Store.dispatch({
                type: Constants.UPDATE_FORM_DATA,
                formData
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

    static getCollectionSchema(schema, collection) {

        ApiActions.get(
            `/api/schemas/${schema}/${collection}`,
            undefined,
            Store,
            Constants.GET_COLLECTION_SCHEMA,
            Constants.GET_COLLECTION_SCHEMA_RESPONSE
        );
    }

    static getContent(siteId, type, id) {

        ApiActions.get(
            `/api/sites/${siteId}/contents/${type}/${id}`,
            undefined,
            Store,
            Constants.GET_CONTENT,
            Constants.GET_CONTENT_RESPONSE
        );
    }


    static saveContent(siteId, collection, data) {

        let post = {
            "collection": collection,
            "content": data
        }

        ApiActions.post(
            `/api/sites/${siteId}/contents`,
            post,
            Store,
            Constants.SAVE_DATASET,
            Constants.SAVE_DATASET_RESPONSE,
            (err, response) => {

                if (!err) {
                    ReactRouter.browserHistory.push('/sites/' + siteId + '/' + collection + '/' + data.identifier);
                    window.scrollTo(0, 0);
                }
            }
        );


    }

    static updateContent(siteId, collection, id, data) {
        let post = {
            "collection": collection,
            "content": data
        }

        ApiActions.put(
            `/api/sites/${siteId}/contents/${id}`,
            post,
            Store,
            Constants.UPDATE_DATASET,
            Constants.UPDATE_DATASET_RESPONSE,
            (err, response) => {

                if (!err) {
                    ReactRouter.browserHistory.push('/sites/' + siteId + '/' + collection + '/' + data.identifier);
                    window.scrollTo(0, 0);
                }
            }

        );
    }

    static deleteContent(siteId, collection, id) {

        ApiActions.delete(
            `/api/sites/${siteId}/contents/${collection}/${id}`,
            undefined,
            Store,
            Constants.DELETE,
            Constants.DELETE_RESPONSE,
            (err, response) => {

                if (!err) {
                    ReactRouter.browserHistory.push(`/sites/${siteId}/content`);

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
