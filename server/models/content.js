'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');
const fs = require('fs');

class Storage {

  constructor(siteId) {
    this.siteId = siteId;
//    this.identifier = identifier
//    this.directory = __dirname.replace("server/models","/") + dir + '/' + site
  }

  init() {}

  count() {}

  findByIdentifier(){}

  insert() {}

  insertMany() {}

  update() {}

  delete() {}
}

// location of data folder
// site name
// collection type
//
//

/**

NOTES:
-> Add CRUD and pagedFind to FileStorage
-> Now we can save to files
-> Now do we just use our own site OR do we create a static site?
  static site
    definition:
      -> data_files/philly folder written to
      -> sites/philly/index.html et all updated
          -> or s3 or github updated
      -> philly.interradata.io
    pros:
      -> Can host easily on S3 or Github pages etc
      -> Scalable
      -> decoupled from admin
    cons:
      -> make it harder to just make cheap service
      -> make it harder to create new functionality

    next steps:
      -> finish file storage
      -> finish schema module definition
      -> fix APIs
      -> create static site generator

*/

class FileStorage extends Storage {

  constructor(siteId) {
    super(siteId);
  }

  insert() {
    console.log("inserting");
    console.log(this.directory);
    this.load(null);
  }

  count() {}

  load(callack) {
    fs.readdir(this.directory, function(err, list) {
      console.log("filelist", list);
      var i;
      for (i in list) {
        console.log(list[i]);
      }

    });
  }

  pagedFind(query, fields, sort, limit, page, callback) {

  }
}

class internalMongo extends MongoModels {
    static create(document, callback) {

        this.insertOne(document, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }

}

// All content for all sites is stored in a single 'contents' collection.
// Content is differentiated by 'site' and by 'type'.
// These are stored in the documents. For the file storage they are part of
// the directory structure.
class Mongo extends Storage {

    // TODO: logic for _id = siteId - identifier - type.
    constructor(siteId) {
        super(siteId);
    }

    titles(type, callback) {
        let query = {};
        if (type) {
            query = {"type": type};
        }
        const projection = {'title' : 1, 'identifier': 1, _id: 0};

        return MongoModels.find(query, projection, callback);
    }

    pagedFind(query, fields, sort, limit, page, callback) {
        query.siteId = this.siteId;

        return MongoModels.pagedFind(query, fields, sort, limit, page, callback);
    }

    findByIdentifier(identifier, type, callback) {
        const query = { '_id': this.siteId + '-' + type + '-' +  identifier };

        MongoModels.findOne(query, (err, content) => {
            if (err) {
                return callback(err);
            }

            callback(null, content);        }

        );
    }

    count(type, callback) {

        const query = {'siteId': this.siteId};

        if (typeof(type) === 'undefined') {
            query.type = type;
        }
        console.log('query', query);

        return MongoModels.count(query, callback);
    }

    findOneAndUpdate(identifier, type, content, callback) {

        const query = { '_id': this.siteId + '-' + type + '-' +  identifier };
        const update = {
            $set: content
        };

        console.log("THE QUERIES", query);

        return MongoModels.findOneAndUpdate(query, update, callback);
    }

    insertOne(identifier, type, content, callback) {

        console.log("identifier", identifier);


        if (typeof(content._id) === 'undefined') {
            content._id = this.siteId + '-' + type + '-' +  identifier;
        }

        content.siteId = this.siteId;
        content.type = type;

        MongoModels.insertOne(content, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }
}

MongoModels.collection = 'datasets';

module.exports = {
  Storage,
  Mongo,
  FileStorage
};
