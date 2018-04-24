import ObjectId from "mongodb";

export default class UsersMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args._id = ObjectId(context.user.id);
  }
  async beforeUpdate(match, updates, root, args, context, ast) {
    match.userId = ObjectId(context.user.id);
  }
}
