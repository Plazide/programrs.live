import { IndexResource } from "fauna-gql-upload";
import { query as q } from "faunadb";

export default {
	name: "all-streams",
	source: q.Collection("Stream"),
	values: [
		{ field: ["ref"] }
	]
} as IndexResource