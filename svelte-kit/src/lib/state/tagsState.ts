import type { Tag } from "$data/types";

// export const tagsState = derived(queryState, $tags => {
//   const tags = $tags.data ? $tags.data.allTags.Tags : [];
//   const tagHash = tags?.length ? tags.reduce((hash, t) => ((hash[t._id] = t), hash), {}) : {};

//   return { tagsLoaded: $tags.loaded, tags, tagHash };
// });

// function tagsSort({ name: name1 }, { name: name2 }) {
//   let name1After = name1.toLowerCase() > name2.toLowerCase();
//   let bothEqual = name1.toLowerCase() === name2.toLowerCase();
//   return bothEqual ? 0 : name1After ? 1 : -1;
// }

export const filterTags = (tags: Tag[], search: string) => {
  let filterFn: (txt: string) => boolean;
  if (!search) {
    filterFn = () => true;
  } else {
    let regex = new RegExp(search, "i");
    filterFn = txt => regex.test(txt);
  }
  return tags.filter(s => filterFn(s.name));
};
