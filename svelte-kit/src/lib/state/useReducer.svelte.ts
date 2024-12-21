import { ref, type Ref } from "./reactivityHelpers.svelte";

export default function useReducer<T = any, P = any>(
  reducer: (state: T, payload: [string, P]) => T,
  initialState: T
): [Ref<T>, (action: any) => void] {
  let state = ref(initialState);

  const dispatch = (action: [string, P]) => {
    state.value = reducer(state.value, action);
  };

  return [state, dispatch];
}
