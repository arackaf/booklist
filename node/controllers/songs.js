import { controller } from "easy-express-controllers";

import { MongoClient, ObjectId } from "mongodb";

const dbName = "jellyrolls";
const connString = process.env.JELLYROLLS_CONNECTION;

export async function getDbConnection() {
  let client = await MongoClient.connect(connString, { useNewUrlParser: true });
  let db = await client.db(dbName);

  return { client, db };
}

class SongsController {
  async getSongs({ search }) {
    try {
      let { client, db } = await getDbConnection();

      let res = await db
        .collection("songs")
        .find({ title: RegExp(search, "i") })
        .sort({ title: 1 })
        .toArray();

      this.send({ songs: res });
    } catch (ex) {
      this.send({ songs: [], err: ex });
    }
  }
  async updateSong({ _id, title, singers, group }) {
    try {
      let { client, db } = await getDbConnection();

      let $set = {
        group,
        title
      };
      let packet = {
        $set
      };
      if (group) {
        packet.$unset = { singers: "" };
      } else {
        $set.singers = singers;
      }
      await db.collection("songs").update({ _id: ObjectId(_id) }, packet);

      this.send({ success: true });
    } catch (er) {
      debugger;
      this.send({ success: false });
    }
  }
}

controller({ defaultVerb: "post" })(SongsController);

export default SongsController;
