import renderView from '../../src/render/renderView';
import { equal } from 'assert';

function createSVG() {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
}

function mockViewport(width = 100, height = 100, scale = 1, rotation = 0) {
  return {
    width, height, scale, rotation
  };
}

function testRotation(rotation, transX, transY) {
  viewport = mockViewport(undefined, undefined, undefined, rotation);
  let annotations = [
    {
      type: 'highlight',
      color: 'FFFF00',
      rectangles: [{
        x: 125,
        y: 150,
        width: 275,
        height: 40
      }] 
    }
  ];
  
  renderView(svg, viewport, {annotations});

  equal(svg.querySelector('rect').getAttribute('transform'), `scale(1) rotate(${rotation}) translate(${transX}, ${transY})`);
}

function render(annotations) {
  let data = Array.isArray(annotations) ? { annotations } : annotations;
  renderView(svg, viewport, data);
}

let svg;
let viewport;

describe('render::renderView', function () {
  beforeEach(function () {
    svg = createSVG();
    viewport = mockViewport();
  });

  it('should reset SVG on each render', function () {
    let viewport = mockViewport(undefined, undefined, .5);    

    render([
      {
        type: 'point',
        x: 0,
        y: 0
      }
    ]);

    equal(svg.children.length, 1);

    render([
      {
        type: 'point',
        x: 0,
        y: 0
      },
      {
        type: 'point',
        x: 25,
        y: 25
      }
    ]);

    equal(svg.children.length, 2);
  });

  it('should add data-attributes', function () {
    render({
      documentId: '/renderView',
      pageNumber: 1,
      annotations: [
        {
          uuid: 1234,
          type: 'point',
          x: 0,
          y: 0
        },
        {
          uuid: 5678,
          type: 'area',
          x: 0,
          y: 0,
          width: 25,
          height: 25
        }
      ]
    });

    let point = svg.querySelector('svg[data-pdf-annotate-id]');
    let area = svg.querySelector('rect[data-pdf-annotate-id]');

    equal(svg.getAttribute('data-pdf-annotate-container'), 'true');
    equal(svg.getAttribute('data-pdf-annotate-document'), '/renderView');
    equal(svg.getAttribute('data-pdf-annotate-page'), '1');
    equal(point.getAttribute('data-pdf-annotate-id'), '1234');
    equal(point.getAttribute('data-pdf-annotate-type'), 'point');
    equal(area.getAttribute('data-pdf-annotate-id'), '5678');
    equal(area.getAttribute('data-pdf-annotate-type'), 'area');
  });

  it('should render area', function () {
    render([
      {
        type: 'area',
        x: 125,
        y: 225,
        width: 100,
        height: 50
      }
    ]);

    equal(svg.children.length, 1);
    equal(svg.children[0].nodeName.toLowerCase(), 'rect');
  });

  it('should render highlight', function () {
    render([
      {
        type: 'highlight',
        color: 'FF0000',
        rectangles: [
          {
            x: 1,
            y: 1,
            width: 50,
            height: 50
          }
        ]
      }
    ]);

    equal(svg.children.length, 1);
    equal(svg.children[0].nodeName.toLowerCase(), 'rect');
  });

  it('should render strikeout', function () {
    render([
      {
        type: 'strikeout',
        color: 'FF0000',
        rectangles: [{
          x: 125,
          y: 320,
          width: 270,
          height: 1
        }],
      }
    ]);

    equal(svg.children.length, 1);
    equal(svg.children[0].nodeName.toLowerCase(), 'line');
  });

  it('should render textbox', function () {
    render([
      {
        type: 'textbox',
        x: 125,
        y: 400,
        width: 50,
        height: 100,
        size: 20,
        color: '000000',
        content: 'Lorem Ipsum'
      }
    ]);

    equal(svg.children.length, 1);
    equal(svg.children[0].nodeName.toLowerCase(), 'text');
  });

  it('should render point', function () {
    render([
      {
        type: 'point',
        x: 5,
        y: 5
      }
    ]);

    equal(svg.children.length, 1);
    equal(svg.children[0].nodeName.toLowerCase(), 'svg');
  });

  it('should render drawing', function () {
    render([
      {
        type: 'drawing',
        x: 10,
        y: 10,
        lines: [[0, 0], [1, 1]]
      }
    ]);

    equal(svg.children.length, 1);
    equal(svg.children[0].nodeName.toLowerCase(), 'path');
  });

  it('should fail gracefully if no annotations are provided', function () {
    let error = false;
    try {
      render(null);
    } catch (e) {
      error = true;
    }

    equal(error, false);
  });

  it('should fail gracefully if no type is provided', function () {
    let error = false;
    try {
      render([
        { x: 1, y: 1 }
      ]);
    } catch (e) {
      error = true;
    }

    equal(error, false);
  });

  it('should transform scale', function () {
    viewport = mockViewport(undefined, undefined, .5);
    let annotations = [
      {
        type: 'point',
        x: 100,
        y: 100
      }
    ];
    
    render(annotations);

    let nested = svg.querySelector('svg');
    
    equal(nested.getAttribute('x'), 50);
    equal(nested.getAttribute('y'), 50);
    equal(nested.querySelector('svg').getAttribute('x'), 1);
    equal(nested.querySelector('svg').getAttribute('y'), 0.5);
    equal(nested.getAttribute('transform'), 'scale(0.5) rotate(0) translate(0, 0)');
    equal(nested.querySelector('rect').getAttribute('transform'), 'scale(0.5) rotate(0) translate(0, 0)');
    equal(nested.querySelector('path').getAttribute('transform'), 'scale(0.5) rotate(0) translate(0, 0)');
  });
  
  it('should transform rotation 0', function () { testRotation(0, 0, 0); });
  it('should transform rotation 90', function () { testRotation(90, 0, -100); });
  it('should transform rotation 180', function () { testRotation(180, -100, -100); });
  it('should transform rotation 270', function () { testRotation(270, -100, 0); });
  it('should transform rotation 360', function () { testRotation(360, 0, 0); });
  it('should transform rotation 540', function () { testRotation(540, -100, -100); });
});
