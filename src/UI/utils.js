import createStyleSheet from 'create-stylesheet';

export const BORDER_COLOR = '#00BFFF';

const userSelectStyleSheet = createStyleSheet({
  body: {
    '-webkit-user-select': 'none',
       '-moz-user-select': 'none',
        '-ms-user-select': 'none',
            'user-select': 'none'
  }
});
userSelectStyleSheet.setAttribute('data-pdf-annotate-user-select', 'true');

export function findSVGContainer(node) {
  let parentNode = node;

  while ((parentNode = parentNode.parentNode) &&
          parentNode !== document) {
    if (parentNode.nodeName.toUpperCase() === 'SVG' &&
        parentNode.getAttribute('data-pdf-annotate-container') === 'true') {
      return parentNode;
    }
  }

  return null;
}

export function findSVGAtPoint(x, y) {
  let elements = document.querySelectorAll('svg[data-pdf-annotate-container="true"]');

  for (let i=0, l=elements.length; i<l; i++) {
    let el = elements[i];
    let rect = el.getBoundingClientRect();

    if (collidesWithPoint(rect, x, y)) {
      return el;
    }
  }

  return null;
}

export function findAnnotationAtPoint(x, y) {
  let elements = document.querySelectorAll('svg[data-pdf-annotate-container="true"] [data-pdf-annotate-type]');

  // Find a target element within SVG
  for (let i=0, l=elements.length; i<l; i++) {
    let el = elements[i];
    let size = getSize(el);
    let { offsetLeft, offsetTop } = getOffset(el);
    let rect = {
      top: size.y + offsetTop,
      left: size.x + offsetLeft,
      right: size.x + size.w + offsetLeft,
      bottom: size.y + size.h + offsetTop
    };

    if (collidesWithPoint(rect, x, y)) {   
      return el;
    }
  }

  return null;
}

export function collidesWithPoint(rect, x, y) {
  return y > rect.top && y < rect.bottom && x > rect.left && x < rect.right;
}

export function getSize(el) {
  let h = 0, w = 0, x = 0, y = 0;

  switch (el.nodeName.toLowerCase()) {
    case 'path':
    return getDrawingSize(el);
    break;

    case 'line':
    h = parseInt(el.getAttribute('y2'), 10) - parseInt(el.getAttribute('y1'), 10);
    w = parseInt(el.getAttribute('x2'), 10) - parseInt(el.getAttribute('x1'), 10);
    x = parseInt(el.getAttribute('x1'), 10);
    y = parseInt(el.getAttribute('y1'), 10);

    if (h === 0) {
      // TODO this should be calculated somehow
      let offset = 16;
      h += offset;
      y -= (offset / 2)
    }
    break;

    case 'text':
    let rect = el.getBoundingClientRect();
    h = rect.height;
    w = rect.width;
    x = parseInt(el.getAttribute('x'), 10);
    y = parseInt(el.getAttribute('y'), 10) - h;
    break;

    default:
    h = parseInt(el.getAttribute('height'), 10);
    w = parseInt(el.getAttribute('width'), 10);
    x = parseInt(el.getAttribute('x'), 10);
    y = parseInt(el.getAttribute('y'), 10);
  }

  // For the case of nested SVG (point annotations)
  // no adjustment needs to be made for scale.
  // I assume that the scale is already being handled
  // natively by virtue of the `transform` attribute.
  if (el.nodeName.toLowerCase() === 'svg') {
    return { h, w, x, y };
  }

  let rect = el.getBoundingClientRect();
  let svg = findSVGAtPoint(rect.left, rect.top);

  return scaleUp(svg, { h, w, x, y });
}
  
export function getRectangleSize(el) {
  let id = el.getAttribute('data-pdf-annotate-id');
  let nodes = document.querySelectorAll(`[data-pdf-annotate-id="${id}"]`);
  let size = {};
  let lastSize;
  
  Array.prototype.map.call(nodes, getSize).forEach((s) => {
    if (typeof size.x === 'undefined' || s.x < size.x) { size.x = s.x; }
    if (typeof size.y === 'undefined' || s.y < size.y) { size.y = s.y; }
    if (typeof size.w === 'undefined' || s.w > size.w) { size.w = s.w; }
    if (typeof size.h === 'undefined') { size.h = 0; }

    size.h += s.h;

    // This accounts for the spacing between selected lines
    if (lastSize) {
      size.h += s.y - (lastSize.y + lastSize.h);
    }

    lastSize = s;
  });

  return size;
}

export function getDrawingSize(el) {
  let parts = el.getAttribute('d').replace(/Z/, '').split('M').splice(1);
  let rect = el.getBoundingClientRect();
  let svg = findSVGAtPoint(rect.left, rect.top);
  let minX, maxX, minY, maxY;

  parts.forEach((p) => {
    var s = p.split(' ').map(i => parseInt(i, 10));

    if (typeof minX === 'undefined' || s[0] < minX) { minX = s[0]; }
    if (typeof maxX === 'undefined' || s[2] > maxX) { maxX = s[2]; }
    if (typeof minY === 'undefined' || s[1] < minY) { minY = s[1]; }
    if (typeof maxY === 'undefined' || s[3] > maxY) { maxY = s[3]; }
  });

  return scaleUp(svg, {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY
  });
}

// Adjust scale from normalized scale (100%) to rendered scale
export function scaleUp(svg, rect) {
  let result = {};
  let { viewport } = getMetadata(svg);

  Object.keys(rect).forEach((key) => {
    result[key] = rect[key] * viewport.scale;
  });

  return result;
}

// Adjust scale from rendered scale to a normalized scale (100%)
export function scaleDown(svg, rect) {
  let result = {};
  let { viewport } = getMetadata(svg);

  Object.keys(rect).forEach((key) => {
    result[key] = rect[key] / viewport.scale;
  });

  return result;
}

export function getScroll(el) {
  let scrollTop = 0;
  let scrollLeft = 0;
  let parentNode = el;

  while ((parentNode = parentNode.parentNode) &&
          parentNode !== document) {
    scrollTop += parentNode.scrollTop;
    scrollLeft += parentNode.scrollLeft;
  }

  return { scrollTop, scrollLeft };
}

export function getOffset(el) {
  let parentNode = el;

  while ((parentNode = parentNode.parentNode) &&
          parentNode !== document) {
    if (parentNode.nodeName.toUpperCase() === 'SVG') {
      break;
    }
  }

  let rect = parentNode.getBoundingClientRect();

  return { offsetLeft: rect.left, offsetTop: rect.top };
}

export function disableUserSelect() {
  if (!userSelectStyleSheet.parentNode) {
    document.head.appendChild(userSelectStyleSheet);
  }
}

export function enableUserSelect() {
  if (userSelectStyleSheet.parentNode) {
    userSelectStyleSheet.parentNode.removeChild(userSelectStyleSheet);
  }
}

export function getMetadata(svg) {
  return {
    documentId: svg.getAttribute('data-pdf-annotate-document'),
    pageNumber: parseInt(svg.getAttribute('data-pdf-annotate-page'), 10),
    viewport: JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'))
  };
}
