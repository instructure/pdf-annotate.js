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

  e.setAttribute('transform', `
    scale(${viewport.scale})
    rotate(${viewport.rotation})
    translate(${trans.x}, ${trans.y})
  `);

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

    svg.innerHTML = '';

    this.annotations.forEach((a) => {
      let el;
      switch (a.type) {
        case 'area':
        case 'highlight':
          el = renderRect(a);
          break;
        case 'strikeout':
          el = renderLine(a);
          break;
        case 'point':
          el = renderPoint(a);
          break;
        case 'textbox':
          el = renderText(a);
          break;
        case 'drawing':
          el = renderPath(a);
          break;
      }

      arrayFrom(el).forEach((e) => {
        svg.appendChild(transform(e, viewport));
      });
    });
  }
}
