import { ReactElement, ReactNode } from "react"

import styles from "../../styles/Layout.module.css";

interface Props {
	children: ReactNode
}

export default function Layout({ children }: Props): ReactElement {
	return (
		<>
			<header className={styles.header}></header>
			<main>{children}</main>
		</>
	)
}
