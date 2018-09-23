export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = "5b57f71b6871ae00145198ff";
  }
}
