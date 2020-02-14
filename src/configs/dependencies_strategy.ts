import { dependencies, devDependencies } from './dependencies_stable_map';
import { STRATEGY } from '../index.d';

type dependenciesKey = keyof typeof dependencies;
type devDependenciesKey = keyof typeof devDependencies;

export function getDependency (strategy: STRATEGY) {
  return function (key: dependenciesKey | devDependenciesKey) {
    if (strategy === 'latest') {
      return `${key}@latest`;
    }

    return `${key}@${dependencies[key as dependenciesKey] || devDependencies[key as devDependenciesKey] || 'latest'}`;
  };
}

export function arr2str (arr: string[]) {
  return arr.join(' ').trim();
}

export function intersection (arr1: any[], arr2: any[]) {
  const set_2 = new Set(arr2);

  return Array.from(new Set(arr1.filter(v => set_2.has(v))));
}

export default getDependency;