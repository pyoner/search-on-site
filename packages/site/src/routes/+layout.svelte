<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.scss';

	function theme(dark = 'dark', ligth = 'light') {
		const m = darkThemeMatcher();
		return {
			isDark() {
				return m.matches;
			},
			detect() {
				this.isDark() ? setTheme(dark) : setTheme(ligth);
			},
			set(name: string) {
				setTheme(name);
			},
			listen() {
				const toggle = ({ matches }: MediaQueryListEvent) => {
					if (matches) {
						setTheme(dark);
					} else {
						setTheme(ligth);
					}
				};
				m.addEventListener('change', toggle);

				return () => m.removeEventListener('change', toggle);
			}
		};
	}

	function darkThemeMatcher() {
		return window.matchMedia('(prefers-color-scheme:dark)');
	}

	function setTheme(theme: string) {
		document.firstElementChild?.setAttribute('data-theme', theme);
	}

	onMount(() => {
		const t = theme();
		t.detect();
		return t.listen();
	});
</script>

<slot />
