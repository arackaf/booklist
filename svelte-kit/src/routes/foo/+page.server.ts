let i = 0;

// @ts-ignore
export async function load(params) {
	console.log('LOADING FOO');

	//const val = params.url.searchParams.get('val');
	//const search = params

	//await new Promise((res) => setTimeout(res, 1000));

	const result = {
		searchProps: 'FOO' //+ i++
	};

	params.setHeaders({
		'Cache-Control': 'public, max-age=20'
	});

	return result;
}
