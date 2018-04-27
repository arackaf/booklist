import { httpPost, route, nonRoutable, controller } from "easy-express-controllers";
import tagDAO from "../dataAccess/tagDAO";

class TagController {
  async setInfo({ _id, name, backgroundColor, textColor, parentId }) {
    let tagDao = new tagDAO(this.request.user.id),
      { tag } = await tagDao.updateTagInfo(_id, name, backgroundColor, textColor);

    this.send({ tag });
  }
  async delete({ _id }) {
    let tagDao = new tagDAO(this.request.user.id);
    await tagDao.deleteTag(_id);
    this.send({ success: true });
  }
}

controller({ defaultVerb: "post" })(TagController);

export default TagController;
