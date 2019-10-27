export default function () {
  const date = new Date();
  return `---
title: Omni Project!
publishDate: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
tags: 
  - test
---

The first content.

---

Hello world!

\`\`\`js
(function () {
  console.log('Hello world!');
})();
\`\`\``;
}



