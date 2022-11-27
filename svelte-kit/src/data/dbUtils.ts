import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

const dbName = env.DB_NAME;
const connString = env.MONGO_CONNECTION!;

export async function getDbConnection() {
	let client = await MongoClient.connect(connString);
	let db = await client.db(dbName);

	return { client, db };
}
