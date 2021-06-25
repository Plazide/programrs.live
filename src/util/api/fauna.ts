import { Client, query as q } from "faunadb";

// Types
import { NormalizedStream } from "../../types/streams"

const endpoint = process.env.FGU_API_ENDPOINT;
const [scheme, domain, port] = endpoint ? endpoint.replace("//", "").split(":") as ["http" | "https", string, string] : [];
const devOptions = endpoint ? { scheme, domain, port: parseInt(port) } : {};

const client = new Client({
	secret: process.env.FGU_SECRET,
	...devOptions
})

export async function saveToFauna(streams: NormalizedStream[]){
	return client.query(
		q.Let(
			{
				documents: q.Match(
					q.Index("list-streams")
				)
			},
			q.Do(
				q.Foreach(
					streams,
					q.Lambda(
						"stream",
						q.Let(
							{
								match: q.Match(
									q.Index("stream-by-channel"),
									q.Select(["channel"], q.Var("stream"))
								)
							},
							q.If(
								q.Exists(q.Var("match")),
								q.Update(
									q.Select("ref", q.Get(q.Var("match"))), {
										data: q.Merge(
											q.Var("stream"),
											{
												startedAt: q.Time(q.Select("startedAt", q.Var("stream")))
											}
										)
									}
								),
								q.Create(q.Collection("Stream"), {
									data: q.Merge(
										q.Var("stream"),
										{
											startedAt: q.Time(q.Select("startedAt", q.Var("stream")))
										}
									)
								})
							)
						)
					)
				),
				q.Foreach(
					q.Map(
						q.Paginate(q.Var("documents"), { size: 10_000 }),
						q.Lambda(
							"ref",
							q.Get(q.Var("ref"))
						)
					),
					q.Lambda(
						"doc",
						q.If(
							q.Any(
								q.Map(
									streams,
									q.Lambda(
										"stream",
										q.Equals(
											q.Select(["channel"], q.Var("stream")),
											q.Select(["data", "channel"], q.Var("doc"))
										)
									)
								)
							),
							null,
							q.Delete(
								q.Select("ref", q.Var("doc"))
							)
						)
					)
				)
			)
		)
	)
}