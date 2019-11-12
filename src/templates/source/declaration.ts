import { STYLE } from '../../index.d';

export default function (config: {
  style: STYLE;
}) {
  const { style } = config;

  return style ? `declare module '*.less';

declare module '*.scss';

declare module '*.svg';

declare module '*.png';

declare module '*.jpg';

declare module '*.jpeg';

declare module '*.gif';

declare module '*.md' {
  const content: string;
  export default content;
}
` : `declare module '*.svg';

declare module '*.png';

declare module '*.jpg';

declare module '*.jpeg';

declare module '*.gif';

declare module '*.md' {
  const content: string;
  export default content;
}`;
}