import { runBookLookupIfAvailable } from "../util/book-lookup";

export const handler = async event => {
  try {
    console.log("go!!");
    const lookup = await runBookLookupIfAvailable();

    return { success: true };
  } catch (err) {
    console.log("ERROR", err);

    return { success: false, err };
  }
};