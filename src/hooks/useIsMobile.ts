import { useMediaQuery } from "react-responsive";

export function useIsMobile(): boolean{
	return useMediaQuery({ query: "(max-width: 600px)" });
}