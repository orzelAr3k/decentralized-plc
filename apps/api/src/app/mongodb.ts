import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb://0.0.0.0:27017");
client.connect((err, conn) => {
    if(err) console.log(err);
    console.log('Connected to the configuration base!');
});

const db = client.db('DIOT');
export const configDB = db.collection('config');
export const logDB = db.collection('logs');
export const peersDB = db.collection('peers');