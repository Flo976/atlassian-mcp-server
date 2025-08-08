#!/usr/bin/env node

/**
 * Script de lancement du serveur MCP Atlassian pour Claude Code
 * Utilise ts-node pour lancer le serveur legacy fonctionnel
 */

const { spawn } = require('child_process');
const path = require('path');

// Répertoire du serveur MCP
const serverDir = path.dirname(__filename);
const tsNodeBinary = path.join(serverDir, 'node_modules', '.bin', 'ts-node');
const serverScript = path.join(serverDir, 'src', 'index.ts');

console.log('🚀 Démarrage du serveur MCP Atlassian...');
console.log(`📂 Répertoire: ${serverDir}`);
console.log(`🔧 Script: ${serverScript}`);

// Lancer ts-node avec le serveur legacy
const server = spawn('ts-node', [serverScript], {
  cwd: serverDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  },
  shell: true
});

server.on('error', (err) => {
  console.error('❌ Erreur de démarrage du serveur MCP:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Le serveur MCP s'est arrêté avec le code ${code}`);
    process.exit(code);
  }
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur MCP...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur MCP...');
  server.kill('SIGTERM');
});