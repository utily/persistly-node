import * as model from "persistly-model"
import * as mongo from "mongodb"

export namespace Condition {
	export function toMongo<T>(condition: model.Filter.Condition<T>): mongo.QuerySelector<T> | any {
		let result: mongo.QuerySelector<T> | any = {}
		if (Object.prototype.hasOwnProperty.call(condition, "$eq"))
			result = condition.$eq
		if (Object.prototype.hasOwnProperty.call(condition, "$gt"))
			result.$gt = condition.$gt
		if (Object.prototype.hasOwnProperty.call(condition, "$gte"))
			result.$gte = condition.$gte
		if (Object.prototype.hasOwnProperty.call(condition, "$in"))
			result.$in = condition.$in
		if (Object.prototype.hasOwnProperty.call(condition, "$lt"))
			result.$lt = condition.$lt
		if (Object.prototype.hasOwnProperty.call(condition, "$lte"))
			result.$lte = condition.$lte
		if (Object.prototype.hasOwnProperty.call(condition, "$ne"))
			result.$ne = condition.$ne
		if (Object.prototype.hasOwnProperty.call(condition, "$nin"))
			result.$nin = condition.$nin
		if (Object.prototype.hasOwnProperty.call(condition, "$isset"))
			result.$exists = condition.$isset
		return result
	}
}
