import fs from 'fs';
import path from 'path';
import readline from 'readline';

import { rankedBangs } from 'bangs-duckgo';
import bangs from 'bangs-duckgo/bangs.json';

async function parseJsonlFile(filePath: string): Promise<any[]> {
	const fileStream = fs.createReadStream(filePath);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const jsonArray: any[] = [];

	for await (const line of rl) {
		try {
			const jsonObject = JSON.parse(line);
			jsonArray.push(jsonObject);
		} catch (error) {
			console.error('Error parsing JSONL line:', line, error);
		}
	}

	return jsonArray;
}

async function main() {
	const top500 = rankedBangs(bangs).slice(0, 500);

	const dataDir = path.resolve(__dirname, 'data');
	const filePath = path.resolve(dataDir, 'result.jsonl');
	const result = await parseJsonlFile(filePath);
	// console.log(result[0].response.body.choices[0].message);

	const merged = top500.map((item, i) => {
		// console.log('index', i);
		return {
			...item,
			tut: result[i].response.body.choices[0].message.content
		};
	});

	const mergedFilename = path.resolve(dataDir, 'merged.json');
	fs.writeFileSync(mergedFilename, JSON.stringify(merged, null, 2));
}

main();
