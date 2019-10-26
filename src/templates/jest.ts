export default function (config: {
  ts: boolean;
}) {
  const { ts } = config;

  return `'use strict';

module.exports = {
  clearMocks: true,

  coverageDirectory: "coverage",

  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
  ],

  roots: [
    "<rootDir>/src"
  ],

  testRegex: "src\/(components|utils)\/.*\/__test__\/.*\.test\.${ts ? 'tsx' : 'jsx'}?$",

  ${ts ? `transform: {
    "^.+\\.tsx?$": "ts-jest"
  },` : ''}
};`;
}

