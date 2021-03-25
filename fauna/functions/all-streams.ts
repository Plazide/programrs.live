import { FunctionResource } from "fauna-gql-upload";
import { query as q} from "faunadb";
import { filter, filterTech } from "../lib/Filter";

function mainSet(){
	return q.Filter(
		q.Join(
			q.Var("match"),
			q.Index(q.Var("joinIndex"))
		),
		q.Lambda(
			["order", "ref"],
			q.If(
				q.Equals(q.Var("filter"), null),
				true,
				q.Let(
					{
						language: q.Select("language", q.Var("filter"), null),
						service: q.Select("service", q.Var("filter"), null),
						includedTech: q.Select("tech", q.Var("filter"), null),
						stream: q.Get(q.Var("ref")),
						tech: q.Select(["data", "tech"], q.Var("stream"), null),
					},
					q.And(
						filter("language"),
						filter("service"),
						filterTech(q.Var("tech"), q.Var("includedTech"))
					)
				)
			)
		)
	)
}

export default {
	name: "all-streams",
	body: q.Query(
		q.Lambda(
			["_sorting", "_order", "_filter", "_size", "after", "before"],
			q.Let(
				{
					filter: q.Var("_filter"),
					match: q.Match(q.Index("all-streams")),
					sorting: q.If(
						q.Not(q.Equals(q.Var("_sorting"), null)),
						q.Var("_sorting"),
						"viewers"
					),
					order: q.If(
						q.Not(q.Equals(q.Var("_order"), null)),
						q.Var("_order"),
						"desc"
					),
					joinIndex: q.Concat(["streams-by", q.Var("sorting"), q.Var("order")], "-"),
					size: q.If(
						q.Not(q.Equals(q.Var("_size"), null)),
						q.Var("_size"),
						10
					)
				},
				q.Map(
					q.If(
						q.Not(q.Equals(q.Var("after"), null)),
						q.Paginate(
							mainSet(),
							{ size: q.Var("size"), after: q.Var("after") }
						),
						q.Paginate(
							mainSet(),
							{ size: q.Var("size") }
						)
					),
					q.Lambda(
						["order", "ref"],
						q.Get(q.Var("ref"))
					)
				)
				
			)
		)
	)
} as FunctionResource;