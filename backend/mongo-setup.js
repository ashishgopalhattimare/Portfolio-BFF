const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const environment = require('../environment/environment');

const dbName = 'Portfolio';
const credentials = {
    username: environment.username,
    password: environment.password
}
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
};

// const url = 'mongodb://localhost:27017';
const url = `mongodb+srv://${credentials.username}:${credentials.password}@cluster0.jtned.mongodb.net/${dbName}?retryWrites=true&w=majority`;

function mongoSetup(collectionName) {
    return new MongoClient(url, config).connect().then(client => {
        const collection = client.db(dbName).collection(collectionName);
        return { collection, client };
    })
    .catch(err => console.log('mongo error : ', err));
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

module.exports = {
    mongoSetup,
    MongoQuery
};