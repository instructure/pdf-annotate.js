import renderLine from '../../src/render/renderLine';
import renderPath from '../../src/render/renderPath';
import renderRect from '../../src/render/renderRect';
import mockViewport from '../mockViewport';
import mockSVGContainer from '../mockSVGContainer';
import mockTextAnnotation from '../mockTextAnnotation';
import { equal, deepEqual } from 'assert';
import {
  BORDER_COLOR,
  findSVGContainer,
  findSVGAtPoint,
  findAnnotationAtPoint,
  pointIntersectsRect,
  getAnnotationRect,
  scaleUp,
  scaleDown,
  getScroll,
  getOffset,
  disableUserSelect,
  enableUserSelect,
  getMetadata
} from '../../src/UI/utils';

function createPath() {
  return renderPath({
    width: 1,
    lines: [
      [33, 40],
      [35, 40],
      [36, 39],
      [37, 39],
      [38, 38],
      [39, 37],
      [41, 36],
      [42, 36],
      [43, 36],
      [43, 35]
    ],
  });
}

let div;
let svg;
let text;

describe('UI::utils', function () {
  beforeEach(function () {
    div = document.createElement('div');
    svg = mockSVGContainer();
    text = mockTextAnnotation();
  });

  afterEach(function () {
    enableUserSelect();

    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }

    if (svg.parentNode) {
      svg.parentNode.removeChild(svg);
    }
  });

  it('should provide a border color constant', function () {
    equal(BORDER_COLOR, '#00BFFF');
  });

  it('should find svg container', function () {
    svg.appendChild(text);

    equal(findSVGContainer(text), svg);
  });

  it('should find svg at point', function () {
    svg.style.width = '10px';
    svg.style.height = '10px';
    document.body.appendChild(svg);
    let rect = svg.getBoundingClientRect();

    equal(findSVGAtPoint(rect.left, rect.top), svg);
    equal(findSVGAtPoint(rect.left + rect.width, rect.top + rect.height), svg);
    equal(findSVGAtPoint(rect.left - 1, rect.top - 1), null);
    equal(findSVGAtPoint(rect.left + rect.width + 1, rect.top + rect.height + 1), null);
  });

  it('should find annotation at point', function () {
    text.setAttribute('data-pdf-annotate-type', 'text');
    svg.appendChild(text);
    document.body.appendChild(svg);

    let rect = svg.getBoundingClientRect();
    let textRect = text.getBoundingClientRect();
    let textW = textRect.width;
    let textH = textRect.height;
    let textX = parseInt(text.getAttribute('x'), 10);
    let textY = parseInt(text.getAttribute('y'), 10) - textH; // NOTE this needs to be done to account for how text is rendered

    equal(findAnnotationAtPoint(rect.left + textX, rect.top + textY), text);
    equal(findAnnotationAtPoint(rect.left + textX + textW, rect.top + textY + textH), text);
    equal(findAnnotationAtPoint(rect.left + textX - 1, rect.top + textY - 1), null);
    equal(findAnnotationAtPoint(rect.left + textX + textW + 1, rect.top + textY + textH + 1), null);
  });

  it('should detect if a rect collides with points', function () {
    let rect = {
      top: 10,
      left: 10,
      right: 20,
      bottom: 20
    };

    // above
    equal(pointIntersectsRect(11, 9, rect), false);
    // left
    equal(pointIntersectsRect(9, 11, rect), false);
    // right
    equal(pointIntersectsRect(21, 11, rect), false);
    // below
    equal(pointIntersectsRect(11, 21, rect), false);
    // top left
    equal(pointIntersectsRect(11, 11, rect), true);
    // top right
    equal(pointIntersectsRect(19, 11, rect), true);
    // bottom left
    equal(pointIntersectsRect(11, 19, rect), true);
    // bottom right
    equal(pointIntersectsRect(19, 19, rect), true);
    // shared top left
    equal(pointIntersectsRect(10, 10, rect), true);
    // shared bottom right
    equal(pointIntersectsRect(20, 20, rect), true);
  });

  describe('getAnnotationRect', function () {
    it('should get the size of a line', function () {
      document.body.appendChild(svg);
      let line = renderLine({
        rectangles: [
          {
            x: 10,
            y: 35,
            width: 115,
            height: 20
          }
        ]
      });

      svg.appendChild(line);

      let x1 = parseInt(line.children[0].getAttribute('x1'), 10);
      let x2 = parseInt(line.children[0].getAttribute('x2'), 10);
      let y1 = parseInt(line.children[0].getAttribute('y1'), 10);
      let y2 = parseInt(line.children[0].getAttribute('y2'), 10);

      deepEqual(getAnnotationRect(line.children[0]), {
        width: x2 - x1,
        height: (y2 - y1) + 16,
        left: x1,
        top: y1 - (16 / 2),
        right: x1 + (x2 - x1),
        bottom: y1 - (16 / 2) + (y2 - y1) + 16
      });
    });

    it('should get the size of text', function () {
      svg.appendChild(text);
      document.body.appendChild(svg);

      let rect = text.getBoundingClientRect();

      deepEqual(getAnnotationRect(text), {
        width: rect.width,
        height: rect.height,
        left: parseInt(text.getAttribute('x'), 10),
        top: parseInt(text.getAttribute('y'), 10) - rect.height,
        right: parseInt(text.getAttribute('x'), 10) + rect.width,
        bottom: parseInt(text.getAttribute('y'), 10)
      });
    });

    it('should get the size of a rectangle', function () {
      document.body.appendChild(svg);
      let rect = renderRect({
        type: 'highlight',
        color: '0ff',
        rectangles: [
          {
            x: 10,
            y: 10,
            width: 100,
            height: 25
          }
        ]
      });

      svg.appendChild(rect);

      deepEqual(getAnnotationRect(rect.children[0]), {
        width: parseInt(rect.children[0].getAttribute('width'), 10),
        height: parseInt(rect.children[0].getAttribute('height'), 10),
        left: parseInt(rect.children[0].getAttribute('x'), 10),
        top: parseInt(rect.children[0].getAttribute('y'), 10),
        right: parseInt(rect.children[0].getAttribute('x'), 10) + parseInt(rect.children[0].getAttribute('width'), 10),
        bottom: parseInt(rect.children[0].getAttribute('y'), 10) + parseInt(rect.children[0].getAttribute('height'), 10)
      });
    });
  });
  
  it('should get the size of a rectangle', function () {
    document.body.appendChild(svg);
    let rect = renderRect({
      type: 'highlight',
      color: '0ff',
      rectangles: [
        {
          x: 65,
          y: 103,
          width: 228,
          height: 9,
        },
        {
          x: 53,
          y: 113,
          width: 240,
          height: 9
        },
        {
          x: 53,
          y: 123,
          width: 205,
          height: 9
        }
      ]
    });

    rect.setAttribute('data-pdf-annotate-id', 'ann-foo');
    svg.appendChild(rect);

    let size = getAnnotationRect(rect);

    equal(size.left, 53);
    equal(size.top, 103);
    equal(size.width, 240);
    equal(size.height, 29);
    equal(size.right, 53 + 240);
    equal(size.bottom, 103 + 29);
  });

  it('should get the size of a drawing', function () {
    document.body.appendChild(svg);
    let path = createPath();
    svg.appendChild(path);

    let size = getAnnotationRect(path);

    equal(size.left, 33);
    equal(size.top, 36);
    equal(size.width, 10);
    equal(size.height, 4);
    equal(size.right, 33 + 10);
    equal(size.bottom, 36 + 4);
  });

  it('should scale up', function () {
    svg.setAttribute('data-pdf-annotate-viewport', JSON.stringify(mockViewport(undefined, undefined, 1.5)));
    let rect = scaleUp(svg, {top: 100, left: 100, width: 200, height: 200});

    equal(rect.top, 150);
    equal(rect.left, 150);
    equal(rect.width, 300);
    equal(rect.height, 300);
  });
  
  it('should scale down', function () {
    svg.setAttribute('data-pdf-annotate-viewport', JSON.stringify(mockViewport(undefined, undefined, 1.5)));
    let rect = scaleDown(svg, {top: 150, left: 150, width: 300, height: 300});

    equal(rect.top, 100);
    equal(rect.left, 100);
    equal(rect.width, 200);
    equal(rect.height, 200);
  });

  it('should get scroll', function () {
    svg.appendChild(text);
    div.appendChild(svg);
    document.body.appendChild(div);
    div.style.overflow = 'auto';
    div.style.height = '5px';
    div.style.width = '5px';
    div.scrollTop = 10;
    div.scrollLeft = 25;

    let { scrollLeft, scrollTop } = getScroll(text);

    equal(scrollLeft, 25);
    equal(scrollTop, 10);
  });

  it('should get offset', function () {
    svg.appendChild(text);
    document.body.appendChild(svg);

    let rect = svg.getBoundingClientRect();
    let { offsetLeft, offsetTop } = getOffset(text);

    equal(offsetTop, rect.top);
    equal(offsetLeft, rect.left);
  });

  it('should disable user select', function () {
    disableUserSelect();

    equal(document.head.querySelector('style[data-pdf-annotate-user-select]').nodeName, 'STYLE');
  });

  it('should enable user select', function () {
    disableUserSelect();
    enableUserSelect();

    equal(document.head.querySelector('style[data-pdf-annotate-user-select]'), null);
  });
  
  it('should get metadata', function () {
    let {
      documentId,
      pageNumber,
      viewport
    } = getMetadata(svg);

    equal(documentId, 'test-document-id');
    equal(pageNumber, 1);
    equal(typeof viewport, 'object');
  });
});
