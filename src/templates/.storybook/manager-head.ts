export default function (config: {
  name: string;
}) {
  const { name } = config;

  return `<script>
  var title = '${name}';
  document.title = title;
  var observer = new MutationObserver(function(mutations) {
    if (document.title.match(/Storybook$/) && title !== document.title) {
      document.title = title;
    }
  }).observe(document.querySelector('title'), {
    childList: true,
    subtree: true,
    characterData: true
  });
</script>`;
}