import render from '../../src/render';
import mockViewport from '../mockViewport';
import { equal } from 'assert';

function _render(annotations) {
  let data = Array.isArray(annotations) ? { annotations } : annotations;
  render(svg, viewport, data);
}

let svg;
let viewport;

describe('render::index', function () {
  beforeEach(function () {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    viewport = mockViewport();
  });

  it('should reset SVG on each render', function () {
    let viewport = mockViewport(undefined, undefined, .5);

    _render([
      {
        type: 'point',
        x: 0,
        y: 0
      }
    ]);

    equal(svg.children.length, 1);

    _render([
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
    _render({
      documentId: '/render',
      pageNumber: 1
    });

    equal(svg.getAttribute('data-pdf-annotate-container'), 'true');
    equal(svg.getAttribute('data-pdf-annotate-viewport'), JSON.stringify(viewport));
    equal(svg.getAttribute('data-pdf-annotate-document'), '/render');
    equal(svg.getAttribute('data-pdf-annotate-page'), '1');
  });

  it('should add document and page if annotations are empty', function () {
    _render({
      documentId: '/render',
      pageNumber: 1,
      annotations: []
    });

    equal(svg.getAttribute('data-pdf-annotate-container'), 'true');
    equal(svg.getAttribute('data-pdf-annotate-viewport'), JSON.stringify(viewport));
    equal(svg.getAttribute('data-pdf-annotate-document'), '/render');
    equal(svg.getAttribute('data-pdf-annotate-page'), '1');
  });

  it('should reset document and page if no data', function () {
    _render({
      documentId: '/render',
      pageNumber: 1,
      annotations: []
    });

    _render();

    equal(svg.getAttribute('data-pdf-annotate-container'), 'true');
    equal(svg.getAttribute('data-pdf-annotate-viewport'), JSON.stringify(viewport));
    equal(svg.getAttribute('data-pdf-annotate-document'), null);
    equal(svg.getAttribute('data-pdf-annotate-page'), null);
  });

  it('should fail gracefully if no annotations are provided', function () {
    let error = false;
    try {
      _render(null);
    } catch (e) {
      error = true;
    }

    equal(error, false);
  });
});
