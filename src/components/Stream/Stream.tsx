import React, { ReactElement } from "react"
import Image from "next/image";
import { truncate } from "../../util/truncate";
import { useIsMobile } from "../../hooks/useIsMobile";

// Icons
import ViewersIcon from "../../icons/viewers.svg";
import TwitchLogo from "../../icons/twitch.svg";
import YouTubeLogo from "../../icons/youtube.svg"

// Styles
import styles from "./stream.module.css";
import formatDistanceStrict from "date-fns/formatDistanceStrict/index.js";

import { Stream as IStream } from "../../graphql/types";

interface StreamProps{
	stream: Omit<IStream, "_id" | "_ts">
}

export default function Stream({ stream }: StreamProps): ReactElement{
	const { thumbnail, channel, viewers, avatar, link, startedAt, title, service } = stream;
	const uptime = formatDistanceStrict(new Date(startedAt), new Date());
	const isMobile = useIsMobile();
	const titleLength = isMobile ? 55 : 45;

	return(
		<li className={styles.stream}>
			<div className={styles.imageWrapper}>
				<a 
					href={link}
					target="__blank"
					rel="noopener noreferrer"
				>
					<Image 
						src={thumbnail}
						alt={`${channel}'s thumbnail`}
						layout="responsive"
						height={189}
						width={336}
						className={styles.image}
					/>
				</a>
				<span className={styles.viewers}>
					<ViewersIcon className={styles.icon} />
					<span>{viewers}</span>
				</span>
				<span className={styles.service}>
					<Service 
						service={service} 
						className={styles.icon} 
					/>
				</span>
				<span className={styles.startedAt}>
					{uptime}
				</span>
			</div>
			<div className={styles.content}>
				<div className={styles.topRow}>
					<div className={styles.avatar}>
						{
							avatar 
								? <Image 
									className={styles.image}
									src={avatar}
									alt={`${channel}'s avatar`}
									width={35}
									height={35}
								/>
								: <div className={styles.initial}>
									{channel.substr(0, 1)}
								</div>
						}
					</div>
					<a 
						href={link} 
						className={styles.title}
						target="__blank"
						rel="noopener noreferrer"
						title={title}
					>
						{truncate(title, titleLength)}
					</a>
				</div>
				

				<a 
					href={link} 
					className={styles.user}
					target="__blank"
					rel="noopener noreferrer"
				>
					<span>{channel}</span>
				</a>
			</div>
		</li>
	)
}

function Service({ service, className = "" }: { service: "twitch" | "youtube", className?: string }){
	switch(service){
	case "twitch":
		return <TwitchLogo className={className} />
	case "youtube":
		return <YouTubeLogo className={className} />
	}
}
