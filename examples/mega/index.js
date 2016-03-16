import twitter from 'twitter-text';
import PDFJSAnnotate from '../../';
import localStoreAdapter from '../localStoreAdapter';

const { UI } = PDFJSAnnotate;
const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg');
const container = document.querySelector('.textLayer');
const contentLayout = document.getElementById('content-layout');
const DOCUMENT_ID = window.location.pathname.replace(/\/$/, '');
const PAGE_NUMBER = 1;
let SCALE = parseFloat(localStorage.getItem(`${DOCUMENT_ID}/scale`), 10) || 1;
let ROTATE = parseInt(localStorage.getItem(`${DOCUMENT_ID}/rotate`), 10) || 0;
const data = {
  page: null,
  annotations: null
};

PDFJSAnnotate.StoreAdapter = localStoreAdapter;
PDFJS.workerSrc = '../pdf.worker.js';

PDFJS.getDocument('PDFJSAnnotate.pdf').then((pdf) => {
  Promise.all([
    pdf.getPage(PAGE_NUMBER),
    PDFJSAnnotate.getAnnotations(DOCUMENT_ID, PAGE_NUMBER)
  ])
  .then(([page, annotations]) => {
    data.page = page;
    data.annotations = annotations;
    render();
  });
});

// Render the stuff to the thing
function render() {
  let viewport = data.page.getViewport(SCALE, ROTATE);
  let canvasContext = canvas.getContext('2d');
  
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  canvas.style.marginLeft = ((viewport.width / 2) * -1) + 'px';
  canvas.style.marginTop = ((viewport.height /2) * -1) + 'px';
  
  svg.setAttribute('height', viewport.height);
  svg.setAttribute('width', viewport.width);
  svg.style.marginLeft = ((viewport.width / 2) * -1) + 'px';
  svg.style.marginTop = ((viewport.height /2) * -1) + 'px';

  container.innerHTML = '';
  container.style.height = viewport.height + 'px';
  container.style.width = viewport.width + 'px';
  container.style.marginLeft = ((viewport.width / 2) * -1) + 'px';
  container.style.marginTop = ((viewport.height / 2) * -1) + 'px';

  contentLayout.style.width = '';
  contentLayout.style.height = '';

  let rect = contentLayout.getBoundingClientRect();

  contentLayout.style.width = Math.max((viewport.width + 20), rect.width) + 'px';
  contentLayout.style.height = Math.max((viewport.height + 20), rect.height) + 'px';

  data.page.render({canvasContext, viewport});
  PDFJSAnnotate.render(svg, viewport, data.annotations);

  // This method requires pdfjs-dist/web/pdf_viewer.js
  // The benefit is that it makes selecting text much smoother.
  data.page.getTextContent().then((textContent) => {
    let textLayerFactory = new PDFJS.DefaultTextLayerFactory();
    let textLayerBuilder = textLayerFactory.createTextLayerBuilder(container, PAGE_NUMBER - 1, viewport);
    textLayerBuilder.setTextContent(textContent);
    textLayerBuilder.render();

    setTimeout(function () {
      mergeTextRows(container);
    });
  });

  // This method is straight forward, but text selection is janky
  // data.page.getTextContent().then((textContent) => {
  //   PDFJS.renderTextLayer({
  //     textContent,
  //     container,
  //     viewport,
  //     textDivs: []
  //   });
  // });
}

