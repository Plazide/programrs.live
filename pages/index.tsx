import Head from "next/head"
import Layout from "../components/Layout/Layout"
import styles from "../styles/Home.module.css"
import useSWR from "swr";

import StreamSkeleton from "../components/StreamSkeleton/StreamSkeleton";
import Stream from "../components/Stream/Stream";

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
