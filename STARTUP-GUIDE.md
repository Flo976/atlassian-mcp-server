# 🚀 Guide de Démarrage - Atlassian MCP Server

Ce guide explique comment démarrer correctement le serveur MCP Atlassian au démarrage de votre ordinateur pour qu'il fonctionne avec Claude Code.

## 📋 Prérequis

### Windows
- ✅ Node.js 16+ installé
- ✅ Repository cloné dans `Documents\GitHub\atlassian-mcp-server`
- ✅ Dépendances installées (`npm run install:all`)
- ✅ Claude Code installé
- ✅ Identifiants Atlassian disponibles

### Linux
- ✅ Node.js 16+ installé (`sudo apt install nodejs npm` ou équivalent)
- ✅ Repository cloné dans `~/Documents/atlassian-mcp-server`
- ✅ Dépendances installées (`npm run install:all`)
- ✅ Claude Code installé
- ✅ Identifiants Atlassian disponibles

## ⚡ Procédure de Démarrage Rapide

### 🔥 Option 1: Démarrage Manuel (Recommandé)

**À chaque démarrage d'ordinateur, suivez ces 4 étapes :**

#### 🪟 Windows

##### 1️⃣ Ouvrir PowerShell/Terminal
```powershell
# Naviguer vers le répertoire MCP
cd "C:\Users\[VotreNom]\Documents\GitHub\atlassian-mcp-server\mcp-server"
```

##### 2️⃣ Définir les Variables d'Environnement
```powershell
$env:ATLASSIAN_EMAIL="votre-email@company.com"
$env:ATLASSIAN_API_TOKEN="votre_token_atlassian"  
$env:ATLASSIAN_BASE_URL="https://votre-entreprise.atlassian.net"
```

##### 3️⃣ Démarrer le Serveur MCP
```powershell
npx ts-node src/index.ts
```

#### 🐧 Linux

##### 1️⃣ Ouvrir un Terminal
```bash
# Naviguer vers le répertoire MCP
cd ~/Documents/atlassian-mcp-server/mcp-server
```

##### 2️⃣ Définir les Variables d'Environnement
```bash
export ATLASSIAN_EMAIL="votre-email@company.com"
export ATLASSIAN_API_TOKEN="votre_token_atlassian"
export ATLASSIAN_BASE_URL="https://votre-entreprise.atlassian.net"
```

##### 3️⃣ Démarrer le Serveur MCP
```bash
npx ts-node src/index.ts
```

#### 4️⃣ Vérifier le Statut
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

#### 5️⃣ Laisser le Terminal Ouvert et Démarrer Claude Code
- ⚠️ **NE PAS FERMER** le terminal avec le serveur MCP
- Lancer Claude Code - il se connectera automatiquement

---

### 🤖 Option 2: Démarrage Automatique

#### 🪟 Windows - Script de Démarrage Automatique

**1. Utiliser le script fourni**
Le projet inclut déjà `start-mcp-server.bat` - personnalisez les variables si nécessaire.

**2. Ajouter au démarrage Windows**
```powershell
# Ouvrir le dossier de démarrage automatique
Win + R -> shell:startup

# Créer un raccourci vers start-mcp-server.bat dans ce dossier
```

**3. Redémarrer Windows pour tester**

#### 🐧 Linux - Service Systemd

**1. Créer un fichier de service**
```bash
sudo nano /etc/systemd/system/atlassian-mcp.service
```

**2. Contenu du fichier service :**
```ini
[Unit]
Description=Atlassian MCP Server
After=network.target

[Service]
Type=simple
User=votre-username
WorkingDirectory=/home/votre-username/Documents/atlassian-mcp-server/mcp-server
Environment=ATLASSIAN_EMAIL=votre-email@company.com
Environment=ATLASSIAN_API_TOKEN=votre_token_atlassian
Environment=ATLASSIAN_BASE_URL=https://votre-entreprise.atlassian.net
Environment=NODE_ENV=production
ExecStart=/usr/bin/npx ts-node src/index.ts
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=atlassian-mcp

[Install]
WantedBy=multi-user.target
```

