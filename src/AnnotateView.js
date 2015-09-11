import arrayFrom from './utils/arrayFrom';
import renderSVG from './render/renderSVG';
import renderPoint from './render/renderPoint';
import renderDrawing from './render/renderDrawing';
import renderTextbox from './render/renderTextbox';
import renderRectangle from './render/renderRectangle';

export default class AnnotateView {
  constructor(viewport, annotations) {
    this.viewport = viewport;
    this.annotations = annotations;
  }

  render() {
    let svg = renderSVG(this.viewport);

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
          console.warn('%s not implemented', a.type);
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
