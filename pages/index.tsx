import Head from "next/head"
import Layout from "../components/Layout/Layout"
import styles from "../styles/Home.module.css"
import useSWR from "swr";

// Types
import { Stream as IStream } from "node-twitch/dist/types/objects";

// Icons
import ViewersIcon from "../icons/viewers.svg";
import UserIcon from "../icons/user.svg";
import { truncate } from "../util/truncate";
import StreamSkeleton from "../components/StreamSkeleton/StreamSkeleton";

interface StreamProps{
	stream: IStream
}

async function fetcher(path: string){
	const response = await fetch(path);
	return response.json();
}

export default function Home() {
	const { data, error } = useSWR("/api/streams?sort=viewer_count&order=desc&limit=50", fetcher);
	
	if(error) console.error(error);
	const streams = data?.streams || [];

	return (
		<Layout>
			<Head>
				<title>Programrs | Find live programming streams</title>
				<meta name="description" content="Find programming live streams from around the internet. Everything collected in one place for you to browse." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles.hero}>
				<h1>Live programming streams</h1>
				<p>Find programming streams from all around the internet, but mostly Twitch.</p>
			</div>
			<div className={styles.streams}>
				<ul className={styles.list}>
					{streams.map( stream => <Stream stream={stream} key={stream.id} />)}
					{
						!data
							? new Array(4).fill("").map( (_, index) => <StreamSkeleton key={index} />)
							: null
					}
				</ul>
			</div>
		</Layout>
	)
}

function Stream({ stream }: StreamProps){
	const thumbnail = stream.thumbnail_url.replace("{width}", "336").replace("{height}", "189");
	const streamUrl = `https://twitch.tv/${stream.user_name}`;

	return(
		<li className={styles.stream}>
			<img 
				src={thumbnail}
				alt={`${stream.user_name}'s thumbnail`}
				height={189}
				width={336}
			/>
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
					{truncate(stream.title, 50)}
				</a>

				<a href={streamUrl} className={styles.user}>
					<UserIcon className={styles.icon} />
					<span>{stream.user_name}</span>
				</a>
			</div>
		</li>
	)
}