**3. Activer et démarrer le service**
```bash
# Recharger les services systemd
sudo systemctl daemon-reload

# Activer le service au démarrage
sudo systemctl enable atlassian-mcp.service

# Démarrer le service immédiatement
sudo systemctl start atlassian-mcp.service

# Vérifier le statut
sudo systemctl status atlassian-mcp.service
```

**4. Commandes utiles pour le service**
```bash
# Voir les logs en temps réel
sudo journalctl -u atlassian-mcp.service -f

# Arrêter le service
sudo systemctl stop atlassian-mcp.service

# Redémarrer le service
sudo systemctl restart atlassian-mcp.service

# Désactiver le démarrage automatique
sudo systemctl disable atlassian-mcp.service
```

#### 🐧 Linux - Alternative avec crontab

**Pour un démarrage utilisateur (sans sudo) :**

**1. Utiliser le script fourni**
Le projet inclut déjà `start-mcp-server.sh` - personnalisez les variables :
```bash
nano ~/Documents/atlassian-mcp-server/start-mcp-server.sh
```

**2. Rendre le script exécutable** (si pas déjà fait)
```bash
chmod +x ~/Documents/atlassian-mcp-server/start-mcp-server.sh
```

**3. Créer un script pour le crontab**
```bash
nano ~/start-mcp-cron.sh
```

**4. Contenu du script cron :**
```bash
#!/bin/bash
# Attendre que le réseau soit disponible
sleep 30

# Lancer le serveur MCP
cd ~/Documents/atlassian-mcp-server/mcp-server
export ATLASSIAN_EMAIL="votre-email@company.com"
export ATLASSIAN_API_TOKEN="votre_token_atlassian"
export ATLASSIAN_BASE_URL="https://votre-entreprise.atlassian.net"
npx ts-node src/index.ts >> ~/atlassian-mcp.log 2>&1
```

**5. Rendre exécutable et ajouter au crontab**
```bash
# Rendre exécutable
chmod +x ~/start-mcp-cron.sh

# Éditer le crontab
crontab -e

# Ajouter cette ligne pour démarrer au boot
@reboot /home/votre-username/start-mcp-cron.sh

# Vérifier le crontab
crontab -l
```

---

## 🔍 Vérification du Fonctionnement

### ✅ Checklist de Démarrage

- [ ] Terminal avec serveur MCP ouvert et actif
- [ ] Message "MCP Server ready for connections" visible
- [ ] Claude Code démarré APRÈS le serveur MCP
- [ ] Dans Claude Code : paramètres MCP → `atlassian-mcp` connecté
- [ ] Test : "Liste tous les projets Jira" fonctionne

### 🧪 Test de Validation

**Dans Claude Code, tapez :**
```
Utilise l'outil list_jira_projects pour lister tous les projets Jira disponibles
```

**Réponse attendue :**
Une liste des projets Jira avec leurs clés et noms.

---

## 🛠️ Dépannage

### ❌ Problème: Serveur ne démarre pas

**Causes possibles :**
- Node.js non installé
- Variables d'environnement incorrectes  
- Répertoire incorrect
- Dépendances manquantes

**Solutions Windows :**
```powershell
# Vérifier Node.js
node --version
npm --version

# Réinstaller les dépendances
cd mcp-server
npm install

# Vérifier les variables
echo $env:ATLASSIAN_EMAIL
echo $env:ATLASSIAN_BASE_URL
```

**Solutions Linux :**
```bash
# Vérifier Node.js
node --version
npm --version

# Réinstaller les dépendances
cd mcp-server
npm install

# Vérifier les variables
echo $ATLASSIAN_EMAIL
echo $ATLASSIAN_BASE_URL

# Vérifier les logs du service (si utilisé)
sudo journalctl -u atlassian-mcp.service -n 50

# Vérifier les logs crontab
tail -f ~/atlassian-mcp.log
```

