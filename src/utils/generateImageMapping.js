const fs = require('fs');
const path = require('path');

const tilesDir = path.resolve(__dirname, '../tiles');
const objectsDir = path.resolve(__dirname, '../objects');

const newTilesDir = path.resolve(__dirname, '../tilesToAdd');
const newObjectsDir = path.resolve(__dirname, '../objectsToAdd');

const mappingFilePath = path.resolve(__dirname, 'imageMapping.js');

function moveNewFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.log(`Directory "${srcDir}" does not exist; skipping.`);
    return;
  }
  const files = fs.readdirSync(srcDir).filter(file =>
    /\.(png|jpe?g|svg)$/i.test(file)
  );
  files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    fs.renameSync(srcPath, destPath);
    console.log(`Moved ${file} from ${srcDir} to ${destDir}`);
  });
}

moveNewFiles(newTilesDir, tilesDir);
moveNewFiles(newObjectsDir, objectsDir);

function loadExistingMapping() {
  if (fs.existsSync(mappingFilePath)) {
    try {
      const existing = require(mappingFilePath);
      return existing;
    } catch (e) {
      console.error("Error loading existing mapping:", e);
      return { tileMapping: {}, objectMapping: {} };
    }
  }
  return { tileMapping: {}, objectMapping: {} };
}

function generateMappingFromDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory "${dir}" does not exist; returning empty mapping.`);
    return {};
  }
  const files = fs.readdirSync(dir).filter(file =>
    /\.(png|jpe?g|svg)$/i.test(file)
  );
  const mapping = {};
  files.forEach(file => {
    const key = file.replace(/\.(png|jpe?g|svg)$/i, '').toLowerCase();
    mapping[key] = file;
  });
  return mapping;
}

function mergeMapping(existingMapping, newMapping) {
  const merged = { ...existingMapping };
  Object.keys(newMapping).forEach(key => {
    if (!(key in merged)) {
      merged[key] = newMapping[key];
    }
  });
  return merged;
}

const existing = loadExistingMapping();

const newTileMapping = generateMappingFromDir(tilesDir);
const newObjectMapping = generateMappingFromDir(objectsDir);

const finalTileMapping = mergeMapping(existing.tileMapping || {}, newTileMapping);
const finalObjectMapping = mergeMapping(existing.objectMapping || {}, newObjectMapping);

const outputContent = `// This file is auto-generated. Do not edit manually.
module.exports = {
  tileMapping: ${JSON.stringify(finalTileMapping, null, 2)},
  objectMapping: ${JSON.stringify(finalObjectMapping, null, 2)}
};
`;

fs.writeFileSync(mappingFilePath, outputContent);
console.log('imageMapping.js generated successfully.');
