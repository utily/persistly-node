import * as model from "persistly-model"
export namespace Action {
	export function extract<T>(action: model.Update.Action<T> | any): model.Update.Action<T> | undefined {
		const result: model.Update.Action<T> | undefined = model.Update.Action.is(action) ? {} : undefined
		if (result) {
			if ("$set" in action)
				result.$set = clear(action.$set)
			if ("$unset" in action)
				result.$unset = action.$unset
			if ("$push" in action)
				result.$push = clear(action.$push)
			if ("$addToSet" in action)
				result.$addToSet = clear(action.$addToSet)
		}
		return result
	}
}
function clear(value: any): any {
	if (Array.isArray(value))
		value = value.filter(v => v != undefined && v != null).map(clear)
	else if (value && typeof value == "object")
		for (const entry of Object.entries(value)) {
			if (entry[1] == undefined || entry[1] == null)
				delete value[entry[0]]
			else if (typeof entry[1] == "object")
				value[entry[0]] = clear(entry[1])
		}
	return value
}
