import { ObjectId } from "mongodb";

export default class UsersMiddleware {
  queryMiddleware(queryPacket, root, args, context, ast) {
    let { $match } = queryPacket;
    $match._id = ObjectId(context.user.id);
  }
  async beforeUpdate(match, updates, root, args, context, ast) {
    match.userId = ObjectId(context.user.id);
  }
}
