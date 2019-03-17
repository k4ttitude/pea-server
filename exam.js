const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'pea-server';

const client = new MongoClient(url);

client.connect(err => {
    assert.equal(null, err);
    console.log('Connected successfully to server');
    
    const db = client.db(dbName);

    client.close();
});