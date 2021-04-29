import { Client, query as q } from "faunadb";

// Types
import { NormalizedStream } from "../../types/streams"

const client = new Client({
	domain: "localhost",
	secret: process.env.FGU_SECRET,
	port: 8443,
	scheme: "http"
})

export async function saveToFauna(streams: NormalizedStream[]){
	return client.query(
		q.Do(
			q.Let(
				{
					documents: q.Match(
						q.Index("list-streams")
					)
				},
				q.Foreach(
					q.Paginate(q.Var("documents"), { size: 10000 }),
					q.Lambda(
						"ref",
						q.Delete(q.Var("ref"))
					)
				)
			),
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
				
			)
		)
	)
}