export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = "573d1b97120426ef0078aa92";
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
