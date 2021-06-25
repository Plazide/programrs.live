import { useEffect, useState } from "react";

type Scheme = "dark" | "light";

export function useColorScheme(): Scheme {
	const defaultScheme = window?.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	const [scheme, setScheme] = useState<Scheme>(defaultScheme);

	useEffect( () => {
		window?.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
			const newScheme = e.matches ? "dark" : "light";
			setScheme(newScheme);
		})
	}, [])

	return scheme;
}