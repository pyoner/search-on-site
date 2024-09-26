import bangs from '$lib/bangs/bangs.json';

export const RE_BANG = /^\s*\!(\w+)(?:\s+|$)(.*)/;

export function parseBang(s: string): [bang: string, query: string] | undefined {
	const m = RE_BANG.exec(s);
	if (!m) {
		return;
	}

	const [_, bang, query] = m;
	return [bang, query];
}

export function bangItemStartsWith(bang: string) {
	return bangs.find(({ t }) => t.startsWith(bang));
}

export function fingBangItem(bang: string) {
	return bangs.find(({ t }) => t === bang);
}

export function getBangURL(item: (typeof bangs)[number], query: string) {
	return item.u.replace('{{{s}}}', encodeURIComponent(query));
}
