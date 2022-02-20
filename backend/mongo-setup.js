const { MongoClient, ObjectId } = require('mongodb');

const dbName = 'Portfolio';
const url = 'mongodb://localhost:27017';

function mongoSetup(collectionName) {
    return MongoClient.connect(url).then(client => {
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

module.exports = {
    mongoSetup,
    getObjectId,
    findQuery,
    insertOne,
    findByIdAndUpdate,
    deleteById
};

/**

const collection = db.collection(collectionName);
collection.find().toArray((err, docs) => {
    console.log('docs : ', docs.length);
    client.close();
});

**/