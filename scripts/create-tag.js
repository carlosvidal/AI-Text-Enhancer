#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Leer la versión del package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;
const tagName = `v${version}`;

console.log(`📦 Creando tag ${tagName}...`);

try {
  // Agregar todos los archivos modificados
  execSync('git add .', { stdio: 'inherit' });
  
  // Hacer commit con la nueva versión
  const commitMessage = `Release ${tagName}

- Bump version to ${version}
- Auto-generated release tag

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
  
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  
  // Crear el tag
  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  
  // Push commits y tags
  execSync('git push origin main', { stdio: 'inherit' });
  execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
  
  console.log(`✅ Tag ${tagName} creado y pusheado exitosamente!`);
  console.log(`🔗 jsDelivr CDN URL: https://cdn.jsdelivr.net/gh/carlosvidal/AI-Text-Enhancer@${tagName}/dist/ai-text-enhancer.umd.js`);
  
} catch (error) {
  console.error('❌ Error creando tag:', error.message);
  process.exit(1);
}