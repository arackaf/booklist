import { controller } from "easy-express-controllers";
import UserDAO from "../dataAccess/userDAO";

class userController {
  async getPubliclyAvailableUsersName({ _id }) {
    let user = await new UserDAO().getPublicDisplayInfo(_id);
    this.send({ publicName: user && user.publicName, publicBooksHeader: user && user.publicBooksHeader });
  }
  async setPublicSettings({ isPublic, publicName, publicBooksHeader }) {
    let userId = this.request.user.id;
    let result = await new UserDAO().setPublicSettings(userId, isPublic, publicName, publicBooksHeader);
    this.send({});
  }
  async resetPassword({ oldPassword, newPassword }) {
    let userId = this.request.user.id;
    let result = await new UserDAO().resetPassword(userId, oldPassword, newPassword);
    this.send({ ...result });
  }
  async saveNotificationSubscription({ subscription }) {
    let userId = this.request.user.id;
    await new UserDAO().updateSubscription(userId, JSON.parse(subscription));
    this.send({ success: true });
  }
}
controller({ defaultVerb: "post" })(userController);

export default userController;
