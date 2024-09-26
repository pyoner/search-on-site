import { filter, pipe, sort, take } from 'remeda';
import bangs from '$lib/bangs/bangs.json';

export type Bang = (typeof bangs)[number];
export const RE_BANG = /^\s*\!(\w+)(?:\s+|$)(.*)/;

export function parseBang(s: string): [bang: string, query: string] | undefined {
	const m = RE_BANG.exec(s);
	if (!m) {
		return;
	}

	const [_, bang, query] = m;
	return [bang, query];
}

const sortBang = (a: Bang, b: Bang) => b.r - a.r;
export function findBangItemsStartsWith(bang: string, amount = 10) {
	return pipe(
		bangs,
		filter(({ t }) => t.startsWith(bang)),
		sort(sortBang),
		take(amount)
	);
}

export function fingBangItem(bang: string) {
	return bangs.find(({ t }) => t === bang);
}

export function getBangURL(item: Bang, query: string) {
	return item.u.replace('{{{s}}}', encodeURIComponent(query));
}

export function getRankedBangs() {
	return pipe(bangs, sort(sortBang));
}
