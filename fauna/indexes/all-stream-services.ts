import { IndexResource } from "fauna-gql-upload";
import { query as q } from "faunadb";

export default {
	name: "all-stream-services",
	source: q.Collection("Stream"),
	values: [
		{ field: ["data", "service"] }
	]
} as IndexResource;