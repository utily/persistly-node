import * as Mongo from "mongodb"
import { Collection } from "./Collection"
import { Document } from "./Document"

export class Connection {
	private readonly database: Promise<Mongo.Db>
	private constructor (private client: Promise<Mongo.MongoClient>, database: string) {
		this.database = this.client.then(client => client.db(database))
	}
	get<T extends Document>(name: string, shard?: string): Collection<T> {
		return new Collection<T>(this.database.then(db => db.collection(name)), shard)
	}
	async close(): Promise<void> {
		await (await this.client).close()
	}
	static open(url: string, database: string): Connection {
		const client: Promise<Mongo.MongoClient> = Mongo.MongoClient.connect(url, { useNewUrlParser: true })
		return new Connection(client, database)
	}
}
