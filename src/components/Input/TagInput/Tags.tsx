import { KeyboardEvent } from "react";
import styles from "./tagInput.module.css"
import CloseIcon from "../../../icons/close.svg";

interface TagsProps{
	tags: string[];
	onRemove: (value: string) => void;
}

interface TagProps{
	value: string;
	onRemove: (value: string) => void;
}

export default function Tags({ tags, onRemove }: TagsProps){
	return (
		<ul 
			className={styles.selectedTags} 
			aria-live="polite"
			aria-label="Selected technologies"
		>
			{tags.map( (tag, index) => (
				<Tag 
					key={index} 
					value={tag} 
					onRemove={onRemove} 
				/>
			))}
		</ul>
	)
}

export function Tag({ value, onRemove }: TagProps){
	function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>){
		const { key } = e;
		if(key === "Backspace"){
			e.preventDefault();
			onRemove(value);
		}
	}

	return(
		<li>
			<button 
				onClick={ () => onRemove(value)}
				onKeyDown={handleKeyDown}
				className={styles.tag}
				aria-label="Remove technology"
				type="button"
			>
				<span className={styles.value}>{value}</span>
				<CloseIcon className={styles.icon} />
			</button>
		</li>
	)
}