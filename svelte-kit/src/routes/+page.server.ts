let i = 0;

export async function load(params: any) {
	console.log('LOADING');
	const result = {
		searchProps: 'Value ' + params.url.search + ' ' + i++
	};

	return result;
}
