import { useRef, useState, ChangeEvent, KeyboardEvent } from "react";
import { escapeRegExp } from "../util/string";

interface Options{
	options: (string | string[])[];
}

export function useTags({ options }: Options){
	const inputRef = useRef<HTMLInputElement>(null);
	const [search, setSearch] = useState("");
	const[tags, setTags] = useState([]);

	const matches = search ? matchTags(search, options) : []

	function handleChange(e: ChangeEvent<HTMLInputElement>){
		const value = e.currentTarget.value;
		setSearch(value);
	}

	function handleInputKeyUp(e: KeyboardEvent<HTMLInputElement>){
		const { key } = e;
		const selectKeys = [" ", "Enter"];
		const removeKeys = ["Backspace"];

		if(selectKeys.includes(key)){
			const match = matches[0];
			if(match) handleSelection(match);
		}

		if(removeKeys.includes(key))
			handleRemoveSelection(tags[tags.length - 1]);

	}

	function handleSelection(value: string){
		if(!tags.includes(value)){
			setTags([...tags, value]);
			setSearch("");
			inputRef.current.focus();
		}
	}

	function handleRemoveSelection(value: string){
		const newTags = tags.filter( tag => tag !== value);
		setTags(newTags);
		inputRef.current.focus();
	}

	return{
		matches,
		tags,
		search,
		inputRef,
		handleChange,
		handleInputKeyUp,
		handleSelection,
		handleRemoveSelection
	}
}

function matchTags(search: string, options: (string | string[])[]){
	const term = escapeRegExp(search)

	return options.filter( option => {
		if(Array.isArray(option)){
			return option.find( tech => new RegExp(`^${term}`, "i").test(tech));
		}

		return new RegExp(`^${term}`, "i").test(option);
	}).map( option => {
		if(Array.isArray(option))
			return option[0];
		
		return option;
	})
}