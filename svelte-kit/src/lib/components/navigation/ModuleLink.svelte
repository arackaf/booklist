<script lang="ts">
	//import { browseTo } from "util/urlHelpers";
	//import { appState } from "app/state/appState";

	export let href: string;
	export let style = '';
	//export let disabled = false;
	export let onClick: (evt?: any) => void = null as any;

	function anchorClicked(evt: any) {
		evt.preventDefault();

		if (onClick) {
			onClick(evt);
		}
		let newHref = href.replace(/^\//, '');

		//if (!disabled && newHref && newHref != $appState.module) {
		//browseTo(newHref);
		//}
	}
</script>

<a {href} {style} on:click={anchorClicked}>
	<slot />
</a>
