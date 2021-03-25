import React, { ReactElement, useEffect } from "react"
import TagInput from "../Input/TagInput/TagInput";
import styles from "./filter.module.css";
import tech from "../../models/technologies";
import Sort from "./Sort";
import Language from "./Language";
import { useFilter, State } from "../../hooks/useFilter";

interface Props {
	langs: string[];
	onChange: (filter: State) => void;
}

export default function Filter({ langs, onChange }: Props): ReactElement {
	const{
		state,
		sorting,
		order,
		filter,
		onLangChange,
		onSortChange,
		onTagsChange
	} = useFilter();

	useEffect( () => {
		onChange(state);
	}, [sorting, order, filter?.language, filter?.tech?.length])

	return (
		<div className={styles.filter}>
			<fieldset>
				<Sort 
					sorting={sorting} 
					order={order} 
					onChange={onSortChange} 
				/>

				<Language 
					language={filter?.language}
					onChange={onLangChange}
					langs={langs}
				/>
				
				<TagInput 
					label="Technologies" 
					options={tech}
					placeholder="Search (ie. js, python, c++)" 
					onChange={onTagsChange}
				/>
			</fieldset>
		</div>
	)
}
