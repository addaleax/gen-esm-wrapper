'use strict';
const assert = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const { execFileSync } = require('child_process');

const updateSnapshots = process.argv[2] === 'update-snapshots';

const getOutputWithoutTarget = dir => {
  const entrydir = resolve(__dirname, 'fixtures', dir, 'out');
  const origcwd = process.cwd();

  process.chdir(entrydir);
  const stdoutWithoutTarget = execFileSync(process.execPath, [
    resolve(__dirname, '../gen-esm-wrapper.js'),
    resolve(__dirname, `fixtures/${dir}/index.js`)
  ]);
  process.chdir(origcwd);

  return stdoutWithoutTarget;
}

for (const dir of fs.readdirSync(resolve(__dirname, 'fixtures'))) {
  console.log(`Testing in directory ${dir}`);
  execFileSync(process.execPath, [
    resolve(__dirname, '../gen-esm-wrapper.js'),
    resolve(__dirname, `fixtures/${dir}/index.js`),
    resolve(__dirname, `fixtures/${dir}/out/wrapper.mjs`)
  ]);

  // trim the last '\n'
  const outputWithoutTarget = getOutputWithoutTarget(dir).slice(0, -1);

  const actual = fs.readFileSync(
    resolve(__dirname, `fixtures/${dir}/out/wrapper.mjs`), 'utf8');
  if (updateSnapshots) {
    fs.writeFileSync(
      resolve(__dirname, `fixtures/${dir}/wrapper.mjs`), actual);
  } else {
    const expected = fs.readFileSync(
      resolve(__dirname, `fixtures/${dir}/wrapper.mjs`), 'utf8');
    assert.strictEqual(actual, expected);
    assert.strictEqual(Buffer.from(expected).equals(outputWithoutTarget), true);
  }
}

// run --exclude option tests as well
require('./exclude/test');
