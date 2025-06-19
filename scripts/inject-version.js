#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Leer la versión del package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

// Crear un archivo de versión
const versionFile = path.join(__dirname, '..', 'src', 'version.js');
const versionContent = `// Auto-generated version file
export const VERSION = '${version}';
export const BUILD_DATE = '${new Date().toISOString()}';
`;

fs.writeFileSync(versionFile, versionContent);
console.log(`✅ Version file updated: ${version}`);