// Characters in text layer may be rendered character by character.
// This causes weirdness when selecting text to create annotations.
// This method merges adjacent characters into a shared div.
function mergeTextRows(textLayer) {
  let chars = textLayer.querySelectorAll('div');
  let rows = {};

  // Arrange all the characters by row based on style.top
  Array.prototype.forEach.call(chars, div => {
    let top = div.style.top;

    if (!rows[top]) {
      rows[top] = [];
    }

    let row = rows[top];
    row.push(div);
  });

  // Merge characters into rows
  let fragment = document.createDocumentFragment();
  Object.keys(rows).forEach(key => {
    let row = rows[key];
    let text = '';
    let textDiv;
    let lastDiv;

    function openTextDiv(div) {
      textDiv = div.cloneNode();
      textDiv.innerHTML = '';
      fragment.appendChild(textDiv);
    }

    function closeTextDiv() {
      textDiv.appendChild(document.createTextNode(text));
      textDiv = null;
      text = '';
    }

    // Iterate every character in the row
    row.forEach((div, i) => {
      if (!textDiv) {
        openTextDiv(div);
      }

      // Get the style without position props of this and last div
      let thisStyle = div.getAttribute('style');
      let lastStyle = lastDiv ? lastDiv.getAttribute('style') : null;
      if (thisStyle) {
        thisStyle = thisStyle.replace(/(left|top):.*?px;/g, '').trim();
      }
      if (lastStyle) {
        lastStyle = lastStyle.replace(/(left|top):.*?px;/g, '').trim();
      }

      // Close div if last style doesn't match current style
      if (thisStyle !== lastStyle) {
        closeTextDiv();
        openTextDiv(div);
      }
      // Account for white space-ish
      else if (lastDiv) {
        let thisRect = div.getBoundingClientRect();
        let lastRect = lastDiv.getBoundingClientRect();
        let cloneDiv = div.cloneNode();
        let spaceDiff = thisRect.left - lastRect.right;
        let spaceWidth = 0;

        // Calculate the width of a single white space
        cloneDiv.innerHTML = '&nbsp;';
        cloneDiv.style.position = 'absolute';
        document.body.appendChild(cloneDiv);
        spaceWidth = cloneDiv.getBoundingClientRect().width;
        document.body.removeChild(cloneDiv);

        // If the diff is greater than a single space close div
        if (spaceDiff > spaceWidth) {
          closeTextDiv();
          openTextDiv(div);
        }
        // Otherwise if divs aren't immediately adjacent add a space
        else if (spaceDiff >= 1) {
          text += ' ';
        }
      }
      
      // Copy text content
      text += div.textContent;

      // This is it, we're done with the row
      if (i === row.length - 1) {
        closeTextDiv();
      }

      // Keep track of the last div
      lastDiv = div;
    });
  });

  // Update the text layer with the merged text
  textLayer.innerHTML = '';
  textLayer.appendChild(fragment);
}

// Text stuff
(function () {
  let textSize;
  let textColor;

  function initText() {
    let size = document.querySelector('.toolbar .text-size');
    [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96].forEach((s) => {
      size.appendChild(new Option (s, s));
    });

    setText(
      localStorage.getItem(`${DOCUMENT_ID}/text/size`) || 10,
      localStorage.getItem(`${DOCUMENT_ID}/text/color`) || '000000'
    );
  }

  function setText(size, color) {
    let modified = false;

    if (textSize !== size) {
      modified = true;
      textSize = size;
      localStorage.setItem(`${DOCUMENT_ID}/text/size`, textSize);
      document.querySelector('.toolbar .text-size').value = textSize;
    }

    if (textColor !== color) {
      modified = true;
      textColor = color;
      localStorage.setItem(`${DOCUMENT_ID}/text/color`, textColor);
      
      let selected = document.querySelector('.toolbar .text-color.color-selected');
      if (selected) {
        selected.classList.remove('color-selected');
        selected.removeAttribute('aria-selected');
      }

      selected = document.querySelector(`.toolbar .text-color[data-color="${color}"]`);
      if (selected) {
        selected.classList.add('color-selected');
        selected.setAttribute('aria-selected', true);
      }

    }

    if (modified) {
      UI.setText(textSize, textColor);
    }
  }
  
  function setTextColorFromElement(el) {
    if (el.nodeName === 'A' &&
        el.classList.contains('text-color') &&
        el.getAttribute('data-color')) {
      setText(textSize, el.getAttribute('data-color'));
    }
  }

  function handleMenuClick(e) {
    setTextColorFromElement(e.target);
  }

  function handleMenuKeyUp(e) {
    if (e.keyCode === 32) {
      setTextColorFromElement(e.target);
    }
  }

  function handleTextSizeChange(e) {
    setText(e.target.value, textColor);
  }

  document.querySelector('.toolbar').addEventListener('click', handleMenuClick);
  document.querySelector('.toolbar').addEventListener('keyup', handleMenuKeyUp);
  document.querySelector('.toolbar .text-size').addEventListener('change', handleTextSizeChange);

  initText();
})();

