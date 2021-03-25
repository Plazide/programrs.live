/** Truncates a string to the specified length. 
 * @param str - The string to truncate
 * @param length - The length of the resulting string, including the trailing characters.
 * @param trail - The trial showing that the string is truncated. Default: "..."
 */
export function truncate(str: string, length: number, trail = "..."){
	return str.length > length ? str.slice(0, length - trail.length).trimEnd() + trail: str;
}

/**
 * Transforms the first letter in a string to be uppercase.
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(str: string): string{
	return str[0].toUpperCase() + str.substr(1);
}

/**
 * Tranforms the first letter of a str to be lowercase.
 * @param str - The string to un-capitalize
 * @returns - An un-capitalized string
 */
export function unCapitalize(str: string): string{
	return str[0].toLowerCase() + str.substr(1);
}

export function escapeRegExp(str: string){
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}