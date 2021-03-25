import styles from "./tagInput.module.css";

interface SuggestionsProps{
	matches: string[];
	onSelect: (value: string) => void;
}

interface SuggestionProps{
	label?: string;
	value: string;
	onSelect: (value: string) => void;
}

export default function Suggestions({ matches, onSelect }: SuggestionsProps){
	return(
		<ul 
			className={styles.suggestions}
			aria-live="polite"
		>
			{
				matches.map( opt => (
					<Suggestion 
						onSelect={onSelect}
						value={opt}
						key={opt}
					/>
				))
			}
		</ul>
	)
}

export function Suggestion({ label, value, onSelect }: SuggestionProps){
	return<li>
		<button 
			className={[styles.suggestion, styles.tag].join(" ")}
			onClick={ () => onSelect(value)}
			type="button"
		>
			{label || value}
		</button>
	</li>
}