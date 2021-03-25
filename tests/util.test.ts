import { truncate } from "../src/util/truncate";
import { containsTech, extractTechnology } from "../src/util/tech";

describe("util function tests", () => {
	test("truncates string", () => {
		const str = "A very long string that needs to be truncated";
		expect(truncate(str, 10)).toBe("A very...")
		expect(truncate(str, 20)).toBe("A very long strin...")
	});

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
	})
})
