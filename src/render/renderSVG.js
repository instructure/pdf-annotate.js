export default function renderSVG(viewport) {
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.style.display = 'block';
  svg.style.position = 'absolute';
  svg.style.top = viewport.offsetY + 'px';
  svg.style.left = viewport.offsetX + 'px';
  svg.style.width = viewport.width + 'px';
  svg.style.height = viewport.height + 'px';
  // svg.style.background = 'rgba(0, 0, 0, .2)';

  return svg;
}
