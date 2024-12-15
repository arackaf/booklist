type Ref<T> = {
  get current(): T;
  set current(value: T);
};
const ref = <T>(value: T): Ref<T> => {
  let state = $state<T>(value);
  return {
    get current() {
      return state;
    },
    set current(value: T) {
      state = value;
    }
  };
};

export default function useReducer<T = any, P = any>(
  reducer: (state: T, payload: [string, P]) => T,
  initialState: T
): [Ref<T>, (action: any) => void] {
  let state = ref(initialState);

  const dispatch = (action: [string, P]) => {
    state.current = reducer(state.current, action);
  };

  return [state, dispatch];
}
