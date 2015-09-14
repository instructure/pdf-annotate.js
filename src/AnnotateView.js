import arrayFrom from './utils/arrayFrom';
import renderPoint from './render/renderPoint';
import renderDrawing from './render/renderDrawing';
import renderTextbox from './render/renderTextbox';
import renderRectangle from './render/renderRectangle';

export default class AnnotateView {
  constructor(svg, viewport, annotations) {
    this.svg = svg;
    this.viewport = viewport;
    this.annotations = annotations;
  }

  render() {
    let svg = this.svg;

    this.annotations.forEach((a) => {
      let el;
      switch (a.type) {
        case 'highlight':
          el = renderRectangle(a);
          break;
        case 'point':
          el = renderPoint(a);
          break;
        case 'area':
          el = renderRectangle(a);
          break;
        case 'textbox':
          el = renderTextbox(a);
          break;
        case 'drawing':
          el = renderDrawing(a);
          break;
        case 'strikeout':
          el = renderRectangle(a);
          break;
      }

      arrayFrom(el).forEach((e) => {
        svg.appendChild(e);
      });
    });
    
    document.body.appendChild(svg);
  }
}
