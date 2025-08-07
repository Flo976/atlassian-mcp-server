# Atlassian MCP Server (Protocol)

Serveur MCP (Model Context Protocol) qui fait le pont entre les agents IA et votre serveur REST Atlassian existant. Ce serveur implémente le protocole MCP complet pour une intégration native avec Claude Desktop, n8n MCP Client et autres outils MCP.

## 🔗 Architecture

```
Claude Desktop / n8n MCP Client  ←→  MCP Server (stdio)  ←→  REST API Server  ←→  Atlassian APIs
```

Le serveur MCP traduit les appels de tools MCP en requêtes HTTP vers votre API REST existante.

## 🚀 Installation et utilisation

### Prérequis
- Node.js 16+
- Serveur REST Atlassian en fonctionnement (port 3000)
- Même clé API que le serveur REST

### Installation

1. **Naviguer vers le dossier MCP**
```bash
cd mcp-server
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration**
```bash
cp .env.example .env
```

Configurez le fichier `.env` :
```env
REST_API_BASE_URL=http://localhost:3000
MCP_API_KEY=votre_cle_api_partagee
MCP_PORT=3001
LOG_LEVEL=info
```

4. **Build et démarrage**
```bash
# Build TypeScript
npm run build

# Démarrer en production
npm start

# Ou en développement avec rechargement
npm run dev
```

## 🔌 Intégration avec n8n

### Configuration du nœud MCP Client

1. **Dans n8n, ajoutez un nœud "MCP Client"**
2. **Configurez les paramètres :**
   - **Transport** : `stdio`
   - **Command** : `node`
   - **Args** : `["/path/to/mcp-server/dist/index.js"]`
   - **Working Directory** : `/path/to/mcp-server`

### Variables d'environnement pour n8n
```bash
# Dans votre environnement n8n
REST_API_BASE_URL=http://your-rest-server:3000
MCP_API_KEY=your_shared_api_key
```

### Exemple d'utilisation dans n8n workflow
Le nœud MCP Client exposera automatiquement tous les outils Jira et Confluence :

- `create_jira_issue`
- `get_jira_issue` 
- `update_jira_issue`
- `transition_jira_issue`
- `comment_jira_issue`
- `search_jira_issues`
- `list_jira_projects`
- `create_confluence_page`
- `get_confluence_page`
- `update_confluence_page`
- `add_confluence_comment`
- `list_confluence_spaces`
- `search_confluence_pages`
- `get_confluence_page_children`
- `delete_confluence_page`

## 🖥️ Intégration avec Claude Desktop

### Configuration

Ajoutez dans votre `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "REST_API_BASE_URL": "http://localhost:3000",
        "MCP_API_KEY": "your_shared_api_key"
      }
    }
  }
}
```

### Utilisation
Claude Desktop découvrira automatiquement tous les outils Atlassian et pourra :
- Créer et gérer des tickets Jira
- Créer et modifier des pages Confluence  
- Effectuer des recherches dans les deux systèmes
- Automatiser les workflows Atlassian

## 🐳 Déploiement Docker

### Build l'image MCP
```bash
docker build -t atlassian-mcp-server .
```

### Docker Compose complet
```yaml
version: '3.8'
services:
  # Serveur REST existant
  atlassian-rest:
    build: ../
    ports:
      - "3000:3000"
    environment:
      - ATLASSIAN_EMAIL=your-email@company.com
      - ATLASSIAN_API_TOKEN=your_token
      - ATLASSIAN_BASE_URL=https://company.atlassian.net
      - MCP_API_KEY=shared_api_key

  # Nouveau serveur MCP  
  atlassian-mcp:
    build: .
    depends_on:
      - atlassian-rest
    environment:
      - REST_API_BASE_URL=http://atlassian-rest:3000
      - MCP_API_KEY=shared_api_key
    # Pas de ports exposés - communication via stdio
```

## 🛠️ Outils disponibles

### Jira (7 outils)
- **create_jira_issue** : Créer un ticket
- **get_jira_issue** : Consulter un ticket  
- **update_jira_issue** : Modifier un ticket
- **transition_jira_issue** : Changer le statut
- **comment_jira_issue** : Ajouter un commentaire
- **search_jira_issues** : Recherche JQL
- **list_jira_projects** : Lister les projets

### Confluence (8 outils)
- **create_confluence_page** : Créer une page
- **get_confluence_page** : Consulter une page
- **update_confluence_page** : Modifier une page
- **add_confluence_comment** : Ajouter un commentaire
- **list_confluence_spaces** : Lister les espaces
- **search_confluence_pages** : Recherche CQL
- **get_confluence_page_children** : Pages enfants
- **delete_confluence_page** : Supprimer une page

## 🔧 Développement

### Structure du projet
```
mcp-server/
├── src/
│   ├── index.ts           # Point d'entrée MCP
│   ├── config.ts          # Configuration
│   ├── rest-client.ts     # Client REST API
│   ├── tool-handlers.ts   # Gestionnaires d'outils
│   └── tools/
│       ├── jira-tools.ts      # Définitions outils Jira
│       └── confluence-tools.ts # Définitions outils Confluence
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Scripts disponibles
```bash
npm run build    # Compiler TypeScript
npm start        # Démarrer en production
npm run dev      # Développement avec rechargement
npm run watch    # Mode watch pour développement
npm run clean    # Nettoyer le dossier dist/
```

## 🔐 Sécurité

- **Authentication unifiée** : Utilise la même clé API que le serveur REST
- **Validation des entrées** : Schémas Zod pour tous les paramètres
- **Transport sécurisé** : Communication stdio sécurisée
- **Isolation** : Le serveur MCP n'a pas accès direct aux APIs Atlassian

## 🚦 Monitoring et logs

Les logs incluent :
- Démarrage du serveur avec configuration
- Appels d'outils avec paramètres (mode debug)
- Erreurs de communication avec l'API REST
- Métriques de performance

## 📋 Tests

Pour tester le serveur MCP :

```bash
# Test avec un client MCP simple
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

## 🤝 Différences avec le serveur REST

| Aspect | Serveur REST | Serveur MCP |
|--------|-------------|-------------|
| **Protocol** | HTTP/REST | MCP (JSON-RPC) |
| **Transport** | HTTP | stdio |
| **Découverte** | Documentation manuelle | Automatique |
| **Clients** | Tous | Outils MCP uniquement |
| **Usage** | API directe | Agents IA |

## 🆘 Troubleshooting

### Le serveur MCP ne démarre pas
- Vérifiez que le serveur REST est accessible
- Validez la clé API dans le fichier `.env`
- Consultez les logs pour les erreurs de configuration

### n8n ne trouve pas les outils
- Vérifiez la configuration stdio dans n8n
- Assurez-vous que le chemin vers `dist/index.js` est correct
- Testez la communication avec le serveur REST directement

### Claude Desktop ne se connecte pas
- Validez la configuration JSON
- Vérifiez les chemins absolus dans la configuration
- Redémarrez Claude Desktop après modification