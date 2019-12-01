import { graphqlClient } from "util/graphql";

import GetTags from "graphQL/tags/getTags.graphql";
import { useContext, useMemo, createContext, useState } from "react";
import { buildQuery, useQuery } from "micro-graphql-react";
import { AppContext } from "./renderUI";

import delve from "dlv";
import { syncUpdates, syncDeletes } from "../util/graphqlHelpers";
import { QueryOf, Queries } from "graphql-typings";

interface ITag {
  _id: string;
  name: string;
}

export interface TagsState {
  tagsLoaded: boolean;
  tags: ITag[];
  tagHash: any;
}

graphqlClient.subscribeMutation([
  {
    when: /(update|create)Tag/,
    run: (op, res) => syncUpdates(GetTags, [(res.updateTag || res.createTag).Tag], "allTags", "Tags", { sort: tagsSort })
  },
  { when: /deleteTag/, run: (op, res, req) => syncDeletes(GetTags, [req._id], "allTags", "Tags", { sort: tagsSort }) }
]);

export function useTagsState(): TagsState {
  const [{ publicUserId }] = useContext(AppContext);
  const req = { publicUserId: publicUserId || void 0 };
  const { loaded, data } = useQuery<QueryOf<Queries["allTags"]>>(
    buildQuery(GetTags, req, { onMutation: { when: /(update|delete|create)Tag/, run: ({ refresh }) => refresh() } })
  );

  const tags = data ? data.allTags.Tags : [];
  const tagHash = useMemo(() => (tags && tags.length ? tags.reduce((hash, t) => ((hash[t._id] = t), hash), {}) : {}), [tags]);

  return { tagsLoaded: loaded, tags, tagHash };
}

const tagsSort = ({ name: name1 }, { name: name2 }) => {
  let name1After = name1.toLowerCase() > name2.toLowerCase();
  let bothEqual = name1.toLowerCase() === name2.toLowerCase();
  return bothEqual ? 0 : name1After ? 1 : -1;
};

export const filterTags = (tags, search) => {
  if (!search) {
    search = () => true;
  } else {
    let regex = new RegExp(search, "i");
    search = txt => regex.test(txt);
  }
  return tags.filter(s => search(s.name));
};
