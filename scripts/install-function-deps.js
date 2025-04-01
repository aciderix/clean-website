const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Chemin vers le dossier des fonctions
const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');

// Vérifier si le dossier existe
if (!fs.existsSync(functionsDir)) {
  console.log(`Le dossier des fonctions n'existe pas: ${functionsDir}`);
  process.exit(0);
}

// Lister tous les fichiers dans le dossier des fonctions
const files = fs.readdirSync(functionsDir);

// Vérifier si package.json existe
const packageJsonPath = path.join(functionsDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('Installation des dépendances des fonctions Netlify...');
  try {
    // Installer les dépendances dans le dossier des fonctions
    execSync('npm install', { cwd: functionsDir, stdio: 'inherit' });
    console.log('Dépendances des fonctions installées avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'installation des dépendances:', error);
    process.exit(1);
  }
} else {
  console.log('Aucun fichier package.json trouvé dans le dossier des fonctions');
} 