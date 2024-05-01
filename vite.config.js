import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
import typescript from '@rollup/plugin-typescript';

// const entries = {
// 	// Tabs: fileURLToPath(new URL('src/lib/', import.meta.url)),
// 	Tabs: fileURLToPath(new URL('src/lib/components/tabs/index.ts', import.meta.url)),
// 	Accordions: fileURLToPath(new URL('src/lib/components/Accordions/index.js', import.meta.url)),
// };

function findEntries(startPath) {
	const entries = {};
	const files = fs.readdirSync(startPath);

	files.forEach((file) => {
		const directoryPath = path.join(startPath, file);
		const stat = fs.lstatSync(directoryPath);

		if (stat.isDirectory()) {
			// Поиск файла index.js или index.ts
			const possibleIndexFiles = ['index.js', 'index.ts'];
			for (let index = 0; index < possibleIndexFiles.length; index += 1) {
				const indexFile = possibleIndexFiles[index];
				const indexPath = path.join(directoryPath, indexFile);
				if (fs.existsSync(indexPath)) {
					const componentName = path.basename(file);
					entries[componentName] = fileURLToPath(new URL(indexPath, import.meta.url));
					break; // Прерываем цикл, если нашли подходящий файл
				}
			}
		}
	});

	return entries;
}

const entries = findEntries('./src/lib/components');

console.log(findEntries('./src/lib/components'));

export default defineConfig({

	plugins: [
		typescript({}),
	],
	build: {
		logLevel: 'info',
		minify: false,
		cssCodeSplit: true,
		lib: {
			entry: entries,
			name: 'digitalbutlers-components',
			fileName: 'digitalbutlers-components',
			formats: ['es', 'cjs'], // Форматы сборки
		},
		rollupOptions: {
			// Указываем Rollup обрабатывать каждый компонент как отдельный входной файл
			// input: entries,
			output: {
				entryFileNames: '[name]/index.js',
				chunkFileNames: '[name]/[hash].js',
				assetFileNames: '[name]/[hash].[ext]',
			},

		},
	},
	server: {
		port: 3000,
	},
});
