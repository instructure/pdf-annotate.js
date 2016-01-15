import PDFJSAnnotate from '../src/PDFJSAnnotate';
import arrayFrom from '../src/utils/arrayFrom';
import renderPath from '../src/render/renderPath';
import renderRect from '../src/render/renderRect';
import renderLine from '../src/render/renderLine';
import renderText from '../src/render/renderText';
import renderPoint from '../src/render/renderPoint';

const UI = {};

const BORDER_COLOR = '#00BFFF';

export default UI;

function findSVGAtPoint(x, y) {
  let els = document.elementsFromPoint(x, y);

  for (let i=0, l=els.length; i<l; i++) {
    let el = els[i];
    if (el.nodeName.toUpperCase() === 'SVG' &&
        el.getAttribute('data-pdf-annotate-container') === 'true') {
      return el;
    }
  }

  return null;
}

function getDrawingSize(el) {
  let parts = el.getAttribute('d').replace(/(M|Z)/g, '').split(',');
  let minX, maxX, minY, maxY;

  parts.forEach((p) => {
    var s = p.split(' ').map(i => parseInt(i, 10));

    if (typeof minX === 'undefined' || s[0] < minX) { minX = s[0]; }
    if (typeof maxX === 'undefined' || s[2] > maxX) { maxX = s[2]; }
    if (typeof minY === 'undefined' || s[1] < minY) { minY = s[1]; }
    if (typeof maxY === 'undefined' || s[3] > maxY) { maxY = s[3]; }
  });

  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function preventDefault(e) {
  e.preventDefault();
  return false;
}

// Pen stuff
(function () {
  let _penSize;
  let _penColor;
  let path;
  let lines;
  
  function handleMouseDown() {
    path = null;
    lines = [];

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseUp(e) {
    let svg;
    if (lines.length > 1 && (svg = findSVGAtPoint(e.clientX, e.clientY))) {
      PDFJSAnnotate.addAnnotation(
        svg.getAttribute('data-pdf-annotate-document'),
        parseInt(svg.getAttribute('data-pdf-annotate-page'), 10), {
          type: 'drawing',
          width: _penSize,
          color: _penColor,
          lines
        }
      );
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e) {
    let svg = findSVGAtPoint(e.clientX, e.clientY);
    if (!svg) {
      return;
    }

    let rect = svg.getBoundingClientRect();
    lines.push([e.clientX - rect.left, e.clientY - rect.top]);

    if (lines.length <= 1) {
      return;
    }

    if (path) {
      svg.removeChild(path);
    }

    path = renderPath({
      color: _penColor,
      width: _penSize,
      lines
    });

    svg.appendChild(path);
  }

  UI.setPen = (penSize = 1, penColor = '000000') => {
    _penSize = parseInt(penSize, 10);
    _penColor = penColor;
  };

  UI.enablePen = () => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('selectstart', preventDefault);
  };

  UI.disablePen = () => {
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('selectstart', preventDefault);
  };
})(window, document, undefined);

// Rect stuff
(function () {
  let _type;
  let overlay;
  let originY;
  let originX;

  function getSelectionRects() {
    try {
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);
      let rects = range.getClientRects();

      if (rects.length > 0) {
        return rects;
      }
    } catch (e) {}
    
    return null;
  }

  function handleMouseDown(e) {
    if (_type !== 'area') {
      return;
    }

    originY = e.clientY;
    originX = e.clientX;

    overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = `${originY}px`;
    overlay.style.left = `${originX}px`;
    overlay.style.border = `3px solid ${BORDER_COLOR}`;
    overlay.style.borderRadius = '3px';
    document.body.appendChild(overlay);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('selectstart', preventDefault);
  }

  function handleMouseMove(e) {
    overlay.style.width = `${e.clientX - originX}px`;
    overlay.style.height = `${e.clientY - originY}px`;
  }

  function handleMouseUp(e) {
    let rects;
    if (_type !== 'area' && (rects = getSelectionRects())) {
      createRect(_type, rects);
    } else if (_type === 'area' && overlay) {
      createRect(_type, [{
        top: parseInt(overlay.style.top, 10),
        left: parseInt(overlay.style.left, 10),
        width: parseInt(overlay.style.width, 10),
        height: parseInt(overlay.style.height, 10)
      }]);

      document.body.removeChild(overlay);
      overlay = null;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('selectstart', preventDefault);
    }
  }

  function createRect(type, rects, color) {
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

        return {
          y: (r.top + offset) - boundingRect.top,
          x: r.left - boundingRect.left,
          width: r.width,
          height: r.height
        };
      }).filter((r) => r.width > 0 && r.height > 0)
    };

    // Short circuit if no rectangles exist
    if (annotation.rectangles.length === 0) {
      return;
    }

    // Add the annotation
    PDFJSAnnotate.addAnnotation(
      svg.getAttribute('data-pdf-annotate-document'),
      parseInt(svg.getAttribute('data-pdf-annotate-page'), 10),
      annotation
    );

    // Render the annotation
    if (type === 'strikeout') {
      node = renderLine(annotation);
    } else {
      node = renderRect(annotation);
    }

    arrayFrom(node).forEach((el) => {
      svg.appendChild(el);
    });
  }

  UI.enableRect = (type) => {
    _type = type;
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
  };

  UI.disableRect = () => {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousedown', handleMouseDown);
  };
})(window, document, undefined);

