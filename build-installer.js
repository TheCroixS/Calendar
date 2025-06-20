const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando el proceso de construcción del instalador...');

// Paso 1: Instalar dependencias
console.log('📦 Instalando dependencias...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencias instaladas correctamente');
} catch (error) {
  console.error('❌ Error al instalar dependencias:', error);
  process.exit(1);
}

// Paso 2: Construir la aplicación React
console.log('🔨 Construyendo la aplicación React...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Aplicación React construida correctamente');
} catch (error) {
  console.error('❌ Error al construir la aplicación React:', error);
  process.exit(1);
}

// Paso 3: Construir el ejecutable de Electron
console.log('⚡ Construyendo el ejecutable de Electron...');
try {
  execSync('npm run electron:build', { stdio: 'inherit' });
  console.log('✅ Ejecutable de Electron construido correctamente');
} catch (error) {
  console.error('❌ Error al construir el ejecutable de Electron:', error);
  process.exit(1);
}

console.log('🎉 ¡Proceso de construcción completado con éxito!');
console.log('📦 El instalador se encuentra en la carpeta dist_electron');
