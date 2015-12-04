import PDFJSAnnotate from '../../';
import annotations from './annotations';
import mockViewport from '../mockViewport';
const svg = document.querySelector('svg');
const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');
const PAGE_NUMBER = 1;

PDFJSAnnotate.StoreAdapter.getAnnotations = (documentId, pageNumber) => {
  return new Promise((resolve, reject) => {
    resolve(annotations);
  });
};

PDFJSAnnotate.StoreAdapter.deleteAnnotation = (documentId, annotationId) => {
  let index = -1;
  for (let i=0, l=annotations.length; i<l; i++) {
    if (annotations[i].uuid === annotationId) {
      index = i;
      break;
    }
  }
  
  if (index > -1) {
    annotations.splice(index, 1);
  }
};

// Get the annotations
PDFJSAnnotate.getAnnotations(DOCUMENT_ID, PAGE_NUMBER).then((annotations) => {
  PDFJSAnnotate.render(svg, mockViewport(svg), annotations);
});

// Event handling
(function (window, document) {
  function isAtPoint(e, x, y) {
    // Account for scroll
    x += window.scrollX;
    y += window.scrollY;
    
    let size = getSize(e);
    let isAbove = y < size.y;
    let isLeft = x < size.x;
    let isBelow = y > (size.y + size.h);
    let isRight = x > (size.x + size.w);

    return !isAbove && !isBelow && !isLeft && !isRight;
  }

  function getSize(e) {
    let { offsetLeft, offsetTop } = getOffset(e);
    let h = 0, w = 0, x = 0, y = 0;

    switch (e.nodeName.toLowerCase()) {
      case 'line':
      h = parseInt(e.getAttribute('y2'), 10) - parseInt(e.getAttribute('y1'), 10);
      w = parseInt(e.getAttribute('x2'), 10) - parseInt(e.getAttribute('x1'), 10);
      x = parseInt(e.getAttribute('x1'), 10) + offsetLeft;
      y = parseInt(e.getAttribute('y1'), 10) + offsetLeft;
      break;

      case 'text':
      h = e.offsetHeight;
      w = e.offsetWidth;
      x = parseInt(e.getAttribute('x'), 10) + offsetLeft;
      y = parseInt(e.getAttribute('y'), 10) + offsetTop;
      break;

      default:
      h = parseInt(e.getAttribute('height'), 10);
      w = parseInt(e.getAttribute('width'), 10);
      x = parseInt(e.getAttribute('x'), 10) + offsetLeft;
      y = parseInt(e.getAttribute('y'), 10) + offsetTop;
    }

    return { h, w, x, y };
  }

  function getRectangleSize(id) {
    let nodes = document.querySelectorAll(`[data-pdf-annotate-id="${id}"]`);
    let size = {};
    let sizes = Array.prototype.map.call(nodes, (n) => {
      return getSize(n);
    });

    sizes.forEach((s) => {
      if (typeof size.x === 'undefined' || s.x < size.x) { size.x = s.x; }
      if (typeof size.y === 'undefined' || s.y < size.y) { size.y = s.y; }
      if (typeof size.w === 'undefined' || s.w > size.w) { size.w = s.w; }
      if (typeof size.h === 'undefined') {
        size.h = 0;
      }
      size.h += s.h;
    });

    return size;
  }

  function getDrawingSize(id) {
    let node = document.querySelector(`[data-pdf-annotate-id="${id}"]`);
    let parts = node.getAttribute('d').replace(/(M|Z)/g, '').split(',');
    let { offsetLeft, offsetTop } = getOffset(node);
    let minX, maxX, minY, maxY;

    parts.forEach((p) => {
      var s = p.split(' ').map(i => parseInt(i, 10));

      if (typeof minX === 'undefined' || s[0] < minX) { minX = s[0]; }
      if (typeof maxX === 'undefined' || s[2] > maxX) { maxX = s[2]; }
      if (typeof minY === 'undefined' || s[1] < minY) { minY = s[1]; }
      if (typeof maxY === 'undefined' || s[3] > maxY) { maxY = s[3]; }
    });

    return { x: minX + offsetLeft, y: minY + offsetTop, w: maxX - minX, h: maxY - minY };
  }

  function getOffset(e) {
    let offsetLeft = 0;
    let offsetTop = 0;
    let parentNode = e;

    while ((parentNode = parentNode.parentNode) &&
            parentNode !== document) {
      offsetLeft += parentNode.offsetLeft;
      offsetTop += parentNode.offsetTop;
    }

    return {
      offsetLeft,
      offsetTop
    };
  }
  
  document.addEventListener('click', function (e) {
    // Remove current overlay
    let overlay = document.getElementById('pdf-annotate-edit-overlay');
    if (overlay) {
      if (isDragging || e.target === overlay) {
        return;
      }

      destroyEditOverlay();
    }

    // Find all SVG elements at the point of the event
    let elements = document.elementsFromPoint(e.clientX, e.clientY).filter((e) => {
      return e.getAttribute('data-pdf-annotate-container') === 'true';
    });

    // Find a target element within SVG
    let target;
    for (let i=0, l=elements.length; i<l; i++) {
      let children = elements[i].children;
      for (let j=0, c=children.length; j<c; j++) {
        if (isAtPoint(children[j], e.clientX, e.clientY)) {
          target = children[j];
          break;
        }
      }
    }

    // Make edit overlay
    if (target) {
      createEditOverlay(target);
    }
  });

  let isDragging = false, overlay;
  let dragOffsetX, dragOffsetY, dragStartX, dragStartY;

  function createEditOverlay(target) {
    overlay = document.createElement('div');
    let id = target.getAttribute('data-pdf-annotate-id');
    let type = target.getAttribute('data-pdf-annotate-type');
    let size = type === 'drawing' ? getDrawingSize(id) : getRectangleSize(id);
    const OVERLAY_BORDER_SIZE = 3;
    
    overlay.setAttribute('id', 'pdf-annotate-edit-overlay');
    overlay.setAttribute('data-target-id', id);
    overlay.style.position = 'absolute';
    overlay.style.top = size.y + 'px';
    overlay.style.left = size.x + 'px';
    overlay.style.width = size.w + 'px';
    overlay.style.height = size.h + 'px';
    overlay.style.border = OVERLAY_BORDER_SIZE + 'px solid #00BFFF';
    overlay.style.borderRadius = OVERLAY_BORDER_SIZE + 'px';
    
    document.body.appendChild(overlay);
    document.addEventListener('keyup', handleDocumentKeyup);
    document.addEventListener('mousedown', handleDocumentMousedown);
  }

  function destroyEditOverlay() {
    if (!overlay) { return; }

    overlay.parentNode.removeChild(overlay);

    document.removeEventListener('keyup', handleDocumentKeyup);
    document.removeEventListener('mousedown', handleDocumentMousedown);
  }

  function handleDocumentKeyup(e) {
    if (overlay && e.keyCode === 46) {
      if (confirm('Are you sure you want to delete this annotation?')) {
        let id = overlay.getAttribute('data-target-id');
        let nodes = document.querySelectorAll(`[data-pdf-annotate-id="${id}"]`);
        
        Array.prototype.forEach.call(nodes, (n) => {
          n.parentNode.removeChild(n);
        });

        PDFJSAnnotate.deleteAnnotation(DOCUMENT_ID, id);

        destroyEditOverlay();
      }
    }
  }

  function handleDocumentMousedown(e) {
    if (e.target !== overlay) { return; }

    isDragging = true;
    dragOffsetX = e.clientX;
    dragOffsetY = e.clientY;
    dragStartX = overlay.offsetLeft;
    dragStartY = overlay.offsetTop;

    overlay.style.background = 'rgba(255, 255, 255, 0.7)';
    overlay.style.cursor = 'move';

    document.addEventListener('mousemove', handleDocumentMousemove);
    document.addEventListener('mouseup', handleDocumentMouseup);
    document.addEventListener('selectstart', handleDocumentSelectstart);
  }

  function handleDocumentMousemove(e) {
    let id = overlay.getAttribute('data-target-id');
    let parent = document.querySelector(`[data-pdf-annotate-id="${id}"]`).parentNode;
    let y = (dragStartY + (e.clientY - dragOffsetY));
    let x = (dragStartX + (e.clientX - dragOffsetX));
    let minY = parent.offsetTop;
    let maxY = parent.offsetTop + parent.offsetHeight;
    let minX = parent.offsetLeft;
    let maxX = parent.offsetLeft + parent.offsetWidth;

    if (y > minY && y + overlay.offsetHeight < maxY) {
      overlay.style.top = y + 'px';
    }

    if (x > minX && x + overlay.offsetWidth < maxX) {
      overlay.style.left = x + 'px';
    }
  }

  function handleDocumentMouseup(e) {
    let id = overlay.getAttribute('data-target-id');
    let target = document.querySelectorAll(`[data-pdf-annotate-id="${id}"]`);
    let type = target[0].getAttribute('data-pdf-annotate-type');
    let { offsetTop, offsetLeft } = getOffset(target[0]);

    function getDelta(propY, propX) {
      return {
        deltaY: (overlay.offsetTop - offsetTop) - parseInt(target[0].getAttribute(propY), 10),
        deltaX: (overlay.offsetLeft - offsetLeft) - parseInt(target[0].getAttribute(propX), 10)
      };
    }

    if (['area', 'highlight', 'point', 'textbox'].indexOf(type) > -1) {
      let { deltaY, deltaX } = getDelta('y', 'x');
      Array.prototype.forEach.call(target, (t) => {
        if (deltaY !== 0) {
          t.setAttribute('y', parseInt(t.getAttribute('y'), 10) + deltaY);
        }
        if (deltaX !== 0) {
          t.setAttribute('x', parseInt(t.getAttribute('x'), 10) + deltaX);
        }
      });
    } else if (type === 'strikeout') {
      let { deltaY, deltaX } = getDelta('y1', 'x1');
      Array.prototype.forEach.call(target, (t) => {
        if (deltaY !== 0) {
          t.setAttribute('y1', parseInt(t.getAttribute('y1'), 10) + deltaY);
          t.setAttribute('y2', parseInt(t.getAttribute('y2'), 10) + deltaY);
        }
        if (deltaX !== 0) {
          t.setAttribute('x1', parseInt(t.getAttribute('x1'), 10) + deltaX);
          t.setAttribute('x2', parseInt(t.getAttribute('x2'), 10) + deltaX);
        }
      });
    } else {
      console.warn('Repositioning is not yet supported for "' + type + '"');
    }
    
    // TODO:
    //  - Adjust x/y map for drawing
    //  - Fix click area for drawing
    // PDFJSAnnotate.editAnnotation(DOCUMENT_ID, id, {});

    setTimeout(() => {
      isDragging = false;
    }, 0);

    overlay.style.background = '';
    overlay.style.cursor = '';

    document.removeEventListener('mousemove', handleDocumentMousemove);
    document.removeEventListener('mouseup', handleDocumentMouseup);
    document.removeEventListener('selectstart', handleDocumentSelectstart);
  }

  function handleDocumentSelectstart(e) {
    e.preventDefault();
  }
})(window, document, undefined);
