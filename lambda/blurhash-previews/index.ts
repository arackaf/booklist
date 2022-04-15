import { getDbConnection } from "../util/getDbConnection";
import { getBlurhashPreview } from "./getBlurhashPreview";

export async function handler() {
  getBlurhashPreview(
    "https://my-library-cover-uploads.s3.amazonaws.com/small-covers/60a93babcc3928454b5d1cc6/dcf8480a-21cb-4c53-8179-839d006bd52a.jpg"
  );

  const { db, client } = await getDbConnection();

  const books = await db.collection("books").find({}).toArray();

  console.log(books.length);

  await client.close();

  console.log(getDbConnection, getBlurhashPreview);
}
