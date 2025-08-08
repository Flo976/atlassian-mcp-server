@echo off
title Atlassian MCP Server
cd /d "C:\Users\%USERNAME%\Documents\GitHub\atlassian-mcp-server\mcp-server"

echo.
echo ==========================================
echo 🚀 ATLASSIAN MCP SERVER - DEMARRAGE
echo ==========================================
echo.

echo ⚙️ Configuration des variables d'environnement...
set ATLASSIAN_EMAIL=florent@sooatek.com
set ATLASSIAN_API_TOKEN=ATATT3xFfGF0ZXXHpIdCYNiNlJrAd9zHXpFZdKiiz3kCc5W6vhqecB2M8YNKzNGpgpeGIAiU5WFfEXQMC9ZrBzOsSNQZVx6kUVzW2dG7cUpyp-Pu2UfsGm4AyUH-uNLyPK9tMeP5SWIM1Hf6zB4PLCEnqJXH_Px1p9SR_rSnWa9mQSKirGhw_iM=BE380EAC
set ATLASSIAN_BASE_URL=https://sooatek.atlassian.net

echo 📂 Répertoire actuel: %CD%
echo 📧 Email Atlassian: %ATLASSIAN_EMAIL%
echo 🌐 URL Atlassian: %ATLASSIAN_BASE_URL%
echo.

echo 📦 Vérification des dépendances...
if not exist node_modules (
    echo ⚠️ Dépendances manquantes - Installation en cours...
    npm install
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées avec succès
) else (
    echo ✅ Dépendances déjà présentes
)

echo.
echo 🔄 Lancement du serveur MCP...
echo ⚠️ IMPORTANT: Gardez cette fenêtre ouverte !
echo ⚠️ Claude Code doit être démarré APRÈS ce serveur
echo.

npx ts-node src/index.ts

echo.
echo ❌ Le serveur MCP s'est arrêté de manière inattendue
echo 🔍 Vérifiez les erreurs ci-dessus
echo 💡 Appuyez sur une touche pour fermer cette fenêtre
pause > nul