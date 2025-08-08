#!/bin/bash

echo "=========================================="
echo "🚀 ATLASSIAN MCP SERVER - DÉMARRAGE LINUX"
echo "=========================================="
echo

# Naviguer vers le répertoire du serveur MCP
cd ~/Documents/atlassian-mcp-server/mcp-server || {
    echo "❌ Erreur: Impossible de trouver le répertoire ~/Documents/atlassian-mcp-server/mcp-server"
    echo "💡 Vérifiez que le projet est cloné dans ~/Documents/"
    exit 1
}

echo "⚙️ Configuration des variables d'environnement..."
export ATLASSIAN_EMAIL="votre-email@company.com"
export ATLASSIAN_API_TOKEN="votre_token_atlassian"
export ATLASSIAN_BASE_URL="https://votre-entreprise.atlassian.net"

echo "📂 Répertoire actuel: $(pwd)"
echo "📧 Email Atlassian: $ATLASSIAN_EMAIL"
echo "🌐 URL Atlassian: $ATLASSIAN_BASE_URL"
echo

echo "📦 Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
    echo "⚠️ Dépendances manquantes - Installation en cours..."
    npm install || {
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    }
    echo "✅ Dépendances installées avec succès"
else
    echo "✅ Dépendances déjà présentes"
fi

echo
echo "🔄 Lancement du serveur MCP..."
echo "⚠️ IMPORTANT: Gardez ce terminal ouvert !"
echo "⚠️ Claude Code doit être démarré APRÈS ce serveur"
echo

# Lancer le serveur MCP
npx ts-node src/index.ts

echo
echo "❌ Le serveur MCP s'est arrêté de manière inattendue"
echo "🔍 Vérifiez les erreurs ci-dessus"
echo "💡 Appuyez sur Entrée pour fermer ce terminal"
read -r