// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client, query as q } from "faunadb";
import type { NextApiRequest, NextApiResponse } from "next";
import TwitchApi from "node-twitch";
import { Stream as TwitchStream, User as TwitchUser } from "node-twitch/dist/types/objects";
import { extractTechnology } from "../../util/tech";

interface NormalizedStream{
	viewers: number;
	service: string;
	thumbnail: string;
	link: string;
	startedAt: string;
	title: string;
	channel: string;
	avatar: string;
	language: string;
}

const twitch = new TwitchApi({
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET
});

const client = new Client({
	domain: "localhost",
	secret: process.env.FGU_SECRET,
	port: 8443,
	scheme: "http"
})

const tags = [
	"f588bd74-e496-4d11-9169-3597f38a5d25",
	"c23ce252-cf78-4b98-8c11-8769801aaf3a",
	"6e23d976-33ec-47e8-b22b-3727acd41862",
	"a59f1e4e-257b-4bd0-90c7-189c3efbf917",
	"6f86127d-6051-4a38-94bb-f7b475dde109"
]

export default async (req: NextApiRequest, res: NextApiResponse) => {	
	const streams = await Promise.all([
		fetchFromTwitch()
	]);

	await saveToFauna(streams.flat())

	res.statusCode = 200
	res.end();
}

async function fetchFromTwitch(){
	let streams = [];

	async function _fetch(cursor = null){
		const result = await twitch.getStreams({ 
			game_id: [509670, 21548, 505867], 
			language: "en", 
			first: 100,
			after: cursor
		});
		const newCursor = result.pagination.cursor;

		const fetchedStreams = result.data
			.filter( 
				stream => stream.tag_ids?.some( 
					tagId => tags.includes(tagId) 
				)
			);
		const newChannels = fetchedStreams.map( stream => stream.user_id);
		const newUsers = await twitch.getUsers(newChannels);
		const newStreams = fetchedStreams.map( stream => ({
			...stream,
			...newUsers.data.find( user => user.login === stream.user_name)
		}))

	
		streams = [
			...streams, 
			...newStreams
		];
	
		if(newCursor){
			await _fetch(newCursor);
		}
	}
	
	await _fetch();

	return normalizeFromTwitch(streams);
}

function normalizeFromTwitch(streams: (TwitchStream & TwitchUser)[]): NormalizedStream[]{
	return streams.map( stream => ({
		service: "twitch",
		viewers: stream.viewer_count,
		thumbnail: stream.getThumbnailUrl({ width: 274, height: 148 }),
		link: `https://twitch.tv/${stream.user_name}`,
		title: stream.title,
		startedAt: new Date(stream.started_at).toISOString(),
		channel: stream.user_name,
		avatar: stream.profile_image_url,
		language: stream.language,
		tech: extractTechnology(stream.title)
	}))
}

async function saveToFauna(streams: NormalizedStream[]){
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