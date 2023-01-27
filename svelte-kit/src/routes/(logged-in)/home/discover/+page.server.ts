export const actions = {
  async search({ request, fetch }: any) {
    const formData: FormData = await request.formData();

    console.log("XXXXXXX SHOULD NOT CALL XXXXXXXX");

    return null;
  }
};
