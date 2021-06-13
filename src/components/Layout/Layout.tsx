import { ReactElement, ReactNode } from "react"
import Logo from "../../images/logo.svg";

import styles from "./layout.module.css";

interface Props {
	children: ReactNode
}

export default function Layout({ children }: Props): ReactElement {
	return (
		<>
			<header className={styles.header}>
				<div className={styles.content}>
					<Logo className={styles.logo} />
					<span className={styles.title}>Programrs</span>
				</div>
			</header>
			<main className={styles.main}>{children}</main>
		</>
	)
}
