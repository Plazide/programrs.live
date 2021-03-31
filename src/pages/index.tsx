import Head from "next/head"
import Layout from "../components/Layout/Layout"
import styles from "../styles/Home.module.css"

import StreamSkeleton from "../components/StreamSkeleton/StreamSkeleton";
import Stream from "../components/Stream/Stream";
import { useEffect, useRef, useState } from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useAllStreamsQuery, EnumOrder, EnumSorting } from "../graphql/types";
import Filter from "../components/Filter/Filter";
import { State } from "../hooks/useFilter";
import { GetStaticProps } from "next";
import { Client, query as q, ClientConfig } from "faunadb";

interface Props{
	langs: string[];
}

export default function Home({ langs }: Props) {
	const streamsRef = useRef<HTMLDivElement>(null);
	const nextCursor = useRef<string>(null);
	const [cursor, setCursor] = useState(null);
	const [state, setState] = useState<State>({ sorting: EnumSorting.Viewers, order: EnumOrder.Desc });
	const [result] = useAllStreamsQuery({
		variables: {...state, cursor, size: 20 }
	})
	const { data, error, fetching } = result;
	const streams = data?.allStreams.data || [];
	nextCursor.current = data?.allStreams?.after || null

	if(error) console.error(error);

	function onFilterChange(filter: State){
		setState(filter);
	}

	function onNextPage(){
		console.log({ nextCursor: nextCursor.current })

		if(nextCursor.current && nextCursor.current !== cursor)
			setCursor(nextCursor.current);
	}

	useEffect(() => {
		nextCursor.current = null;
		console.log("Next cursor changed to", nextCursor.current)

		setCursor(null);
	}, [JSON.stringify(state)]);

	useInfiniteScroll(streamsRef, onNextPage, { 
		enabled: true
	});

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
			<button onClick={onNextPage}>next page</button>
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

	return {
		props: {
			langs: langs.data,
			services: services.data
		}
	}
}
