# Atlassian MCP Server

Un serveur MCP (Modular Command Platform) qui fait le pont entre les agents IA, les outils d'automatisation comme n8n et les APIs Atlassian Cloud (Jira et Confluence). Ce serveur expose des endpoints REST clairs pour automatiser les opérations courantes sur Jira et Confluence.

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
npm install
```

3. **Configuration**
```bash
cp .env.example .env
```

Remplir le fichier `.env` avec vos informations :
```env
ATLASSIAN_EMAIL=votre-email@company.com
ATLASSIAN_API_TOKEN=votre_token_api_atlassian
ATLASSIAN_BASE_URL=https://votre-entreprise.atlassian.net
MCP_API_KEY=votre_cle_api_securisee
PORT=3000
```

4. **Démarrer le serveur**
```bash
# Mode production
npm start

# Mode développement (avec rechargement automatique)
npm run dev
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
  -p 3000:3000 \
  -e ATLASSIAN_EMAIL=votre-email@company.com \
  -e ATLASSIAN_API_TOKEN=votre_token_api \
  -e ATLASSIAN_BASE_URL=https://votre-entreprise.atlassian.net \
  -e MCP_API_KEY=votre_cle_api_securisee \
  atlassian-mcp-server
```

Ou avec docker-compose :
```yaml
version: '3.8'
services:
  atlassian-mcp:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ATLASSIAN_EMAIL=votre-email@company.com
      - ATLASSIAN_API_TOKEN=votre_token_api
      - ATLASSIAN_BASE_URL=https://votre-entreprise.atlassian.net
      - MCP_API_KEY=votre_cle_api_securisee
      - NODE_ENV=production
```

## 📚 Documentation API

### Authentification
Tous les endpoints nécessitent un header `X-API-Key` avec votre clé API.

```bash
curl -H "X-API-Key: votre_cle_api" http://localhost:3000/mcp/jira/list_projects
```

### Endpoints disponibles

#### 📋 Jira

**Créer un ticket**
```bash
curl -X POST "http://localhost:3000/mcp/jira/create_issue" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "project": "PROJECT_KEY",
    "summary": "Titre du ticket",
    "description": "Description détaillée",
    "issueType": "Task",
    "priority": "High",
    "labels": ["automation", "api"]
  }'
```

**Consulter un ticket**
```bash
curl -X GET "http://localhost:3000/mcp/jira/get_issue/PROJECT-123" \
  -H "X-API-Key: votre_cle_api"
```

**Modifier un ticket**
```bash
curl -X PUT "http://localhost:3000/mcp/jira/update_issue/PROJECT-123" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Nouveau titre",
    "description": "Nouvelle description",
    "priority": "Medium"
  }'
```

**Changer le statut**
```bash
curl -X POST "http://localhost:3000/mcp/jira/transition_issue/PROJECT-123" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "transition": "In Progress",
    "comment": "Démarrage du travail"
  }'
```

**Ajouter un commentaire**
```bash
curl -X POST "http://localhost:3000/mcp/jira/comment_issue/PROJECT-123" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Commentaire sur le ticket"
  }'
```

**Rechercher des tickets**
```bash
curl -X POST "http://localhost:3000/mcp/jira/search_issues" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "jql": "project = PROJECT_KEY AND status = \"To Do\"",
    "maxResults": 10
  }'
```

**Lister les projets**
```bash
curl -X GET "http://localhost:3000/mcp/jira/list_projects" \
  -H "X-API-Key: votre_cle_api"
```

#### 📄 Confluence

**Créer une page**
```bash
curl -X POST "http://localhost:3000/mcp/confluence/create_page" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "space": "SPACE_KEY",
    "title": "Titre de la page",
    "content": "<p>Contenu de la page en HTML</p>",
    "parentId": "123456"
  }'
```

**Consulter une page**
```bash
curl -X GET "http://localhost:3000/mcp/confluence/get_page/123456" \
  -H "X-API-Key: votre_cle_api"
```

**Modifier une page**
```bash
curl -X PUT "http://localhost:3000/mcp/confluence/update_page/123456" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouveau titre",
    "content": "<p>Nouveau contenu</p>",
    "version": 2
  }'
```

**Ajouter un commentaire**
```bash
curl -X POST "http://localhost:3000/mcp/confluence/add_comment/123456" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "<p>Commentaire sur la page</p>"
  }'
```

**Lister les espaces**
```bash
curl -X GET "http://localhost:3000/mcp/confluence/list_spaces" \
  -H "X-API-Key: votre_cle_api"
```

**Rechercher des pages**
```bash
curl -X POST "http://localhost:3000/mcp/confluence/search_pages" \
  -H "X-API-Key: votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "mot-clé",
    "space": "SPACE_KEY",
    "limit": 10
  }'
```

## 🔧 Intégration avec des agents IA

### Claude / OpenAI
Utilisez les endpoints REST directement dans vos prompts ou outils personnalisés.

### n8n
1. Utilisez le nœud HTTP Request
2. Configurez l'URL de l'endpoint
3. Ajoutez le header `X-API-Key`
4. Structurez votre payload JSON

### Exemple de workflow n8n
```json
{
  "method": "POST",
  "url": "http://localhost:3000/mcp/jira/create_issue",
  "headers": {
    "X-API-Key": "{{$env.MCP_API_KEY}}",
    "Content-Type": "application/json"
  },
  "body": {
    "project": "PROJ",
    "summary": "{{$json.title}}",
    "description": "{{$json.description}}"
  }
}
```

## 🛡️ Sécurité

- **Authentification par clé API** : Tous les endpoints nécessitent une clé API valide
- **Variables d'environnement** : Toutes les informations sensibles sont stockées dans des variables d'environnement
- **Rate limiting** : Protection contre les abus avec limitation de débit
- **Validation des entrées** : Validation stricte de tous les paramètres
- **Gestion d'erreurs sécurisée** : Pas d'exposition d'informations sensibles dans les erreurs

## 🚦 Monitoring

### Endpoints de santé
- `GET /health` : Vérification de l'état du serveur
- `GET /mcp` : Documentation des endpoints disponibles

### Logs
Les logs incluent :
- Requêtes HTTP avec méthodes et codes de réponse
- Erreurs Atlassian avec détails (en mode développement)
- Tentatives d'authentification échouées

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