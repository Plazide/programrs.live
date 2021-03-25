import { escapeRegExp } from "./string";
import tech from "../models/technologies";

export function extractTechnology(str: string): string[]{
	const matches = tech.filter( tech => {
		if(Array.isArray(tech)){
			const match = tech.find( variant => {
				return containsTech(variant, str);
			});

			return match !== undefined;
		}

		return containsTech(tech, str);
	})
	const technologies = matches.map( match => {
		if(Array.isArray(match))
			return match[0];
		
		return match;
	})

	return technologies;
}

export function containsTech(tech: string, str: string){
	const cLang = tech.toLowerCase() === "c++" || tech.toLowerCase() === "c#";
	const escaped = escapeRegExp(tech.replace(/\./g, "dot"));
	const expression = cLang ? `\\b${escaped}` : `\\b${escaped}(?![+]{2})\\b`
	const regex = new RegExp(expression, "i");

	return regex.test(str.replace(/\./g, "dot"));
}