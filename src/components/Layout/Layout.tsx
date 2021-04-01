import { ReactElement, ReactNode } from "react"

import styles from "./layout.module.css";

interface Props {
	children: ReactNode
}

export default function Layout({ children }: Props): ReactElement {
	return (
		<>
			<header className={styles.header}></header>
			<main className={styles.main}>{children}</main>
		</>
	)
}
