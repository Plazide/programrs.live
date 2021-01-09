import React, { ReactElement } from "react"
import Image from "next/image";

// Types
import { Stream as IStream } from "node-twitch/dist/types/objects";

// Icons
import ViewersIcon from "../../icons/viewers.svg";
import UserIcon from "../../icons/user.svg";
import { truncate } from "../../util/truncate";

// Styles
import styles from "./stream.module.css";

interface StreamProps{
	stream: IStream
}

export default function Stream({ stream }: StreamProps): ReactElement{
	const thumbnail = stream.thumbnail_url.replace("{width}", "336").replace("{height}", "189");
	const streamUrl = `https://twitch.tv/${stream.user_name}`;

	return(
		<li className={styles.stream}>
			<div className={styles.imageWrapper}>
				<Image 
					src={thumbnail}
					alt={`${stream.user_name}'s thumbnail`}
					height={189}
					width={336}
				/>
			</div>
			<span className={styles.viewers}>
				<ViewersIcon className={styles.icon} />
				<span>{stream.viewer_count}</span>
			</span>
			<div className={styles.content}>
				<a 
					href={streamUrl} 
					className={styles.title}
					target="__blank"
					rel="noopener noreferrer"
				>
					{truncate(stream.title, 70)}
				</a>

				<a href={streamUrl} className={styles.user}>
					<UserIcon className={styles.icon} />
					<span>{stream.user_name}</span>
				</a>
			</div>
		</li>
	)
}
