import * as model from "persistly-model"
import { Update } from "./index"

describe("Update", () => {
	it("toMongo", () => {
		const argument: model.Update<{ name: string; field: number; property: { nested: number }; remove: number }> = {
			name: "test",
			field: { $set: 1337 },
			property: { nested: 42 },
			remove: { $unset: true },
		}
		const filter = Update.toMongo(argument)
		expect(filter).toEqual({ $set: { name: "test", field: 1337, "property.nested": 42 }, $unset: { remove: true } })
	})
	it("addToSet", () => {
		const argument: model.Update<{
			name: string
			field: number
			property: { nested: number }
			remove: number
			event: number[]
		}> = {
			name: "test",
			field: { $set: 1337 },
			property: { nested: 42 },
			remove: { $unset: true },
			event: { $addToSet: [1, 2] },
		}
		const filter = Update.toMongo(argument)
		expect(filter).toEqual({
			$set: { name: "test", field: 1337, "property.nested": 42 },
			$unset: { remove: true },
			$addToSet: { event: [1, 2] },
		})
	})
	it("testRemoval", () => {
		const argument: model.Update<{ name: string; field: number; property: { nested: number }; remove: number }> = {
			name: "test",
			field: { $set: null },
			property: { nested: null },
			remove: { $unset: true },
		}
		const filter = Update.toMongo(argument)
		expect(filter).toEqual({ $set: { name: "test" }, $unset: { remove: true } })
	})
	it("Filter Update split", () => {
		const argument = {
			id: "ab01",
			shard: { $eq: "shard01" },
			field: { nested: { $eq: 42 }, $set: 1337 },
			other: { value: 13.37 },
			not: false,
			name: "test",
			property: { nested: 42 },
			remove: { $unset: true },
			filter: { $eq: 42 },
			range: { $gt: 42, $lte: 1337 },
			array: ["element0", "element1"],
		}
		const update = Update.toMongo(argument, "id", "shard")
		expect(update).toEqual({
			$set: { name: "test", field: 1337, "property.nested": 42, "other.value": 13.37, not: false },
			$unset: { remove: true },
			$push: { array: { $each: ["element0", "element1"] } },
		})
	})
})
