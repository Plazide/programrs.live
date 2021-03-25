import Head from "next/head"
import Layout from "../components/Layout/Layout"
import styles from "../styles/Home.module.css"

import StreamSkeleton from "../components/StreamSkeleton/StreamSkeleton";
import Stream from "../components/Stream/Stream";
import { useEffect, useRef, useState } from "react";
import useInfiniteScroll from "../util/useScrollBottom";
import { useAllStreamsQuery, EnumOrder, EnumSorting, AllStreamsQuery, AllStreamsQueryVariables, AllStreamsDocument } from "../graphql/types";
import Filter from "../components/Filter/Filter";
import { State } from "../hooks/useFilter";
import { GetStaticProps } from "next";
import { Client, query as q, ClientConfig } from "faunadb";
import client from "../util/urql";

interface Props{
	langs: string[];
}

export default function Home({ langs }: Props) {
	const streamsRef = useRef<HTMLDivElement>(null);
	const nextCursor = useRef<string>(null);
	const [streams, setStreams] = useState([]);
	const [cursor, setCursor] = useState(null);
	const [state, setState] = useState<State>({ sorting: EnumSorting.Viewers, order: EnumOrder.Desc });
	const [result] = useAllStreamsQuery({
		variables: {...state, cursor, size: 20 }
	})
	const { data, error } = result;
	// const newStreams = data?.allStreams.data || [];
	// const beforeCursor = data?.allStreams.before;
	if(data?.allStreams.after)
		nextCursor.current = data.allStreams.after

	// console.log({ nextCursor })

	if(error) console.error(error);

	function onFilterChange(filter: State){
		setState(filter);
	}

	useInfiniteScroll(streamsRef, () => {
		console.log("Load more")
		if(nextCursor.current !== cursor)
			setCursor(nextCursor.current);
	});

	useEffect( () => {
		const { before = null, after = null } = data?.allStreams || {};
		const newStreams = data?.allStreams.data || []

		if(!before && !after) setStreams(newStreams);
		if(after) setStreams([...streams, ...newStreams]);
		
		
	}, [nextCursor.current])

	// useEffect(() => {
	// 	refetch();
	// }, [cursor])

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

			<Filter langs={langs} onChange={onFilterChange} />
			<div className={styles.streams} ref={streamsRef}>
				<ul className={styles.list}>
					{streams.map( stream => <Stream stream={stream} key={stream.channel} />)}
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

export const getStaticProps: GetStaticProps = async () => {
	const secret = process.env.NEXT_PUBLIC_GRAPHQL_KEY;
	const env = process.env.NODE_ENV;
	const dev = env === "development" || env === "test";
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

	console.log(services);

	return {
		props: {
			langs: langs.data,
			services: services.data
		}
	}
}
