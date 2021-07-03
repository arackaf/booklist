import fetch from "node-fetch";

import corsResponse from "../util/corsResponse";
import downloadFromUrl from "../util/downloadFromUrl";
import getSecrets from "../util/getSecrets";

export const handler = async event => {
  const secrets = await getSecrets();
  const key = secrets["isbn-db-key"];
  const { isbn } = JSON.parse(event.body);

  const result = {};
  try {
    const fetchResponse = await fetch(`https://api2.isbndb.com/book/${isbn}`, {
      headers: {
        Authorization: key
      }
    });
    const bookResult = await fetchResponse.json();

    console.log("Found from isbndb:", bookResult);

    if (bookResult && bookResult.book && bookResult.book.image) {
      result.image = bookResult.book.image;
    }
  } catch (err) {
    console.log("Error", er);
  }

  return corsResponse({ result });
};
