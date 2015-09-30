import renderText from '../../src/render/renderText';
import { equal } from 'assert';

describe('render::renderText', function () {
  it('should render text', function () {
    let text = renderText({
      x: 50,
      y: 100,
      color: '000',
      size: 20
    });

    equal(text.nodeName, 'text');
    equal(text.getAttribute('x'), 50);
    equal(text.getAttribute('y'), 100);
    equal(text.getAttribute('fill'), '#000');
    equal(text.getAttribute('font-size'), 20);
  });
});
