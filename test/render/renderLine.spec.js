import renderLine from '../../src/render/renderLine';
import { equal } from 'assert';

function assertLine(line, x, y, w) {
  equal(line.nodeName, 'line');
  equal(line.getAttribute('x1'), x);
  equal(line.getAttribute('y1'), y);
  equal(line.getAttribute('x2'), x + w);
  equal(line.getAttribute('y2'), y);
  equal(line.getAttribute('stroke'), '#f00');
  equal(line.getAttribute('stroke-width'), '1');
}

describe('render::renderLine', function () {
  it('should render a line', function () {
    let [line] = renderLine({
      rectangles: [
        {
          x: 25,
          y: 50,
          width: 100
        }
      ]
    });
  
    assertLine(line, 25, 50, 100);
  });

  it('should render multiple lines', function () {
    let lines = renderLine({
      rectangles: [
        {
          x: 0,
          y: 100,
          width: 250
        },
        {
          x: 75,
          y: 10,
          width: 150
        }
      ]
    });

    assertLine(lines[0], 0, 100, 250);
    assertLine(lines[1], 75, 10, 150);
  });
});
