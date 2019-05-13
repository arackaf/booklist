import { writable, derived } from "svelte/store";

export default function withQuery(query, variables) {
  return derived(
    variables,
    (variables, set) => {
      fetch(`https://mylibrary.io/graphql-public?query=${query}&variables=${JSON.stringify(variables)}`)
        .then(val => val.json())
        .then(res => {
          set({ loaded: true, data: res.data || {} });
        });
    },
    { loaded: false, data: {} }
  );
}
