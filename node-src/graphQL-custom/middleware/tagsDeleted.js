export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = context.user && context.user.id;
  }
}
