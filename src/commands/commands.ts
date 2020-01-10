import initial from './initial';
import newTpl from './new';
import build from './build';
import release from './release';
import { setBrand } from '../utils/brand';

export { default as initial } from './initial';
export { default as newTpl } from './new';
export { default as build } from './build';
export { default as release } from './release';
export { setBrand } from '../utils/brand';

export default {
  initial,
  new: newTpl,
  build,
  release,
  setBrand
};