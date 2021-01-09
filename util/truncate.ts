
/** Truncates a string to the specified length. 
 * @param str - The string to truncate
 * @param length - The length of the resulting string, including the trailing characters.
 * @param trail - The trial showing that the string is truncated. Default: "..."
 */
export function truncate(str: string, length: number, trail = "..."){
	return str.length > length ? str.slice(0, length) + trail: str;
}