import path from 'path';

export default function () {
  const pkj = require(path.resolve(__dirname, '../../package.json'));
  const CLITAG = pkj?.version?.match?.(/[a-zA-Z]+/g)?.[0];
  const TPLTAG = pkj?.version?.match?.(/[0-9]\.[0-9]/g)?.[0];

  return {
    CLITAG,
    TPLTAG
  };
}