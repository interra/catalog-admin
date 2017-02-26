'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Slug = require('slug');

class Site extends MongoModels {
    static create(_id, name, description, callback) {

        const document = {
            _id,
            description,
            name,
            timeCreated: new Date()
        };

        this.insertOne(document, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }
}

Site.collection = 'site';

Site.schema = Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    timeCreated: Joi.date().required(),
    userCreated: Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    })
});

module.exports = Site;
