import { useContext, useMemo } from "react";
import { QueryOf, Queries } from "graphQL/graphql-typings";

import GetTags from "graphQL/tags/getTags.graphql";
import { useSuspenseQuery } from "micro-graphql-react";
import { AppContext } from "app/state/appState";
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

export function useTagsState(): TagsState {
  const [{ publicUserId }] = useContext(AppContext);
  const { loaded, data } = useSuspenseQuery<QueryOf<Queries["allTags"]>>(GetTags, { publicUserId });

  const tags = data ? data.allTags.Tags : [];
  const tagHash = useMemo(() => (tags?.length ? tags.reduce((hash, t) => ((hash[t._id] = t), hash), {}) : {}), [tags]);

  return { tagsLoaded: loaded, tags, tagHash };
}

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