// Edit stuff
(function (window, document) {
  function isAtPoint(el, x, y) {
    // Account for scroll
    x += window.scrollX;
    y += window.scrollY;
    
    let { offsetLeft, offsetTop } = getOffset(el);
    let size = getSize(el);
    let isAbove = y < (size.y + offsetTop);
    let isLeft = x < (size.x + offsetLeft);
    let isBelow = y > (size.y + offsetTop + size.h);
    let isRight = x > (size.x + offsetLeft + size.w);

    return !isAbove && !isBelow && !isLeft && !isRight;
  }

  function getOffset(el) {
    let offsetLeft = 0;
    let offsetTop = 0;
    let parentNode = el;

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

  function getSize(el) {
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
      h = el.offsetHeight;
      w = el.offsetWidth;
      x = parseInt(el.getAttribute('x'), 10);
      y = parseInt(el.getAttribute('y'), 10) - h;
      break;

      default:
      h = parseInt(el.getAttribute('height'), 10);
      w = parseInt(el.getAttribute('width'), 10);
      x = parseInt(el.getAttribute('x'), 10);
      y = parseInt(el.getAttribute('y'), 10);
    }

    return { h, w, x, y };
  }
  
  function getRectangleSize(el) {
    let id = el.getAttribute('data-pdf-annotate-id');
    let nodes = document.querySelectorAll(`[data-pdf-annotate-id="${id}"]`);
    let size = {};

    Array.prototype.map.call(nodes, getSize).forEach((s) => {
      if (typeof size.x === 'undefined' || s.x < size.x) { size.x = s.x; }
      if (typeof size.y === 'undefined' || s.y < size.y) { size.y = s.y; }
      if (typeof size.w === 'undefined' || s.w > size.w) { size.w = s.w; }
      if (typeof size.h === 'undefined') { size.h = 0; }

      size.h += s.h;
    });

    return size;
  }

  let isDragging = false, overlay;
  let dragOffsetX, dragOffsetY, dragStartX, dragStartY;
  const OVERLAY_BORDER_SIZE = 3;

  function createEditOverlay(target) {
    overlay = document.createElement('div');
    let id = target.getAttribute('data-pdf-annotate-id');
    let type = target.getAttribute('data-pdf-annotate-type');
    let size = type === 'drawing' ? getDrawingSize(target) : getRectangleSize(target);
    let { offsetLeft, offsetTop } = getOffset(target);
    
    overlay.setAttribute('id', 'pdf-annotate-edit-overlay');
    overlay.setAttribute('data-target-id', id);
    overlay.style.boxSizing = 'content-box';
    overlay.style.position = 'absolute';
    overlay.style.top = `${((size.y + offsetTop) - OVERLAY_BORDER_SIZE)}px`;
    overlay.style.left = `${((size.x + offsetLeft) - OVERLAY_BORDER_SIZE)}px`;
    overlay.style.width = `${size.w}px`;
    overlay.style.height = `${size.h}px`;
    overlay.style.border = `${OVERLAY_BORDER_SIZE}px solid ${BORDER_COLOR}`;
    overlay.style.borderRadius = `${OVERLAY_BORDER_SIZE}px`;
    
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
      let annotationId = overlay.getAttribute('data-target-id');
      let nodes = document.querySelectorAll(`[data-pdf-annotate-id="${annotationId}"]`);
      let svg = findSVGAtPoint(parseInt(overlay.style.left, 10), parseInt(overlay.style.top, 10));

      Array.prototype.forEach.call(nodes, (n) => {
        n.parentNode.removeChild(n);
      });
      
      PDFJSAnnotate.deleteAnnotation(
        svg.getAttribute('data-pdf-annotate-document'),
        annotationId 
      );

      destroyEditOverlay();
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
    document.addEventListener('selectstart', preventDefault);
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
      overlay.style.top = `${y}px`;
    }

    if (x > minX && x + overlay.offsetWidth < maxX) {
      overlay.style.left = `${x}px`;
    }
  }

  function handleDocumentMouseup(e) {
    let annotationId = overlay.getAttribute('data-target-id');
    let target = document.querySelectorAll(`[data-pdf-annotate-id="${annotationId}"]`);
    let type = target[0].getAttribute('data-pdf-annotate-type');
    let { offsetTop, offsetLeft } = getOffset(target[0]);
    let svg = findSVGAtPoint(e.clientX, e.clientY);
    let documentId = svg.getAttribute('data-pdf-annotate-document');

    function getDelta(propX, propY) {
      return calcDelta(parseInt(target[0].getAttribute(propX), 10), parseInt(target[0].getAttribute(propY), 10));
    }

    function calcDelta(x, y) {
      return {
        deltaY: OVERLAY_BORDER_SIZE + (overlay.offsetTop - offsetTop) - y,
        deltaX: OVERLAY_BORDER_SIZE + (overlay.offsetLeft - offsetLeft) - x
      }
    }

    PDFJSAnnotate.getAnnotation(documentId, annotationId).then((annotation) => {
      if (['area', 'highlight', 'point', 'textbox'].indexOf(type) > -1) {
        let { deltaY, deltaX } = getDelta('x', 'y');
        Array.prototype.forEach.call(target, (t, i) => {
          if (deltaY !== 0) {
            let y = parseInt(t.getAttribute('y'), 10) + deltaY;

            if (type === 'textbox') {
              y += parseInt(overlay.style.height, 10);
            }

            t.setAttribute('y', y);
            if (annotation.rectangles) {
              annotation.rectangles[i].y = y;
            } else if (annotation.y) {
              annotation.y = y;
            }
          }
          if (deltaX !== 0) {
            let x = parseInt(t.getAttribute('x'), 10) + deltaX;
            t.setAttribute('x', x);
            if (annotation.rectangles) {
              annotation.rectangles[i].x = x;
            } else if (annotation.x) {
              annotation.x = x;
            }
          }
        });
      } else if (type === 'strikeout') {
        let { deltaY, deltaX } = getDelta('x1', 'y1');
        Array.prototype.forEach.call(target, (t, i) => {
          if (deltaY !== 0) {
            t.setAttribute('y1', parseInt(t.getAttribute('y1'), 10) + deltaY);
            t.setAttribute('y2', parseInt(t.getAttribute('y2'), 10) + deltaY);
            annotation.rectangles[i].y = parseInt(t.getAttribute('y1'), 10);
          }
          if (deltaX !== 0) {
            t.setAttribute('x1', parseInt(t.getAttribute('x1'), 10) + deltaX);
            t.setAttribute('x2', parseInt(t.getAttribute('x2'), 10) + deltaX);
            annotation.rectangles[i].x = parseInt(t.getAttribute('x1'), 10);
          }
        });
      } else if (type === 'drawing') {
        let size = getDrawingSize(target[0]);
        let [originX, originY] = annotation.lines[0];
        let { deltaY, deltaX } = calcDelta(originX, originY);

        // origin isn't necessarily at 0/0 in relation to overlay x/y
        // adjust the difference between overlay and drawing coords
        deltaY += (originY - size.y);
        deltaX += (originX - size.x);

        annotation.lines.forEach((line, i) => {
          let [x, y] = annotation.lines[i];
          annotation.lines[i][0] = x + deltaX;
          annotation.lines[i][1] = y + deltaY;
        });

        let node = renderPath(annotation);
        target[0].setAttribute('d', node.getAttribute('d'));
      }

      PDFJSAnnotate.editAnnotation(documentId, annotationId, annotation);
    });

    setTimeout(() => {
      isDragging = false;
    }, 0);

    overlay.style.background = '';
    overlay.style.cursor = '';

    document.removeEventListener('mousemove', handleDocumentMousemove);
    document.removeEventListener('mouseup', handleDocumentMouseup);
    document.removeEventListener('selectstart', preventDefault);
  }

  function handleDocumentClick(e) {
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
  }

  UI.enableEdit = function () {
    document.addEventListener('click', handleDocumentClick);
  };

  UI.disableEdit = function () {
    document.removeEventListener('click', handleDocumentClick);
  };
})(window, document, undefined);

