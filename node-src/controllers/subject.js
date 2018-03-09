import { httpPost, route, nonRoutable } from "easy-express-controllers";
import SubjectDAO from "../dataAccess/subjectDAO";

class subjectController {
  @httpPost
  async delete({ _id }) {
    let subjectDao = new SubjectDAO(this.request.user.id);
    let { subjectsDeleted } = await subjectDao.deleteSubject(_id);
    this.send({ success: true, subjectsDeleted });
  }
}

export default subjectController;
