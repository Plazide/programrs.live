import { ChangeEvent } from "react";
import Select, { Option } from "../Input/Select/Select";

interface Props{
	language?: string;
	langs: string[];
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Language({ language, onChange, langs }: Props){
	const options = [{ value: "all", label: "All" }, ...langs.map( lang => ({
		value: lang
	}))] as Option[];

	return(
		<Select 
			options={options}
			label="Spoken language"
			onChange={onChange}
			defaultValue={language}
		/>
	)
}