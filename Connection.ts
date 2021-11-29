import * as model from "persistly-model"
import * as Mongo from "mongodb"
import { Collection } from "./Collection"
import { Event } from "./Event"

export class Connection implements model.Connection {
	private client: Promise<Mongo.MongoClient | undefined>
	private readonly database: Promise<Mongo.Db | undefined>
	constructor(url: Promise<string>, database?: Promise<string>) {
		this.client = url.then(u => Mongo.MongoClient.connect(u, { useNewUrlParser: true })).catch(() => undefined)
		this.database = this.client
			.then(async c => (c ? c.db(database ? await database : undefined) : undefined))
			.catch(() => undefined)
	}
	async get<T extends model.Document, Shard extends keyof T & string>(
		name: string,
		shard: Shard,
		idLength: 4 | 8 | 12 | 16 = 16
	): Promise<(model.Collection<T> & { readonly updated: Event<T[Shard][]> }) | undefined> {
		const database = await this.database
		return database ? new Collection<T, Shard>(database.collection(name), shard, idLength) : undefined
	}
	async close(): Promise<void> {
		const client = await this.client
		if (client)
			await client.close()
	}
}
export namespace Connection {
	export function open(url: string, database?: string): Connection {
		return new Connection(Promise.resolve(url), database ? Promise.resolve(database) : undefined)
	}
}
