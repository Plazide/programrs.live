import { RoleResource } from "fauna-gql-upload";
import { query as q } from "faunadb";

export default {
	name: "public",
	privileges: [
		{
			resource: q.Collection("Stream"),
			actions: {
				read: true,
				unrestricted_read: true
			}
		},
		{
			resource: q.Index("all-streams"),
			actions: {
				read: true
			}
		},
		{
			resource: q.Index("streams-by-viewers-desc"),
			actions: {
				read: true
			}
		},
		{
			resource: q.Index("streams-by-viewers-asc"),
			actions: {
				read: true
			}
		},
		{
			resource: q.Index("streams-by-startedAt-desc"),
			actions: {
				read: true
			}
		},
		{
			resource: q.Index("streams-by-startedAt-asc"),
			actions: {
				read: true
			}
		},
		{
			resource: q.Function("all-streams"),
			actions: {
				call: true
			}
		},
		{
			resource: q.Index("all-stream-languages"),
			actions: {
				read: true
			}
		},
		{
			resource: q.Index("all-stream-services"),
			actions: {
				read: true
			}
		}
	]

} as RoleResource;