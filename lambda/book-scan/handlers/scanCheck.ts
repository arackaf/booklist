import { runBookLookupIfAble } from "../util/book-lookup";

export const handler = async event => {
  try {
    const lookup = runBookLookupIfAble();

    return { success: true };
  } catch (err) {
    console.log("ERROR", err);

    return { success: false, err };
  }
};
