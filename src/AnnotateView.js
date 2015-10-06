import arrayFrom from './utils/arrayFrom';
import renderLine from './render/renderLine';
import renderPath from './render/renderPath';
import renderPoint from './render/renderPoint';
import renderRect from './render/renderRect';
import renderText from './render/renderText';

const forEach = Array.prototype.forEach;

function getTranslation(viewport) {
  let x;
  let y;

  // Modulus 360 on the rotation so that we only
  // have to worry about four possible values.
  switch(viewport.rotation % 360) {
    case 0:
      x = y = 0;
      break;
    case 90:
      x = 0;
      y = viewport.width * -1;
      break;
    case 180:
      x = viewport.width * -1;
      y = viewport.height * -1;
      break;
    case 270:
      x = viewport.height * -1;
      y = 0;
      break;
  }

  return { x, y };
}

function transform(e, viewport) {
  let trans = getTranslation(viewport);

  // Let SVG natively transform the element
  e.setAttribute('transform', `scale(${viewport.scale}) rotate(${viewport.rotation}) translate(${trans.x}, ${trans.y})`);

  // Manually adjust x/y for nested SVG nodes
  if (e.nodeName.toLowerCase() === 'svg') {
    e.setAttribute('x', parseInt(e.getAttribute('x'), 10) * viewport.scale);
    e.setAttribute('y', parseInt(e.getAttribute('y'), 10) * viewport.scale);
  }

  // Recurse on child nodes
  forEach.call(e.children, (child) => {
    transform(child, viewport);
  });

  return e;
}

export default class AnnotateView {
  constructor(svg, viewport, annotations) {
    this.svg = svg;
    this.viewport = viewport;
    this.annotations = annotations;
  }

  render() {
    let svg = this.svg;
    let viewport = this.viewport;

    // Reset the content of the SVG
    svg.innerHTML = '';

    this.annotations.forEach((a) => {
      let node;
      switch (a.type) {
        case 'area':
        case 'highlight':
          node = renderRect(a);
          break;
        case 'strikeout':
          node = renderLine(a);
          break;
        case 'point':
          node = renderPoint(a);
          break;
        case 'textbox':
          node = renderText(a);
          break;
        case 'drawing':
          node = renderPath(a);
          break;
      }

      // Node may be either single node, or array of nodes.
      // Ensure we are dealing with an array, then
      // transform, and append each node to the SVG.
      arrayFrom(node).forEach((n) => {
        svg.appendChild(transform(n, viewport));
      });
    });
  }
}
