let i = 0;

// @ts-ignore
export async function load(params) {
  console.log("LOADING");

  // const val = params.url.searchParams.get('val');
  const val = params.url.search;

  const result = {
    searchProps: "Value " + val + " " + " CACHE TEST VALUE === " + i++
  };

  params.setHeaders({
    "cache-control": "max-age=60"
    //Vary: 'Cookie'
  });

  return result;
}

export const actions = {
  default: async (evt: any) => {
    const currentValue = +evt.cookies.get("search-bust");
    const newValue = isNaN(currentValue) ? 1 : currentValue + 1;
    evt.cookies.set("search-bust", newValue);

    return {};
  }
};
