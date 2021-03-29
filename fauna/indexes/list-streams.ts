// Index that lists all streams in the database
import { query as q } from "faunadb";
import { IndexResource } from "fauna-gql-upload";

export default {
	name: "list-streams",
	source: q.Collection("Stream"),
	values: [
		{ field: ["ref"] }
	]
} as IndexResource;