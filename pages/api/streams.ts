// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import TwitchApi from "node-twitch";
import sortArray from "array-sort";

const twitch = new TwitchApi({
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET
});

const tags = [
	"f588bd74-e496-4d11-9169-3597f38a5d25",
	"c23ce252-cf78-4b98-8c11-8769801aaf3a",
	"6e23d976-33ec-47e8-b22b-3727acd41862",
	"a59f1e4e-257b-4bd0-90c7-189c3efbf917",
	"6f86127d-6051-4a38-94bb-f7b475dde109"
]

let cache = {}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const query = req.query;
	const url = req.url;
	console.log(url);

	const cached = cache[url];
	const result = await twitch.getStreams({ 
		game_id: [509670, 21548, 505867], 
		language: "en", 
		first: 100
	})
	const streams = cached && cached.length > 0
		? cached
		: result.data.filter( stream => stream.tag_ids?.filter( value => tags.includes(value)))
	
	cache[url] = streams;
	res.statusCode = 200
	res.json({ 
		streams: sortArray(
			streams, 
			query.sort || "viewer_count", 
			{ reverse: query.order === "desc" }) 
	});
}

async function GetAllStreamTags(){
	let tags = [];

	async function fetchStreamTags(cursor?: string){
		const result = await twitch.getAllStreamTags({ first: 100, after: cursor });
		const after = result.pagination.cursor;

		tags = [...tags, ...result.data]

		if(after)
			return fetchStreamTags(after);
	}

	await fetchStreamTags();

	return tags;
}
