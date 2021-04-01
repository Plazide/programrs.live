import React, { ReactElement, useEffect } from "react"
import TagInput from "../Input/TagInput/TagInput";
import styles from "./filter.module.css";
import tech from "../../models/technologies";
import Sort from "./Sort";
import Language from "./Language";
import { useFilter, State } from "../../hooks/useFilter";
import { useIsMobile } from "../../hooks/useIsMobile";

// Icons
import FilterIcon from "../../icons/filter.svg";
import { useState } from "react";

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
	const isMobile = useIsMobile();
	const [show, setShow] = useState(false);

	useEffect( () => {
		onChange(state);
	}, [sorting, order, filter?.language, filter?.tech?.length])

	return (
		<div className={styles.filter}>
			<fieldset className={[
				styles.options, 
				(show ? styles.show : styles.hide)
			].join(" ")}>
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


			{isMobile 
				? <button
					onClick={ () => setShow(!show)}
					className={styles.button}
				>
					<FilterIcon className={styles.icon} /> 
					{!show ? "Show filter" : "Hide filter"}
				</button>
				: null
			}
		</div>
	)
}
