import { writable, type Writable } from "svelte/store";

export default function useReducer<T = any, P = any>(
  reducer: (state: T, payload: [string, P]) => T,
  initialState: T
): [Writable<T>, (action: any) => void] {
  const state = writable(initialState);
  const dispatch = (action: [string, P]) => state.update(currentState => reducer(currentState, action));

  return [state, dispatch];
}
