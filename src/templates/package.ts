import { DevServer } from '../index.d';

export default (config: {
  name: string;
  devServer: DevServer;
}) => {
  const { name, devServer } = config;

  return `{
  "name": "${name}",
  "version": "0.0.1",
  "description": "",
  "main": "lib/index.js",
  "module": "es/index.js",
  "typings": "lib/index.d.ts",
  "scripts": {
    ${devServer ? `"start": "${devServer === 'express' ? 'node server/index.js' : 'bisheng start'}",
    "dev": "${devServer === 'express' ? 'node server/index.js' : 'bisheng start'}",` : ''}
    "test": "omni test",
    "test:snapshot": "omni test --snapshot",
    "lint": "omni lint",
    "lint:commit": "omni lint --commit",
    "lint:fix": "omni lint --fix",
    "build": "omni build",
    "release": "omni release",
    "new": "omni new"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run lint && npm run test",
      "commit-msg": "npm run lint:commit"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "npm run lint:fix",
      "git add"
    ]
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`;
};

