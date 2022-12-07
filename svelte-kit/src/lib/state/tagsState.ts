import type { Tag } from "$data/types";

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
