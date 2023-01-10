export async function load({ locals, fetch, data }: any) {
  const colors = fetch("/api/colors").then((resp: any) => resp.json());

  return {
    ...data,
    colors
  };
}
