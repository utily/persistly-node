import {
	Collection as modelCollection,
	Command,
	Connection as modelConnection,
	Document,
	Filter,
	Key,
	Options,
	Update,
} from "persistly-model"
import { Collections } from "./Collections"
import { Connection as NodeConnection } from "./Connection"
import { Event } from "./Event"
import { TestConnection } from "./TestConnection"

export { Command, Collections, Document, Filter, Key, Options, Update, TestConnection }

export interface Collection<T extends Document, Shard extends keyof T & string> extends modelCollection<T> {
	readonly updated: Event<T[Shard][]>
}
export interface Connection extends modelConnection {
	get<T extends Document, Shard extends keyof T & string>(
		name: string,
		shard: Shard,
		idLength: 4 | 8 | 12 | 16
	): Promise<Collection<T, Shard> | undefined>
}
export namespace Connection {
	export const open = NodeConnection.open
}
