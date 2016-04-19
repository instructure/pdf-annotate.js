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
  collidesWithPoint,
  getSize,
  getRectangleSize,
  getDrawingSize,
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

    equal(findSVGAtPoint(rect.left + 1, rect.top + 1), svg);
    equal(findSVGAtPoint(rect.left + rect.width - 1, rect.top + rect.height - 1), svg);
    equal(findSVGAtPoint(rect.left, rect.top), null);
    equal(findSVGAtPoint(rect.left + rect.width, rect.top + rect.height), null);
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

    equal(findAnnotationAtPoint(rect.left + textX + 1, rect.top + textY + 1), text);
    equal(findAnnotationAtPoint(rect.left + textX + textW - 1, rect.top + textY + textH - 1), text);
    equal(findAnnotationAtPoint(rect.left + textX, rect.top + textY), null);
    equal(findAnnotationAtPoint(rect.left + textX + textW, rect.top + textY + textH), null);
  });

  it('should detect if a rect collides with points', function () {
    let rect = {
      top: 10,
      left: 10,
      right: 20,
      bottom: 20
    };

    // above
    equal(collidesWithPoint(rect, 11, 9), false);
    // left
    equal(collidesWithPoint(rect, 9, 11), false);
    // right
    equal(collidesWithPoint(rect, 21, 11), false);
    // below
    equal(collidesWithPoint(rect, 11, 21), false);
    // top left
    equal(collidesWithPoint(rect, 11, 11), true);
    // top right
    equal(collidesWithPoint(rect, 19, 11), true);
    // bottom left
    equal(collidesWithPoint(rect, 11, 19), true);
    // bottom right
    equal(collidesWithPoint(rect, 19, 19), true);
  });

  describe('getSize', function () {
    it('should get the size of a drawing', function () {
      let path = createPath();
      svg.appendChild(path);
      document.body.appendChild(svg);

      deepEqual(getSize(path), getDrawingSize(path));
    });

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
      }).map((line) => {
        svg.appendChild(line);
        return line;
      })[0];

      let x1 = parseInt(line.getAttribute('x1'), 10);
      let x2 = parseInt(line.getAttribute('x2'), 10);
      let y1 = parseInt(line.getAttribute('y1'), 10);
      let y2 = parseInt(line.getAttribute('y2'), 10);

      deepEqual(getSize(line), {
        w: x2 - x1,
        h: (y2 - y1) + 16,
        x: x1,
        y: y1 - (16 / 2)
      });
    });

    it('should get the size of text', function () {
      svg.appendChild(text);
      document.body.appendChild(svg);

      let rect = text.getBoundingClientRect();

      deepEqual(getSize(text), {
        w: rect.width,
        h: rect.height,
        x: parseInt(text.getAttribute('x'), 10),
        y: parseInt(text.getAttribute('y'), 10) - rect.height
      });
    });

    it('should get the size of a rectangle', function () {
      document.body.appendChild(svg);
      let rect = renderRect({
        color: '0ff',
        rectangles: [
          {
            x: 10,
            y: 10,
            width: 100,
            height: 25
          }
        ]
      }).map((rect) => {
        svg.appendChild(rect);
        return rect;
      })[0];
      
      deepEqual(getSize(rect), {
        w: parseInt(rect.getAttribute('width'), 10),
        h: parseInt(rect.getAttribute('height'), 10),
        x: parseInt(rect.getAttribute('x'), 10),
        y: parseInt(rect.getAttribute('y'), 10)
      });
    });
  });
  
  it('should get the size of a rectangle', function () {
    document.body.appendChild(svg);
    let rects = renderRect({
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
    }).map((rect) => {
      rect.setAttribute('data-pdf-annotate-id', 'ann-foo');
      svg.appendChild(rect);
      return rect;
    });

    let size = getRectangleSize(rects[1]);

    equal(size.x, 53);
    equal(size.y, 103);
    equal(size.w, 240);
    equal(size.h, 29);
  });

  it('should get the size of a drawing', function () {
    document.body.appendChild(svg);
    let path = createPath();
    svg.appendChild(path);

    let size = getDrawingSize(path);

    equal(size.x, 33);
    equal(size.y, 36);
    equal(size.w, 10);
    equal(size.h, 4);
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
