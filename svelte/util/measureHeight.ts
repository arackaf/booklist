export default function measureHeight(node, onMeasure) {
  let currentHeight = 0;
  const ro = new ResizeObserver(packet => {
    if (currentHeight != node.offsetHeight) {
      currentHeight = node.offsetHeight;
      onMeasure(currentHeight);
    }
  });
  ro.observe(node);

  return {
    destroy() {
      ro.disconnect();
    }
  };
}
