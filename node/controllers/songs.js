import { controller } from "easy-express-controllers";

import { ObjectId } from "mongodb";
import { JrConn } from "../../startApp";

class SongsController {
  async getSongs({ search }) {
    if (!this.request.user.jr_admin) return this.send({ songs: [] });

    try {
      let { client, db } = await JrConn;

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
      let { client, db } = await JrConn;

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
      let { client, db } = await JrConn;

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
