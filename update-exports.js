import fs from 'node:fs';
import path from 'node:path';

const distributionDirection = './dist';
const packageJsonPath = './package.json';

function generateExportsObject() {
	const exports = {};
	const components = fs.readdirSync(distributionDirection, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	components.forEach((component) => {
		console.log('!!!!!!!!!!!', component);
		const jsPath = path.posix.join(
			'.', distributionDirection, component, 'index.js',
		);
		const cssPath = path.posix.join(
			'.', distributionDirection, component, 'index.css',
		);

		exports[`./${component}`] = `./${jsPath}`;
		exports[`./${component}/index.css`] = `./${cssPath}`;
	});

	return exports;
}

function updatePackageJsonExports() {
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	const exportsObject = generateExportsObject();

	packageJson.exports = exportsObject;
	fs.writeFileSync(packageJsonPath, JSON.stringify(
		packageJson, undefined, 2,
	));
}

updatePackageJsonExports();
