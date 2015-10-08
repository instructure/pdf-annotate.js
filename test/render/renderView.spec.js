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
  
  renderView(svg, viewport, annotations);

  equal(svg.querySelector('rect').getAttribute('transform'), `scale(1) rotate(${rotation}) translate(${transX}, ${transY})`);
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

    renderView(svg, viewport, [
      {
        type: 'point',
        x: 0,
        y: 0
      }
    ]);

    equal(svg.children.length, 1);

    renderView(svg, viewport, [
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

  it('should render area', function () {
    renderView(svg, viewport, [
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
    renderView(svg, viewport, [
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
    renderView(svg, viewport, [
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
    renderView(svg, viewport, [
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
    renderView(svg, viewport, [
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
    renderView(svg, viewport, [
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
      renderView(svg, viewport, null);
    } catch (e) {
      error = true;
    }

    equal(error, false);
  });

  it('should fail gracefully if no type is provided', function () {
    let error = false;
    try {
      renderView(svg, viewport, [
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
    
    renderView(svg, viewport, annotations);

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
