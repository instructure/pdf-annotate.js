import AnnotateView from '../src/AnnotateView';
import uuid from '../src/utils/uuid';
import { equal } from 'assert';

function testRotation(rotation, transX, transY) {
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let viewport = {
    width: 100,
    height: 100,
    scale: 1,
    rotation
  };
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
  
  let view = new AnnotateView(svg, viewport, annotations);
  view.render();

  equal(svg.querySelector('rect').getAttribute('transform'), `scale(1) rotate(${rotation}) translate(${transX}, ${transY})`);
}

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

  it('should reset SVG on each render', function () {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let viewport = {
      width: 100,
      height: 100,
      scale: .5,
      rotation: 0
    };
    let view = new AnnotateView(svg, viewport, [
      {
        type: 'point',
        x: 0,
        y: 0
      }
    ]);
    view.render();

    equal(svg.children.length, 1);

    view = new AnnotateView(svg, viewport, [
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
    view.render();

    equal(svg.children.length, 2);
  });

  it('should transform scale', function () {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let viewport = {
      width: 100,
      height: 100,
      scale: .5,
      rotation: 0
    };
    let annotations = [
      {
        type: 'point',
        x: 100,
        y: 100
      }
    ];
    
    let view = new AnnotateView(svg, viewport, annotations);
    view.render();

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
