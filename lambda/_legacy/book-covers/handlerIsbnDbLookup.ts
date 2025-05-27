import fetch from "node-fetch";

import corsResponse from "../../util/corsResponse";
import getSecrets from "../../util/getSecrets";

export const handler = async event => {
  const secrets = await getSecrets();
  const key = secrets["isbn-db-key"];
  const { isbn } = JSON.parse(event.body);

  const result = {} as any;
  try {
    const fetchResponse = await fetch(`https://api2.isbndb.com/book/${isbn}`, {
      headers: {
        Authorization: key
      }
    });
    const bookResult: any = await fetchResponse.json();

    console.log("Found from isbndb:", bookResult);

    if (bookResult && bookResult.book && bookResult.book.image) {
      result.image = bookResult.book.image;
    }
  } catch (err) {
    console.log("Error", err);
  }

  return corsResponse({ result });
};
