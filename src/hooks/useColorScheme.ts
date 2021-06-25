import { useEffect, useState } from "react";

export function useColorScheme(): "dark" | "light" {
	const defaultScheme = window?.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	const [scheme, setScheme] = useState(defaultScheme);

	useEffect( () => {
		window?.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
			const newScheme = e.matches ? "dark" : "light";
			setScheme(newScheme);
		})
	}, [])

	return scheme;
}