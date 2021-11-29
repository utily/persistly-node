import { Collections } from "./index"
import * as orders from "./order.json"

describe("Collections", () => {
	it("open non-existing", () => {
		const connection = Collections.connect(
			{ order: orders },
			{ collections: { order: { shard: "merchant", idLength: 8 } }, cache: "order", cached: ["order", "user"] }
		)
		expect(connection).toBeTruthy()
	})
	// it("open real", async () => {
	// 	const db = process.env.database
	// 	if (db) {
	// 		const connection = persistly.Connection.open(db)
	// 		expect(connection).toBeTruthy()
	// 		const merchant = await connection.get<{ id: string } & any, "id">("merchant", "id", 4)
	// 		expect(merchant).toBeTruthy()
	// 		await connection.close()
	// 	}
	// })
})
