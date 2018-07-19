export default class SubjectsMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = "573d1b97120426ef0078aa92";
  }
}
