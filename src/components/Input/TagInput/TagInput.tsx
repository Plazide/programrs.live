import React, { ReactElement, useEffect } from "react"
import Tags from "./Tags";

import styles from "./tagInput.module.css";
import Suggestions from "./Suggestions";
import { useTags } from "../../../hooks/useTags";


interface Props {
	label: string;
	options: (string | string[])[];
	placeholder?: string;
	onChange: (tags: string[]) => void;
}

export default function TagInput({ label, options, placeholder, onChange }: Props): ReactElement {
	const { 
		tags, 
		matches, 
		search,
		inputRef,
		handleChange, 
		handleInputKeyUp, 
		handleRemoveSelection, 
		handleSelection 
	} = useTags({ options });

	useEffect( () => {
		onChange(tags);
	}, [tags.length])

	return (
		<label className={styles.tagInput}>
			<span>{label}</span>
			<div className={styles.inputWrapper}>
				<Tags onRemove={handleRemoveSelection} tags={tags} />
				<input 
					type="text" 
					className={styles.input} 
					onKeyUp={handleInputKeyUp}
					onChange={handleChange}
					placeholder={tags.length === 0 ? placeholder : ""}
					value={search}
					ref={inputRef}
					aria-label="Search for technology"
				/>
			</div>
			<Suggestions matches={matches} onSelect={handleSelection} />
		</label>
	)
}