# Atlassian MCP Server

Un serveur MCP (Model Context Protocol) qui fait le pont entre les agents IA et les APIs Atlassian Cloud (Jira et Confluence). Le serveur fournit actuellement **15 outils MCP fonctionnels** pour les opérations essentielles sur Jira et Confluence, avec une architecture extensible prête pour les fonctionnalités avancées futures.

## 🚀 Fonctionnalités

### Jira
- ✅ Créer des tickets Jira
- ✅ Consulter des tickets par clé
- ✅ Modifier des tickets (résumé, description, priorité, assigné)
- ✅ Effectuer des transitions de statut
- ✅ Ajouter des commentaires
- ✅ Recherche avancée par JQL
- ✅ Lister tous les projets

### Confluence
- ✅ Créer des pages Confluence
- ✅ Consulter des pages par ID
- ✅ Modifier des pages
- ✅ Ajouter des commentaires
- ✅ Lister tous les espaces
- ✅ Rechercher des pages
- ✅ Gérer l'arborescence des pages

## 🛠️ Installation

### Prérequis
- Node.js 16+ 
- Compte Atlassian Cloud avec API token
- Token API Atlassian (généré depuis https://id.atlassian.com/manage-profile/security/api-tokens)

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/Flo976/atlassian-mcp-server
cd atlassian-mcp-server
```

2. **Installer les dépendances**
```bash
npm run install:all
```

3. **Configuration**
Créer un fichier `.env` avec vos informations Atlassian :
```env
ATLASSIAN_EMAIL=votre-email@company.com
ATLASSIAN_API_TOKEN=votre_token_api_atlassian
ATLASSIAN_BASE_URL=https://votre-entreprise.atlassian.net
```

4. **Démarrer le serveur MCP**
```bash
# Compiler et démarrer
npm run build
npm start

# Mode développement (avec rechargement automatique)
npm run dev

# Mode développement avec auto-reload
npm run watch
```

### Installation Docker

1. **Build l'image**
```bash
docker build -t atlassian-mcp-server .
```

2. **Lancer le container**
```bash
docker run -d \
  --name atlassian-mcp \
  -e ATLASSIAN_EMAIL=votre-email@company.com \
  -e ATLASSIAN_API_TOKEN=votre_token_api \
  -e ATLASSIAN_BASE_URL=https://votre-entreprise.atlassian.net \
  atlassian-mcp-server
```

## 🤖 Utilisation avec des Agents IA

### Claude Code

1. **Ajouter le serveur MCP à Claude**
```bash
# Depuis le répertoire du projet
./mcp-server/dist/index-full.js
```

2. **Ou via npm global**
```bash
npm install -g .
atlassian-mcp
```

### Configuration MCP
Le serveur utilise le transport STDIO par défaut, compatible avec :
- Claude Code (`claude.ai/code`)
- n8n avec MCP Client Tool Node
- Tout client compatible MCP

## 🖥️ Démarrage au Boot de l'Ordinateur

### Procédure Manuelle (Recommandée)

**Au démarrage de votre ordinateur, suivez ces étapes dans l'ordre :**

1. **Ouvrir un terminal dans le projet**
```bash
# Naviguer vers le répertoire du serveur MCP
cd C:\Users\[VotreNom]\Documents\GitHub\atlassian-mcp-server\mcp-server

# Définir les variables d'environnement
set ATLASSIAN_EMAIL=votre-email@company.com
set ATLASSIAN_API_TOKEN=votre_token_api_atlassian
set ATLASSIAN_BASE_URL=https://votre-entreprise.atlassian.net

# Démarrer le serveur MCP
npx ts-node src/index.ts
```

2. **Vérifier le démarrage**
Vous devriez voir :
```
🚀 Starting Atlassian MCP Server...
📍 REST API Base URL: http://localhost:3000
🔧 Available Tools: 15
   - Jira tools: 7
   - Confluence tools: 8
✅ MCP Server ready for connections via stdio
💡 Connect with: n8n MCP Client, Claude Desktop, or other MCP clients
```

3. **Laisser le terminal ouvert**
⚠️ **Important** : Ne fermez PAS ce terminal - le serveur MCP doit rester actif pour que Claude Code puisse s'y connecter.

4. **Démarrer Claude Code**
Une fois le serveur MCP lancé, démarrez Claude Code. Il se connectera automatiquement au serveur.

### Démarrage Automatique (Optionnel)

**Pour Windows - Script de démarrage automatique :**

1. **Utiliser le script fourni**
Le projet inclut déjà un script `start-mcp-server.bat` prêt à l'emploi.

2. **Personnaliser les variables** (si nécessaire)
Éditez `start-mcp-server.bat` et modifiez :
```batch
set ATLASSIAN_EMAIL=votre-email@company.com
set ATLASSIAN_API_TOKEN=votre_token
set ATLASSIAN_BASE_URL=https://votre-entreprise.atlassian.net
```

3. **Démarrage automatique**
- Appuyez sur `Win + R` et tapez `shell:startup`
- Créez un raccourci vers `start-mcp-server.bat` dans ce dossier
- Le serveur se lancera automatiquement au démarrage de Windows

4. **Test manuel**
Double-cliquez sur `start-mcp-server.bat` pour tester le script

### Vérification du Fonctionnement

**Dans Claude Code :**
1. Redémarrez Claude Code après avoir lancé le serveur MCP
2. Vérifiez dans les paramètres MCP que `atlassian-mcp` apparaît comme connecté
3. Les 15 outils Atlassian doivent être disponibles dans vos conversations

**Test rapide :**
Dans Claude Code, demandez : "Liste tous les projets Jira disponibles"

### Dépannage

**Si le serveur ne démarre pas :**
- Vérifiez que Node.js et npm sont installés
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez votre connexion internet

**Si Claude Code ne se connecte pas :**
- Vérifiez que le serveur MCP est en cours d'exécution
- Redémarrez Claude Code
- Vérifiez le fichier `claude_desktop_config.json`

## 🛠️ Outils MCP Disponibles

Le serveur expose **15 outils MCP fonctionnels** organisés en 2 catégories principales :

### ✅ 📋 Jira - Outils de Base (7 outils - 100% fonctionnels)
- `create_jira_issue` - Créer un ticket
- `get_jira_issue` - Consulter un ticket par clé
- `update_jira_issue` - Modifier un ticket (résumé, description, priorité, assigné)
- `transition_jira_issue` - Effectuer des transitions de statut
- `comment_jira_issue` - Ajouter des commentaires
- `search_jira_issues` - Recherche avancée par JQL
- `list_jira_projects` - Lister tous les projets

### ✅ 📄 Confluence - Outils de Base (8 outils - 100% fonctionnels)
- `create_confluence_page` - Créer une page
- `get_confluence_page` - Consulter une page par ID
- `update_confluence_page` - Modifier une page
- `delete_confluence_page` - Supprimer une page
- `add_confluence_comment` - Ajouter un commentaire
- `list_confluence_spaces` - Lister tous les espaces
- `search_confluence_pages` - Rechercher des pages
- `get_confluence_page_children` - Gérer l'arborescence des pages

### 🚧 Fonctionnalités En Développement

Pour les fonctionnalités avancées planifiées (analytics, IA, opérations en masse), consultez notre [**ROADMAP.md**](ROADMAP.md) qui détaille :
- **Phase 1** : Opérations en masse et analytics de base
- **Phase 2** : Recherche intelligente et synchronisation
- **Phase 3** : IA prédictive et automatisation avancée

## 🏗️ Architecture Actuelle

### 🔧 Serveur MCP de Production
- **Version stable** : Serveur MCP legacy avec 15 outils fonctionnels
- **Protocol MCP** : Implémentation complète du Model Context Protocol
- **Transport STDIO** : Communication optimisée pour les agents IA
- **Validation Zod** : Schemas de validation stricts pour tous les outils

### 🚀 Infrastructure Avancée (Prête pour Extension)
- **Cache Manager** : Infrastructure de cache intelligente (prête à utiliser)
- **Context Manager** : Gestion des contextes utilisateur (implémentée)
- **AtlassianClient** : Client API robuste avec gestion d'erreurs
- **Tool Executor** : Moteur d'exécution extensible pour nouveaux outils

## 🛡️ Sécurité & Fiabilité

- **Variables d'environnement** : Configuration sécurisée
- **Validation Zod** : Validation stricte des entrées
- **Gestion d'erreurs** : Récupération automatique avec retry
- **Rate limiting** : Protection contre les abus

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Créer une Pull Request

## 📝 Licence

MIT

## 🆘 Support

Pour les problèmes liés à :
- **Atlassian APIs** : Consultez la [documentation officielle Atlassian](https://developer.atlassian.com/)
- **Configuration** : Vérifiez vos variables d'environnement et tokens API
- **Développement** : Créez une issue sur ce repository