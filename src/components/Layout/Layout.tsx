import { ReactElement, ReactNode } from "react"
import Logo from "../../images/logo.svg";
import site from "../../models/site.config";

import styles from "./layout.module.css";

interface Props {
	children: ReactNode
}

export default function Layout({ children }: Props): ReactElement {
	return (
		<>
			<header className={styles.header}>
				<div className={styles.content}>
					<div className={styles.logo}>
						<Logo className={styles.icon} />
						<span className={styles.title}>Programrs</span>
					</div>
					

					<div className={styles.links}>
						<a
							href={site.github}
						>
							<img 
								src="/github-light.png"
								className={styles.icon} 
							/>
						</a>
					</div>
				
				</div>
				
			</header>
			<main className={styles.main}>{children}</main>
		</>
	)
}
