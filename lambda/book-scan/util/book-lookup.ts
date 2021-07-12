import { getBookLookupsFree } from "./data-helpers";

export const runBookLookupIfAble = async () => {
  const lookupsFree = await getBookLookupsFree();

  console.log("BOOK LOOKUP STATUS", JSON.stringify(lookupsFree));
};
