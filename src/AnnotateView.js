import arrayFrom from './utils/arrayFrom';
import renderLine from './render/renderLine';
import renderPath from './render/renderPath';
import renderPoint from './render/renderPoint';
import renderRect from './render/renderRect';
import renderText from './render/renderText';

export default class AnnotateView {
  constructor(svg, viewport, annotations) {
    this.svg = svg;
    this.viewport = viewport;
    this.annotations = annotations;
  }

  render() {
    let svg = this.svg;
    let scale = (unit) => unit * this.viewport.scale;

    this.annotations.forEach((a) => {
      let el;
      switch (a.type) {
        case 'area':
        case 'highlight':
          el = renderRect(a, scale);
          break;
        case 'strikeout':
          el = renderLine(a, scale);
          break;
        case 'point':
          el = renderPoint(a, scale);
          break;
        case 'textbox':
          el = renderText(a, scale);
          break;
        case 'drawing':
          el = renderPath(a, scale);
          break;
      }

      arrayFrom(el).forEach((e) => {
        svg.appendChild(e);
      });
    });
  }
}
