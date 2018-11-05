export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = args.publicUserId || (context.user && context.user.id);
  }
}
