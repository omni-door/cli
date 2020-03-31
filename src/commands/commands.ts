import initial from './initial';
import dev from './dev';
import newTpl from './new';
import build from './build';
import release from './release';
import { setLogo, setBrand } from '@omni-door/utils';

export { default as initial } from './initial';
export { default as dev } from './dev';
export { default as newTpl } from './new';
export { default as build } from './build';
export { default as release } from './release';
export { setLogo, setBrand } from '@omni-door/utils';

export default {
  initial,
  dev,
  new: newTpl,
  build,
  release,
  setLogo,
  setBrand
};