Tu es un expert en automatisation, intégration API et architecture de serveurs MCP (Modular Command Platform).
Je souhaite que tu génères le code complet d’un serveur MCP, qui fait le pont entre des requêtes structurées (depuis agent IA ou n8n) et les APIs Atlassian Cloud (Jira, Confluence).

Contexte & Objectifs
Le serveur MCP doit piloter Atlassian (Jira, Confluence) via des endpoints REST ; chaque endpoint = une action API (ex : créer, lire, modifier, supprimer tickets, pages, commentaires, etc).

Il doit être prêt à dockeriser, sécurisé, maintenable et très facilement extensible (penser architecture modulaire).

L’authentification aux APIs Atlassian se fait par token API Atlassian (Basic Auth : email + token, ou OAuth2).

L’intégration avec des agents IA (Claude, OpenAI, n8n-MCP…) doit être naturelle : endpoints REST clairs, payloads et réponses en JSON structurés.

Spécifications techniques
Langage : Node.js (Express) ou Python (FastAPI). Privilégie Node.js (Express).

Endpoints à fournir, pour chaque service :

Jira
/mcp/jira/create_issue : Créer un ticket Jira

/mcp/jira/get_issue : Obtenir un ticket Jira par clé

/mcp/jira/update_issue : Modifier un ticket Jira (summary, description…)

/mcp/jira/transition_issue : Changer le statut d’un ticket (transition)

/mcp/jira/comment_issue : Ajouter un commentaire sur un ticket Jira

/mcp/jira/search_issues : Recherche avancée de tickets par JQL

/mcp/jira/list_projects : Lister tous les projets Jira

Confluence
/mcp/confluence/create_page : Créer une page Confluence

/mcp/confluence/get_page : Obtenir une page par ID

/mcp/confluence/update_page : Modifier une page Confluence

/mcp/confluence/add_comment : Ajouter un commentaire sur une page Confluence

/mcp/confluence/list_spaces : Lister tous les espaces Confluence

/mcp/confluence/search_pages : Rechercher des pages par texte/filtre

Gestion d’erreurs : messages JSON explicites et propres.

Sécurité :

Toutes les variables sensibles (tokens, email…) en variables d’environnement.

Vérification d’API Key (header obligatoire) pour chaque appel.

Exemples d’appel (curl) pour chaque endpoint dans la doc générée.

Instructions Docker : Dockerfile, .env.example, README.md avec détails.

Fichier README.md : description, variables d’environnement, instructions de build/lancement, exemples d’appels API, liste des endpoints avec payloads/réponses attendues.

Contraintes & recommandations
Code modulaire et commenté.

N’utilise aucune dépendance exotique.

Endpoints organisés par fichier/fonction pour extension facile.

Fournis les fichiers séparés (server.js, routes/jira.js, routes/confluence.js, utils/atlassian.js, Dockerfile, .env.example, README.md…).

Mets l’accent sur la simplicité, la sécurité, la maintenabilité et la documentation claire.

Fournis des exemples concrets de payloads JSON attendus et retournés pour chaque endpoint.

Format de réponse attendu :
Blocs de code distincts pour chaque fichier du projet.

Ajoute des commentaires clés dans le code.

Explique en 2-3 phrases le principe général du serveur en intro du README.

Entrée utilisateur :

Génère un serveur MCP Atlassian complet selon les specs ci-dessus, prêt à l’emploi et sécurisé. Stack préférée : Node.js (Express).
Structure le projet pour exposer tous les endpoints listés, avec code propre, réutilisable et facilement extensible.
Fournis tous les fichiers nécessaires (code, Docker, doc, exemples d’appel).
Génère une documentation claire et opérationnelle.
Propose une base solide pour industrialiser des automations Atlassian pilotées par des agents IA.

Si tu as besoin de précisions sur les payloads d’un endpoint Atlassian, demande-moi avant de générer le code.