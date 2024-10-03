import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import bangs from './merged.json';

import rehypeFormat from 'rehype-format';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
	.use(remarkParse)
	.use(remarkDirective)
	.use(remarkFrontmatter)
	.use(remarkGfm)
	.use(remarkMath)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeRaw)
	.use(rehypeFormat)
	.use(rehypeSanitize)
	.use(rehypeStringify);

export const load: PageLoad = async ({ params }) => {
	const item = bangs.find((item) => item.bang === params.bang);
	if (item) {
		return {
			content: await processor.process(item.tut)
		};
	}
	error(404, 'Not found');
};
