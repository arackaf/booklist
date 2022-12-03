import { searchBooks } from "$data/books";

export async function load(params: any) {
  const s = +new Date();
  const books = searchBooks(params.url.searchParams.get("search"));
  const e = +new Date();

  //console.log(params);
  //console.log(params.url.searchParams.get('search'));
  //console.log(junkRes);

  // console.log({ books });
  // console.log('--------------------------');

  return {
    books
  };
}
