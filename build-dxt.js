#!/usr/bin/env node

/**
 * Script de génération du fichier .DXT pour Claude Desktop
 * 
 * Un fichier .DXT est une extension Claude Desktop empaquetée
 * contenant un serveur MCP et ses métadonnées.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Génération du fichier .DXT pour Claude Desktop...');

// Configuration
const OUTPUT_DIR = 'dist-dxt';
const OUTPUT_FILE = 'atlassian-mcp-server.dxt';

// Fichiers à inclure dans le .DXT
const INCLUDE_FILES = [
  'manifest.json',
  'README.md',
  'STARTUP-GUIDE.md',
  'ROADMAP.md', 
  'package.json',
  'start-mcp-server.bat',
  'start-mcp-server.sh',
  'mcp-server/'
];

// Fichiers à exclure
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  'tests',
  '.git',
  '.github',
  '*.log',
  '*.tmp',
  '.env'
];

async function buildDXT() {
  try {
    console.log('📦 Préparation du répertoire de build...');
    
    // Créer le répertoire de sortie
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true });
    }
    fs.mkdirSync(OUTPUT_DIR);

    console.log('📋 Validation du manifest...');
    
    // Vérifier que le manifest existe
    if (!fs.existsSync('manifest.json')) {
      throw new Error('❌ Fichier manifest.json manquant');
    }

    // Lire et valider le manifest
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    console.log(`✅ Manifest validé - ${manifest.name} v${manifest.version}`);

    console.log('📂 Copie des fichiers...');
    
    // Copier les fichiers nécessaires
    for (const file of INCLUDE_FILES) {
      const srcPath = path.join(process.cwd(), file);
      const destPath = path.join(OUTPUT_DIR, file);
      
      if (fs.existsSync(srcPath)) {
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          console.log(`📁 Copie du répertoire: ${file}`);
          copyDirectory(srcPath, destPath, EXCLUDE_PATTERNS);
        } else {
          console.log(`📄 Copie du fichier: ${file}`);
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.copyFileSync(srcPath, destPath);
        }
      } else {
        console.log(`⚠️ Fichier manquant ignoré: ${file}`);
      }
    }

    console.log('📝 Génération des métadonnées...');
    
    // Créer un fichier de métadonnées
    const metadata = {
      generatedAt: new Date().toISOString(),
      version: manifest.version,
      tools: manifest.tools.length,
      nodeVersion: process.version,
      platform: process.platform
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, '.dxt-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log('🗜️ Création de l\'archive .DXT...');
    
    // Créer l'archive ZIP (renommée en .DXT)
    const archiver = require('archiver');
    const output = fs.createWriteStream(OUTPUT_FILE);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        const size = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log(`✅ Fichier .DXT créé: ${OUTPUT_FILE} (${size} MB)`);
        console.log(`📊 ${archive.pointer()} octets archivés`);
        
        // Nettoyer le répertoire temporaire
        fs.rmSync(OUTPUT_DIR, { recursive: true });
        console.log('🧹 Répertoire temporaire nettoyé');
        
        resolve();
      });

      output.on('error', reject);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(OUTPUT_DIR, false);
      archive.finalize();
    });

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    process.exit(1);
  }
}

function copyDirectory(src, dest, excludePatterns = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    // Vérifier les exclusions
    const shouldExclude = excludePatterns.some(pattern => {
      return item.includes(pattern) || srcPath.includes(pattern);
    });
    
    if (shouldExclude) {
      continue;
    }
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath, excludePatterns);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Installer archiver si nécessaire
try {
  require('archiver');
} catch (error) {
  console.log('📦 Installation d\'archiver...');
  execSync('npm install archiver', { stdio: 'inherit' });
}

// Exécuter la génération
if (require.main === module) {
  buildDXT()
    .then(() => {
      console.log('\n🎉 Génération .DXT terminée avec succès !');
      console.log('\n💡 Pour installer l\'extension dans Claude Desktop :');
      console.log('   1. Ouvrir Claude Desktop');
      console.log('   2. Aller dans Extensions > Install from file');
      console.log(`   3. Sélectionner ${OUTPUT_FILE}`);
      console.log('   4. Configurer les variables d\'environnement');
    })
    .catch((error) => {
      console.error('💥 Échec de la génération:', error);
      process.exit(1);
    });
}