let i = 0;

import type { PageServerLoad } from './$types';

// @ts-ignore
export async function load(params) {
	console.log('LOADING');

	// const val = params.url.searchParams.get('val');
	const val = params.url.search;

	const result = {
		searchProps: 'Value ' + val + ' ' + i++
	};

	params.setHeaders({
		'cache-control': 'max-age=20000'
	});

	return result;
}
