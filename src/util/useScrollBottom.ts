import { RefObject, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce"


export default function useInfiniteScroll(ref: RefObject<HTMLDivElement>, callback: () => void, offsetBottom = 300){
	if(typeof window === "undefined") return;
	const debouncedCallback = useDebouncedCallback(callback, 1000)

	const element = ref.current;

	function handleScroll(){
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