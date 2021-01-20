import path from 'path';
const pkj = require(path.resolve(__dirname, '../../package.json'));

export const CLITAG = pkj?.version?.match?.(/[a-zA-Z]+/g)?.[0];
export const TPLTAG = pkj?.version?.match?.(/[0-9]\.[0-9]/g)?.[0];

export default {
  CLITAG,
  TPLTAG
};