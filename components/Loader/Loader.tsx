import React, { ReactElement } from "react"
import styles from "./loader.module.css";

interface Props {
	size?: "small" | "medium" | "large";
}

export default function Loader({ size = "small" }: Props): ReactElement {
	const classNames = [
		styles.container,
		styles[size]
	].join(" ");

	return (
		<div className={classNames}></div>
	)
}
