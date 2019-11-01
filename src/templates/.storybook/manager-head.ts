export default function (config: {
  name: string;
}) {
  const { name } = config;

  return `<script>
  document.title = "${name}";
  var observer = new MutationObserver(function(mutations) {
    if (document.title.match(/Storybook$/)) {
      document.title = "${name}";
    }
  }).observe(document.querySelector("title"), {
    childList: true,
    subtree: true,
    characterData: true
  });
</script>`;
}