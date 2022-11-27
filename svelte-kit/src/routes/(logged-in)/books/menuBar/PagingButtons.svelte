<script lang="ts">
	//import { appState } from "app/state/appState";
	//import { currentSearch } from "../booksSearchState";
	//import { pageOne, setPage } from "../setBookFilters";

	export let totalPages: number;
	export let resultsCount: number | string;
	export let booksLoaded: boolean;

	const online = true;
	const page = 1;
	const pageSize = 50;
	const setPage = (page: number) => {};
	const pageOne = () => {};
	//$: ({ online } = $appState);

	//$: ({ page, pageSize } = $currentSearch);

	$: canPageUp = online ? page < totalPages : resultsCount == pageSize;
	$: canPageDown = page > 1;
	$: canPageOne = page > 1;
	$: canPageLast = page < totalPages;

	let pageUp = () => setPage(+page + 1);
	let pageDown = () => setPage(+page - 1);
	let pageLast = () => setPage(totalPages);
</script>

<div style="display: flex; margin-right: 5px; align-items: center">
	<div class="btn-group">
		<button on:click={pageOne} disabled={!canPageOne} class="btn btn-default page-edge"><i class="fal fa-angle-double-left" /></button>
		<button on:click={pageDown} disabled={!canPageDown} class="btn btn-default page" style="margin-right: 5px">
			<i class="fal fa-angle-left" />
		</button>
	</div>
	{#if online}
		<div class="results-holder overlay-holder">
			<span style="display: inline;">
				{#if booksLoaded}
					{#if totalPages}<span><span class="page-label">Page </span>{page} of {totalPages}</span>{:else}<span>No results</span>{/if}
				{:else}<span>Loading...</span>{/if}
			</span>
			<span style="visibility: hidden">
				<span class="page-label">Page </span>1 of 10
			</span>
		</div>
	{/if}
	<div class="btn-group">
		<button on:click={pageUp} disabled={!canPageUp} class="btn btn-default page" style="margin-left: 5px"> <i class="fal fa-angle-right" /> </button>
		{#if online}
			<button on:click={pageLast} disabled={!canPageLast} class="btn btn-default page-edge"><i class="fal fa-angle-double-right" /></button>
		{/if}
	</div>
</div>
