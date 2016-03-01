import PDFJSAnnotate from '../PDFJSAnnotate';
import appendChild from '../render/appendChild';
import {
  BORDER_COLOR,
  disableUserSelect,
  enableUserSelect,
  findSVGAtPoint,
  getMetadata,
  scaleDown,
  scaleUp
} from './utils';

let _enabled = false;
let _type;
let overlay;
let originY;
let originX;

function getSelectionRects() {
  try {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let rects = range.getClientRects();

    if (rects.length > 0 &&
        rects[0].width > 0 &&
        rects[0].height > 0) {
      return rects;
    }
  } catch (e) {}
  
  return null;
}

function handleMouseDown(e) {
  let svg = findSVGAtPoint(e.clientX, e.clientY);

  if (!svg || _type !== 'area') {
    return;
  }

  originY = e.clientY;
  originX = e.clientX;

  overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = `${originY + window.scrollY}px`;
  overlay.style.left = `${originX + window.scrollX}px`;
  overlay.style.border = `3px solid ${BORDER_COLOR}`;
  overlay.style.borderRadius = '3px';
  document.body.appendChild(overlay);
  
  document.addEventListener('mousemove', handleMouseMove);
  disableUserSelect();
}

function handleMouseMove(e) {
  let svg = findSVGAtPoint(originX, originY);
  let rect = svg.getBoundingClientRect();

  if (originX + (e.clientX - originX) < rect.right) {
    overlay.style.width = `${e.clientX - originX}px`;
  }

  if (originY + (e.clientY - originY) < rect.bottom) {
    overlay.style.height = `${e.clientY - originY}px`;
  }
}

function handleMouseUp(e) {
  let rects;
  if (_type !== 'area' && (rects = getSelectionRects())) {
    let svg = findSVGAtPoint(rects[0].left, rects[0].top);
    saveRect(_type, Array.prototype.map.call(rects, (r) => {
      // It seems counter-intuitive to scale up here only
      // to scale down within saveRect, but the browser
      // is handling the scaling natively using CSS zoom.
      // It is necessary to adjust the scale up to account
      // for the native browser scaling.
      return scaleUp(svg, {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height
      });
    }));
  } else if (_type === 'area' && overlay) {
    saveRect(_type, [{
      top: parseInt(overlay.style.top, 10) - window.scrollY,
      left: parseInt(overlay.style.left, 10) - window.scrollX,
      width: parseInt(overlay.style.width, 10),
      height: parseInt(overlay.style.height, 10)
    }]);

    document.body.removeChild(overlay);
    overlay = null;

    document.removeEventListener('mousemove', handleMouseMove);
    enableUserSelect();
  }
}

function saveRect(type, rects, color) {
  let svg = findSVGAtPoint(rects[0].left, rects[0].top);
  let node;
  let annotation;

  if (!svg) {
    return;
  }

  let boundingRect = svg.getBoundingClientRect();

  if (!color) {
    if (type === 'highlight') {
      color = 'FFFF00';
    } else if (type === 'strikeout') {
      color = 'FF0000';
    }
  }

  // Initialize the annotation
  annotation = {
    type,
    color,
    rectangles: Array.prototype.map.call(rects, (r) => {
      let offset = 0;

      if (type === 'strikeout') {
        offset = r.height / 2;
      }

      return scaleDown(svg, {
        y: (r.top + offset) - boundingRect.top,
        x: r.left - boundingRect.left,
        width: r.width,
        height: r.height
      });
    }).filter((r) => r.width > 0 && r.height > 0)
  };

  // Short circuit if no rectangles exist
  if (annotation.rectangles.length === 0) {
    return;
  }

  let { documentId, pageNumber } = getMetadata(svg);

  // Add the annotation
  PDFJSAnnotate.StoreAdapter.addAnnotation(documentId, pageNumber, annotation)
    .then((annotation) => {
      appendChild(svg, annotation);
    });
}

export function enableRect(type) {
  _type = type;
  
  if (_enabled) { return; }

  _enabled = true;
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousedown', handleMouseDown);
}

export function disableRect() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mousedown', handleMouseDown);
}

