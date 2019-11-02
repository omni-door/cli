export default function () {
  return `declare module '*.md' {
  const content: string;
  export default content;
}
`;
}