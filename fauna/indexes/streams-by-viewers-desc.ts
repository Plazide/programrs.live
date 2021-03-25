import { IndexResource } from "fauna-gql-upload";
import { query as q } from "faunadb";

export default {
	name: "streams-by-viewers-desc",
	source: q.Collection("Stream"),
	values: [
		{ field: ["data", "viewers"], reverse: true },
		{ field: "ref" }
	],
	terms: [
		{ field: ["ref"] }
	]
} as IndexResource