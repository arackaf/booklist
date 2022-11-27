<script lang="ts">
	//import { appState } from "app/state/appState";
	import { page } from '$app/stores';
	import ModuleLink from './ModuleLink.svelte';

	export let style = '';
	export let href = '';
	export let disabled = false;
	let className = '';
	export { className as class };
	export let onClick: (evt?: any) => void = null as any;

	$: currentModule = $page.route.id;
	$: active = currentModule?.indexOf(href) !== -1;

	const spreadClassNames = (baseCssClasses = '', ...userClasses: string[]) => `${baseCssClasses} ${userClasses.join(' ')}`;

	function liClicked() {
		onClick && onClick();
	}
	/* on:click={liClicked} */
</script>

<li class={spreadClassNames(className || '', !!disabled ? 'disabled' : '', active ? 'active' : '')}>
	<ModuleLink {style} {href}>
		<slot />
	</ModuleLink>
</li>
