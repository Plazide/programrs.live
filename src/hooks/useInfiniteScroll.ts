import { RefObject, useEffect } from "react";
import { useDebounceCallback } from "@react-hook/debounce"

interface Options{
	offsetBottom?: number;
	enabled?: boolean;
}

export default function useInfiniteScroll(ref: RefObject<HTMLDivElement>, callback: () => void, {
	offsetBottom = 300,
	enabled = true
}: Options = {}){
	if(typeof window === "undefined") return;
	const debouncedCallback = useDebounceCallback(callback, 1000, true)

	const element = ref.current;

	function handleScroll(){
		if(!element || !enabled) return;

		const scrollY = window.scrollY;
		const height = element.clientHeight;
		const offsetTop = element.offsetTop;
		const threshold = height - offsetTop - offsetBottom;

		if(scrollY > threshold)
			debouncedCallback();
	}

	useEffect( () => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		}
	}, [element])
}