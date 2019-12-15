import { controller } from "easy-express-controllers";

import { downloadBookCover, removeFile, resizeIfNeeded, saveCoverToS3 } from "../util/bookCovers/bookCoverHelpers";

import { ObjectId } from "mongodb";
import { getDbConnection } from "../util/dbUtils";

class BookSummaryController {
  async newSmallImage({ _id, url }) {
    this.sizeAndSetImage({ _id, url, width: 50, imgKey: "smallImage" });
  }
  async sizeAndSetImage({ _id, url, imgKey, width }) {
    if (!this.request.user.admin) {
      return this.send({});
    }
    let userId = this.request.user.id;
    let res = await downloadBookCover(url, 750);

    if (!res) {
      this.send({ failure: true, msg: "failure during download" });
    }

    let { fileName, fullName } = res;
    let newPath = await resizeIfNeeded(fileName, width);

    if (!newPath) {
      this.send({ failure: true, msg: "failure during resize" });
    }

    let s3Key = await saveCoverToS3(newPath, `bookCovers/bookSummary/${fileName}`);
    let { db, client } = await getDbConnection();

    await db.collection("bookSummaries").updateOne(
      { _id: ObjectId(_id) },
      {
        $set: { [imgKey]: s3Key }
      }
    );

    await client.close();

    removeFile(fullName);
    removeFile(newPath);

    this.send({ url: s3Key });
  }
}

controller({ defaultVerb: "post" })(BookSummaryController);

export default BookSummaryController;
