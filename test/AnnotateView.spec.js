import AnnotateView from '../src/AnnotateView';
import uuid from '../src/utils/uuid';
import { equal } from 'assert';

describe('AnnotateView', function () {
  it('should construct view', function () {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let viewport = {
      width: 100,
      height: 100,
      scale: 1,
      rotation: 0
    };
    let annotations = [
      {
        class: 'Annotation',
        uuid: uuid(),
        page: 1,
        owner: 'admin',
        type: 'point',
        x: 100,
        y: 100
      }
    ];
    let view = new AnnotateView(svg, viewport, annotations);
    
    equal(view.svg, svg);
    equal(view.viewport, viewport);
    equal(view.annotations, annotations);
  });
});
