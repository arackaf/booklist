import { writable } from "svelte/store";

export default function withQuery(query, variables) {
  const results = writable({ loaded: false, data: {} });

  variables.subscribe(variables => {
    fetch(`https://mylibrary.io/graphql-public?query=${query}&variables=${JSON.stringify(variables)}`)
      .then(val => val.json())
      .then(res => {
        results.set({ loaded: true, data: res.data || {} });
      });
  });

  return results;
}
