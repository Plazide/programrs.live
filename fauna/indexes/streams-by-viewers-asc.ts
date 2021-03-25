import { IndexResource } from "fauna-gql-upload";
import { query as q } from "faunadb";

export default {
	name: "streams-by-viewers-asc",
	source: q.Collection("Stream"),
	values: [
		{ field: ["data", "viewers"] },
		{ field: "ref" }
	],
	terms: [
		{ field: ["ref"] }
	]
} as IndexResource