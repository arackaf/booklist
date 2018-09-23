export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = "5b57f71b6871ae00145198ff";
  }
  async beforeInsert(tag, root, args, context, ast) {
    tag.userId = "5b57f71b6871ae00145198ff";
  }
  async beforeUpdate(match, updates, root, args, context, ast) {
    match.userId = "5b57f71b6871ae00145198ff";
  }
  beforeDelete(match, root, args, context, ast) {
    match.userId = "5b57f71b6871ae00145198ff";
  }
}
