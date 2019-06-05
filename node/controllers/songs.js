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
    if (!this.request.user.jr_admin) return this.send({ songs: [] });

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
  async updateSong({ _id, title, singers, artist, group }) {
    if (!this.request.user.jr_admin) return this.send({ success: false });
    try {
      let { client, db } = await getDbConnection();

      let $set = {
        title,
        artist
      };
      let packet = {
        $set
      };
      if (group) {
        packet.$unset = { singers: "" };
        $set.group = true;
      } else {
        packet.$unset = { group: "" };
        $set.singers = singers;
      }
      await db.collection("songs").update({ _id: ObjectId(_id) }, packet);

      this.send({ success: true });
    } catch (er) {
      this.send({ success: false });
    }
  }
  async addSong({ _id, title, artist, singers, group }) {
    if (!this.request.user.jr_admin) return this.send({ success: false });

    try {
      let { client, db } = await getDbConnection();

      let song = {
        title,
        artist
      };
      if (!group) {
        song.singers = singers;
      } else {
        song.group = true;
      }
      await db.collection("songs").insertOne(song);

      this.send({ success: true });
    } catch (er) {
      this.send({ success: false });
    }
  }
}

controller({ defaultVerb: "post" })(SongsController);

export default SongsController;
