const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'pea-server';

const client = new MongoClient(url, { useNewUrlParser: true });

const connectDatabase = async todo => {
    let _client, db;

    _client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = _client.db(dbName);
    try {
        await todo(db);
    } finally {
        _client.close();
    }
}

const addStudent = async id => {
    let _client, db;

    _client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = _client.db(dbName);
    try {
        let student = { memberCode: id };
        await db.collection('student').insertOne(student, (err, r) => {
            if (err) {
                // return false;
            }
        });
    } finally {
        _client.close();
    }
}

const addExam = async (code) => {
    let _client, db;

    _client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = _client.db(dbName);
    try {
        let exam = { examCode: code, online: false };
        await db.collection('exam').insertOne(exam, (err, r) => {
            if (err) {
                // return false;
            }
        });
    } finally {
        _client.close();
    }
}

const openExam = async code => {
    let _client, db;

    _client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = _client.db(dbName);
    try {
        let exam = { examCode: code };
        await db.collection('exam').updateOne(exam, {$set: { online: true }}, (err, r) => {
            if (err) {
                // return false;
                console.log(err);
            }
        });
    } finally {
        _client.close();
    }
}

const closeExam = async code => {
    let _client, db;

    _client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = _client.db(dbName);
    try {
        let exam = { examCode: code };
        await db.collection('exam').updateOne(exam, {$set: { online: false }}, (err, r) => {
            if (err) {
                // return false;
                console.log(err);
            }
        });
    } finally {
        _client.close();
    }
}

const verifyExamCode = async (code) => {
    let _client, db;

    _client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = _client.db(dbName);
    try {
        const _ = await db.collection('exam').find({ examCode: code, online: true }).toArray();
        return _.length > 0;
    } finally {
        _client.close();
    }
}

module.exports = {
    connectDatabase,
    addStudent,
    addExam,
    verifyExamCode,
    openExam,
    closeExam,
}