import fs from 'node:fs';
import path from 'node:path';

const distributionDirection = './dist';
const mainFilePath = path.join(distributionDirection, 'index.js');

function generateMainFile() {
	let importsExports = '';
	const directories = fs.readdirSync(distributionDirection, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory());

	directories.forEach((direction) => {
		const moduleName = direction.name;
		if (moduleName === 'assets') return;
		const functionName = direction.name[0].toUpperCase() + direction.name.slice(1);
		const jsFilePath = path.posix.join(moduleName, 'index.js');
		importsExports += `export { default as ${functionName} } from './${jsFilePath}';\n`;
	});

	fs.writeFileSync(mainFilePath, importsExports);
}

generateMainFile();
