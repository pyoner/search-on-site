import bangs from '$lib/bangs/bangs.json';

export const RE_BANG = /^\s*\!(\w+)(?:\s+|$)(.*)/;

export function parseBang(query: string): [bang: string, s: string] | undefined {
	const m = RE_BANG.exec(query);
	if (!m) {
		return;
	}

	const [_, bang, s] = m;
	return [bang, s];
}

export function bangItemStartsWith(bang: string) {
	return bangs.find(({ t }) => t.startsWith(bang));
}

export function fingBangItem(bang: string) {
	return bangs.find(({ t }) => t === bang);
}

export function getBangURL(item: (typeof bangs)[number], s: string) {
	return item.u.replace('{{{s}}}', encodeURIComponent(s));
}