### ❌ Problème: Claude Code ne se connecte pas

**Causes possibles :**
- Serveur MCP non démarré
- Configuration MCP incorrecte
- Claude Code démarré avant le serveur

**Solutions :**
1. S'assurer que le serveur MCP est actif
2. Redémarrer Claude Code
3. Vérifier `claude_desktop_config.json` :
   ```json
   {
     "mcpServers": {
       "atlassian-mcp": {
         "command": "npx",
         "args": ["ts-node", "src/index.ts"],
         "cwd": "C:\\Users\\[VotreNom]\\Documents\\GitHub\\atlassian-mcp-server\\mcp-server",
         "env": {
           "ATLASSIAN_EMAIL": "votre-email@company.com",
           "ATLASSIAN_API_TOKEN": "***",
           "ATLASSIAN_BASE_URL": "https://votre-entreprise.atlassian.net"
         }
       }
     }
   }
   ```

### ❌ Problème: Outils non disponibles

**Vérifications :**
- Serveur MCP affiche "15 tools" au démarrage
- Connexion Atlassian réussie
- Token API valide

---

## 🔄 Ordre de Démarrage Critique

**IMPORTANT - Respecter cet ordre :**

1. 🖥️ **Démarrer l'ordinateur**
2. 🟢 **Lancer le serveur MCP** (terminal reste ouvert)  
3. ⏳ **Attendre "MCP Server ready"**
4. 🚀 **Démarrer Claude Code**
5. ✅ **Vérifier la connexion MCP**

**❌ Ne JAMAIS faire :**
- Fermer le terminal du serveur MCP
- Démarrer Claude Code avant le serveur MCP
- Changer les variables d'environnement après le démarrage

---

## 📞 Support

**En cas de problème persistant :**
- Consultez les logs du serveur MCP
- Vérifiez la documentation Atlassian API
- Testez la connexion avec les scripts dans `tests/`

**Fichiers de logs :**
- Console du serveur MCP
- Logs Claude Code : `%APPDATA%\Claude\logs\`

---

## 📦 Distribution - Fichier .DXT pour Claude Desktop

### 🎯 Génération du Fichier .DXT

Le projet peut être empaqueté en fichier `.DXT` pour distribution :

```bash
# Générer le fichier atlassian-mcp-server.dxt
npm run build:dxt
```

### 📥 Installation via Fichier .DXT

**1. Générer ou récupérer le fichier .DXT**
- Soit générer localement avec `npm run build:dxt`
- Soit télécharger depuis les releases GitHub

**2. Installer dans Claude Desktop**
- Ouvrir Claude Desktop
- Aller dans `Extensions > Install from file`
- Sélectionner `atlassian-mcp-server.dxt`
- Configurer les variables d'environnement dans les paramètres de l'extension

**3. Configuration**
Les variables suivantes seront demandées :
- `ATLASSIAN_EMAIL` : votre-email@company.com
- `ATLASSIAN_API_TOKEN` : votre token API Atlassian
- `ATLASSIAN_BASE_URL` : https://votre-entreprise.atlassian.net

### 🎁 Contenu du Package .DXT

Le fichier .DXT inclut :
- ✅ Serveur MCP complet avec 15 outils fonctionnels
- ✅ Toutes les dépendances nécessaires
- ✅ Scripts de démarrage cross-platform
- ✅ Documentation complète
- ✅ Configuration automatique pour Claude Desktop

### 📋 Avantages du .DXT

- **Installation simplifiée** : Un seul fichier à installer
- **Prêt à l'emploi** : Configuration automatique
- **Portable** : Fonctionne sur Windows, Linux et macOS
- **Intégré** : Apparaît directement dans Claude Desktop

---

*Guide créé pour garantir un démarrage fiable du serveur MCP Atlassian avec Claude Code.*