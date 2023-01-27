export const actions = {
  async search({ request, fetch }: any) {
    const formData: FormData = await request.formData();

    let searchParams = new URLSearchParams([
      ["page-size", "20"],
      ["result-set", "compact"]
    ]);

    ["search", "is-read", "child-subjects"].forEach(k => {
      const formVal = formData.get(k);
      if (formVal) {
        searchParams.set(k, formVal.toString());
      }
    });

    ["subjects", "tags"].forEach(k => {
      const formVal = formData.getAll(k) || [];
      console.log("entry", k, { formVal });
      for (const id of formVal) {
        searchParams.append(k, id.toString());
      }
    });

    console.log("SEARCH", searchParams.toString());

    return fetch(`/api/books?${searchParams.toString()}`).then((resp: any) => resp.json());
  }
};
