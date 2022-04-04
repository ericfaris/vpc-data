require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

module.exports = {

    connect: async () => {
        const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.blwxx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        return await client.connect();
    },

    getCollection: async (client, collectionName) => {
        const collections = await client.db(DB_NAME).collections();
        if (!collections.some((collection) => collection.collectionName === collectionName)) {
            client.db(DB_NAME).createCollection(collectionName);
        }

        return client.db(DB_NAME).collection(collectionName);
    },

    getAll: async (collectionName) => {
        let findResult;

        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        findResult = await collection.find({}).toArray();
        client.close();

        return findResult;
    },

    generateObjectId: () => {
        return new ObjectId();
    },

    insertOne: async (doc, collectionName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        await collection.insertOne(doc);
        client.close();
    },

    insertMany: async (docs, collectionName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        await collection.insertMany(docs);
        client.close();
    },

    find: async (filter, collectionName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        const docs = await collection.find(filter).toArray();
        client.close();
        return docs;
    },

    findOne: async (filter, collectionName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        const doc = await collection.findOne(filter);
        client.close();
        return doc;
    },

    findOneAndUpdate: async (filter, update, options, collectionName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        const doc = await collection.findOneAndUpdate(filter, update, options);
        client.close();
        return doc;
    },

    findCurrentWeek: async (collectionName, channelName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        const doc = await collection.findOne({ isArchived: false, channelName: channelName});
        client.close();
        return doc;
    },

    updateOne: async (filter, update, options, collectionName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        await collection.updateOne(filter, update, options);
        client.close();
    },

    deleteAll: async (collectionName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        await collection.deleteMany({});
        client.close();
    },

    aggregate: async(pipeline, collectionName) => {
        const client = await module.exports.connect();
        const collection = await module.exports.getCollection(client, collectionName)
        const docs = await collection.aggregate(pipeline).toArray();
        client.close();
        return docs;
    }
}