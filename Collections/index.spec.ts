import * as persistly from "../index"
import { orders } from "./order"

jest.setTimeout(50000)
describe("Collections", () => {
	let testCollection: persistly.Collections
	it("Connect test collection", async () => {
		testCollection = persistly.Collections.connect(
			{ order: orders },
			{ collections: { order: { shard: "merchant", idLength: 16 } }, cache: "cache", cached: ["order"] }
		)
		expect(testCollection).toBeTruthy()
	})
	it("Test collection list orders", async () => {
		const orderCollection = await testCollection.get("order")
		const list = await orderCollection?.list()
		expect(list).toStrictEqual(orders)
	})
	it("open real", async () => {
		const db = process.env.database
		if (db) {
			const collection = persistly.Collections.connect(db, {
				collections: { merchant: { shard: "id", idLength: 4 } },
				cache: "cache",
				cached: ["order"],
			})
			expect(collection).toBeTruthy()
			const merchant = await collection.get<{ id: string } & any, "id">("merchant")
			expect(merchant).toBeTruthy()
			await collection.close()
		}
	})

	afterAll(async done => {
		await testCollection.close()
		done()
	})
})
