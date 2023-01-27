export const actions = {
  async search({ request, fetch }: any) {
    const formData: FormData = await request.formData();

    let searchParams = new URLSearchParams([
      ["page-size", "20"],
      ["result-set", "compact"],
      ...["search", "is-read", "child-subjects"].map(k => [k, formData.get(k)?.toString() ?? ""]),
      ...["subjects", "tags"].flatMap(k => (formData.getAll(k) ?? []).map(val => [k, val.toString()]))
    ]);

    const currentQuery = searchParams.toString();
    const result = await fetch(`/api/books?${searchParams.toString()}`).then((resp: any) => resp.json());

    return {
      ...result,
      currentQuery
    };
  }
};
