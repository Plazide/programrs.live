import TwitchApi from "node-twitch";
import { Stream as TwitchStream, User as TwitchUser } from "node-twitch/dist/types/objects";
import { extractTechnology } from "../../util/tech";
import includelist from "../../models/includelist";

// Types
import { NormalizedStream } from "../../types/streams"

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

export async function fetchFromTwitch(){
	let streams = [];

	async function _fetch(cursor = null){
		const [result, includeResults] = (await Promise.all([
			twitch.getStreams({ 
				game_id: [509670, 21548, 505867], 
				language: "en", 
				first: 100,
				after: cursor
			}),
			includelist.twitch.length > 0 ? twitch.getStreams({
				channels: includelist.twitch,
				first: includelist.youtube.length
			}) : { data: [] }
		]))
		const newCursor = result.pagination.cursor;

		const fetchedStreams = [
			...result.data
				.filter( 
					stream => stream.tag_ids?.some( 
						tagId => tags.includes(tagId) 
					)
				),
			...includeResults.data
		].filter(Boolean);
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