import renderSVG from './render/renderSVG';
import renderDrawing from './render/renderDrawing';

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
        case 'drawing':
          el = renderDrawing(a);
          break;
      }

      svg.appendChild(el);
    });
    
    document.body.appendChild(svg);
  }
}
