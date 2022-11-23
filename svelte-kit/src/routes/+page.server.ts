let i = 0;

import type { PageServerLoad } from './$types';

// @ts-ignore
export async function load(params) {
	console.log('LOADING');

	// const val = params.url.searchParams.get('val');
	const val = params.url.search;

	const result = {
		searchProps: 'Value ' + val + ' ' + ' CACHE TEST VALUE === ' + i++
	};

	params.setHeaders({
		'cache-control': 'max-age=60'
	});

	params.depends('search:main');

	return result;
}
