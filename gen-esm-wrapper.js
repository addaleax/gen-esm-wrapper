#!/usr/bin/env node
'use strict';
const isValidIdentifier = require('is-valid-identifier');
const { resolve, relative, dirname } = require('path');
const fs = require('fs');

const source = process.argv[2];
const target = process.argv[3] || '-';

if (typeof source !== 'string') {
  console.error('Usage: esm-wrapper-gen <path-to-module> <path-to-output>');
  return;
}

const cjsSource = require.resolve(resolve(source));
const mod = require(cjsSource);
const keys = new Set(Object.getOwnPropertyNames(mod));

if (typeof mod === 'function') {
  for (const key of ['length', 'prototype', 'name', 'caller'])
    keys.delete(key);
} else if (typeof mod !== 'object' || mod === null) {
  keys.clear();
}

let relPath =
  relative(resolve(target === '-' ? './' : dirname(target)), cjsSource)
  .replace(/\\/g, '/');
if (!relPath.startsWith('./') && !relPath.startsWith('../') && relPath != '..')
  relPath = `./${relPath}`;

let output = `import mod from ${JSON.stringify(relPath)};

`;

output += 'export default mod;\n';
for (const key of keys) {
  if (isValidIdentifier(key)) {
    output += `export const ${key} = mod.${key};\n`;
  }
}

if (target === '-') {
  console.log(output);
} else {
  fs.mkdirSync(dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
}
