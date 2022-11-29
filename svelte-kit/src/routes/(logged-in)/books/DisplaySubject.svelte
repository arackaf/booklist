<script lang="ts">
	import { children } from 'svelte/internal';

	export let subject: any;
</script>

{subject.name}
{#if subject.children.length}
	<ul>
		{#each subject.children as child}
			<li>
				<svelte:self subject={child} />
			</li>
		{/each}
	</ul>
{/if}
