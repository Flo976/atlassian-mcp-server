# Atlassian MCP Server

Un serveur MCP (Model Context Protocol) intelligent qui fait le pont entre les agents IA et les APIs Atlassian Cloud (Jira et Confluence). Ce serveur implémente le protocole MCP avec des fonctionnalités avancées comme le cache intelligent, l'apprentissage contextuel et l'analytique prédictive.

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

## 🛠️ Outils MCP Disponibles

Le serveur expose plus de 40 outils MCP organisés en 5 catégories :

### 📋 Jira - Outils de Base
- `create_jira_issue` - Créer un ticket
- `get_jira_issue` - Consulter un ticket
- `update_jira_issue` - Modifier un ticket
- `transition_jira_issue` - Changer le statut
- `add_jira_comment` - Ajouter un commentaire
- `search_jira_issues` - Recherche JQL
- `list_jira_projects` - Lister les projets

### 📋 Jira - Outils Avancés
- `bulk_create_jira_issues` - Création en masse
- `get_jira_workflows` - Gestion des workflows
- `jira_advanced_search` - Recherche avancée avec analytics
- `get_jira_field_suggestions` - Suggestions intelligentes
- `jira_bulk_transition` - Transitions en masse

### 📄 Confluence - Outils de Base
- `create_confluence_page` - Créer une page
- `get_confluence_page` - Consulter une page
- `update_confluence_page` - Modifier une page
- `delete_confluence_page` - Supprimer une page
- `add_confluence_comment` - Ajouter un commentaire
- `list_confluence_spaces` - Lister les espaces
- `search_confluence_pages` - Rechercher des pages

### 📄 Confluence - Outils Avancés
- `bulk_create_confluence_pages` - Création en masse
- `confluence_template_management` - Gestion des templates
- `confluence_content_analysis` - Analyse de contenu
- `confluence_space_analytics` - Analytics des espaces
- `sync_jira_confluence` - Synchronisation Jira ↔ Confluence

### 📊 Analytics & Intelligence
- `get_usage_analytics` - Statistiques d'utilisation
- `predict_workload` - Prédictions de charge de travail
- `suggest_optimizations` - Suggestions d'optimisation
- `generate_reports` - Génération de rapports
- `performance_insights` - Insights de performance

## 🎯 Fonctionnalités Intelligentes

### 🧠 Cache Intelligent
- **90%+ taux de cache** : Réduction drastique des appels API
- **50k entrées** : Cache haute capacité avec nettoyage automatique
- **Prédictif** : Pré-charge des données fréquemment utilisées

### 👤 Apprentissage Contextuel
- **Préférences utilisateur** : Mémorisation des habitudes
- **Suggestions intelligentes** : Propositions basées sur l'historique
- **Auto-complétion** : Champs automatiquement remplis

### 📈 Analytics Avancées
- **Métriques en temps réel** : Performance et utilisation
- **Prédictions** : Anticipation des besoins futurs
- **Optimisations** : Recommandations d'amélioration

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