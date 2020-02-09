import { Db, MongoClient } from 'mongodb';
import { Maybe } from '../Utils/Maybe';

class Client {
    private static _db: Db;

    static get db(): Db {
        return Client._db;
    }

    static set db(value: Db) {
        Client._db = value;
    }

    private static _connection: MongoClient;

    static get connection(): MongoClient {
        return Client._connection;
    }

    static set connection(value: MongoClient) {
        Client._connection = value;
    }

    static async connect(): Promise<Maybe<Db>> {
        console.log('Trying to connect...');
        if (this.db) {
            console.log('Already connected, returning DB');
            return this.db;
        }
        console.log('Creating new connection');
        this.connection = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = this.connection.db(process.env.MONGO_DATABASE_NAME);
        return this.db;
    }

    static async close(): Promise<void> {
        await this.connection.close();
    }
}

export default Client;
