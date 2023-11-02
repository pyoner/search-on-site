import type { PageLoad } from './$types';

export const load: PageLoad = ({ setHeaders }) => {
	const maxAge = 60 * 60 * 24;
	setHeaders({
		'cache-control': `public, max-age=${maxAge}`
	});
};
