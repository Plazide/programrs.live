import { createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { pagination } from "./cache";

const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const secret = process.env.NEXT_PUBLIC_GRAPHQL_KEY;

const cache = cacheExchange({
	resolvers: {
		Query: {
			allStreams: pagination("allStreams", "QueryAllStreamsPage")
		}
	}
})

const client = createClient({
	url: graphqlEndpoint,
	fetchOptions: () => ({
		headers: {
			"Authorization": `Bearer ${secret}`
		}
	}),
	exchanges: [dedupExchange, cache, fetchExchange]
})

export default client;