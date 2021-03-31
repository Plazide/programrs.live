import { Cache, Data, FieldInfo, ResolveInfo, Variables } from "@urql/exchange-graphcache";
const ensureKey = (x: any): string | null => (typeof x === "string" ? x : null);

function getData(current: FieldInfo, entityKey: string, cache: Cache){
	const { fieldKey } = current;
	
	const link = ensureKey(cache.resolve(entityKey, fieldKey));
	if(!link) return [];

	const newData = cache.resolve(link, "data") as string[];
	return newData;
}

export function pagination(field: string, typename: string){
	return  (_: Data, fieldArgs: Variables, cache: Cache, info: ResolveInfo) => {
		const { parentKey: entityKey, fieldName } = info;
		const allFields = cache.inspectFields(entityKey);
		const fieldInfos = allFields.filter(info => 
			info.fieldName === fieldName
		);

		if(!fieldInfos || fieldInfos.length === 0) return undefined

		const prevInfo = fieldInfos.slice(-2)[0];
		const currInfo = fieldInfos.slice(-1)[0];

		const oldArgs = prevInfo.arguments;

		const newCursor = fieldArgs._cursor;
		const oldCursor = oldArgs._cursor;
		const shouldAppend = newCursor !== null && newCursor !== undefined && newCursor !== oldCursor;

		if(!shouldAppend && fieldInfos.length > 1) 
			cache.invalidate(entityKey, field, oldArgs)

		const size = fieldInfos.length;
		if (size === 0) {
			return undefined;	
		}

		const data = shouldAppend 
			? fieldInfos.flatMap( (current) => getData(current, entityKey, cache)) 
			: getData(currInfo, entityKey, cache);

		return {
			__typename: typename,
			data
		}
	}
}