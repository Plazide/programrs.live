import React, { HTMLProps, ReactElement } from "react"

interface Props extends HTMLProps<HTMLInputElement> {
	label: string;
}

export default function Input(props: Props): ReactElement {
	const { label } = props;

	return (
		<label>
			<span>{label}</span>
			<input
				{...props}
			/>
		</label>
		
	)
}
