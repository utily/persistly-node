import * as model from "persistly-model"
import * as mongo from "mongodb"

export namespace Update {
	function update<T>(
		query: mongo.UpdateQuery<T>,
		operation: model.Update.Action.Operator,
		field: string,
		value: any
	): mongo.UpdateQuery<T> {
		const r: { [f: string]: any } = query[operation] ?? {}
		r[field] = value
		query[operation] = r as any
		return query
	}
	export function toMongo<T>(update: model.Update<T>, ...suppress: (string | undefined)[]): mongo.UpdateQuery<T> {
		const result: mongo.UpdateQuery<T> = {}
		for (const field in update)
			if (Object.prototype.hasOwnProperty.call(update, field) && !suppress.some(s => s == field)) {
				const value = update[field]
				toMongoUpdate(result, field, value)
			}
		return result
	}
	function toMongoUpdate<T>(query: mongo.UpdateQuery<T>, prefix: string, value: any) {
		if (Array.isArray(value))
			update(query, "$push", prefix, { $each: value.filter(v => v != undefined) })
		else if (typeof value != "object" && value != undefined)
			update(query, "$set", prefix, value)
		else
			for (const field in value) {
				if (Object.prototype.hasOwnProperty.call(value, field)) {
					const v = value[field]
					if (model.Update.Action.Operator.is(field) && v != undefined)
						update(query, field, prefix, v)
					else if (!field.startsWith("$"))
						toMongoUpdate(query, prefix + "." + field, v)
				}
			}
	}
}
