import renderRect from '../../src/render/renderRect';
import { equal } from 'assert';

function assertRect(rect, x, y, w, h, c) {
  equal(rect.nodeName, 'rect');
  equal(rect.getAttribute('x'), x);
  equal(rect.getAttribute('y'), y);
  equal(rect.getAttribute('width'), w);
  equal(rect.getAttribute('height'), h);

  if (c) {
    equal(rect.getAttribute('fill'), `#${c}`);
  } else {
    equal(rect.getAttribute('fill'), 'none');
    equal(rect.getAttribute('stroke'), '#f00');
  }
}

describe('render::renderRect', function () {
  it('should render a rect', function () {
    let [rect] = renderRect({
      color: '0ff',
      rectangles: [
        {
          x: 50,
          y: 75,
          width: 100,
          height: 125
        }
      ]
    });

    assertRect(rect, 50, 75, 100, 125, '0ff');
  });

  it('should render multiple rects', function () {
    let rects = renderRect({
      rectangles: [
        {
          x: 50,
          y: 75,
          width: 100,
          height: 125
        },
        {
          x: 100,
          y: 200,
          width: 300,
          height: 400
        }
      ]
    });

    assertRect(rects[0], 50, 75, 100, 125);
    assertRect(rects[1], 100, 200, 300, 400);
  });
});
