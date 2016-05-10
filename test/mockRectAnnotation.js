import assign from 'object-assign';
import uuid from '../src/utils/uuid';
import renderRect from '../src/render/renderRect';

const DEFAULT_RECT_ANNOTATION = {rectangles: [{x: 10, y: 10, width: 20, height: 20}]};

export default function mockRectAnnotation(annotation) {
  let rect = renderRect(assign(DEFAULT_RECT_ANNOTATION, annotation));
  Array.prototype.forEach.call(rect, (r) => {
    r.setAttribute('data-pdf-annotate-id', uuid());
    r.setAttribute('data-pdf-annotate-type', 'area');
  });
  return rect;
}

export { DEFAULT_RECT_ANNOTATION };
