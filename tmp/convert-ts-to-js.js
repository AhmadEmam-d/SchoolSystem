#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const srcDir = '/tmp/sandbox/src/app';
const excludePatterns = ['ImageWithFallback.tsx', 'App.tsx'];

function shouldExclude(filepath) {
  return excludePatterns.some(pattern => filepath.includes(pattern));
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!filePath.includes('node_modules')) {
        getAllFiles(filePath, fileList);
      }
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !shouldExclude(filePath)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function convertFile(tsxPath) {
  let jsxPath;
  if (tsxPath.endsWith('.tsx')) {
    jsxPath = tsxPath.replace(/\.tsx$/, '.jsx');
  } else if (tsxPath.endsWith('.ts')) {
    jsxPath = tsxPath.replace(/\.ts$/, '.js');
  } else {
    return null;
  }
  
  // Check if jsx version already exists
  if (fs.existsSync(jsxPath)) {
    console.log(`⏭️  Skipping ${path.basename(tsxPath)} (already exists)`);
    return null;
  }
  
  // Copy file
  try {
    fs.copyFileSync(tsxPath, jsxPath);
    console.log(`✅ Converted: ${path.relative(srcDir, tsxPath)} → ${path.basename(jsxPath)}`);
    return jsxPath;
  } catch (error) {
    console.error(`❌ Error converting ${tsxPath}:`, error.message);
    return null;
  }
}

// Main execution
console.log('🚀 Starting TypeScript to JavaScript conversion...\n');

const allTsFiles = getAllFiles(srcDir);
console.log(`Found ${allTsFiles.length} TypeScript files to convert\n`);

let converted = 0;
let skipped = 0;
let errors = 0;

allTsFiles.forEach(file => {
  const result = convertFile(file);
  if (result) {
    converted++;
  } else if (fs.existsSync(file.replace(/\.tsx?$/, file.endsWith('.tsx') ? '.jsx' : '.js'))) {
    skipped++;
  } else {
    errors++;
  }
});

console.log('\n📊 Conversion Summary:');
console.log(`✅ Converted: ${converted} files`);
console.log(`⏭️  Skipped: ${skipped} files`);
console.log(`❌ Errors: ${errors} files`);
console.log(`\n🎉 Conversion complete!`);
