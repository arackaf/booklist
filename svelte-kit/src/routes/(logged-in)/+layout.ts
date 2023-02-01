export async function load({ fetch, data }: any) {
  const colors = fetch("/api/colors").then((resp: any) => resp.json());

  return {
    ...data,
    colors
  };
}
