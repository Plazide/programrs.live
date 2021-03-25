import { ChangeEvent } from "react";
import styles from "./select.module.css";

export interface Option{
	label?: string;
	value: string;
}

interface Props{
	options: Option[];
	label: string;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	defaultValue?: string;
}

export default function Select({ label, options, onChange, defaultValue }: Props){
	return(
		<label className={styles.wrapper}>
			<span className={styles.label}>{label}</span>
			<select 
				defaultValue={defaultValue} 
				onChange={onChange}
				className={styles.select}
			>
				{
					options.map( ({ value, label }) => (
						<option
							value={value}
							key={value}
						>
							{label || value}
						</option>
					))
				}
			</select>
		</label>
	)
}