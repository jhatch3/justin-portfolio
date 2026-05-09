// Loads the browser-shaped data/*.js modules (which all assign to window.JH_DATA)
// into a Node-side constant. Order matters: profile.js creates the object,
// the rest extend it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, '..', 'data');

const FILES = [
  'profile.js',
  'projects.js',
  'experience.js',
  'education.js',
  'skills.js',
  'writing.js',
  'now.js',
];

const fakeWindow = {};
for (const file of FILES) {
  const code = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const fn = new Function('window', code);
  fn(fakeWindow);
}

export const JH_DATA = fakeWindow.JH_DATA;
