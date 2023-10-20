<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		const theme = window.matchMedia('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'ligth';
		document.firstElementChild?.setAttribute('data-theme', theme);
	});
</script>

<slot />
