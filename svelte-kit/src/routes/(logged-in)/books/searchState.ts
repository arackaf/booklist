import { page } from '$app/stores';
import { derived, get } from 'svelte/store';

export const searchState = derived(page, $page => {
	const searchParams = $page.url.searchParams;
	const subjects = searchParams.getAll('subjects') ?? [];

	return {
		search: searchParams.get('search') ?? '',
		subjects,
		subjectsLookup: new Set(subjects)
	};
});
