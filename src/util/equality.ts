
export function isEqual(value1: unknown, value2: unknown): boolean{
	if(typeof value1 !== typeof value2) return false;
	if(value1 === value2) return true;
	if(typeof value1 === "object" && typeof value2 === "object") return objectIsEqual(value1, value2);
	if(Array.isArray(value1)) return arrayIsEqual(value1, value2);

	return false;
}

export function arrayIsEqual(arr1: unknown, arr2: unknown){
	if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
	if(arr1.length !== arr2.length) return false;

	return arr1.every( (value1, index) => {
		const value2 = arr2[index];
		return isEqual(value1, value2);
	})
}

/**
 * Compare two objects deeply, not just referential equality. Passing `null` or `undefined` values will return `false`.
 * @param obj1 The first object to compare
 * @param obj2 The second object to compare
 * @returns {boolean} `true` if equal, `false` if not equal
 */
export function objectIsEqual(obj1: { [key: string]: unknown } | object, obj2: { [key: string]: unknown } | object): boolean{
	if(obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) return false;
	if(typeof obj1 !== "object" || typeof obj2 !== "object") return false;

	return Object.entries(obj1).every( ([key, value1]) => {
		const value2 = obj2[key];

		return isEqual(value1, value2);
	})
}