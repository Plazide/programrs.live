import { truncate } from "../util/truncate";

describe("util function tests", () => {
	test("truncates string", () => {
		const str = "A very long string that needs to be truncated";
		expect(truncate(str, 10)).toBe("A very...")
		expect(truncate(str, 20)).toBe("A very long strin...")
	});
})
