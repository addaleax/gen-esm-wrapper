const assert = require('assert');
const { readFileSync } = require('fs');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const { resolve } = require('path');
const { execPath } = process;

const binPath = resolve(__dirname, '..', '..', 'gen-esm-wrapper.js');
const inputPath = resolve(__dirname, 'fixtures', 'input.js');

async function run(...args) {
  const result = await execFile(execPath, [ binPath, inputPath, ...args ]);
  return result.stdout;
}

function readFixture(name) {
  return readFileSync(resolve(__dirname, 'fixtures', name), 'utf8');
}

(async () => {
  console.log('Running --exclude option tests');

  assert.strictEqual(await run(), readFixture('stdout.mjs'));
  assert.strictEqual(await run('-'), readFixture('stdout.mjs'));
  await run(resolve(__dirname, 'fixtures', 'wrapper.mjs'));
  assert.strictEqual(readFixture('wrapper.mjs'), readFixture('file.mjs'));

  assert.strictEqual(await run('--exclude=^_'), readFixture('stdout-excluded.mjs'));
  assert.strictEqual(await run('-', '--exclude=^_'), readFixture('stdout-excluded.mjs'));
  await run(resolve(__dirname, 'fixtures', 'wrapper-excluded.mjs'), '--exclude=^_');
  assert.strictEqual(readFixture('wrapper-excluded.mjs'), readFixture('file-excluded.mjs'));

  await assert.rejects(() => run('--invalidArg'));
  await assert.rejects(() => run('-', '--invalidArg'));
  await assert.rejects(() => run('-', '--exclude=\\'));
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
