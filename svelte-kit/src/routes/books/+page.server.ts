export async function load(params: any) {
	const junk = await params.fetch('/api/books');
	const junkRes = await junk.json();

	console.log(junkRes);

	return {};
}
