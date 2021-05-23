import Head from "next/head"
import Layout from "../components/Layout/Layout"
import styles from "../styles/Home.module.css"

import StreamSkeleton from "../components/StreamSkeleton/StreamSkeleton";
import Stream from "../components/Stream/Stream";
import { useRef } from "react";
import Filter from "../components/Filter/Filter";
import { GetStaticProps } from "next";
import { Client, query as q, ClientConfig } from "faunadb";
import { useStreams } from "../hooks/useStreams";

const API_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "https://graphql.fauna.com"

interface Props{
	langs: string[];
}

export default function Home({ langs }: Props) {
	const streamsRef = useRef<HTMLDivElement>(null);
	const{
		streams,
		fetching,
		cursor,
		onFilterChange
	} = useStreams(streamsRef);

	return (
		<Layout>
			<Head>
				<title>Programrs | Find live programming streams</title>
				<meta name="description" content="Find programming live streams from around the internet. Everything collected in one place for you to browse." />
				<link rel="icon" href="/favicon.ico" />
				<link 
					rel="preconnect" 
					href={API_ENDPOINT} 
				/>
			</Head>
			<div className={styles.hero}>
				<h1>Live programming streams</h1>
				<p>Find programming streams from all around the internet, but mostly Twitch.</p>
			</div>

			<Filter 
				langs={langs} 
				onChange={onFilterChange} 
			/> 
			<div className={styles.streams} ref={streamsRef}>
				<ul className={styles.list}>
					{
						fetching && !cursor
							? new Array(4).fill("").map( (_, index) => <StreamSkeleton key={index} />)
							: streams.map( stream => <Stream stream={stream} key={stream.channel} />)
					}
				</ul>
			</div>
		</Layout>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const secret = process.env.NEXT_PUBLIC_GRAPHQL_KEY;
	const endpoint = process.env.FGU_API_ENDPOINT;
	const dev = !!endpoint;
	const devOptions: Omit<ClientConfig, "secret"> = dev ? {
		domain: "localhost",
		scheme: "http",
		port: 8443
	} : {};

	const client = new Client({ secret, ...devOptions });
	const langs: { data: string[] } = await client.query(
		q.Paginate(
			q.Distinct(q.Match(q.Index("all-stream-languages")))
		)
	)

	const services: { data: string[] } = await client.query(
		q.Paginate(
			q.Distinct(q.Match(q.Index("all-stream-services")))
		)
	)

	return {
		props: {
			langs: langs.data,
			services: services.data
		}
	}
}