// Text stuff
(function () {
  let input;
  let _textSize;
  let _textColor;

  function handleMouseUp(e) {
    if (input) {
      return;
    }

    if (!findSVGAtPoint(e.clientX, e.clientY)) {
      return;
    }

    input = document.createElement('input');
    input.style.border = `3px solid ${BORDER_COLOR}`;
    input.style.borderRadius = '3px';
    input.style.position = 'absolute';
    input.style.top = `${e.clientY}px`;
    input.style.left = `${e.clientX}px`;
    input.style.fontSize = `${_textSize}px`;

    input.addEventListener('blur', handleBlur);
    input.addEventListener('keyup', handleKeyUp);

    document.body.appendChild(input);
    input.focus();
  }

  function handleBlur(e) {
    saveText();
  }
  
  function handleKeyUp(e) {
    if (e.keyCode === 27) {
      closeInput();
    } else if (e.keyCode === 13) {
      saveText();
    }
  }

  function saveText() {
    if (input.value.trim().length > 0) {
      let clientX = parseInt(input.style.left, 10);
      let clientY = parseInt(input.style.top, 10);
      let svg = findSVGAtPoint(clientX, clientY);
      if (!svg) {
        return;
      }

      let rect = svg.getBoundingClientRect();
      let annotation = {
        type: 'textbox',
        x: clientX - rect.left,
        y: clientY -  rect.top,
        width: input.offsetWidth,
        height: input.offsetHeight,
        size: _textSize,
        color: _textColor,
        content: input.value.trim()
      };

      PDFJSAnnotate.addAnnotation(
        svg.getAttribute('data-pdf-annotate-document'),
        parseInt(svg.getAttribute('data-pdf-annotate-page'), 10),
        annotation
      );

      let node = renderText(annotation);
      svg.appendChild(node);
    }
    
    closeInput();
  }

  function closeInput() {
    if (input) {
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('keyup', handleKeyUp);
      document.body.removeChild(input);
      input = null;
    }
  }

  UI.setText = function (textSize = 12, textColor = '000') {
    _textSize = parseInt(textSize, 10);
    _textColor = textColor;
  };

  UI.enableText = function () {
    document.addEventListener('mouseup', handleMouseUp);
  };

  UI.disableText = function () {
    document.removeEventListener('mouseup', handleMouseUp);
  };
})(window, document, undefined);

