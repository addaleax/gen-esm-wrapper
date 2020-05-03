# gen-esm-wrapper

Generate ESM wrapper files for CommonJS modules

This CLI tool makes it easier to support both ES modules and CommonJS modules
for Node.js. It looks at the exports of an existing CommonJS module, and creates
an ES module wrapper file that makes the exports available as named exports.

For example, if you are in the root of your npm package, you can use

```js
gen-esm-wrapper . path/to/wrapper/output.mjs
```

to create a wrapper file, and add

```
  ...
  "exports": {
    "require": "./<same file as 'main'>",
    "import": "./path/to/wrapper/output.mjs"
  }
  ...
```

to your `package.json` in order to make your module available as a dual
ESM/CJS package.
The command can also be added as a build step before publishing.

Note that adding `exports:` to your `package.json` is
[potentially a breaking change](https://medium.com/javascript-in-plain-english/is-promise-post-mortem-cab807f18dcc)
because it restricts the ways in which consumers can `require()` your module.
