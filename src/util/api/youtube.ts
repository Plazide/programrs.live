import { youtube, youtube_v3 } from "googleapis/build/src/apis/youtube";
import tech from "../../models/technologies";
import includelist from "../../models/includelist";

// Types
import { NormalizedStream } from "../../types/streams"
import { extractTechnology } from "../tech";

type YoutubeStream = youtube_v3.Schema$SearchResult & youtube_v3.Schema$Video & { channel: youtube_v3.Schema$Channel };

const API_KEY = process.env.GOOGLE_API_KEY;
const service = youtube("v3");

// We need to wrap special characters in quotes, or the query won't work.
const specialChars = [" ", "+", "#"]
const query = tech
	.map( item => Array.isArray(item) ? item[0] : item)
	.map( item => specialChars.some(char => 
		item.includes(char)) ? `"${item}"` : item
	)
	.join("|");

const searchOptions: youtube_v3.Params$Resource$Search$List = {
	part: ["snippet"],
	eventType: "live",
	q: `+(${query})`,
	type: ["video"],
	maxResults: 50,
	videoCategoryId: "28",
	topicId: "/m/07c1v"
}

export async function fetchFromYoutube(){
	let streams: YoutubeStream[][] = [],
		pageToken = undefined;

	async function _fetch(){
		const[searchResult, ...includeResults] = await Promise.all([
			service.search.list({
				auth: API_KEY,
				...searchOptions,
				pageToken
			}),
			...includelist.youtube.map( id => service.search.list({
				auth: API_KEY,
				part: ["snippet"],
				eventType: "live",
				type: ["video"],
				channelId: id
			}))
		]);
		const searchItems = [
			...searchResult.data.items, 
			...includeResults.filter( item => item.data.items.length > 0).map( item => item.data.items[0])
		];
		if(!searchItems || searchItems.length === 0) return;

		const [videosResult, usersResult] = await Promise.all([
			service.videos.list({
				auth: API_KEY,
				id: searchItems.map( stream => stream.id.videoId),
				part: ["statistics", "snippet", "liveStreamingDetails"]
			}),
			service.channels.list({
				auth: API_KEY,
				id: searchItems.map( stream => stream.snippet.channelId),
				part: ["snippet"]
			})
		]) 
		const newStreams = videosResult.data.items.map( item => ({
			...item,
			channel: usersResult.data.items.find( channel => 
				item.snippet.channelId === channel.id
			)
		}));
		streams.push(newStreams);

		const nextToken = searchResult.data.nextPageToken;
		if(nextToken){
			pageToken = nextToken;
			await _fetch();
		}
	}
	
	await _fetch();

	const normalizedStreams = normalizeFromYoutube(streams.flat())
		.filter( stream => {
			const uptime = Date.now() - new Date(stream.startedAt).getTime();
			const hours = uptime / 1000 / 60 / 60;

			// Use arbitrary number of hours to determine if stream is something other than a programming stream.
			return hours < 32;
		});
	return normalizedStreams;
}

function parseViewers(viewers: string){
	const num = parseInt(viewers);

	if(isNaN(num)) return 0;
	return num;
}

function normalizeFromYoutube(streams: YoutubeStream[]): NormalizedStream[]{
	return streams.map( stream => ({
		service: "youtube",
		viewers: parseViewers(stream.liveStreamingDetails.concurrentViewers),
		thumbnail: stream.snippet.thumbnails.medium.url,
		link: `https://youtube.com/watch?v=${stream.id}`,
		title: stream.snippet.title,
		startedAt: stream.liveStreamingDetails.actualStartTime,
		channel: stream.snippet.channelTitle,
		avatar: stream.channel.snippet.thumbnails.medium.url,
		language: (stream.snippet.defaultAudioLanguage || stream.snippet.defaultLanguage)?.split("-")[0] || null,
		tech: extractTechnology(stream.snippet.channelTitle)
	}))
}