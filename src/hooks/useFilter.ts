import { useReducer, ChangeEvent } from "react";
import { EnumSorting, EnumOrder, EnumService } from "../graphql/types";
import { capitalize } from "../util/string";

export interface State{
	sorting: EnumSorting;
	order: EnumOrder;
	filter?: {
		language?: string;
		service?: EnumService
		tech?: string[]
	}
}

type Sorting = "viewers-asc" | "viewers-desc" | "startedAt-asc" | "startedAt-desc";
type Reducer = (state: State, action: Partial<State>) => State;
type SelectChange = ChangeEvent<HTMLSelectElement>;

const reducer: Reducer = (state, action) => {
	return { ...state, ...action };
}

export function useFilter(){
	const [state, dispatch] = useReducer<Reducer, Partial<State>>(
		reducer, 
		{ 
			sorting: EnumSorting.Viewers, 
			order: EnumOrder.Desc
		}, 
		(state) => state
	);
	const { sorting, order, filter } = state;

	function onSortChange(e: SelectChange){
		const value = e.currentTarget.value as Sorting;
		const [sorting, order] = value.split("-");
		dispatch({ 
			sorting: EnumSorting[capitalize(sorting)], 
			order: EnumOrder[capitalize(order)] 
		})
	}

	function onLangChange(e: SelectChange){
		const value = e.currentTarget.value;
		dispatch({
			filter: {
				...filter,
				language: value
			}
		})
	}

	function onTagsChange(tags: string[]){
		dispatch({
			filter: {
				...filter,
				tech: tags
			}
		})
	}

	return {
		state,
		sorting,
		order,
		filter,
		onSortChange,
		onLangChange,
		onTagsChange
	}
}