'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');

class Dataset extends MongoModels {
    static create(_id, name, siteId, description, users, callback) {

        const document = {
            _id,
            siteId,
            description,
            name,
            timeCreated: new Date(),
            users
        };

        this.insertOne(document, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }

}

Dataset.collection = 'datasets';

Dataset.schema = Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    timeCreated: Joi.date().required(),
    users: Joi.array().items().required()
});

module.exports = Dataset;