// Point stuff
(function () {
  let input;

  function handleMouseUp(e) {
    if (input) {
      return;
    }

    if (!findSVGAtPoint(e.clientX, e.clientY)) {
      return;
    }

    input = document.createElement('input');
    input.style.border = `3px solid ${BORDER_COLOR}`;
    input.style.borderRadius = '3px';
    input.style.position = 'absolute';
    input.style.top = `${e.clientY}px`;
    input.style.left = `${e.clientX}px`;

    input.addEventListener('blur', handleBlur);
    input.addEventListener('keyup', handleKeyUp);

    document.body.appendChild(input);
    input.focus();
  }

  function handleBlur(e) {
    savePoint();
  }

  function handleKeyUp(e) {
    if (e.keyCode === 27) {
      closeInput();
    } else if (e.keyCode === 13) {
      savePoint();
    }
  }

  function savePoint() {
    if (input.value.trim().length > 0) {
      let clientX = parseInt(input.style.left, 10);
      let clientY = parseInt(input.style.top, 10);
      let content = input.value.trim();
      let svg = findSVGAtPoint(clientX, clientY);
      if (!svg) {
        return;
      }

      let rect = svg.getBoundingClientRect();
      let documentId = svg.getAttribute('data-pdf-annotate-document');
      let annotation = {
        type: 'point',
        x: clientX - rect.left,
        y: clientY - rect.top
      };

      PDFJSAnnotate.addAnnotation(
        documentId,
        parseInt(svg.getAttribute('data-pdf-annotate-page'), 10),
        annotation
      ).then((annotationId) => {
        PDFJSAnnotate.addComment(
          documentId,
          annotationId,
          content
        );
      });

      let node = renderPoint(annotation);
      svg.appendChild(node);
    }

    closeInput();
  }

  function closeInput() {
    input.removeEventListener('blur', handleBlur);
    input.removeEventListener('keyup', handleKeyUp);
    document.body.removeChild(input);
    input = null;
  }

  UI.enablePoint = function () {
    document.addEventListener('mouseup', handleMouseUp);
  };

  UI.disablePoint = function () {
    document.removeEventListener('mouseup', handleMouseUp);
  };
})(window, document, undefined);
