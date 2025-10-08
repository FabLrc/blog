#!/usr/bin/env node

/**
 * Script pour générer des secrets sécurisés pour Strapi
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('='.repeat(60));
console.log('🔐 SECRETS STRAPI - À copier dans votre fichier .env');
console.log('='.repeat(60));
console.log('');

console.log('# Généré le:', new Date().toISOString());
console.log('');

console.log('APP_KEYS=' + Array(4).fill().map(() => generateSecret()).join(','));
console.log('API_TOKEN_SALT=' + generateSecret());
console.log('ADMIN_JWT_SECRET=' + generateSecret());
console.log('TRANSFER_TOKEN_SALT=' + generateSecret());
console.log('JWT_SECRET=' + generateSecret());
console.log('ENCRYPTION_KEY=' + generateSecret());

console.log('');
console.log('='.repeat(60));
console.log('⚠️  ATTENTION : Ne partagez JAMAIS ces secrets publiquement !');
console.log('='.repeat(60));
