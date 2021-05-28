import type { AppProps } from "next/app";
import { Provider } from "urql";
import client from "../util/urql";
import PlausibleProvider from "next-plausible";

import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
	return <Provider value={client}>
		<PlausibleProvider domain="programrs.live">
			<Component {...pageProps} />
		</PlausibleProvider>
	</Provider>
}

export default MyApp
