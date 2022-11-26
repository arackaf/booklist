<script lang="ts">
	export let href: string;
	export let style = '';
	export let disabled = false;
</script>

<a href={disabled ? null : href} {style}>
	<slot />
</a>
