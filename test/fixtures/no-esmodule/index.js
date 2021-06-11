const o = {
  a: 42,
  b() {},
  get c() {}
};

Object.defineProperty(o, '__esModule', { value: true });

module.exports = o;
