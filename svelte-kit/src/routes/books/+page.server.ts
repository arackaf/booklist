import { searchBooks } from '$data/books';

export async function load(params: any) {
	const books = await searchBooks(params.url.searchParams.get('search'));
	//console.log(params);
	//console.log(params.url.searchParams.get('search'));
	//console.log(junkRes);

	console.log({ books });
	console.log('--------------------------');

	return {
		books
	};
}
