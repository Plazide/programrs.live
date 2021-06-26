// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchFromTwitch } from "../../util/api/twitch";
import { saveToFauna } from "../../util/api/fauna";
import blocked from "../../models/blocklist";

// Types
import { NormalizedStream } from "../../types/streams";
import { fetchFromYoutube } from "../../util/api/youtube";

export default async (req: NextApiRequest, res: NextApiResponse) => {	
	const raw: NormalizedStream[][] = await Promise.all([
		fetchFromTwitch(),
		fetchFromYoutube()
	]);

	const flattened = raw.flat();
	const streams = filterBlocked(flattened, blocked);
	
	await saveToFauna(streams)

	res.statusCode = 200
	res.end();
}

function filterBlocked(streams: NormalizedStream[], blocklist: typeof blocked): NormalizedStream[]{
	const blockedChannels = blocklist.channels.map( channel => channel.toLocaleLowerCase());
	const blockedWords = blocklist.words.map( word => new RegExp(`.*${word}.*`, "i"));

	console.log(blockedChannels)

	return streams.filter( stream => {
		const containsBlockedWord = blockedWords.some( word => word.test(stream.title));

		if(blockedChannels.includes(stream.channel.toLocaleLowerCase())) return false;
		if(containsBlockedWord) return false;

		return true;
	})
}