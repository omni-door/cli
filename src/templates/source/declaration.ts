import { STYLE } from '../../index.d';

export default function (config: {
  style: STYLE;
}) {
  const { style } = config;

  return style ? `declare module '*.less';

declare module '*.scss';

declare module '*.md' {
  const content: string;
  export default content;
}
` : `declare module '*.md' {
  const content: string;
  export default content;
}`;
}