import { truncate } from "../src/util/truncate";
import { containsTech, extractTechnology } from "../src/util/tech";
import { isEqual, arrayIsEqual, objectIsEqual } from "../src/util/equality";

describe("util function tests", () => {
	describe("string functions", () => {
		test("truncates string", () => {
			const str = "A very long string that needs to be truncated";
			expect(truncate(str, 10)).toBe("A very...")
			expect(truncate(str, 20)).toBe("A very long strin...")
		});
	})
	
	describe("technology functions", () => {
		test("contains technology", () => {
			expect(containsTech("javascript", "Making a JavaScript bot with Node.js")).toBe(true)
		})
	
		test("extracts technologies", () => {
			const js = ["JavaScript", "NodeJS"];
			expect(extractTechnology("Making a JavaScript bot with Node.js"))
				.toEqual(expect.arrayContaining(js))
	
			expect(extractTechnology("Making a Discord bot with Python"))
				.toEqual(expect.not.arrayContaining(js))
	
			const cppExpect = expect(extractTechnology("Writing a CLI using C++"));
			cppExpect.toEqual(expect.arrayContaining(["C++"]))
			cppExpect.toEqual(expect.not.arrayContaining(["C"]))
	
			expect(extractTechnology("Building windows app with C#"))
				.toEqual(expect.arrayContaining(["C#"]))
	
			expect(extractTechnology("Building a really cool thing with C"))
				.toEqual(expect.arrayContaining(["C"]))
	
			expect(extractTechnology("Coding in C/C++/C#"))
				.toEqual(expect.arrayContaining(["C", "C++", "C#"]))
	
			expect(extractTechnology("Building a really cool web app with GCP/Node.js"))
				.toEqual(expect.arrayContaining(["Google Cloud Platform", "NodeJS"]))
	
			expect(extractTechnology("React/Next.js @ gunpoint"))
				.toEqual(expect.arrayContaining(["NextJS", "React"]))
		});
	});

	describe("equality functions", () => {
		test("object is equal", () => {

			expect(
				objectIsEqual(
					{ name: "Carl", age: 23 },
					{ name: "Carl", age: 23 }
				)
			).toBeTruthy();

			expect(
				objectIsEqual(
					{ name: "Carl", age: 23 },
					undefined
				)
			).toBeFalsy();

			expect(
				objectIsEqual(
					{ names: [ "Carl", "Leonard", "Albert" ] },
					{ names: [ "Carl", "Leonard", "Albert" ] }
				)
			).toBeTruthy()

			expect(
				objectIsEqual(
					null,
					null
				)
			).toBeFalsy()

			expect(
				objectIsEqual(
					{ name: "Carl", address: { street: "road", zip: 1200 } },
					{ name: "Carl", address: { street: "road", zip: 1200 } }
				)
			).toBeTruthy()
		})

		test("array is equal", () => {
			expect(
				arrayIsEqual(
					[null, null, null],
					[null, null, null]
				)
			).toBeTruthy()

			expect(
				arrayIsEqual(
					[],
					[]
				)
			).toBeTruthy();

			expect(
				arrayIsEqual(
					[ "Carl" ],
					[ "Charles" ]
				)
			).toBeFalsy();

			expect(
				arrayIsEqual(
					{},
					{}
				)
			).toBeFalsy()

			expect(
				arrayIsEqual(
					[ {} ],
					[]
				)
			).toBeFalsy()

			expect(
				arrayIsEqual(
					[ {} ],
					[ {} ]
				)
			).toBeTruthy()

			expect(
				arrayIsEqual(
					[ [ "Hello" ] ],
					[ [ "Hello" ] ]
				)
			).toBeTruthy()
		})

		test("value is equal", () => {
			expect(
				isEqual("name", "name")
			).toBeTruthy()

			expect(
				isEqual({ name: "Carl" }, { name: "Carl" })
			).toBeTruthy()

			expect(
				isEqual(null, undefined)
			).toBeFalsy();

			expect(
				isEqual(null, null)
			).toBeTruthy()

			expect(
				isEqual(0, 0)
			).toBeTruthy()
		})
	})
})
