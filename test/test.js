'use strict';
const assert = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const { execFileSync } = require('child_process');

const updateSnapshots = process.argv[2] === 'update-snapshots';

for (const dir of fs.readdirSync(resolve(__dirname, 'fixtures'))) {
  console.log(`Testing in directory ${dir}`);
  execFileSync(process.execPath, [
    resolve(__dirname, '../gen-esm-wrapper.js'),
    resolve(__dirname, `fixtures/${dir}/index.js`),
    resolve(__dirname, `fixtures/${dir}/out/wrapper.mjs`)
  ]);

  const actual = fs.readFileSync(
    resolve(__dirname, `fixtures/${dir}/out/wrapper.mjs`), 'utf8');
  if (updateSnapshots) {
    fs.writeFileSync(
      resolve(__dirname, `fixtures/${dir}/wrapper.mjs`), actual);
  } else {
    const expected = fs.readFileSync(
      resolve(__dirname, `fixtures/${dir}/wrapper.mjs`), 'utf8');
    assert.strictEqual(actual, expected);
  }
}
