export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = args.publicUserId || (context.user && context.user.id);
  }
  async beforeInsert(tag, root, args, context, ast) {
    tag.timestamp = Date.now();
    tag.userId = context.user.id;
  }
  async beforeUpdate(match, updates, root, args, context, ast) {
    if (!updates.$set) {
      updates.$set = {};
    }
    updates.$set.timestamp = Date.now();

    match.userId = context.user.id;
  }
  beforeDelete(match, root, args, context, ast) {
    match.userId = context.user.id;
  }
  async afterDelete(match, root, args, context, ast) {
    let db = await root.db;
    let ids = args._id ? [args._id] : args._ids;
    await db.collection("tagsDeleted").insertMany(ids.map(_id => ({ _id, userId: context.user.id })));
  }
}
