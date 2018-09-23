export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = "5b57f71b6871ae00145198ff";
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
