// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchFromTwitch } from "../../util/api/twitch";
import { saveToFauna } from "../../util/api/fauna"

// Types
import { NormalizedStream } from "../../types/streams";
import { fetchFromYoutube } from "../../util/api/youtube";

export default async (req: NextApiRequest, res: NextApiResponse) => {	
	const streams: NormalizedStream[][] = await Promise.all([
		fetchFromTwitch(),
		fetchFromYoutube()
	]);

	await saveToFauna(streams.flat())

	res.statusCode = 200
	res.end();
}