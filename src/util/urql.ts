import { createClient, defaultExchanges } from "urql";

const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const secret = process.env.NEXT_PUBLIC_GRAPHQL_KEY;

const client = createClient({
	url: graphqlEndpoint,
	fetchOptions: () => ({
		headers: {
			"authorization": `Bearer ${secret}`
		}
	})
})

export default client;