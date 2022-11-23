let i = 0;

import type { PageServerLoad } from './$types';

// @ts-ignore
export async function load(params) {
	console.log('LOADING');

	const val = params.url.searchParams.get('val');
	//const search = params

	//await new Promise((res) => setTimeout(res, 1000));

	const result = {
		searchProps: 'Value ' + val + ' ' //+ i++
	};

	// params.setHeaders({
	// 	'Cache-Control': 'public, max-age=20'
	// });

	return result;
}
