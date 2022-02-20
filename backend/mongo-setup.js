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

function findQuery(collection, filter) {
    return collection.find(filter).toArray();
}
function insertOne(collection, doc) {
    return collection.insertOne(doc);
}
function findOneAndUpdate(collection, filter, doc) {
    doc['_id'] = getObjectId(doc['_id']);
    return collection.findOneAndUpdate(filter, {
        $set: doc
    }).then((response) => {
        if (!response.value) {
            throw new Error('Data Not found');
        }
        return response;
    });
}
function deleteById(collection, id) {
    return collection.deleteOne({ '_id': ObjectId(id)});
}

function getObjectId(id) {
    return ObjectId(id);
}

module.exports = {
    mongoSetup,
    getObjectId,
    findQuery,
    insertOne,
    findOneAndUpdate,
    deleteById
};

/**

const collection = db.collection(collectionName);
collection.find().toArray((err, docs) => {
    console.log('docs : ', docs.length);
    client.close();
});

**/