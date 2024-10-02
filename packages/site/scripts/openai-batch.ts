import fs from 'fs';
import OpenAI from 'openai';

import bangs from 'bangs-duckgo/bangs.json';
import { rankedBangs } from 'bangs-duckgo';

type BatchOpts<T> = {
	model: string;
	systemMessage: string;
	userMessage(item: T, index: number, array: T[]): string;
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const batchFilename = 'output.jsonl';
const batchResultFilename = 'result.jsonl';
const batchOpts: BatchOpts<(typeof bangs)[number]> = {
	model: 'gpt-4o',

	systemMessage: `You are internet search expert and SEO writer,
		  user send you a DuckDuckGo bang, you should write a tutorial how to use it.

			The tutorial should contain sections:
			 About - short description about service/domain,
			 Usage
			 Example
			 Result
			 Advanced Search Operators - if this sercvice has them

			The output should be in Markdown format.

			PLEASE DOUBLE CHECK THE INFORMATION!!!

			Example:

			# Hacker News (\`!hn\`)

      ## About
      Hacker News is a social news website focusing on computer science and entrepreneurship.

      ## Usage
      To search for articles on Hacker News, use the bang \`!hn\` followed by your search term.

      ## Example
      \`\`\`
      !hn startup ideas
      \`\`\`

      ## Result
      This will show you Hacker News articles related to "startup ideas".
			`,
	userMessage(item) {
		const message = Array.from(Object.entries(item)).reduce(
			(acc, [key, value]) => acc + `${key}: ${value}, `,
			''
		);
		return message;
	}
};

function jsonToOpenAIBatch<T>(json: T[], opts: BatchOpts<T>) {
	return json.map((item, i) => ({
		custom_id: i.toString(),
		method: 'POST',
		url: '/v1/chat/completions',
		body: {
			model: opts.model,
			messages: [
				{ role: 'system', content: opts.systemMessage },
				{ role: 'user', content: opts.userMessage(item, i, json) }
			],
			max_tokens: 1000
		}
	}));
}

function jsonToJsonl(json: object[]): string {
	return json.map((item) => JSON.stringify(item)).join('\n');
}

async function uploadFile() {
	const file = await openai.files.create({
		file: fs.createReadStream(batchFilename),
		purpose: 'batch'
	});

	console.log('uploaded file', file);
	return file;
}

async function createBatch(fileId: string) {
	const batch = await openai.batches.create({
		input_file_id: fileId,
		endpoint: '/v1/chat/completions',
		completion_window: '24h'
	});

	console.log('created batch file', batch);
	return batch;
}

async function getBatchStatus(fileId: string) {
	const batch = await openai.batches.retrieve(fileId);

	console.log('status of batch file', batch);
	return batch;
}

async function dowloadBatchResult(fileId: string) {
	const fileResponse = await openai.files.content(fileId);
	const fileContents = await fileResponse.text();

	fs.writeFileSync(batchResultFilename, fileContents);
}

async function main() {
	const items = rankedBangs(bangs);
	const top500 = items.slice(0, 500);
	const result = jsonToJsonl(jsonToOpenAIBatch(top500, batchOpts));

	fs.writeFileSync(batchFilename, result);
	const file = await uploadFile();
	if (!file) {
		return console.log('no uploaded file');
	}

	const batch = createBatch(file.id);
}

main();
