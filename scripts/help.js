#!/usr/bin/env node

console.log(`
🚀 AI Text Enhancer - Workflow de Versionado

📦 Scripts disponibles:

Comandos básicos:
  npm run build           - Compilar el proyecto
  npm run show:version    - Mostrar versión actual

Versionado manual:
  npm run version:patch   - Incrementar versión patch (1.0.0 → 1.0.1)
  npm run version:minor   - Incrementar versión minor (1.0.0 → 1.1.0) 
  npm run version:major   - Incrementar versión major (1.0.0 → 2.0.0)

Release automático (recomendado):
  npm run release:patch   - Patch + Build + Tag + Push
  npm run release:minor   - Minor + Build + Tag + Push
  npm run release:major   - Major + Build + Tag + Push

🔧 Workflow recomendado:
  1. Hacer tus cambios de código
  2. Ejecutar: npm run release:patch (para fixes)
  3. Copiar la URL del CDN que aparece en la consola
  4. Actualizar tu HTML con la nueva versión

📋 Tipos de versión:
  - PATCH (x.x.X): Bug fixes, correcciones menores
  - MINOR (x.X.x): Nuevas features, cambios compatibles  
  - MAJOR (X.x.x): Breaking changes, cambios incompatibles

🌐 CDN URLs:
  - Latest: https://cdn.jsdelivr.net/gh/carlosvidal/AI-Text-Enhancer@latest/dist/ai-text-enhancer.umd.js
  - Specific: https://cdn.jsdelivr.net/gh/carlosvidal/AI-Text-Enhancer@vX.X.X/dist/ai-text-enhancer.umd.js
  - Purge cache: Agregar ?purge al final de la URL
`);