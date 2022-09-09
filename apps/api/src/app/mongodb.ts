import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb://localhost:27017");
client.connect((err, conn) => {
    if(err) console.log(err);
    console.log('Connected to the configuration base!');
});

const db = client.db('DIOT');
export const configDB = db.collection('config');
export const logDB = db.collection('logs');