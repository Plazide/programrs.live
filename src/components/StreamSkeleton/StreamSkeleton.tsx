import React, { ReactElement } from "react"

import styles from "./streamSkeleton.module.css";

export default function StreamSkeleton(): ReactElement {
	return (
		<li className={styles.stream}>
			<div className={[styles.image, styles.placeholder].join(" ")}></div>
			<div className={styles.content}>
				<div className={[styles.title, styles.placeholder].join(" ")}></div>
				<div className={[styles.user, styles.placeholder].join(" ")}></div>
			</div>
		</li>
	)
}
