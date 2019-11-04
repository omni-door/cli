export default function () {
  return `declare module '*.less';

declare module '*.scss';

declare module '*.md' {
  const content: string;
  export default content;
}
`;
}