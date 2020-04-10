import { addPath } from 'app-module-path';

export default function () {
  const cwd = process.cwd();
  addPath(cwd);
  addPath(`${cwd}/node_modules`);
}