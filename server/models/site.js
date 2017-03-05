'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');

class Site extends MongoModels {
    static create(_id, name, description, users, callback) {

        const document = {
            _id,
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

    static addUser(_id, user, callback) {

        const query = {};
        query._id = _id;
        const update = {
            $push: {
                user
            }
        };
        this.updateOne(query, update);
    }

    static findByUsername(username, callback) {

        const query = { 'user.name': username.toLowerCase() };

        this.findMany(query, callback);

    }
}

Site.collection = 'sites';

Site.schema = Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    timeCreated: Joi.date().required(),
    users: Joi.array().items().required()
});

module.exports = Site;