// Pen stuff
(function () {
  let penSize;
  let penColor;

  function initPen() {
    let size = document.querySelector('.toolbar .pen-size');
    for (let i=0; i<20; i++) {
      size.appendChild(new Option(i+1, i+1));
    }

    setPen(
      localStorage.getItem(`${DOCUMENT_ID}/pen/size`) || 1,
      localStorage.getItem(`${DOCUMENT_ID}/pen/color`) || '000000'
    );
  }

  function setPen(size, color) {
    let modified = false;

    if (penSize !== size) {
      modified = true;
      penSize = size;
      localStorage.setItem(`${DOCUMENT_ID}/pen/size`, penSize);
      document.querySelector('.toolbar .pen-size').value = penSize;
    }

    if (penColor !== color) {
      modified = true;
      penColor = color;
      localStorage.setItem(`${DOCUMENT_ID}/pen/color`, penColor);
      
      let selected = document.querySelector('.toolbar .pen-color.color-selected');
      if (selected) {
        selected.classList.remove('color-selected');
        selected.removeAttribute('aria-selected');
      }

      selected = document.querySelector(`.toolbar .pen-color[data-color="${color}"]`);
      if (selected) {
        selected.classList.add('color-selected');
        selected.setAttribute('aria-selected', true);
      }
    }

    if (modified) {
      UI.setPen(penSize, penColor);
    }
  }

  function setPenColorFromElement(el) {
    if (el.nodeName === 'A' &&
        el.classList.contains('pen-color') &&
        el.getAttribute('data-color')) {
      setPen(penSize, el.getAttribute('data-color'));
    }
  }

  function handleMenuClick(e) {
    setPenColorFromElement(e.target);
  }

  function handleMenuKeyUp(e) {
    if (e.keyCode === 32) {
      setPenColorFromElement(e.target);
    }
  }

  function handlePenSizeChange(e) {
    setPen(e.target.value, penColor);
  }

  document.querySelector('.toolbar').addEventListener('click', handleMenuClick);
  document.querySelector('.toolbar').addEventListener('keyup', handleMenuKeyUp);
  document.querySelector('.toolbar .pen-size').addEventListener('change', handlePenSizeChange);

  initPen();
})();

// Toolbar buttons
(function () {
  let tooltype = localStorage.getItem(`${DOCUMENT_ID}/tooltype`) || 'cursor';
  if (tooltype) {
    setActiveToolbarItem(tooltype, document.querySelector(`.toolbar button[data-tooltype=${tooltype}]`));
  }

  function setActiveToolbarItem(type, button) {
    let active = document.querySelector('.toolbar button.active');
    if (active) {
      active.classList.remove('active');

      switch (tooltype) {
        case 'cursor':
          UI.disableEdit();
          break;
        case 'draw':
          UI.disablePen();
          break;
        case 'text':
          UI.disableText();
          break;
        case 'point':
          UI.disablePoint();
          break;
        case 'area':
        case 'highlight':
        case 'strikeout':
          UI.disableRect();
          break;
      }
    }

    if (button) {
      button.classList.add('active');
    }
    if (tooltype !== type) {
      localStorage.setItem(`${DOCUMENT_ID}/tooltype`, type);
    }
    tooltype = type;

    switch (type) {
      case 'cursor':
        UI.enableEdit();
        break;
      case 'draw':
        UI.enablePen();
        break;
      case 'text':
        UI.enableText();
        break;
      case 'point':
        UI.enablePoint();
        break;
      case 'area':
      case 'highlight':
      case 'strikeout':
        UI.enableRect(type);
        break;
    }
  }

  function handleToolbarClick(e) {
    if (e.target.nodeName === 'BUTTON') {
      setActiveToolbarItem(e.target.getAttribute('data-tooltype'), e.target);
    }
  }

  document.querySelector('.toolbar').addEventListener('click', handleToolbarClick);
})();

