// Loads the browser-shaped data.js (which assigns to window.JH_DATA)
// into a Node-side constant without modifying the source file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(here, '..', 'data.js');
const code = fs.readFileSync(dataPath, 'utf8');

const fakeWindow = {};
const fn = new Function('window', code);
fn(fakeWindow);

export const JH_DATA = fakeWindow.JH_DATA;
