import { derived, get } from "svelte/store";
import { query } from "micro-graphql-svelte";
import { QueryOf, Queries } from "gql/graphql-typings";

import GetTags from "gql/tags/getTags.graphql";
import { appState } from "./appState";
import { graphqlSyncAndRefresh } from "util/graphqlHelpers";

interface ITag {
  _id: string;
  name: string;
}

export interface TagsState {
  tagsLoaded: boolean;
  tags: ITag[];
  tagHash: any;
}

graphqlSyncAndRefresh("Tag", GetTags, { sort: tagsSort });

const { queryState } = query<QueryOf<Queries["allTags"]>>(GetTags, { initialSearch: { publicUserId: get(appState).publicUserId } });

export const tagsState = derived(queryState, $tags => {
  const tags = $tags.data ? $tags.data.allTags.Tags : [];
  const tagHash = tags?.length ? tags.reduce((hash, t) => ((hash[t._id] = t), hash), {}) : {};

  return { tagsLoaded: $tags.loaded, tags, tagHash };
});

function tagsSort({ name: name1 }, { name: name2 }) {
  let name1After = name1.toLowerCase() > name2.toLowerCase();
  let bothEqual = name1.toLowerCase() === name2.toLowerCase();
  return bothEqual ? 0 : name1After ? 1 : -1;
}

export const filterTags = (tags, search) => {
  if (!search) {
    search = () => true;
  } else {
    let regex = new RegExp(search, "i");
    search = txt => regex.test(txt);
  }
  return tags.filter(s => search(s.name));
};
