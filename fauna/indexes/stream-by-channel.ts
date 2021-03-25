import { IndexResource } from "fauna-gql-upload";
import { query as q } from "faunadb";

export default {
	name: "stream-by-channel",
	source: q.Collection("Stream"),
	values: [
		{ field: ["data", "channel"] },
		{ field: ["ref"] }
	],
	terms: [
		{ field: ["data", "channel"] }
	]
} as IndexResource;