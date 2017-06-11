'use strict';
const ApiActions = require('../../../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const ReactRouter = require('react-router');


class Actions {

    static submitFile(siteId, file) {

        let form = new FormData();
        form.append('file', file, file.name);

        ApiActions.postFile(
            `/api/${siteId}/files`,
            form,
            Store,
            Constants.SAVE_FILE,
            Constants.SAVE_FILE_RESPONSE
        );

    }


}


module.exports = Actions;
