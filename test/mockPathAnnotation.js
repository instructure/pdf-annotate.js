import assign from 'object-assign';
import uuid from '../src/utils/uuid';
import renderPath from '../src/render/renderPath';

const DEFAULT_PATH_ANNOTATION = {color: '000', width: 1, lines: [[113, 81], [115, 80], [119, 79], [123, 77], [126, 75]]};

export default function mockPathAnnotation(annotation) {
  let path = renderPath(assign(DEFAULT_PATH_ANNOTATION, annotation));
  path.setAttribute('data-pdf-annotate-id', uuid());
  path.setAttribute('data-pdf-annotate-type', 'drawing');
  return path;
}

export { DEFAULT_PATH_ANNOTATION };
