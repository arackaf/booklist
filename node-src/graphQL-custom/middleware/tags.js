export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = args.publicUserId || (context.user && context.user.id);
  }
  async beforeInsert(tag, root, args, context, ast) {
    tag.userId = context.user.id;
  }
  async beforeUpdate(match, updates, root, args, context, ast) {
    match.userId = context.user.id;
  }
  beforeDelete(match, root, args, context, ast) {
    match.userId = context.user.id;
  }
}
