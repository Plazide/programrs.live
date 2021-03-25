import { query as q, Expr } from "faunadb";

export function filter(attr: string): Expr{
	return q.If(
		q.Or(
			q.Equals(q.Var(attr), "all"),
			q.Equals(q.Var(attr), null)
		),
		true,
		q.Equals(
			q.Var(attr), 
			q.Select(
				["data", attr], 
				q.Var("stream")
			)
		)
	)
}

export function filterTech(tech: Expr, included: Expr){
	return q.If(
		q.Or(
			q.Equals(tech, null),
			q.Equals(included, null)
		),
		true,
		q.Any(
			q.Map(
				tech,
				q.Lambda(
					"item",
					q.GT(
						q.Count(
							q.Intersection(tech, included)
						),
						0
					)
				)
			)
		)
	)
}