import { useRef, useState, useEffect, RefObject } from "react";
import { EnumSorting, EnumOrder, useAllStreamsQuery } from "../graphql/types";
import { State } from "./useFilter";
import useInfiniteScroll from "./useInfiniteScroll";

export function useStreams(streamsRef: RefObject<HTMLDivElement>){
	const nextCursor = useRef<string>(null);
	const [cursor, setCursor] = useState(null);
	const [state, setState] = useState<State>({ sorting: EnumSorting.Viewers, order: EnumOrder.Desc });
	const [result] = useAllStreamsQuery({
		variables: {...state, cursor, size: 20 }
	})
	const { data, error, fetching } = result;
	const streams = data?.allStreams.data || [];
	nextCursor.current = data?.allStreams?.after || null

	if(error) console.error(error);

	function onFilterChange(filter: State){
		setState(filter);
	}

	function onNextPage(){
		if(nextCursor.current && nextCursor.current !== cursor)
			setCursor(nextCursor.current);
	}

	useEffect(() => {
		nextCursor.current = null;

		setCursor(null);
	}, [JSON.stringify(state)]);

	useInfiniteScroll(streamsRef, onNextPage, { 
		enabled: true
	});

	return{
		streams,
		fetching,
		cursor,
		onFilterChange
	}
}