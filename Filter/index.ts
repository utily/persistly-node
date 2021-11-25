import * as model from "persistly-model"
import * as mongo from "mongodb"
import { Condition } from "./Condition"

export namespace Filter {
	export function toMongo<T>(
		filter: model.Filter<T>,
		...prioritized: (string | undefined)[]
	): mongo.QuerySelector<T> & Partial<model.Document> {
		const result: any = {}
		let field: keyof model.Filter<T>
		for (field in filter)
			if (Object.prototype.hasOwnProperty.call(filter, field)) {
				const value = filter[field]
				const r = model.Filter.Condition.is(value)
					? Condition.toMongo(value)
					: typeof value == "object"
					? Filter.toMongo(value as any, prioritized?.[0] == "*" ? "*" : undefined)
					: prioritized?.[0] == "*" || prioritized.some(p => p == field)
					? value
					: undefined
				if (r != undefined && !(Object.keys(r).length == 0 && r.constructor == Object))
					result[field] = r
			}
		return toDotNotation(result)
	}
}
function toDotNotation(value: Record<string, any>): Record<string, any> {
	const result: Record<string, any> = {}
	for (const key of Object.keys(value)) {
		if (!Array.isArray(value[key]) && typeof value[key] == "object")
			Object.entries(toDotNotation(value[key])).forEach(entry =>
				entry[0].charAt(0) == "$" || key.charAt(0) == "$"
					? (result[key] = { ...result[key], [entry[0]]: entry[1] })
					: (result[key + "." + entry[0]] = entry[1])
			)
		else
			result[key] = value[key]
	}
	return result
}
