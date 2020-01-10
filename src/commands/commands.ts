import initial from './initial';
import newTpl from './new';
import build from './build';
import release from './release';
import { setLogo, setBrand } from '../utils/log_prefix';

export { default as initial } from './initial';
export { default as newTpl } from './new';
export { default as build } from './build';
export { default as release } from './release';
export { setLogo, setBrand } from '../utils/log_prefix';

export default {
  initial,
  new: newTpl,
  build,
  release,
  setLogo,
  setBrand
};