// Scale/rotate
(function () {
  function setScaleRotate(scale, rotate) {
    scale = parseFloat(scale, 10);
    rotate = parseInt(rotate, 10);

    if (SCALE !== scale || ROTATE !== rotate) {
      SCALE = scale;
      ROTATE = rotate;

      localStorage.setItem(`${DOCUMENT_ID}/scale`, SCALE);
      localStorage.setItem(`${DOCUMENT_ID}/rotate`, ROTATE % 360);

      render();
    }
  }

  function handleScaleChange(e) {
    setScaleRotate(e.target.value, ROTATE);
  }

  function handleRotateCWClick() {
    setScaleRotate(SCALE, ROTATE + 90);
  }

  function handleRotateCCWClick() {
    setScaleRotate(SCALE, ROTATE - 90);
  }

  document.querySelector('.toolbar select.scale').value = SCALE;
  document.querySelector('.toolbar select.scale').addEventListener('change', handleScaleChange);
  document.querySelector('.toolbar .rotate-ccw').addEventListener('click', handleRotateCCWClick);
  document.querySelector('.toolbar .rotate-cw').addEventListener('click', handleRotateCWClick);
})();

// Clear toolbar button
(function () {
  function handleClearClick(e) {
    if (confirm('Are you sure you want to clear annotations?')) {
      svg.innerHTML = '';
      localStorage.removeItem(`${DOCUMENT_ID}/annotations`);
      PDFJSAnnotate.getAnnotations(DOCUMENT_ID, PAGE_NUMBER).then((annotations) => {
        data.annotations = annotations;
      });
    }
  }
  document.querySelector('a.clear').addEventListener('click', handleClearClick);
})();

// Comment stuff
(function (window, document) {
  let commentList = document.querySelector('#comment-wrapper .comment-list-container');
  let commentForm = document.querySelector('#comment-wrapper .comment-list-form');
  let commentText = commentForm.querySelector('input[type="text"]');

  function supportsComments(target) {
    let type = target.getAttribute('data-pdf-annotate-type');
    return ['point', 'highlight', 'area'].indexOf(type) > -1;
  }

  function insertComment(comment) {
    let child = document.createElement('div');
    child.className = 'comment-list-item';
    child.innerHTML = twitter.autoLink(twitter.htmlEscape(comment.content));

    commentList.appendChild(child);
  }

  function handleAnnotationClick(target) {
    if (supportsComments(target)) {
      let documentId = target.parentNode.getAttribute('data-pdf-annotate-document');
      let annotationId = target.getAttribute('data-pdf-annotate-id');

      PDFJSAnnotate.StoreAdapter.getComments(documentId, annotationId).then((comments) => {
        commentList.innerHTML = '';
        commentForm.style.display = '';
        commentText.focus();

        commentForm.onsubmit = function () {
          PDFJSAnnotate.StoreAdapter.addComment(documentId, annotationId, commentText.value.trim())
            .then(insertComment)
            .then(() => {
              commentText.value = '';
              commentText.focus();
            });

          return false;
        };

        comments.forEach(insertComment);
      });
    }
  }

  function handleAnnotationBlur(target) {
    if (supportsComments(target)) {
      commentList.innerHTML = '';
      commentForm.style.display = 'none';
      commentForm.onsubmit = null;
      
      insertComment({content: 'No comments'});
    }
  }

  UI.addEventListener('annotation:click', handleAnnotationClick);
  UI.addEventListener('annotation:blur', handleAnnotationBlur);
})(window, document);

