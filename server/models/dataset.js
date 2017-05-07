'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');
const fs = require('fs');

class Storage {

  instance($class, $id) {
      return new $class($id);
  }

  init() {}

  insert() {}

  insertMany() {}

  update() {}

  delete() {}
}

// location of data folder
// site name
// collection type
//

class FileStorage extends Storage {

  insert() {
    console.log("inserting");
  }
}

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
module.exports = {
  Storage,
  Dataset,
  FileStorage
};
