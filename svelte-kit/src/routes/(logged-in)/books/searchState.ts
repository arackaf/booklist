import { page } from '$app/stores';
import { derived, get } from 'svelte/store';

export const searchState = derived(page, $page => {
	const searchParams = $page.url.searchParams;

	return {
		search: searchParams.get('search') ?? ''
	};
});
