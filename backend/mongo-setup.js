const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const environment = require('../environment/environment');

const mongo = {
    ...environment.mongo,
    config: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
    }
};

// const url = 'mongodb://localhost:27017';
const url = `mongodb+srv://${mongo.username}:${mongo.password}@cluster0.jtned.mongodb.net/${mongo.db}?retryWrites=true&w=majority`;

function mongoSetup(collectionName) {
    console.log(url, mongo);
    return new MongoClient(url, mongo.config).connect().then(client => {
        const collection = client.db(mongo.db).collection(collectionName);
        return { collection, client };
    })
    .catch(err => logger(err));
};

function logger(res) {
    console.log(res);
    return res;
}

function findQuery(collection, filter) {
    return collection.find(filter).toArray()
    .then(res => logger(res));
}
function insertOne(collection, doc) {
    return collection.insertOne(doc)
    .then(res => logger(res));
}
function findByIdAndUpdate(collection, id, doc) {
    doc['_id'] = getObjectId(doc['_id']);
    return collection.findOneAndUpdate({ '_id': getObjectId(id) }, {
        $set: doc
    })
    .then(res => logger(res))
    .then((res) => {
        if (!res.value) {
            throw new Error('Data Not found');
        }
        return res;
    });
}
function deleteById(collection, id) {
    return collection.deleteOne({ '_id': ObjectId(id)})
    .then(res => logger(res));
}

function getObjectId(id) {
    return ObjectId(id);
}

const MongoQuery = {
    getObjectId,
    findQuery,
    insertOne,
    findByIdAndUpdate,
    deleteById
};

const ID = 'id'; const _ID = '_id';
const PrimaryKeyParser = {
    convertId2UnderscoreId: (doc) => {
        doc[_ID] = doc[ID];
        delete doc[ID];
        return doc;
    },
    convertUnderscoreId2Id: (doc) => {
        doc[ID] = doc[_ID];
        delete doc[_ID];
        return doc;
    }
};

module.exports = {
    mongoSetup,
    MongoQuery,
    PrimaryKeyParser
};