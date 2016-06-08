import insertScreenReaderHint from './insertScreenReaderHint';

/**
 * Insert hints into the DOM for screen readers.
 *
 * @param {Array} annotations The annotations that hints are inserted for
 */
export default function renderScreenReaderHints(annotations) {
  // Arrange supported types and associated sort methods
  let types = {
    'highlight': sortByRectPoint,
    'strikeout': sortByRectPoint,
    'textbox': sortByPoint,
    'point': sortByPoint
  };

  // Insert hints for each type
  Object.keys(types).forEach((type) => {
    let sortBy = types[type];
    annotations
      .filter((a) => a.type === type)
      .sort(sortBy)
      .forEach((a, i) => insertScreenReaderHint(a, i + 1));
  });
}

// Sort annotations first by y, then by x.
// This allows hints to be injected in the order they appear,
// which makes numbering them easier.
function sortByPoint(a, b) {
  if (a.y < b.y) {
    return a.x - b.x;
  } else {
    return 1;
  }
}

// Sort annotation by it's first rectangle
function sortByRectPoint(a, b) {
  return sortByPoint(a.rectangles[0], b.rectangles[0]);
}
