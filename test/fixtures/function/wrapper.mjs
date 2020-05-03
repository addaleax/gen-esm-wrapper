import { createRequire } from 'module';
const mod = createRequire(import.meta.url)("../index.js");

export default mod;
export const a = mod.a;
export const b = mod.b;
export const c = mod.c;
