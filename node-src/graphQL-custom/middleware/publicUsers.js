import ObjectId from "mongodb";

export default class UsersMiddleware {
  async queryPreprocess({ root, args, context, ast }) {
    args.isPublic = true;
  }
}
