export const actions = {
  async search({ request, fetch }: any) {
    const formData: FormData = await request.formData();

    let searchParams = new URLSearchParams();

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

    fetch(`/api/books?${searchParams.toString()}`);
  }
};
