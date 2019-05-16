import { useMemo, useReducer } from "react";

export function makeStateBoundHelpers<T>(state, updateState, fns: T, options = {} as any): { [k in keyof T]: any } {
  return useMemo(
    () =>
      Object.entries(fns).reduce((hash, [name, fn]: [any, any]) => {
        let boundFn = fn(...[state, ...(options.pass || [])]);
        hash[name] = (...args) => {
          updateState(boundFn(...args));
        };
        return hash;
      }, {}),
    [state]
  ) as any;
}

export function makeActionCreators(dispatch, fns) {
  return Object.entries(fns).reduce((hash, [name, fn]: [any, any]) => {
    hash[name] = (...args) => dispatch(fn(...args));
    return hash;
  }, {});
}

export function getStatePacket<T>(reducer, initialState, actions?): [T, any, any] {
  let [state, dispatch] = useReducer(reducer, initialState);
  let newDispatch = useMemo(
    () => val => {
      if (typeof val === "object") {
        dispatch(val);
      } else if (typeof val === "function") {
        val(dispatch, () => state);
      } else throw "Fuck off";
    },
    [state, dispatch]
  );

  return useMemo(() => [state, actions ? makeActionCreators(newDispatch, actions) : {}, dispatch], [state]) as any;
}
