import { IndexResource } from "fauna-gql-upload";
import { query as q } from "faunadb";

export default {
	name: "all-stream-languages",
	source: q.Collection("Stream"),
	values: [
		{ field: ["data", "language"] }
	]
} as IndexResource