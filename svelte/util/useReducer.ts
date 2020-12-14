import { writable, Writable } from "svelte/store";

export default function useReducer<T = any>(reducer, initialState): [Writable<T>, (action: any) => void] {
  const state = writable(initialState);
  const dispatch = action => state.update(currentState => reducer(currentState, action));

  return [state, dispatch];
}
