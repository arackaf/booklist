<script>
	import { writable } from 'svelte/store';
	import MainNavigation from '$lib/components/navigation/MainNavigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const appState = writable({ isMobile: false });

	const theme = 'scheme5';
</script>

<div class={`app-container ${theme}`}>
	<div id="app">
		<MainNavigation />
		<main>
			<slot />

			{#if $appState.isMobile}
				<Footer />
			{/if}
		</main>
		{#if !$appState.isMobile}
			<Footer />
		{/if}
	</div>
</div>

<style>
	.app-container {
		overflow: hidden;
		height: 100vh;
		width: 100vw;
	}
</style>
