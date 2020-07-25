const assert = require('assert'),
      { readFileSync } = require('fs'),
      { exec } = require('child_process'),
      { resolve } = require('path'),
      { execPath } = process,
      binPath = resolve(__dirname, '..', '..', 'gen-esm-wrapper.js'),
      inputPath = resolve(__dirname, 'fixtures', 'input.js');

function run(...args) {
    return new Promise((resolve, reject) => 
        exec([ execPath, binPath, inputPath, ...args ].join(' '), (err, stdout, stderr) => {
            if (err || stderr)
                reject(err || stderr);
            else
                resolve(stdout);
        }));
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

    assert.rejects(() => run('--invalidArg'));
    assert.rejects(() => run('-', '--invalidArg'));
    assert.rejects(() => run('-', '--exclude=\\\\'));
})().catch(err => { 
    console.error(err);
    process.exit(1);
 });
