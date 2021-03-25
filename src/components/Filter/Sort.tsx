import { ChangeEvent } from "react";
import { EnumOrder, EnumSorting } from "../../graphql/types";
import Select, { Option } from "../Input/Select/Select";

interface Props{
	sorting: EnumSorting;
	order: EnumOrder;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Sort({ sorting, order, onChange }: Props){
	const options = [
		{ value: "viewers-asc", label: "Least viewers" },
		{ value: "viewers-desc", label: "Most viewers" },
		{ value: "startedAt-asc", label: "Longest uptime" },
		{ value: "startedAt-desc", label: "Shortest uptime" }
	] as Option[]

	return(
		<Select 
			options={options}
			label="Sort by"
			onChange={onChange}
			defaultValue={`${sorting}-${order}`}
		/>
	)
}