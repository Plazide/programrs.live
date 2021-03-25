import { IndexResource } from "fauna-gql-upload";
import { query as q } from "faunadb";

export default {
	name: "streams-by-startedAt-desc",
	source: q.Collection("Stream"),
	values: [
		{ field: ["data", "startedAt"], reverse: true },
		{ field: "ref" }
	],
	terms: [
		{ field: ["ref"] }
	]
} as IndexResource