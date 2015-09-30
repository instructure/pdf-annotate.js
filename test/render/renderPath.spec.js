import renderPath from '../../src/render/renderPath';
import { equal } from 'assert';

describe('render::renderPath', function () {
  it('should render a path', function () {
    let path = renderPath({
      color: 'f00',
      lines: [[0, 5], [10, 15], [20, 35]]
    });

    equal(path.nodeName, 'path');
    equal(path.getAttribute('d'), 'M0 5 10 15,M10 15 20 35Z');
    equal(path.getAttribute('stroke'), '#f00');
    equal(path.getAttribute('fill'), 'none');
  });
});
