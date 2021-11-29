import * as authly from "authly"
import * as model from "persistly-model"
import * as persistly from "../index"

export class Collections {
	private collections: {
		[name: string]: Promise<persistly.Collection<Document & any, string & any> | undefined> | undefined
	} = {}
	private constructor(
		private readonly congfiguration: Collections.Configuration,
		private readonly connection: persistly.Connection | undefined,
		private readonly data?: Record<string, Record<string, any>[] | undefined>
	) {}
	get<T extends model.Document, Shard extends keyof T & string>(
		name: string
	): Promise<persistly.Collection<T, Shard> | undefined> {
		const shard = this.congfiguration.collections[name].shard as Shard
		const idLength = this.congfiguration.collections[name].idLength
		const collection = this.collections[name]
		return collection
			? Promise.resolve(collection)
			: (this.collections[name] =
					this.connection && idLength
						? this.connection.get<T, Shard>(name, shard, idLength).then(async c => {
								if (c && this.data)
									await c.create((this.data[name] ?? []) as T[])
								if (c && (name == "order" || name == "log" || name == "account"))
									c.updated.listen(async shards =>
										(await this.get<Cache, "merchant">(this.congfiguration.cache))?.delete({
											collection: name,
											[this.congfiguration.collections[this.congfiguration.cache].shard]: { $in: shards },
										})
									)
								return c
						  })
						: Promise.resolve(undefined))
	}
	async close(): Promise<void> {
		if (this.connection)
			await this.connection.close()
	}
	static connect(
		url: string | undefined | Record<string, Record<string, any>[] | undefined>,
		configuration: Collections.Configuration
	): Collections {
		return typeof url == "string"
			? new Collections(configuration, persistly.Connection.open(url))
			: new Collections(configuration, persistly.TestConnection.create(), url)
	}
}

export namespace Collections {
	export interface Configuration {
		collections: Record<string, { shard: string; idLength?: 4 | 8 | 12 | 16 }>
		cached: string[]
		cache: string
	}
}
export interface Cache {
	id: authly.Identifier
	collection: "order" | "log" | "account"
	merchant: authly.Identifier
}
