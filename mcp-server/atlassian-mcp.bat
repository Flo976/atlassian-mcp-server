@echo off
echo 🚀 Démarrage du serveur MCP Atlassian...
cd /d "%~dp0"
echo 📂 Répertoire: %cd%
npx ts-node src/index.ts