/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _twitterText = __webpack_require__(1);

	var _twitterText2 = _interopRequireDefault(_twitterText);

	var _ = __webpack_require__(2);

	var _2 = _interopRequireDefault(_);

	var _initColorPicker = __webpack_require__(4);

	var _initColorPicker2 = _interopRequireDefault(_initColorPicker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var UI = _2.default.UI;

	var documentId = 'example.pdf';
	var PAGE_HEIGHT = void 0;
	var RENDER_OPTIONS = {
	  documentId: documentId,
	  pdfDocument: null,
	  scale: parseFloat(localStorage.getItem(documentId + '/scale'), 10) || 1.33,
	  rotate: parseInt(localStorage.getItem(documentId + '/rotate'), 10) || 0
	};

	_2.default.setStoreAdapter(new _2.default.LocalStoreAdapter());
	PDFJS.workerSrc = './shared/pdf.worker.js';

	// Render stuff
	var NUM_PAGES = 0;
	document.getElementById('content-wrapper').addEventListener('scroll', function (e) {
	  var visiblePageNum = Math.round(e.target.scrollTop / PAGE_HEIGHT) + 1;
	  var visiblePage = document.querySelector('.page[data-page-number="' + visiblePageNum + '"][data-loaded="false"]');
	  if (visiblePage) {
	    setTimeout(function () {
	      UI.renderPage(visiblePageNum, RENDER_OPTIONS);
	    });
	  }
	});

	function render() {
	  PDFJS.getDocument(RENDER_OPTIONS.documentId).then(function (pdf) {
	    RENDER_OPTIONS.pdfDocument = pdf;

	    var viewer = document.getElementById('viewer');
	    viewer.innerHTML = '';
	    NUM_PAGES = pdf.pdfInfo.numPages;
	    for (var i = 0; i < NUM_PAGES; i++) {
	      var page = UI.createPage(i + 1);
	      viewer.appendChild(page);
	    }

	    UI.renderPage(1, RENDER_OPTIONS).then(function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 2);

	      var pdfPage = _ref2[0];
	      var annotations = _ref2[1];

	      var viewport = pdfPage.getViewport(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate);
	      PAGE_HEIGHT = viewport.height;
	    });
	  });
	}
	render();

	// Text stuff
	(function () {
	  var textSize = void 0;
	  var textColor = void 0;

	  function initText() {
	    var size = document.querySelector('.toolbar .text-size');
	    [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96].forEach(function (s) {
	      size.appendChild(new Option(s, s));
	    });

	    setText(localStorage.getItem(RENDER_OPTIONS.documentId + '/text/size') || 10, localStorage.getItem(RENDER_OPTIONS.documentId + '/text/color') || '#000000');

	    (0, _initColorPicker2.default)(document.querySelector('.text-color'), textColor, function (value) {
	      setText(textSize, value);
	    });
	  }

	  function setText(size, color) {
	    var modified = false;

	    if (textSize !== size) {
	      modified = true;
	      textSize = size;
	      localStorage.setItem(RENDER_OPTIONS.documentId + '/text/size', textSize);
	      document.querySelector('.toolbar .text-size').value = textSize;
	    }

	    if (textColor !== color) {
	      modified = true;
	      textColor = color;
	      localStorage.setItem(RENDER_OPTIONS.documentId + '/text/color', textColor);

	      var selected = document.querySelector('.toolbar .text-color.color-selected');
	      if (selected) {
	        selected.classList.remove('color-selected');
	        selected.removeAttribute('aria-selected');
	      }

	      selected = document.querySelector('.toolbar .text-color[data-color="' + color + '"]');
	      if (selected) {
	        selected.classList.add('color-selected');
	        selected.setAttribute('aria-selected', true);
	      }
	    }

	    if (modified) {
	      UI.setText(textSize, textColor);
	    }
	  }

	  function handleTextSizeChange(e) {
	    setText(e.target.value, textColor);
	  }

	  document.querySelector('.toolbar .text-size').addEventListener('change', handleTextSizeChange);

	  initText();
	})();

	// Pen stuff
	(function () {
	  var penSize = void 0;
	  var penColor = void 0;

	  function initPen() {
	    var size = document.querySelector('.toolbar .pen-size');
	    for (var i = 0; i < 20; i++) {
	      size.appendChild(new Option(i + 1, i + 1));
	    }

	    setPen(localStorage.getItem(RENDER_OPTIONS.documentId + '/pen/size') || 1, localStorage.getItem(RENDER_OPTIONS.documentId + '/pen/color') || '#000000');

	    (0, _initColorPicker2.default)(document.querySelector('.pen-color'), penColor, function (value) {
	      setPen(penSize, value);
	    });
	  }

	  function setPen(size, color) {
	    var modified = false;

	    if (penSize !== size) {
	      modified = true;
	      penSize = size;
	      localStorage.setItem(RENDER_OPTIONS.documentId + '/pen/size', penSize);
	      document.querySelector('.toolbar .pen-size').value = penSize;
	    }

	    if (penColor !== color) {
	      modified = true;
	      penColor = color;
	      localStorage.setItem(RENDER_OPTIONS.documentId + '/pen/color', penColor);

	      var selected = document.querySelector('.toolbar .pen-color.color-selected');
	      if (selected) {
	        selected.classList.remove('color-selected');
	        selected.removeAttribute('aria-selected');
	      }

	      selected = document.querySelector('.toolbar .pen-color[data-color="' + color + '"]');
	      if (selected) {
	        selected.classList.add('color-selected');
	        selected.setAttribute('aria-selected', true);
	      }
	    }

	    if (modified) {
	      UI.setPen(penSize, penColor);
	    }
	  }

	  function handlePenSizeChange(e) {
	    setPen(e.target.value, penColor);
	  }

	  document.querySelector('.toolbar .pen-size').addEventListener('change', handlePenSizeChange);

	  initPen();
	})();

	// Toolbar buttons
	(function () {
	  var tooltype = localStorage.getItem(RENDER_OPTIONS.documentId + '/tooltype') || 'cursor';
	  if (tooltype) {
	    setActiveToolbarItem(tooltype, document.querySelector('.toolbar button[data-tooltype=' + tooltype + ']'));
	  }

	  function setActiveToolbarItem(type, button) {
	    var active = document.querySelector('.toolbar button.active');
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
	      localStorage.setItem(RENDER_OPTIONS.documentId + '/tooltype', type);
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

	    if (RENDER_OPTIONS.scale !== scale || RENDER_OPTIONS.rotate !== rotate) {
	      RENDER_OPTIONS.scale = scale;
	      RENDER_OPTIONS.rotate = rotate;

	      localStorage.setItem(RENDER_OPTIONS.documentId + '/scale', RENDER_OPTIONS.scale);
	      localStorage.setItem(RENDER_OPTIONS.documentId + '/rotate', RENDER_OPTIONS.rotate % 360);

	      render();
	    }
	  }

	  function handleScaleChange(e) {
	    setScaleRotate(e.target.value, RENDER_OPTIONS.rotate);
	  }

	  function handleRotateCWClick() {
	    setScaleRotate(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate + 90);
	  }

	  function handleRotateCCWClick() {
	    setScaleRotate(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate - 90);
	  }

	  document.querySelector('.toolbar select.scale').value = RENDER_OPTIONS.scale;
	  document.querySelector('.toolbar select.scale').addEventListener('change', handleScaleChange);
	  document.querySelector('.toolbar .rotate-ccw').addEventListener('click', handleRotateCCWClick);
	  document.querySelector('.toolbar .rotate-cw').addEventListener('click', handleRotateCWClick);
	})();

	// Clear toolbar button
	(function () {
	  function handleClearClick(e) {
	    if (confirm('Are you sure you want to clear annotations?')) {
	      for (var i = 0; i < NUM_PAGES; i++) {
	        document.querySelector('div#pageContainer' + (i + 1) + ' svg.annotationLayer').innerHTML = '';
	      }

	      localStorage.removeItem(RENDER_OPTIONS.documentId + '/annotations');
	    }
	  }
	  document.querySelector('a.clear').addEventListener('click', handleClearClick);
	})();

	// Comment stuff
	(function (window, document) {
	  var commentList = document.querySelector('#comment-wrapper .comment-list-container');
	  var commentForm = document.querySelector('#comment-wrapper .comment-list-form');
	  var commentText = commentForm.querySelector('input[type="text"]');

	  function supportsComments(target) {
	    var type = target.getAttribute('data-pdf-annotate-type');
	    return ['point', 'highlight', 'area'].indexOf(type) > -1;
	  }

	  function insertComment(comment) {
	    var child = document.createElement('div');
	    child.className = 'comment-list-item';
	    child.innerHTML = _twitterText2.default.autoLink(_twitterText2.default.htmlEscape(comment.content));

	    commentList.appendChild(child);
	  }

	  function handleAnnotationClick(target) {
	    if (supportsComments(target)) {
	      (function () {
	        var documentId = target.parentNode.getAttribute('data-pdf-annotate-document');
	        var annotationId = target.getAttribute('data-pdf-annotate-id');

	        _2.default.getStoreAdapter().getComments(documentId, annotationId).then(function (comments) {
	          commentList.innerHTML = '';
	          commentForm.style.display = '';
	          commentText.focus();

	          commentForm.onsubmit = function () {
	            _2.default.getStoreAdapter().addComment(documentId, annotationId, commentText.value.trim()).then(insertComment).then(function () {
	              commentText.value = '';
	              commentText.focus();
	            });

	            return false;
	          };

	          comments.forEach(insertComment);
	        });
	      })();
	    }
	  }

	  function handleAnnotationBlur(target) {
	    if (supportsComments(target)) {
	      commentList.innerHTML = '';
	      commentForm.style.display = 'none';
	      commentForm.onsubmit = null;

	      insertComment({ content: 'No comments' });
	    }
	  }

	  UI.addEventListener('annotation:click', handleAnnotationClick);
	  UI.addEventListener('annotation:blur', handleAnnotationBlur);
	})(window, document);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {
	  if (typeof twttr === "undefined" || twttr === null) {
	    var twttr = {};
	  }

	  twttr.txt = {};
	  twttr.txt.regexen = {};

	  var HTML_ENTITIES = {
	    '&': '&amp;',
	    '>': '&gt;',
	    '<': '&lt;',
	    '"': '&quot;',
	    "'": '&#39;'
	  };

	  // HTML escaping
	  twttr.txt.htmlEscape = function(text) {
	    return text && text.replace(/[&"'><]/g, function(character) {
	      return HTML_ENTITIES[character];
	    });
	  };

	  // Builds a RegExp
	  function regexSupplant(regex, flags) {
	    flags = flags || "";
	    if (typeof regex !== "string") {
	      if (regex.global && flags.indexOf("g") < 0) {
	        flags += "g";
	      }
	      if (regex.ignoreCase && flags.indexOf("i") < 0) {
	        flags += "i";
	      }
	      if (regex.multiline && flags.indexOf("m") < 0) {
	        flags += "m";
	      }

	      regex = regex.source;
	    }

	    return new RegExp(regex.replace(/#\{(\w+)\}/g, function(match, name) {
	      var newRegex = twttr.txt.regexen[name] || "";
	      if (typeof newRegex !== "string") {
	        newRegex = newRegex.source;
	      }
	      return newRegex;
	    }), flags);
	  }

	  twttr.txt.regexSupplant = regexSupplant;

	  // simple string interpolation
	  function stringSupplant(str, values) {
	    return str.replace(/#\{(\w+)\}/g, function(match, name) {
	      return values[name] || "";
	    });
	  }

	  twttr.txt.stringSupplant = stringSupplant;

	  twttr.txt.regexen.spaces_group = /\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000/;
	  twttr.txt.regexen.spaces = regexSupplant(/[#{spaces_group}]/);
	  twttr.txt.regexen.invalid_chars_group = /\uFFFE\uFEFF\uFFFF\u202A-\u202E/;
	  twttr.txt.regexen.invalid_chars = regexSupplant(/[#{invalid_chars_group}]/);
	  twttr.txt.regexen.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/;
	  twttr.txt.regexen.rtl_chars = /[\u0600-\u06FF]|[\u0750-\u077F]|[\u0590-\u05FF]|[\uFE70-\uFEFF]/mg;
	  twttr.txt.regexen.non_bmp_code_pairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/mg;

	  twttr.txt.regexen.latinAccentChars = /\xC0-\xD6\xD8-\xF6\xF8-\xFF\u0100-\u024F\u0253\u0254\u0256\u0257\u0259\u025B\u0263\u0268\u026F\u0272\u0289\u028B\u02BB\u0300-\u036F\u1E00-\u1EFF/;

	  // Generated from unicode_regex/unicode_regex_groups.scala, same as objective c's \p{L}\p{M}
	  twttr.txt.regexen.bmpLetterAndMarks = /A-Za-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07ca-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0971-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09f0\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a70-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0cf1\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u103f\u1050-\u108f\u109a-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16f1-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u180b-\u180d\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f\u1aa7\u1ab0-\u1abe\u1b00-\u1b4b\u1b6b-\u1b73\u1b80-\u1baf\u1bba-\u1bf3\u1c00-\u1c37\u1c4d-\u1c4f\u1c5a-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u20d0-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005\u3006\u302a-\u302f\u3031-\u3035\u303b\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua672\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6e5\ua6f0\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8e0-\ua8f7\ua8fb\ua90a-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uabc0-\uabea\uabec\uabed\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc/;
	  twttr.txt.regexen.astralLetterAndMarks = /\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\uddfd\ude80-\ude9c\udea0-\uded0\udee0\udf00-\udf1f\udf30-\udf40\udf42-\udf49\udf50-\udf7a\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf]|\ud801[\udc00-\udc9d\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00-\ude03\ude05\ude06\ude0c-\ude13\ude15-\ude17\ude19-\ude33\ude38-\ude3a\ude3f\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee6\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]|\ud803[\udc00-\udc48]|\ud804[\udc00-\udc46\udc7f-\udcba\udcd0-\udce8\udd00-\udd34\udd50-\udd73\udd76\udd80-\uddc4\uddda\ude00-\ude11\ude13-\ude37\udeb0-\udeea\udf01-\udf03\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3c-\udf44\udf47\udf48\udf4b-\udf4d\udf57\udf5d-\udf63\udf66-\udf6c\udf70-\udf74]|\ud805[\udc80-\udcc5\udcc7\udd80-\uddb5\uddb8-\uddc0\ude00-\ude40\ude44\ude80-\udeb7]|\ud806[\udca0-\udcdf\udcff\udec0-\udef8]|\ud808[\udc00-\udf98]|\ud80c[\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud81a[\udc00-\ude38\ude40-\ude5e\uded0-\udeed\udef0-\udef4\udf00-\udf36\udf40-\udf43\udf63-\udf77\udf7d-\udf8f]|\ud81b[\udf00-\udf44\udf50-\udf7e\udf8f-\udf9f]|\ud82c[\udc00\udc01]|\ud82f[\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99\udc9d\udc9e]|\ud834[\udd65-\udd69\udd6d-\udd72\udd7b-\udd82\udd85-\udd8b\uddaa-\uddad\ude42-\ude44]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]|\ud83a[\udc00-\udcc4\udcd0-\udcd6]|\ud83b[\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]|\ud840[\udc00-\udfff]|\ud841[\udc00-\udfff]|\ud842[\udc00-\udfff]|\ud843[\udc00-\udfff]|\ud844[\udc00-\udfff]|\ud845[\udc00-\udfff]|\ud846[\udc00-\udfff]|\ud847[\udc00-\udfff]|\ud848[\udc00-\udfff]|\ud849[\udc00-\udfff]|\ud84a[\udc00-\udfff]|\ud84b[\udc00-\udfff]|\ud84c[\udc00-\udfff]|\ud84d[\udc00-\udfff]|\ud84e[\udc00-\udfff]|\ud84f[\udc00-\udfff]|\ud850[\udc00-\udfff]|\ud851[\udc00-\udfff]|\ud852[\udc00-\udfff]|\ud853[\udc00-\udfff]|\ud854[\udc00-\udfff]|\ud855[\udc00-\udfff]|\ud856[\udc00-\udfff]|\ud857[\udc00-\udfff]|\ud858[\udc00-\udfff]|\ud859[\udc00-\udfff]|\ud85a[\udc00-\udfff]|\ud85b[\udc00-\udfff]|\ud85c[\udc00-\udfff]|\ud85d[\udc00-\udfff]|\ud85e[\udc00-\udfff]|\ud85f[\udc00-\udfff]|\ud860[\udc00-\udfff]|\ud861[\udc00-\udfff]|\ud862[\udc00-\udfff]|\ud863[\udc00-\udfff]|\ud864[\udc00-\udfff]|\ud865[\udc00-\udfff]|\ud866[\udc00-\udfff]|\ud867[\udc00-\udfff]|\ud868[\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86a[\udc00-\udfff]|\ud86b[\udc00-\udfff]|\ud86c[\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|\ud87e[\udc00-\ude1d]|\udb40[\udd00-\uddef]/;

	  // Generated from unicode_regex/unicode_regex_groups.scala, same as objective c's \p{Nd}
	  twttr.txt.regexen.bmpNumerals = /0-9\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0de6-\u0def\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\ua9f0-\ua9f9\uaa50-\uaa59\uabf0-\uabf9\uff10-\uff19/;
	  twttr.txt.regexen.astralNumerals = /\ud801[\udca0-\udca9]|\ud804[\udc66-\udc6f\udcf0-\udcf9\udd36-\udd3f\uddd0-\uddd9\udef0-\udef9]|\ud805[\udcd0-\udcd9\ude50-\ude59\udec0-\udec9]|\ud806[\udce0-\udce9]|\ud81a[\ude60-\ude69\udf50-\udf59]|\ud835[\udfce-\udfff]/;

	  twttr.txt.regexen.hashtagSpecialChars = /_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\xb7/;

	  // A hashtag must contain at least one unicode letter or mark, as well as numbers, underscores, and select special characters.
	  twttr.txt.regexen.hashSigns = /[#＃]/;
	  twttr.txt.regexen.hashtagAlpha = regexSupplant(/(?:[#{bmpLetterAndMarks}]|(?=#{non_bmp_code_pairs})(?:#{astralLetterAndMarks}))/);
	  twttr.txt.regexen.hashtagAlphaNumeric = regexSupplant(/(?:[#{bmpLetterAndMarks}#{bmpNumerals}#{hashtagSpecialChars}]|(?=#{non_bmp_code_pairs})(?:#{astralLetterAndMarks}|#{astralNumerals}))/);
	  twttr.txt.regexen.endHashtagMatch = regexSupplant(/^(?:#{hashSigns}|:\/\/)/);
	  twttr.txt.regexen.codePoint = /(?:[^\uD800-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/;
	  twttr.txt.regexen.hashtagBoundary = regexSupplant(/(?:^|$|(?!#{hashtagAlphaNumeric}|&)#{codePoint})/);
	  twttr.txt.regexen.validHashtag = regexSupplant(/(#{hashtagBoundary})(#{hashSigns})(?!\uFE0F|\u20E3)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi);

	  // Mention related regex collection
	  twttr.txt.regexen.validMentionPrecedingChars = /(?:^|[^a-zA-Z0-9_!#$%&*@＠]|(?:^|[^a-zA-Z0-9_+~.-])(?:rt|RT|rT|Rt):?)/;
	  twttr.txt.regexen.atSigns = /[@＠]/;
	  twttr.txt.regexen.validMentionOrList = regexSupplant(
	    '(#{validMentionPrecedingChars})' +  // $1: Preceding character
	    '(#{atSigns})' +                     // $2: At mark
	    '([a-zA-Z0-9_]{1,20})' +             // $3: Screen name
	    '(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?'  // $4: List (optional)
	  , 'g');
	  twttr.txt.regexen.validReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/);
	  twttr.txt.regexen.endMentionMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/);

	  // URL related regex collection
	  twttr.txt.regexen.validUrlPrecedingChars = regexSupplant(/(?:[^A-Za-z0-9@＠$#＃#{invalid_chars_group}]|^)/);
	  twttr.txt.regexen.invalidUrlWithoutProtocolPrecedingChars = /[-_.\/]$/;
	  twttr.txt.regexen.invalidDomainChars = stringSupplant("#{punct}#{spaces_group}#{invalid_chars_group}", twttr.txt.regexen);
	  twttr.txt.regexen.validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/);
	  twttr.txt.regexen.validSubdomain = regexSupplant(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/);
	  twttr.txt.regexen.validDomainName = regexSupplant(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/);
	  twttr.txt.regexen.validGTLD = regexSupplant(RegExp(
	'(?:(?:' +
	    '삼성|닷컴|닷넷|香格里拉|餐厅|食品|飞利浦|電訊盈科|集团|购物|谷歌|诺基亚|联通|网络|网站|网店|网址|组织机构|移动|珠宝|点看|游戏|淡马锡|机构|書籍|时尚|新闻|政府|政务|' +
	    '手表|手机|我爱你|慈善|微博|广东|工行|家電|娱乐|大拿|在线|嘉里大酒店|嘉里|商标|商店|商城|公益|公司|八卦|健康|信息|佛山|企业|中文网|中信|世界|ポイント|ファッション|' +
	    'セール|ストア|コム|グーグル|クラウド|みんな|คอม|संगठन|नेट|कॉम|همراه|موقع|موبايلي|كوم|شبكة|بيتك|بازار|العليان|' +
	    'ارامكو|ابوظبي|קום|сайт|рус|орг|онлайн|москва|ком|дети|zuerich|zone|zippo|zip|zero|zara|zappos|' +
	    'yun|youtube|you|yokohama|yoga|yodobashi|yandex|yamaxun|yahoo|yachts|xyz|xxx|xperia|xin|xihuan|' +
	    'xfinity|xerox|xbox|wtf|wtc|world|works|work|woodside|wolterskluwer|wme|wine|windows|win|' +
	    'williamhill|wiki|wien|whoswho|weir|weibo|wedding|wed|website|weber|webcam|weatherchannel|' +
	    'weather|watches|watch|warman|wanggou|wang|walter|wales|vuelos|voyage|voto|voting|vote|' +
	    'volkswagen|vodka|vlaanderen|viva|vistaprint|vista|vision|virgin|vip|vin|villas|viking|vig|video|' +
	    'viajes|vet|versicherung|vermögensberatung|vermögensberater|verisign|ventures|vegas|vana|' +
	    'vacations|ups|uol|uno|university|unicom|ubs|tvs|tushu|tunes|tui|tube|trv|trust|' +
	    'travelersinsurance|travelers|travelchannel|travel|training|trading|trade|toys|toyota|town|tours|' +
	    'total|toshiba|toray|top|tools|tokyo|today|tmall|tirol|tires|tips|tiffany|tienda|tickets|theatre|' +
	    'theater|thd|teva|tennis|temasek|telefonica|telecity|tel|technology|tech|team|tdk|tci|taxi|tax|' +
	    'tattoo|tatar|tatamotors|taobao|talk|taipei|tab|systems|symantec|sydney|swiss|swatch|suzuki|' +
	    'surgery|surf|support|supply|supplies|sucks|style|study|studio|stream|store|storage|stockholm|' +
	    'stcgroup|stc|statoil|statefarm|statebank|starhub|star|stada|srl|spreadbetting|spot|spiegel|' +
	    'space|soy|sony|song|solutions|solar|sohu|software|softbank|social|soccer|sncf|smile|skype|sky|' +
	    'skin|ski|site|singles|sina|silk|shriram|show|shouji|shopping|shop|shoes|shiksha|shia|shell|shaw|' +
	    'sharp|shangrila|sfr|sexy|sex|sew|seven|services|sener|select|seek|security|seat|scot|scor|' +
	    'science|schwarz|schule|school|scholarships|schmidt|schaeffler|scb|sca|sbs|sbi|saxo|save|sas|' +
	    'sarl|sapo|sap|sanofi|sandvikcoromant|sandvik|samsung|salon|sale|sakura|safety|safe|saarland|' +
	    'ryukyu|rwe|run|ruhr|rsvp|room|rodeo|rocks|rocher|rip|rio|ricoh|richardli|rich|rexroth|reviews|' +
	    'review|restaurant|rest|republican|report|repair|rentals|rent|ren|reit|reisen|reise|rehab|' +
	    'redumbrella|redstone|red|recipes|realty|realtor|realestate|read|racing|quest|quebec|qpon|pwc|' +
	    'pub|protection|property|properties|promo|progressive|prof|productions|prod|pro|prime|press|' +
	    'praxi|post|porn|politie|poker|pohl|pnc|plus|plumbing|playstation|play|place|pizza|pioneer|pink|' +
	    'ping|pin|pid|pictures|pictet|pics|piaget|physio|photos|photography|photo|philips|pharmacy|pet|' +
	    'pccw|passagens|party|parts|partners|pars|paris|panerai|pamperedchef|page|ovh|ott|otsuka|osaka|' +
	    'origins|orientexpress|organic|org|orange|oracle|ooo|online|onl|ong|one|omega|ollo|olayangroup|' +
	    'olayan|okinawa|office|obi|nyc|ntt|nrw|nra|nowtv|nowruz|now|norton|northwesternmutual|nokia|' +
	    'nissay|nissan|ninja|nikon|nico|nhk|ngo|nfl|nexus|nextdirect|next|news|new|neustar|network|' +
	    'netflix|netbank|net|nec|navy|natura|name|nagoya|nadex|mutuelle|mutual|museum|mtr|mtpc|mtn|' +
	    'movistar|movie|mov|motorcycles|moscow|mortgage|mormon|montblanc|money|monash|mom|moi|moe|moda|' +
	    'mobily|mobi|mma|mls|mlb|mitsubishi|mit|mini|mil|microsoft|miami|metlife|meo|menu|men|memorial|' +
	    'meme|melbourne|meet|media|med|mba|mattel|marriott|markets|marketing|market|mango|management|man|' +
	    'makeup|maison|maif|madrid|luxury|luxe|lupin|ltda|ltd|love|lotto|lotte|london|lol|locus|locker|' +
	    'loans|loan|lixil|living|live|lipsy|link|linde|lincoln|limo|limited|like|lighting|lifestyle|' +
	    'lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|leclerc|lease|lds|lawyer|law|latrobe|lat|' +
	    'lasalle|lanxess|landrover|land|lancaster|lamer|lamborghini|lacaixa|kyoto|kuokgroup|kred|krd|kpn|' +
	    'kpmg|kosher|komatsu|koeln|kiwi|kitchen|kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|' +
	    'kerryhotels|kddi|kaufen|juegos|jprs|jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jewelry|jetzt|' +
	    'jcp|jcb|java|jaguar|iwc|itv|itau|istanbul|ist|ismaili|iselect|irish|ipiranga|investments|' +
	    'international|int|insure|insurance|institute|ink|ing|info|infiniti|industries|immobilien|immo|' +
	    'imdb|imamat|ikano|iinet|ifm|icu|ice|icbc|ibm|hyundai|htc|hsbc|how|house|hotmail|hoteles|hosting|' +
	    'host|horse|honda|homes|homedepot|holiday|holdings|hockey|hkt|hiv|hitachi|hisamitsu|hiphop|hgtv|' +
	    'hermes|here|helsinki|help|healthcare|health|hdfcbank|haus|hangout|hamburg|guru|guitars|guide|' +
	    'guge|gucci|guardian|group|gripe|green|gratis|graphics|grainger|gov|got|gop|google|goog|goodyear|' +
	    'goo|golf|goldpoint|gold|godaddy|gmx|gmo|gmbh|gmail|globo|global|gle|glass|giving|gives|gifts|' +
	    'gift|ggee|genting|gent|gea|gdn|gbiz|garden|games|game|gallup|gallo|gallery|gal|fyi|futbol|' +
	    'furniture|fund|fujitsu|ftr|frontier|frontdoor|frogans|frl|fresenius|fox|foundation|forum|' +
	    'forsale|forex|ford|football|foodnetwork|foo|fly|flsmidth|flowers|florist|flir|flights|flickr|' +
	    'fitness|fit|fishing|fish|firmdale|firestone|fire|financial|finance|final|film|ferrero|feedback|' +
	    'fedex|fast|fashion|farmers|farm|fans|fan|family|faith|fairwinds|fail|fage|extraspace|express|' +
	    'exposed|expert|exchange|everbank|events|eus|eurovision|estate|esq|erni|ericsson|equipment|epson|' +
	    'epost|enterprises|engineering|engineer|energy|emerck|email|education|edu|edeka|eat|earth|dvag|' +
	    'durban|dupont|dunlop|dubai|dtv|drive|download|dot|doosan|domains|doha|dog|docs|dnp|discount|' +
	    'directory|direct|digital|diet|diamonds|dhl|dev|design|desi|dentist|dental|democrat|delta|' +
	    'deloitte|dell|delivery|degree|deals|dealer|deal|dds|dclk|day|datsun|dating|date|dance|dad|dabur|' +
	    'cyou|cymru|cuisinella|csc|cruises|crs|crown|cricket|creditunion|creditcard|credit|courses|' +
	    'coupons|coupon|country|corsica|coop|cool|cookingchannel|cooking|contractors|contact|consulting|' +
	    'construction|condos|comsec|computer|compare|company|community|commbank|comcast|com|cologne|' +
	    'college|coffee|codes|coach|clubmed|club|cloud|clothing|clinique|clinic|click|cleaning|claims|' +
	    'cityeats|city|citic|cisco|circle|cipriani|church|chrome|christmas|chloe|chintai|cheap|chat|' +
	    'chase|channel|chanel|cfd|cfa|cern|ceo|center|ceb|cbre|cbn|cba|catering|cat|casino|cash|casa|' +
	    'cartier|cars|careers|career|care|cards|caravan|car|capital|capetown|canon|cancerresearch|camp|' +
	    'camera|cam|call|cal|cafe|cab|bzh|buzz|buy|business|builders|build|bugatti|budapest|brussels|' +
	    'brother|broker|broadway|bridgestone|bradesco|boutique|bot|bostik|bosch|boots|book|boo|bond|bom|' +
	    'boehringer|boats|bnpparibas|bnl|bmw|bms|blue|bloomberg|blog|blanco|blackfriday|black|biz|bio|' +
	    'bingo|bing|bike|bid|bible|bharti|bet|best|berlin|bentley|beer|beats|bcn|bcg|bbva|bbc|bayern|' +
	    'bauhaus|bargains|barefoot|barclays|barclaycard|barcelona|bar|bank|band|baidu|baby|azure|axa|aws|' +
	    'avianca|autos|auto|author|audio|audible|audi|auction|attorney|associates|asia|arte|art|arpa|' +
	    'army|archi|aramco|aquarelle|apple|app|apartments|anz|anquan|android|analytics|amsterdam|amica|' +
	    'alstom|alsace|ally|allfinanz|alipay|alibaba|akdn|airtel|airforce|airbus|aig|agency|agakhan|afl|' +
	    'aetna|aero|aeg|adult|ads|adac|actor|active|aco|accountants|accountant|accenture|academy|' +
	    'abudhabi|abogado|able|abbvie|abbott|abb|aarp|aaa|onion' +
	')(?=[^0-9a-zA-Z@]|$))'));
	  twttr.txt.regexen.validCCTLD = regexSupplant(RegExp(
	'(?:(?:' +
	    '한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|ਭਾਰਤ|' +
	    'ভাৰত|ভারত|বাংলা|भारत|پاکستان|مليسيا|مصر|قطر|فلسطين|عمان|عراق|سورية|سودان|تونس|بھارت|ایران|' +
	    'امارات|المغرب|السعودية|الجزائر|الاردن|հայ|қаз|укр|срб|рф|мон|мкд|ею|бел|бг|ελ|zw|zm|za|yt|ye|ws|' +
	    'wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|tm|tl|tk|tj|th|tg|tf|td|tc|' +
	    'sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|rs|ro|re|qa|py|pw|pt|ps|' +
	    'pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|' +
	    'mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|ky|kw|kr|kp|kn|km|' +
	    'ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|gt|gs|gr|gq|gp|' +
	    'gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|dk|dj|de|cz|' +
	    'cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|bl|bj|bi|' +
	    'bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac' +
	')(?=[^0-9a-zA-Z@]|$))'));
	  twttr.txt.regexen.validPunycode = /(?:xn--[0-9a-z]+)/;
	  twttr.txt.regexen.validSpecialCCTLD = /(?:(?:co|tv)(?=[^0-9a-zA-Z@]|$))/;
	  twttr.txt.regexen.validDomain = regexSupplant(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/);
	  twttr.txt.regexen.validAsciiDomain = regexSupplant(/(?:(?:[\-a-z0-9#{latinAccentChars}]+)\.)+(?:#{validGTLD}|#{validCCTLD}|#{validPunycode})/gi);
	  twttr.txt.regexen.invalidShortDomain = regexSupplant(/^#{validDomainName}#{validCCTLD}$/i);
	  twttr.txt.regexen.validSpecialShortDomain = regexSupplant(/^#{validDomainName}#{validSpecialCCTLD}$/i);
	  twttr.txt.regexen.validPortNumber = /[0-9]+/;
	  twttr.txt.regexen.cyrillicLettersAndMarks = /\u0400-\u04FF/;
	  twttr.txt.regexen.validGeneralUrlPathChars = regexSupplant(/[a-z#{cyrillicLettersAndMarks}0-9!\*';:=\+,\.\$\/%#\[\]\-_~@\|&#{latinAccentChars}]/i);
	  // Allow URL paths to contain up to two nested levels of balanced parens
	  //  1. Used in Wikipedia URLs like /Primer_(film)
	  //  2. Used in IIS sessions like /S(dfd346)/
	  //  3. Used in Rdio URLs like /track/We_Up_(Album_Version_(Edited))/
	  twttr.txt.regexen.validUrlBalancedParens = regexSupplant(
	    '\\('                                   +
	      '(?:'                                 +
	        '#{validGeneralUrlPathChars}+'      +
	        '|'                                 +
	        // allow one nested level of balanced parentheses
	        '(?:'                               +
	          '#{validGeneralUrlPathChars}*'    +
	          '\\('                             +
	            '#{validGeneralUrlPathChars}+'  +
	          '\\)'                             +
	          '#{validGeneralUrlPathChars}*'    +
	        ')'                                 +
	      ')'                                   +
	    '\\)'
	  , 'i');
	  // Valid end-of-path chracters (so /foo. does not gobble the period).
	  // 1. Allow =&# for empty URL parameters and other URL-join artifacts
	  twttr.txt.regexen.validUrlPathEndingChars = regexSupplant(/[\+\-a-z#{cyrillicLettersAndMarks}0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i);
	  // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user/
	  twttr.txt.regexen.validUrlPath = regexSupplant('(?:' +
	    '(?:' +
	      '#{validGeneralUrlPathChars}*' +
	        '(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*' +
	        '#{validUrlPathEndingChars}'+
	      ')|(?:@#{validGeneralUrlPathChars}+\/)'+
	    ')', 'i');

	  twttr.txt.regexen.validUrlQueryChars = /[a-z0-9!?\*'@\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;
	  twttr.txt.regexen.validUrlQueryEndingChars = /[a-z0-9_&=#\/]/i;
	  twttr.txt.regexen.extractUrl = regexSupplant(
	    '('                                                            + // $1 total match
	      '(#{validUrlPrecedingChars})'                                + // $2 Preceeding chracter
	      '('                                                          + // $3 URL
	        '(https?:\\/\\/)?'                                         + // $4 Protocol (optional)
	        '(#{validDomain})'                                         + // $5 Domain(s)
	        '(?::(#{validPortNumber}))?'                               + // $6 Port number (optional)
	        '(\\/#{validUrlPath}*)?'                                   + // $7 URL Path
	        '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?'  + // $8 Query String
	      ')'                                                          +
	    ')'
	  , 'gi');

	  twttr.txt.regexen.validTcoUrl = /^https?:\/\/t\.co\/[a-z0-9]+/i;
	  twttr.txt.regexen.urlHasProtocol = /^https?:\/\//i;
	  twttr.txt.regexen.urlHasHttps = /^https:\/\//i;

	  // cashtag related regex
	  twttr.txt.regexen.cashtag = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i;
	  twttr.txt.regexen.validCashtag = regexSupplant('(^|#{spaces})(\\$)(#{cashtag})(?=$|\\s|[#{punct}])', 'gi');

	  // These URL validation pattern strings are based on the ABNF from RFC 3986
	  twttr.txt.regexen.validateUrlUnreserved = /[a-z\u0400-\u04FF0-9\-._~]/i;
	  twttr.txt.regexen.validateUrlPctEncoded = /(?:%[0-9a-f]{2})/i;
	  twttr.txt.regexen.validateUrlSubDelims = /[!$&'()*+,;=]/i;
	  twttr.txt.regexen.validateUrlPchar = regexSupplant('(?:' +
	    '#{validateUrlUnreserved}|' +
	    '#{validateUrlPctEncoded}|' +
	    '#{validateUrlSubDelims}|' +
	    '[:|@]' +
	  ')', 'i');

	  twttr.txt.regexen.validateUrlScheme = /(?:[a-z][a-z0-9+\-.]*)/i;
	  twttr.txt.regexen.validateUrlUserinfo = regexSupplant('(?:' +
	    '#{validateUrlUnreserved}|' +
	    '#{validateUrlPctEncoded}|' +
	    '#{validateUrlSubDelims}|' +
	    ':' +
	  ')*', 'i');

	  twttr.txt.regexen.validateUrlDecOctet = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i;
	  twttr.txt.regexen.validateUrlIpv4 = regexSupplant(/(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i);

	  // Punting on real IPv6 validation for now
	  twttr.txt.regexen.validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i;

	  // Also punting on IPvFuture for now
	  twttr.txt.regexen.validateUrlIp = regexSupplant('(?:' +
	    '#{validateUrlIpv4}|' +
	    '#{validateUrlIpv6}' +
	  ')', 'i');

	  // This is more strict than the rfc specifies
	  twttr.txt.regexen.validateUrlSubDomainSegment = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i;
	  twttr.txt.regexen.validateUrlDomainSegment = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i;
	  twttr.txt.regexen.validateUrlDomainTld = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i;
	  twttr.txt.regexen.validateUrlDomain = regexSupplant(/(?:(?:#{validateUrlSubDomainSegment]}\.)*(?:#{validateUrlDomainSegment]}\.)#{validateUrlDomainTld})/i);

	  twttr.txt.regexen.validateUrlHost = regexSupplant('(?:' +
	    '#{validateUrlIp}|' +
	    '#{validateUrlDomain}' +
	  ')', 'i');

	  // Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
	  twttr.txt.regexen.validateUrlUnicodeSubDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9_\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
	  twttr.txt.regexen.validateUrlUnicodeDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
	  twttr.txt.regexen.validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
	  twttr.txt.regexen.validateUrlUnicodeDomain = regexSupplant(/(?:(?:#{validateUrlUnicodeSubDomainSegment}\.)*(?:#{validateUrlUnicodeDomainSegment}\.)#{validateUrlUnicodeDomainTld})/i);

	  twttr.txt.regexen.validateUrlUnicodeHost = regexSupplant('(?:' +
	    '#{validateUrlIp}|' +
	    '#{validateUrlUnicodeDomain}' +
	  ')', 'i');

	  twttr.txt.regexen.validateUrlPort = /[0-9]{1,5}/;

	  twttr.txt.regexen.validateUrlUnicodeAuthority = regexSupplant(
	    '(?:(#{validateUrlUserinfo})@)?'  + // $1 userinfo
	    '(#{validateUrlUnicodeHost})'     + // $2 host
	    '(?::(#{validateUrlPort}))?'        //$3 port
	  , "i");

	  twttr.txt.regexen.validateUrlAuthority = regexSupplant(
	    '(?:(#{validateUrlUserinfo})@)?' + // $1 userinfo
	    '(#{validateUrlHost})'           + // $2 host
	    '(?::(#{validateUrlPort}))?'       // $3 port
	  , "i");

	  twttr.txt.regexen.validateUrlPath = regexSupplant(/(\/#{validateUrlPchar}*)*/i);
	  twttr.txt.regexen.validateUrlQuery = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i);
	  twttr.txt.regexen.validateUrlFragment = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i);

	  // Modified version of RFC 3986 Appendix B
	  twttr.txt.regexen.validateUrlUnencoded = regexSupplant(
	    '^'                               + // Full URL
	    '(?:'                             +
	      '([^:/?#]+):\\/\\/'             + // $1 Scheme
	    ')?'                              +
	    '([^/?#]*)'                       + // $2 Authority
	    '([^?#]*)'                        + // $3 Path
	    '(?:'                             +
	      '\\?([^#]*)'                    + // $4 Query
	    ')?'                              +
	    '(?:'                             +
	      '#(.*)'                         + // $5 Fragment
	    ')?$'
	  , "i");


	  // Default CSS class for auto-linked lists (along with the url class)
	  var DEFAULT_LIST_CLASS = "tweet-url list-slug";
	  // Default CSS class for auto-linked usernames (along with the url class)
	  var DEFAULT_USERNAME_CLASS = "tweet-url username";
	  // Default CSS class for auto-linked hashtags (along with the url class)
	  var DEFAULT_HASHTAG_CLASS = "tweet-url hashtag";
	  // Default CSS class for auto-linked cashtags (along with the url class)
	  var DEFAULT_CASHTAG_CLASS = "tweet-url cashtag";
	  // Options which should not be passed as HTML attributes
	  var OPTIONS_NOT_ATTRIBUTES = {'urlClass':true, 'listClass':true, 'usernameClass':true, 'hashtagClass':true, 'cashtagClass':true,
	                            'usernameUrlBase':true, 'listUrlBase':true, 'hashtagUrlBase':true, 'cashtagUrlBase':true,
	                            'usernameUrlBlock':true, 'listUrlBlock':true, 'hashtagUrlBlock':true, 'linkUrlBlock':true,
	                            'usernameIncludeSymbol':true, 'suppressLists':true, 'suppressNoFollow':true, 'targetBlank':true,
	                            'suppressDataScreenName':true, 'urlEntities':true, 'symbolTag':true, 'textWithSymbolTag':true, 'urlTarget':true,
	                            'invisibleTagAttrs':true, 'linkAttributeBlock':true, 'linkTextBlock': true, 'htmlEscapeNonEntities': true
	                            };

	  var BOOLEAN_ATTRIBUTES = {'disabled':true, 'readonly':true, 'multiple':true, 'checked':true};

	  // Simple object cloning function for simple objects
	  function clone(o) {
	    var r = {};
	    for (var k in o) {
	      if (o.hasOwnProperty(k)) {
	        r[k] = o[k];
	      }
	    }

	    return r;
	  }

	  twttr.txt.tagAttrs = function(attributes) {
	    var htmlAttrs = "";
	    for (var k in attributes) {
	      var v = attributes[k];
	      if (BOOLEAN_ATTRIBUTES[k]) {
	        v = v ? k : null;
	      }
	      if (v == null) continue;
	      htmlAttrs += " " + twttr.txt.htmlEscape(k) + "=\"" + twttr.txt.htmlEscape(v.toString()) + "\"";
	    }
	    return htmlAttrs;
	  };

	  twttr.txt.linkToText = function(entity, text, attributes, options) {
	    if (!options.suppressNoFollow) {
	      attributes.rel = "nofollow";
	    }
	    // if linkAttributeBlock is specified, call it to modify the attributes
	    if (options.linkAttributeBlock) {
	      options.linkAttributeBlock(entity, attributes);
	    }
	    // if linkTextBlock is specified, call it to get a new/modified link text
	    if (options.linkTextBlock) {
	      text = options.linkTextBlock(entity, text);
	    }
	    var d = {
	      text: text,
	      attr: twttr.txt.tagAttrs(attributes)
	    };
	    return stringSupplant("<a#{attr}>#{text}</a>", d);
	  };

	  twttr.txt.linkToTextWithSymbol = function(entity, symbol, text, attributes, options) {
	    var taggedSymbol = options.symbolTag ? "<" + options.symbolTag + ">" + symbol + "</"+ options.symbolTag + ">" : symbol;
	    text = twttr.txt.htmlEscape(text);
	    var taggedText = options.textWithSymbolTag ? "<" + options.textWithSymbolTag + ">" + text + "</"+ options.textWithSymbolTag + ">" : text;

	    if (options.usernameIncludeSymbol || !symbol.match(twttr.txt.regexen.atSigns)) {
	      return twttr.txt.linkToText(entity, taggedSymbol + taggedText, attributes, options);
	    } else {
	      return taggedSymbol + twttr.txt.linkToText(entity, taggedText, attributes, options);
	    }
	  };

	  twttr.txt.linkToHashtag = function(entity, text, options) {
	    var hash = text.substring(entity.indices[0], entity.indices[0] + 1);
	    var hashtag = twttr.txt.htmlEscape(entity.hashtag);
	    var attrs = clone(options.htmlAttrs || {});
	    attrs.href = options.hashtagUrlBase + hashtag;
	    attrs.title = "#" + hashtag;
	    attrs["class"] = options.hashtagClass;
	    if (hashtag.charAt(0).match(twttr.txt.regexen.rtl_chars)){
	      attrs["class"] += " rtl";
	    }
	    if (options.targetBlank) {
	      attrs.target = '_blank';
	    }

	    return twttr.txt.linkToTextWithSymbol(entity, hash, hashtag, attrs, options);
	  };

	  twttr.txt.linkToCashtag = function(entity, text, options) {
	    var cashtag = twttr.txt.htmlEscape(entity.cashtag);
	    var attrs = clone(options.htmlAttrs || {});
	    attrs.href = options.cashtagUrlBase + cashtag;
	    attrs.title = "$" + cashtag;
	    attrs["class"] =  options.cashtagClass;
	    if (options.targetBlank) {
	      attrs.target = '_blank';
	    }

	    return twttr.txt.linkToTextWithSymbol(entity, "$", cashtag, attrs, options);
	  };

	  twttr.txt.linkToMentionAndList = function(entity, text, options) {
	    var at = text.substring(entity.indices[0], entity.indices[0] + 1);
	    var user = twttr.txt.htmlEscape(entity.screenName);
	    var slashListname = twttr.txt.htmlEscape(entity.listSlug);
	    var isList = entity.listSlug && !options.suppressLists;
	    var attrs = clone(options.htmlAttrs || {});
	    attrs["class"] = (isList ? options.listClass : options.usernameClass);
	    attrs.href = isList ? options.listUrlBase + user + slashListname : options.usernameUrlBase + user;
	    if (!isList && !options.suppressDataScreenName) {
	      attrs['data-screen-name'] = user;
	    }
	    if (options.targetBlank) {
	      attrs.target = '_blank';
	    }

	    return twttr.txt.linkToTextWithSymbol(entity, at, isList ? user + slashListname : user, attrs, options);
	  };

	  twttr.txt.linkToUrl = function(entity, text, options) {
	    var url = entity.url;
	    var displayUrl = url;
	    var linkText = twttr.txt.htmlEscape(displayUrl);

	    // If the caller passed a urlEntities object (provided by a Twitter API
	    // response with include_entities=true), we use that to render the display_url
	    // for each URL instead of it's underlying t.co URL.
	    var urlEntity = (options.urlEntities && options.urlEntities[url]) || entity;
	    if (urlEntity.display_url) {
	      linkText = twttr.txt.linkTextWithEntity(urlEntity, options);
	    }

	    var attrs = clone(options.htmlAttrs || {});

	    if (!url.match(twttr.txt.regexen.urlHasProtocol)) {
	      url = "http://" + url;
	    }
	    attrs.href = url;

	    if (options.targetBlank) {
	      attrs.target = '_blank';
	    }

	    // set class only if urlClass is specified.
	    if (options.urlClass) {
	      attrs["class"] = options.urlClass;
	    }

	    // set target only if urlTarget is specified.
	    if (options.urlTarget) {
	      attrs.target = options.urlTarget;
	    }

	    if (!options.title && urlEntity.display_url) {
	      attrs.title = urlEntity.expanded_url;
	    }

	    return twttr.txt.linkToText(entity, linkText, attrs, options);
	  };

	  twttr.txt.linkTextWithEntity = function (entity, options) {
	    var displayUrl = entity.display_url;
	    var expandedUrl = entity.expanded_url;

	    // Goal: If a user copies and pastes a tweet containing t.co'ed link, the resulting paste
	    // should contain the full original URL (expanded_url), not the display URL.
	    //
	    // Method: Whenever possible, we actually emit HTML that contains expanded_url, and use
	    // font-size:0 to hide those parts that should not be displayed (because they are not part of display_url).
	    // Elements with font-size:0 get copied even though they are not visible.
	    // Note that display:none doesn't work here. Elements with display:none don't get copied.
	    //
	    // Additionally, we want to *display* ellipses, but we don't want them copied.  To make this happen we
	    // wrap the ellipses in a tco-ellipsis class and provide an onCopy handler that sets display:none on
	    // everything with the tco-ellipsis class.
	    //
	    // Exception: pic.twitter.com images, for which expandedUrl = "https://twitter.com/#!/username/status/1234/photo/1
	    // For those URLs, display_url is not a substring of expanded_url, so we don't do anything special to render the elided parts.
	    // For a pic.twitter.com URL, the only elided part will be the "https://", so this is fine.

	    var displayUrlSansEllipses = displayUrl.replace(/…/g, ""); // We have to disregard ellipses for matching
	    // Note: we currently only support eliding parts of the URL at the beginning or the end.
	    // Eventually we may want to elide parts of the URL in the *middle*.  If so, this code will
	    // become more complicated.  We will probably want to create a regexp out of display URL,
	    // replacing every ellipsis with a ".*".
	    if (expandedUrl.indexOf(displayUrlSansEllipses) != -1) {
	      var displayUrlIndex = expandedUrl.indexOf(displayUrlSansEllipses);
	      var v = {
	        displayUrlSansEllipses: displayUrlSansEllipses,
	        // Portion of expandedUrl that precedes the displayUrl substring
	        beforeDisplayUrl: expandedUrl.substr(0, displayUrlIndex),
	        // Portion of expandedUrl that comes after displayUrl
	        afterDisplayUrl: expandedUrl.substr(displayUrlIndex + displayUrlSansEllipses.length),
	        precedingEllipsis: displayUrl.match(/^…/) ? "…" : "",
	        followingEllipsis: displayUrl.match(/…$/) ? "…" : ""
	      };
	      for (var k in v) {
	        if (v.hasOwnProperty(k)) {
	          v[k] = twttr.txt.htmlEscape(v[k]);
	        }
	      }
	      // As an example: The user tweets "hi http://longdomainname.com/foo"
	      // This gets shortened to "hi http://t.co/xyzabc", with display_url = "…nname.com/foo"
	      // This will get rendered as:
	      // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
	      //   …
	      //   <!-- There's a chance the onCopy event handler might not fire. In case that happens,
	      //        we include an &nbsp; here so that the … doesn't bump up against the URL and ruin it.
	      //        The &nbsp; is inside the tco-ellipsis span so that when the onCopy handler *does*
	      //        fire, it doesn't get copied.  Otherwise the copied text would have two spaces in a row,
	      //        e.g. "hi  http://longdomainname.com/foo".
	      //   <span style='font-size:0'>&nbsp;</span>
	      // </span>
	      // <span style='font-size:0'>  <!-- This stuff should get copied but not displayed -->
	      //   http://longdomai
	      // </span>
	      // <span class='js-display-url'> <!-- This stuff should get displayed *and* copied -->
	      //   nname.com/foo
	      // </span>
	      // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
	      //   <span style='font-size:0'>&nbsp;</span>
	      //   …
	      // </span>
	      v['invisible'] = options.invisibleTagAttrs;
	      return stringSupplant("<span class='tco-ellipsis'>#{precedingEllipsis}<span #{invisible}>&nbsp;</span></span><span #{invisible}>#{beforeDisplayUrl}</span><span class='js-display-url'>#{displayUrlSansEllipses}</span><span #{invisible}>#{afterDisplayUrl}</span><span class='tco-ellipsis'><span #{invisible}>&nbsp;</span>#{followingEllipsis}</span>", v);
	    }
	    return displayUrl;
	  };

	  twttr.txt.autoLinkEntities = function(text, entities, options) {
	    options = clone(options || {});

	    options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
	    options.hashtagUrlBase = options.hashtagUrlBase || "https://twitter.com/#!/search?q=%23";
	    options.cashtagClass = options.cashtagClass || DEFAULT_CASHTAG_CLASS;
	    options.cashtagUrlBase = options.cashtagUrlBase || "https://twitter.com/#!/search?q=%24";
	    options.listClass = options.listClass || DEFAULT_LIST_CLASS;
	    options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
	    options.usernameUrlBase = options.usernameUrlBase || "https://twitter.com/";
	    options.listUrlBase = options.listUrlBase || "https://twitter.com/";
	    options.htmlAttrs = twttr.txt.extractHtmlAttrsFromOptions(options);
	    options.invisibleTagAttrs = options.invisibleTagAttrs || "style='position:absolute;left:-9999px;'";

	    // remap url entities to hash
	    var urlEntities, i, len;
	    if(options.urlEntities) {
	      urlEntities = {};
	      for(i = 0, len = options.urlEntities.length; i < len; i++) {
	        urlEntities[options.urlEntities[i].url] = options.urlEntities[i];
	      }
	      options.urlEntities = urlEntities;
	    }

	    var result = "";
	    var beginIndex = 0;

	    // sort entities by start index
	    entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });

	    var nonEntity = options.htmlEscapeNonEntities ? twttr.txt.htmlEscape : function(text) {
	      return text;
	    };

	    for (var i = 0; i < entities.length; i++) {
	      var entity = entities[i];
	      result += nonEntity(text.substring(beginIndex, entity.indices[0]));

	      if (entity.url) {
	        result += twttr.txt.linkToUrl(entity, text, options);
	      } else if (entity.hashtag) {
	        result += twttr.txt.linkToHashtag(entity, text, options);
	      } else if (entity.screenName) {
	        result += twttr.txt.linkToMentionAndList(entity, text, options);
	      } else if (entity.cashtag) {
	        result += twttr.txt.linkToCashtag(entity, text, options);
	      }
	      beginIndex = entity.indices[1];
	    }
	    result += nonEntity(text.substring(beginIndex, text.length));
	    return result;
	  };

	  twttr.txt.autoLinkWithJSON = function(text, json, options) {
	    // map JSON entity to twitter-text entity
	    if (json.user_mentions) {
	      for (var i = 0; i < json.user_mentions.length; i++) {
	        // this is a @mention
	        json.user_mentions[i].screenName = json.user_mentions[i].screen_name;
	      }
	    }

	    if (json.hashtags) {
	      for (var i = 0; i < json.hashtags.length; i++) {
	        // this is a #hashtag
	        json.hashtags[i].hashtag = json.hashtags[i].text;
	      }
	    }

	    if (json.symbols) {
	      for (var i = 0; i < json.symbols.length; i++) {
	        // this is a $CASH tag
	        json.symbols[i].cashtag = json.symbols[i].text;
	      }
	    }

	    // concatenate all entities
	    var entities = [];
	    for (var key in json) {
	      entities = entities.concat(json[key]);
	    }

	    // modify indices to UTF-16
	    twttr.txt.modifyIndicesFromUnicodeToUTF16(text, entities);

	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };

	  twttr.txt.extractHtmlAttrsFromOptions = function(options) {
	    var htmlAttrs = {};
	    for (var k in options) {
	      var v = options[k];
	      if (OPTIONS_NOT_ATTRIBUTES[k]) continue;
	      if (BOOLEAN_ATTRIBUTES[k]) {
	        v = v ? k : null;
	      }
	      if (v == null) continue;
	      htmlAttrs[k] = v;
	    }
	    return htmlAttrs;
	  };

	  twttr.txt.autoLink = function(text, options) {
	    var entities = twttr.txt.extractEntitiesWithIndices(text, {extractUrlsWithoutProtocol: false});
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };

	  twttr.txt.autoLinkUsernamesOrLists = function(text, options) {
	    var entities = twttr.txt.extractMentionsOrListsWithIndices(text);
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };

	  twttr.txt.autoLinkHashtags = function(text, options) {
	    var entities = twttr.txt.extractHashtagsWithIndices(text);
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };

	  twttr.txt.autoLinkCashtags = function(text, options) {
	    var entities = twttr.txt.extractCashtagsWithIndices(text);
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };

	  twttr.txt.autoLinkUrlsCustom = function(text, options) {
	    var entities = twttr.txt.extractUrlsWithIndices(text, {extractUrlsWithoutProtocol: false});
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };

	  twttr.txt.removeOverlappingEntities = function(entities) {
	    entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });

	    var prev = entities[0];
	    for (var i = 1; i < entities.length; i++) {
	      if (prev.indices[1] > entities[i].indices[0]) {
	        entities.splice(i, 1);
	        i--;
	      } else {
	        prev = entities[i];
	      }
	    }
	  };

	  twttr.txt.extractEntitiesWithIndices = function(text, options) {
	    var entities = twttr.txt.extractUrlsWithIndices(text, options)
	                    .concat(twttr.txt.extractMentionsOrListsWithIndices(text))
	                    .concat(twttr.txt.extractHashtagsWithIndices(text, {checkUrlOverlap: false}))
	                    .concat(twttr.txt.extractCashtagsWithIndices(text));

	    if (entities.length == 0) {
	      return [];
	    }

	    twttr.txt.removeOverlappingEntities(entities);
	    return entities;
	  };

	  twttr.txt.extractMentions = function(text) {
	    var screenNamesOnly = [],
	        screenNamesWithIndices = twttr.txt.extractMentionsWithIndices(text);

	    for (var i = 0; i < screenNamesWithIndices.length; i++) {
	      var screenName = screenNamesWithIndices[i].screenName;
	      screenNamesOnly.push(screenName);
	    }

	    return screenNamesOnly;
	  };

	  twttr.txt.extractMentionsWithIndices = function(text) {
	    var mentions = [],
	        mentionOrList,
	        mentionsOrLists = twttr.txt.extractMentionsOrListsWithIndices(text);

	    for (var i = 0 ; i < mentionsOrLists.length; i++) {
	      mentionOrList = mentionsOrLists[i];
	      if (mentionOrList.listSlug == '') {
	        mentions.push({
	          screenName: mentionOrList.screenName,
	          indices: mentionOrList.indices
	        });
	      }
	    }

	    return mentions;
	  };

	  /**
	   * Extract list or user mentions.
	   * (Presence of listSlug indicates a list)
	   */
	  twttr.txt.extractMentionsOrListsWithIndices = function(text) {
	    if (!text || !text.match(twttr.txt.regexen.atSigns)) {
	      return [];
	    }

	    var possibleNames = [],
	        slashListname;

	    text.replace(twttr.txt.regexen.validMentionOrList, function(match, before, atSign, screenName, slashListname, offset, chunk) {
	      var after = chunk.slice(offset + match.length);
	      if (!after.match(twttr.txt.regexen.endMentionMatch)) {
	        slashListname = slashListname || '';
	        var startPosition = offset + before.length;
	        var endPosition = startPosition + screenName.length + slashListname.length + 1;
	        possibleNames.push({
	          screenName: screenName,
	          listSlug: slashListname,
	          indices: [startPosition, endPosition]
	        });
	      }
	    });

	    return possibleNames;
	  };


	  twttr.txt.extractReplies = function(text) {
	    if (!text) {
	      return null;
	    }

	    var possibleScreenName = text.match(twttr.txt.regexen.validReply);
	    if (!possibleScreenName ||
	        RegExp.rightContext.match(twttr.txt.regexen.endMentionMatch)) {
	      return null;
	    }

	    return possibleScreenName[1];
	  };

	  twttr.txt.extractUrls = function(text, options) {
	    var urlsOnly = [],
	        urlsWithIndices = twttr.txt.extractUrlsWithIndices(text, options);

	    for (var i = 0; i < urlsWithIndices.length; i++) {
	      urlsOnly.push(urlsWithIndices[i].url);
	    }

	    return urlsOnly;
	  };

	  twttr.txt.extractUrlsWithIndices = function(text, options) {
	    if (!options) {
	      options = {extractUrlsWithoutProtocol: true};
	    }
	    if (!text || (options.extractUrlsWithoutProtocol ? !text.match(/\./) : !text.match(/:/))) {
	      return [];
	    }

	    var urls = [];

	    while (twttr.txt.regexen.extractUrl.exec(text)) {
	      var before = RegExp.$2, url = RegExp.$3, protocol = RegExp.$4, domain = RegExp.$5, path = RegExp.$7;
	      var endPosition = twttr.txt.regexen.extractUrl.lastIndex,
	          startPosition = endPosition - url.length;

	      // if protocol is missing and domain contains non-ASCII characters,
	      // extract ASCII-only domains.
	      if (!protocol) {
	        if (!options.extractUrlsWithoutProtocol
	            || before.match(twttr.txt.regexen.invalidUrlWithoutProtocolPrecedingChars)) {
	          continue;
	        }
	        var lastUrl = null,
	            asciiEndPosition = 0;
	        domain.replace(twttr.txt.regexen.validAsciiDomain, function(asciiDomain) {
	          var asciiStartPosition = domain.indexOf(asciiDomain, asciiEndPosition);
	          asciiEndPosition = asciiStartPosition + asciiDomain.length;
	          lastUrl = {
	            url: asciiDomain,
	            indices: [startPosition + asciiStartPosition, startPosition + asciiEndPosition]
	          };
	          if (path
	              || asciiDomain.match(twttr.txt.regexen.validSpecialShortDomain)
	              || !asciiDomain.match(twttr.txt.regexen.invalidShortDomain)) {
	            urls.push(lastUrl);
	          }
	        });

	        // no ASCII-only domain found. Skip the entire URL.
	        if (lastUrl == null) {
	          continue;
	        }

	        // lastUrl only contains domain. Need to add path and query if they exist.
	        if (path) {
	          lastUrl.url = url.replace(domain, lastUrl.url);
	          lastUrl.indices[1] = endPosition;
	        }
	      } else {
	        // In the case of t.co URLs, don't allow additional path characters.
	        if (url.match(twttr.txt.regexen.validTcoUrl)) {
	          url = RegExp.lastMatch;
	          endPosition = startPosition + url.length;
	        }
	        urls.push({
	          url: url,
	          indices: [startPosition, endPosition]
	        });
	      }
	    }

	    return urls;
	  };

	  twttr.txt.extractHashtags = function(text) {
	    var hashtagsOnly = [],
	        hashtagsWithIndices = twttr.txt.extractHashtagsWithIndices(text);

	    for (var i = 0; i < hashtagsWithIndices.length; i++) {
	      hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
	    }

	    return hashtagsOnly;
	  };

	  twttr.txt.extractHashtagsWithIndices = function(text, options) {
	    if (!options) {
	      options = {checkUrlOverlap: true};
	    }

	    if (!text || !text.match(twttr.txt.regexen.hashSigns)) {
	      return [];
	    }

	    var tags = [];

	    text.replace(twttr.txt.regexen.validHashtag, function(match, before, hash, hashText, offset, chunk) {
	      var after = chunk.slice(offset + match.length);
	      if (after.match(twttr.txt.regexen.endHashtagMatch))
	        return;
	      var startPosition = offset + before.length;
	      var endPosition = startPosition + hashText.length + 1;
	      tags.push({
	        hashtag: hashText,
	        indices: [startPosition, endPosition]
	      });
	    });

	    if (options.checkUrlOverlap) {
	      // also extract URL entities
	      var urls = twttr.txt.extractUrlsWithIndices(text);
	      if (urls.length > 0) {
	        var entities = tags.concat(urls);
	        // remove overlap
	        twttr.txt.removeOverlappingEntities(entities);
	        // only push back hashtags
	        tags = [];
	        for (var i = 0; i < entities.length; i++) {
	          if (entities[i].hashtag) {
	            tags.push(entities[i]);
	          }
	        }
	      }
	    }

	    return tags;
	  };

	  twttr.txt.extractCashtags = function(text) {
	    var cashtagsOnly = [],
	        cashtagsWithIndices = twttr.txt.extractCashtagsWithIndices(text);

	    for (var i = 0; i < cashtagsWithIndices.length; i++) {
	      cashtagsOnly.push(cashtagsWithIndices[i].cashtag);
	    }

	    return cashtagsOnly;
	  };

	  twttr.txt.extractCashtagsWithIndices = function(text) {
	    if (!text || text.indexOf("$") == -1) {
	      return [];
	    }

	    var tags = [];

	    text.replace(twttr.txt.regexen.validCashtag, function(match, before, dollar, cashtag, offset, chunk) {
	      var startPosition = offset + before.length;
	      var endPosition = startPosition + cashtag.length + 1;
	      tags.push({
	        cashtag: cashtag,
	        indices: [startPosition, endPosition]
	      });
	    });

	    return tags;
	  };

	  twttr.txt.modifyIndicesFromUnicodeToUTF16 = function(text, entities) {
	    twttr.txt.convertUnicodeIndices(text, entities, false);
	  };

	  twttr.txt.modifyIndicesFromUTF16ToUnicode = function(text, entities) {
	    twttr.txt.convertUnicodeIndices(text, entities, true);
	  };

	  twttr.txt.getUnicodeTextLength = function(text) {
	    return text.replace(twttr.txt.regexen.non_bmp_code_pairs, ' ').length;
	  };

	  twttr.txt.convertUnicodeIndices = function(text, entities, indicesInUTF16) {
	    if (entities.length == 0) {
	      return;
	    }

	    var charIndex = 0;
	    var codePointIndex = 0;

	    // sort entities by start index
	    entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });
	    var entityIndex = 0;
	    var entity = entities[0];

	    while (charIndex < text.length) {
	      if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
	        var len = entity.indices[1] - entity.indices[0];
	        entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
	        entity.indices[1] = entity.indices[0] + len;

	        entityIndex++;
	        if (entityIndex == entities.length) {
	          // no more entity
	          break;
	        }
	        entity = entities[entityIndex];
	      }

	      var c = text.charCodeAt(charIndex);
	      if (0xD800 <= c && c <= 0xDBFF && charIndex < text.length - 1) {
	        // Found high surrogate char
	        c = text.charCodeAt(charIndex + 1);
	        if (0xDC00 <= c && c <= 0xDFFF) {
	          // Found surrogate pair
	          charIndex++;
	        }
	      }
	      codePointIndex++;
	      charIndex++;
	    }
	  };

	  // this essentially does text.split(/<|>/)
	  // except that won't work in IE, where empty strings are ommitted
	  // so "<>".split(/<|>/) => [] in IE, but is ["", "", ""] in all others
	  // but "<<".split("<") => ["", "", ""]
	  twttr.txt.splitTags = function(text) {
	    var firstSplits = text.split("<"),
	        secondSplits,
	        allSplits = [],
	        split;

	    for (var i = 0; i < firstSplits.length; i += 1) {
	      split = firstSplits[i];
	      if (!split) {
	        allSplits.push("");
	      } else {
	        secondSplits = split.split(">");
	        for (var j = 0; j < secondSplits.length; j += 1) {
	          allSplits.push(secondSplits[j]);
	        }
	      }
	    }

	    return allSplits;
	  };

	  twttr.txt.hitHighlight = function(text, hits, options) {
	    var defaultHighlightTag = "em";

	    hits = hits || [];
	    options = options || {};

	    if (hits.length === 0) {
	      return text;
	    }

	    var tagName = options.tag || defaultHighlightTag,
	        tags = ["<" + tagName + ">", "</" + tagName + ">"],
	        chunks = twttr.txt.splitTags(text),
	        i,
	        j,
	        result = "",
	        chunkIndex = 0,
	        chunk = chunks[0],
	        prevChunksLen = 0,
	        chunkCursor = 0,
	        startInChunk = false,
	        chunkChars = chunk,
	        flatHits = [],
	        index,
	        hit,
	        tag,
	        placed,
	        hitSpot;

	    for (i = 0; i < hits.length; i += 1) {
	      for (j = 0; j < hits[i].length; j += 1) {
	        flatHits.push(hits[i][j]);
	      }
	    }

	    for (index = 0; index < flatHits.length; index += 1) {
	      hit = flatHits[index];
	      tag = tags[index % 2];
	      placed = false;

	      while (chunk != null && hit >= prevChunksLen + chunk.length) {
	        result += chunkChars.slice(chunkCursor);
	        if (startInChunk && hit === prevChunksLen + chunkChars.length) {
	          result += tag;
	          placed = true;
	        }

	        if (chunks[chunkIndex + 1]) {
	          result += "<" + chunks[chunkIndex + 1] + ">";
	        }

	        prevChunksLen += chunkChars.length;
	        chunkCursor = 0;
	        chunkIndex += 2;
	        chunk = chunks[chunkIndex];
	        chunkChars = chunk;
	        startInChunk = false;
	      }

	      if (!placed && chunk != null) {
	        hitSpot = hit - prevChunksLen;
	        result += chunkChars.slice(chunkCursor, hitSpot) + tag;
	        chunkCursor = hitSpot;
	        if (index % 2 === 0) {
	          startInChunk = true;
	        } else {
	          startInChunk = false;
	        }
	      } else if(!placed) {
	        placed = true;
	        result += tag;
	      }
	    }

	    if (chunk != null) {
	      if (chunkCursor < chunkChars.length) {
	        result += chunkChars.slice(chunkCursor);
	      }
	      for (index = chunkIndex + 1; index < chunks.length; index += 1) {
	        result += (index % 2 === 0 ? chunks[index] : "<" + chunks[index] + ">");
	      }
	    }

	    return result;
	  };

	  var MAX_LENGTH = 140;

	  // Returns the length of Tweet text with consideration to t.co URL replacement
	  // and chars outside the basic multilingual plane that use 2 UTF16 code points
	  twttr.txt.getTweetLength = function(text, options) {
	    if (!options) {
	      options = {
	          // These come from https://api.twitter.com/1/help/configuration.json
	          // described by https://dev.twitter.com/docs/api/1/get/help/configuration
	          short_url_length: 23,
	          short_url_length_https: 23
	      };
	    }
	    var textLength = twttr.txt.getUnicodeTextLength(text),
	        urlsWithIndices = twttr.txt.extractUrlsWithIndices(text);
	    twttr.txt.modifyIndicesFromUTF16ToUnicode(text, urlsWithIndices);

	    for (var i = 0; i < urlsWithIndices.length; i++) {
	      // Subtract the length of the original URL
	      textLength += urlsWithIndices[i].indices[0] - urlsWithIndices[i].indices[1];

	      // Add 23 characters for URL starting with https://
	      // http:// URLs still use https://t.co so they are 23 characters as well
	      if (urlsWithIndices[i].url.toLowerCase().match(twttr.txt.regexen.urlHasHttps)) {
	         textLength += options.short_url_length_https;
	      } else {
	        textLength += options.short_url_length;
	      }
	    }

	    return textLength;
	  };

	  // Check the text for any reason that it may not be valid as a Tweet. This is meant as a pre-validation
	  // before posting to api.twitter.com. There are several server-side reasons for Tweets to fail but this pre-validation
	  // will allow quicker feedback.
	  //
	  // Returns false if this text is valid. Otherwise one of the following strings will be returned:
	  //
	  //   "too_long": if the text is too long
	  //   "empty": if the text is nil or empty
	  //   "invalid_characters": if the text contains non-Unicode or any of the disallowed Unicode characters
	  twttr.txt.isInvalidTweet = function(text) {
	    if (!text) {
	      return "empty";
	    }

	    // Determine max length independent of URL length
	    if (twttr.txt.getTweetLength(text) > MAX_LENGTH) {
	      return "too_long";
	    }

	    if (twttr.txt.hasInvalidCharacters(text)) {
	      return "invalid_characters";
	    }

	    return false;
	  };

	  twttr.txt.hasInvalidCharacters = function(text) {
	    return twttr.txt.regexen.invalid_chars.test(text);
	  };

	  twttr.txt.isValidTweetText = function(text) {
	    return !twttr.txt.isInvalidTweet(text);
	  };

	  twttr.txt.isValidUsername = function(username) {
	    if (!username) {
	      return false;
	    }

	    var extracted = twttr.txt.extractMentions(username);

	    // Should extract the username minus the @ sign, hence the .slice(1)
	    return extracted.length === 1 && extracted[0] === username.slice(1);
	  };

	  var VALID_LIST_RE = regexSupplant(/^#{validMentionOrList}$/);

	  twttr.txt.isValidList = function(usernameList) {
	    var match = usernameList.match(VALID_LIST_RE);

	    // Must have matched and had nothing before or after
	    return !!(match && match[1] == "" && match[4]);
	  };

	  twttr.txt.isValidHashtag = function(hashtag) {
	    if (!hashtag) {
	      return false;
	    }

	    var extracted = twttr.txt.extractHashtags(hashtag);

	    // Should extract the hashtag minus the # sign, hence the .slice(1)
	    return extracted.length === 1 && extracted[0] === hashtag.slice(1);
	  };

	  twttr.txt.isValidUrl = function(url, unicodeDomains, requireProtocol) {
	    if (unicodeDomains == null) {
	      unicodeDomains = true;
	    }

	    if (requireProtocol == null) {
	      requireProtocol = true;
	    }

	    if (!url) {
	      return false;
	    }

	    var urlParts = url.match(twttr.txt.regexen.validateUrlUnencoded);

	    if (!urlParts || urlParts[0] !== url) {
	      return false;
	    }

	    var scheme = urlParts[1],
	        authority = urlParts[2],
	        path = urlParts[3],
	        query = urlParts[4],
	        fragment = urlParts[5];

	    if (!(
	      (!requireProtocol || (isValidMatch(scheme, twttr.txt.regexen.validateUrlScheme) && scheme.match(/^https?$/i))) &&
	      isValidMatch(path, twttr.txt.regexen.validateUrlPath) &&
	      isValidMatch(query, twttr.txt.regexen.validateUrlQuery, true) &&
	      isValidMatch(fragment, twttr.txt.regexen.validateUrlFragment, true)
	    )) {
	      return false;
	    }

	    return (unicodeDomains && isValidMatch(authority, twttr.txt.regexen.validateUrlUnicodeAuthority)) ||
	           (!unicodeDomains && isValidMatch(authority, twttr.txt.regexen.validateUrlAuthority));
	  };

	  function isValidMatch(string, regex, optional) {
	    if (!optional) {
	      // RegExp["$&"] is the text of the last match
	      // blank strings are ok, but are falsy, so we check stringiness instead of truthiness
	      return ((typeof string === "string") && string.match(regex) && RegExp["$&"] === string);
	    }

	    // RegExp["$&"] is the text of the last match
	    return (!string || (string.match(regex) && RegExp["$&"] === string));
	  }

	  if (typeof module != 'undefined' && module.exports) {
	    module.exports = twttr.txt;
	  }

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (twttr.txt), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }

	  if (typeof window != 'undefined') {
	    if (window.twttr) {
	      for (var prop in twttr) {
	        window.twttr[prop] = twttr[prop];
	      }
	    } else {
	      window.twttr = twttr;
	    }
	  }
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';var _typeof2=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};(function webpackUniversalModuleDefinition(root,factory){if(( false?'undefined':_typeof2(exports))==='object'&&( false?'undefined':_typeof2(module))==='object')module.exports=factory();else if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if((typeof exports==='undefined'?'undefined':_typeof2(exports))==='object')exports["PDFAnnotate"]=factory();else root["PDFAnnotate"]=factory();})(undefined,function(){return(/******/function(modules){// webpackBootstrap
	/******/// The module cache
	/******/var installedModules={};/******//******/// The require function
	/******/function __webpack_require__(moduleId){/******//******/// Check if module is in cache
	/******/if(installedModules[moduleId])/******/return installedModules[moduleId].exports;/******//******/// Create a new module (and put it into the cache)
	/******/var module=installedModules[moduleId]={/******/exports:{},/******/id:moduleId,/******/loaded:false/******/};/******//******/// Execute the module function
	/******/modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);/******//******/// Flag the module as loaded
	/******/module.loaded=true;/******//******/// Return the exports of the module
	/******/return module.exports;/******/}/******//******//******/// expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m=modules;/******//******/// expose the module cache
	/******/__webpack_require__.c=installedModules;/******//******/// __webpack_public_path__
	/******/__webpack_require__.p="";/******//******/// Load entry module and return exports
	/******/return __webpack_require__(0);/******/}(/************************************************************************//******/[/* 0 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}exports.default=_PDFJSAnnotate2.default;module.exports=exports['default'];/***/},/* 1 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _StoreAdapter=__webpack_require__(2);var _StoreAdapter2=_interopRequireDefault(_StoreAdapter);var _LocalStoreAdapter=__webpack_require__(8);var _LocalStoreAdapter2=_interopRequireDefault(_LocalStoreAdapter);var _render=__webpack_require__(10);var _render2=_interopRequireDefault(_render);var _UI=__webpack_require__(28);var _UI2=_interopRequireDefault(_UI);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}exports.default={/**
		   * Abstract class that needs to be defined so PDFJSAnnotate
		   * knows how to communicate with your server.
		   */StoreAdapter:_StoreAdapter2.default,/**
		   * Implementation of StoreAdapter that stores annotation data to localStorage.
		   */LocalStoreAdapter:_LocalStoreAdapter2.default,/**
		   * Abstract instance of StoreAdapter
		   */__storeAdapter:new _StoreAdapter2.default(),/**
		   * Getter for the underlying StoreAdapter property
		   *
		   * @return {StoreAdapter}
		   */getStoreAdapter:function getStoreAdapter(){return this.__storeAdapter;},/**
		   * Setter for the underlying StoreAdapter property
		   *
		   * @param {StoreAdapter} adapter The StoreAdapter implementation to be used.
		   */setStoreAdapter:function setStoreAdapter(adapter){// TODO this throws an error when bundled
	// if (!(adapter instanceof StoreAdapter)) {
	//   throw new Error('adapter must be an instance of StoreAdapter');
	// }
	this.__storeAdapter=adapter;},/**
		   * UI is a helper for instrumenting UI interactions for creating,
		   * editing, and deleting annotations in the browser.
		   */UI:_UI2.default,/**
		   * Render the annotations for a page in the PDF Document
		   *
		   * @param {SVGElement} svg The SVG element that annotations should be rendered to
		   * @param {PageViewport} viewport The PDFPage.getViewport data
		   * @param {Object} data The StoreAdapter.getAnnotations data
		   * @return {Promise}
		   */render:_render2.default,/**
		   * Convenience method for getting annotation data
		   *
		   * @alias StoreAdapter.getAnnotations
		   * @param {String} documentId The ID of the document
		   * @param {String} pageNumber The page number
		   * @return {Promise}
		   */getAnnotations:function getAnnotations(documentId,pageNumber){var _getStoreAdapter;return(_getStoreAdapter=this.getStoreAdapter()).getAnnotations.apply(_getStoreAdapter,arguments);}};module.exports=exports['default'];/***/},/* 2 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _abstractFunction=__webpack_require__(3);var _abstractFunction2=_interopRequireDefault(_abstractFunction);var _event=__webpack_require__(4);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}// Adapter should never be invoked publicly
	var StoreAdapter=function(){/**
		   * Create a new StoreAdapter instance
		   *
		   * @param {Object} [definition] The definition to use for overriding abstract methods
		   */function StoreAdapter(){var _this=this;var definition=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];_classCallCheck(this,StoreAdapter);// Copy each function from definition if it is a function we know about
	Object.keys(definition).forEach(function(key){if(typeof definition[key]==='function'&&typeof _this[key]==='function'){_this[key]=definition[key];}});}/**
		   * Get all the annotations for a given document and page number.
		   *
		   * @param {String} documentId The ID for the document the annotations belong to
		   * @param {Number} pageNumber The number of the page the annotations belong to
		   * @return {Promise}
		   */_createClass(StoreAdapter,[{key:'__getAnnotations',value:function __getAnnotations(documentId,pageNumber){(0,_abstractFunction2.default)('getAnnotations');}},{key:'getAnnotation',/**
		     * Get the definition for a specific annotation.
		     *
		     * @param {String} documentId The ID for the document the annotation belongs to
		     * @param {String} annotationId The ID for the annotation
		     * @return {Promise}
		     */value:function getAnnotation(documentId,annotationId){(0,_abstractFunction2.default)('getAnnotation');}/**
		     * Add an annotation
		     *
		     * @param {String} documentId The ID for the document to add the annotation to
		     * @param {String} pageNumber The page number to add the annotation to
		     * @param {Object} annotation The definition for the new annotation
		     * @return {Promise}
		     */},{key:'__addAnnotation',value:function __addAnnotation(documentId,pageNumber,annotation){(0,_abstractFunction2.default)('addAnnotation');}},{key:'__editAnnotation',/**
		     * Edit an annotation
		     *
		     * @param {String} documentId The ID for the document
		     * @param {String} pageNumber the page number of the annotation
		     * @param {Object} annotation The definition of the modified annotation
		     * @return {Promise}
		     */value:function __editAnnotation(documentId,pageNumber,annotation){(0,_abstractFunction2.default)('editAnnotation');}},{key:'__deleteAnnotation',/**
		     * Delete an annotation
		     *
		     * @param {String} documentId The ID for the document
		     * @param {String} annotationId The ID for the annotation
		     * @return {Promise}
		     */value:function __deleteAnnotation(documentId,annotationId){(0,_abstractFunction2.default)('deleteAnnotation');}},{key:'getComments',/**
		     * Get all the comments for an annotation
		     *
		     * @param {String} documentId The ID for the document
		     * @param {String} annotationId The ID for the annotation
		     * @return {Promise}
		     */value:function getComments(documentId,annotationId){(0,_abstractFunction2.default)('getComments');}/**
		     * Add a new comment
		     *
		     * @param {String} documentId The ID for the document
		     * @param {String} annotationId The ID for the annotation
		     * @param {Object} content The definition of the comment
		     * @return {Promise}
		     */},{key:'__addComment',value:function __addComment(documentId,annotationId,content){(0,_abstractFunction2.default)('addComment');}},{key:'__deleteComment',/**
		     * Delete a comment
		     *
		     * @param {String} documentId The ID for the document
		     * @param {String} commentId The ID for the comment
		     * @return {Promise}
		     */value:function __deleteComment(documentId,commentId){(0,_abstractFunction2.default)('deleteComment');}},{key:'getAnnotations',get:function get(){return this.__getAnnotations;},set:function set(fn){this.__getAnnotations=function getAnnotations(documentId,pageNumber){return fn.apply(undefined,arguments).then(function(annotations){// TODO may be best to have this happen on the server
	if(annotations.annotations){annotations.annotations.forEach(function(a){a.documentId=documentId;});}return annotations;});};}},{key:'addAnnotation',get:function get(){return this.__addAnnotation;},set:function set(fn){this.__addAnnotation=function addAnnotation(documentId,pageNumber,annotation){return fn.apply(undefined,arguments).then(function(annotation){(0,_event.fireEvent)('annotation:add',documentId,pageNumber,annotation);return annotation;});};}},{key:'editAnnotation',get:function get(){return this.__editAnnotation;},set:function set(fn){this.__editAnnotation=function editAnnotation(documentId,annotationId,annotation){return fn.apply(undefined,arguments).then(function(annotation){(0,_event.fireEvent)('annotation:edit',documentId,annotationId,annotation);return annotation;});};}},{key:'deleteAnnotation',get:function get(){return this.__deleteAnnotation;},set:function set(fn){this.__deleteAnnotation=function deleteAnnotation(documentId,annotationId){return fn.apply(undefined,arguments).then(function(success){if(success){(0,_event.fireEvent)('annotation:delete',documentId,annotationId);}return success;});};}},{key:'addComment',get:function get(){return this.__addComment;},set:function set(fn){this.__addComment=function addComment(documentId,annotationId,content){return fn.apply(undefined,arguments).then(function(comment){(0,_event.fireEvent)('comment:add',documentId,annotationId,comment);return comment;});};}},{key:'deleteComment',get:function get(){return this.__deleteComment;},set:function set(fn){this.__deleteComment=function deleteComment(documentId,commentId){return fn.apply(undefined,arguments).then(function(success){if(success){(0,_event.fireEvent)('comment:delete',documentId,commentId);}return success;});};}}]);return StoreAdapter;}();exports.default=StoreAdapter;module.exports=exports['default'];/***/},/* 3 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=abstractFunction;/**
		 * Throw an Error for an abstract function that hasn't been implemented.
		 *
		 * @param {String} name The name of the abstract function
		 */function abstractFunction(name){throw new Error(name+' is not implemented');}module.exports=exports['default'];/***/},/* 4 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.fireEvent=fireEvent;exports.addEventListener=addEventListener;exports.removeEventListener=removeEventListener;var _events=__webpack_require__(5);var _events2=_interopRequireDefault(_events);var _utils=__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var emitter=new _events2.default();var clickNode=void 0;/**
		 * Handle document.click event
		 *
		 * @param {Event} e The DOM event to be handled
		 */document.addEventListener('click',function handleDocumentClick(e){if(!(0,_utils.findSVGAtPoint)(e.clientX,e.clientY)){return;}var target=(0,_utils.findAnnotationAtPoint)(e.clientX,e.clientY);// Emit annotation:blur if clickNode is no longer clicked
	if(clickNode&&clickNode!==target){emitter.emit('annotation:blur',clickNode);}// Emit annotation:click if target was clicked
	if(target){emitter.emit('annotation:click',target);}clickNode=target;});// let mouseOverNode;
	// document.addEventListener('mousemove', function handleDocumentMousemove(e) {
	//   let target = findAnnotationAtPoint(e.clientX, e.clientY);
	//
	//   // Emit annotation:mouseout if target was mouseout'd
	//   if (mouseOverNode && !target) {
	//     emitter.emit('annotation:mouseout', mouseOverNode);
	//   }
	//
	//   // Emit annotation:mouseover if target was mouseover'd
	//   if (target && mouseOverNode !== target) {
	//     emitter.emit('annotation:mouseover', target);
	//   }
	//
	//   mouseOverNode = target;
	// });
	function fireEvent(){emitter.emit.apply(emitter,arguments);};function addEventListener(){emitter.on.apply(emitter,arguments);};function removeEventListener(){emitter.removeListener.apply(emitter,arguments);};/***/},/* 5 *//***/function(module,exports){// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	function EventEmitter(){this._events=this._events||{};this._maxListeners=this._maxListeners||undefined;}module.exports=EventEmitter;// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter=EventEmitter;EventEmitter.prototype._events=undefined;EventEmitter.prototype._maxListeners=undefined;// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners=10;// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners=function(n){if(!isNumber(n)||n<0||isNaN(n))throw TypeError('n must be a positive number');this._maxListeners=n;return this;};EventEmitter.prototype.emit=function(type){var er,handler,len,args,i,listeners;if(!this._events)this._events={};// If there is no 'error' event listener then throw.
	if(type==='error'){if(!this._events.error||isObject(this._events.error)&&!this._events.error.length){er=arguments[1];if(er instanceof Error){throw er;// Unhandled 'error' event
	}throw TypeError('Uncaught, unspecified "error" event.');}}handler=this._events[type];if(isUndefined(handler))return false;if(isFunction(handler)){switch(arguments.length){// fast cases
	case 1:handler.call(this);break;case 2:handler.call(this,arguments[1]);break;case 3:handler.call(this,arguments[1],arguments[2]);break;// slower
	default:args=Array.prototype.slice.call(arguments,1);handler.apply(this,args);}}else if(isObject(handler)){args=Array.prototype.slice.call(arguments,1);listeners=handler.slice();len=listeners.length;for(i=0;i<len;i++){listeners[i].apply(this,args);}}return true;};EventEmitter.prototype.addListener=function(type,listener){var m;if(!isFunction(listener))throw TypeError('listener must be a function');if(!this._events)this._events={};// To avoid recursion in the case that type === "newListener"! Before
	// adding it to the listeners, first emit "newListener".
	if(this._events.newListener)this.emit('newListener',type,isFunction(listener.listener)?listener.listener:listener);if(!this._events[type])// Optimize the case of one listener. Don't need the extra array object.
	this._events[type]=listener;else if(isObject(this._events[type]))// If we've already got an array, just append.
	this._events[type].push(listener);else// Adding the second element, need to change to array.
	this._events[type]=[this._events[type],listener];// Check for listener leak
	if(isObject(this._events[type])&&!this._events[type].warned){if(!isUndefined(this._maxListeners)){m=this._maxListeners;}else{m=EventEmitter.defaultMaxListeners;}if(m&&m>0&&this._events[type].length>m){this._events[type].warned=true;console.error('(node) warning: possible EventEmitter memory '+'leak detected. %d listeners added. '+'Use emitter.setMaxListeners() to increase limit.',this._events[type].length);if(typeof console.trace==='function'){// not supported in IE 10
	console.trace();}}}return this;};EventEmitter.prototype.on=EventEmitter.prototype.addListener;EventEmitter.prototype.once=function(type,listener){if(!isFunction(listener))throw TypeError('listener must be a function');var fired=false;function g(){this.removeListener(type,g);if(!fired){fired=true;listener.apply(this,arguments);}}g.listener=listener;this.on(type,g);return this;};// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener=function(type,listener){var list,position,length,i;if(!isFunction(listener))throw TypeError('listener must be a function');if(!this._events||!this._events[type])return this;list=this._events[type];length=list.length;position=-1;if(list===listener||isFunction(list.listener)&&list.listener===listener){delete this._events[type];if(this._events.removeListener)this.emit('removeListener',type,listener);}else if(isObject(list)){for(i=length;i-->0;){if(list[i]===listener||list[i].listener&&list[i].listener===listener){position=i;break;}}if(position<0)return this;if(list.length===1){list.length=0;delete this._events[type];}else{list.splice(position,1);}if(this._events.removeListener)this.emit('removeListener',type,listener);}return this;};EventEmitter.prototype.removeAllListeners=function(type){var key,listeners;if(!this._events)return this;// not listening for removeListener, no need to emit
	if(!this._events.removeListener){if(arguments.length===0)this._events={};else if(this._events[type])delete this._events[type];return this;}// emit removeListener for all listeners on all events
	if(arguments.length===0){for(key in this._events){if(key==='removeListener')continue;this.removeAllListeners(key);}this.removeAllListeners('removeListener');this._events={};return this;}listeners=this._events[type];if(isFunction(listeners)){this.removeListener(type,listeners);}else if(listeners){// LIFO order
	while(listeners.length){this.removeListener(type,listeners[listeners.length-1]);}}delete this._events[type];return this;};EventEmitter.prototype.listeners=function(type){var ret;if(!this._events||!this._events[type])ret=[];else if(isFunction(this._events[type]))ret=[this._events[type]];else ret=this._events[type].slice();return ret;};EventEmitter.prototype.listenerCount=function(type){if(this._events){var evlistener=this._events[type];if(isFunction(evlistener))return 1;else if(evlistener)return evlistener.length;}return 0;};EventEmitter.listenerCount=function(emitter,type){return emitter.listenerCount(type);};function isFunction(arg){return typeof arg==='function';}function isNumber(arg){return typeof arg==='number';}function isObject(arg){return(typeof arg==='undefined'?'undefined':_typeof2(arg))==='object'&&arg!==null;}function isUndefined(arg){return arg===void 0;}/***/},/* 6 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.BORDER_COLOR=undefined;exports.findSVGContainer=findSVGContainer;exports.findSVGAtPoint=findSVGAtPoint;exports.findAnnotationAtPoint=findAnnotationAtPoint;exports.pointIntersectsRect=pointIntersectsRect;exports.getOffsetAnnotationRect=getOffsetAnnotationRect;exports.getAnnotationRect=getAnnotationRect;exports.scaleUp=scaleUp;exports.scaleDown=scaleDown;exports.getScroll=getScroll;exports.getOffset=getOffset;exports.disableUserSelect=disableUserSelect;exports.enableUserSelect=enableUserSelect;exports.getMetadata=getMetadata;var _createStylesheet=__webpack_require__(7);var _createStylesheet2=_interopRequireDefault(_createStylesheet);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var BORDER_COLOR=exports.BORDER_COLOR='#00BFFF';var userSelectStyleSheet=(0,_createStylesheet2.default)({body:{'-webkit-user-select':'none','-moz-user-select':'none','-ms-user-select':'none','user-select':'none'}});userSelectStyleSheet.setAttribute('data-pdf-annotate-user-select','true');/**
		 * Find the SVGElement that contains all the annotations for a page
		 *
		 * @param {Element} node An annotation within that container
		 * @return {SVGElement} The container SVG or null if it can't be found
		 */function findSVGContainer(node){var parentNode=node;while((parentNode=parentNode.parentNode)&&parentNode!==document){if(parentNode.nodeName.toUpperCase()==='SVG'&&parentNode.getAttribute('data-pdf-annotate-container')==='true'){return parentNode;}}return null;}/**
		 * Find an SVGElement container at a given point
		 *
		 * @param {Number} x The x coordinate of the point
		 * @param {Number} y The y coordinate of the point
		 * @return {SVGElement} The container SVG or null if one can't be found
		 */function findSVGAtPoint(x,y){var elements=document.querySelectorAll('svg[data-pdf-annotate-container="true"]');for(var i=0,l=elements.length;i<l;i++){var el=elements[i];var rect=el.getBoundingClientRect();if(pointIntersectsRect(x,y,rect)){return el;}}return null;}/**
		 * Find an Element that represents an annotation at a given point
		 *
		 * @param {Number} x The x coordinate of the point
		 * @param {Number} y The y coordinate of the point
		 * @return {Element} The annotation element or null if one can't be found
		 */function findAnnotationAtPoint(x,y){var svg=findSVGAtPoint(x,y);if(!svg){return;}var elements=svg.querySelectorAll('[data-pdf-annotate-type]');// Find a target element within SVG
	for(var i=0,l=elements.length;i<l;i++){var el=elements[i];if(pointIntersectsRect(x,y,getOffsetAnnotationRect(el))){return el;}}return null;}/**
		 * Determine if a point intersects a rect
		 *
		 * @param {Number} x The x coordinate of the point
		 * @param {Number} y The y coordinate of the point
		 * @param {Object} rect The points of a rect (likely from getBoundingClientRect)
		 * @return {Boolean} True if a collision occurs, otherwise false
		 */function pointIntersectsRect(x,y,rect){return y>=rect.top&&y<=rect.bottom&&x>=rect.left&&x<=rect.right;}/**
		 * Get the rect of an annotation element accounting for offset.
		 *
		 * @param {Element} el The element to get the rect of
		 * @return {Object} The dimensions of the element
		 */function getOffsetAnnotationRect(el){var rect=getAnnotationRect(el);var _getOffset=getOffset(el);var offsetLeft=_getOffset.offsetLeft;var offsetTop=_getOffset.offsetTop;return{top:rect.top+offsetTop,left:rect.left+offsetLeft,right:rect.right+offsetLeft,bottom:rect.bottom+offsetTop};}/**
		 * Get the rect of an annotation element.
		 *
		 * @param {Element} el The element to get the rect of
		 * @return {Object} The dimensions of the element
		 */function getAnnotationRect(el){var h=0,w=0,x=0,y=0;var rect=el.getBoundingClientRect();// TODO this should be calculated somehow
	var LINE_OFFSET=16;switch(el.nodeName.toLowerCase()){case'path':var minX=void 0,maxX=void 0,minY=void 0,maxY=void 0;el.getAttribute('d').replace(/Z/,'').split('M').splice(1).forEach(function(p){var s=p.split(' ').map(function(i){return parseInt(i,10);});if(typeof minX==='undefined'||s[0]<minX){minX=s[0];}if(typeof maxX==='undefined'||s[2]>maxX){maxX=s[2];}if(typeof minY==='undefined'||s[1]<minY){minY=s[1];}if(typeof maxY==='undefined'||s[3]>maxY){maxY=s[3];}});h=maxY-minY;w=maxX-minX;x=minX;y=minY;break;case'line':h=parseInt(el.getAttribute('y2'),10)-parseInt(el.getAttribute('y1'),10);w=parseInt(el.getAttribute('x2'),10)-parseInt(el.getAttribute('x1'),10);x=parseInt(el.getAttribute('x1'),10);y=parseInt(el.getAttribute('y1'),10);if(h===0){h+=LINE_OFFSET;y-=LINE_OFFSET/2;}break;case'text':h=rect.height;w=rect.width;x=parseInt(el.getAttribute('x'),10);y=parseInt(el.getAttribute('y'),10)-h;break;case'g':var _getOffset2=getOffset(el);var offsetLeft=_getOffset2.offsetLeft;var offsetTop=_getOffset2.offsetTop;h=rect.height;w=rect.width;x=rect.left-offsetLeft;y=rect.top-offsetTop;if(el.getAttribute('data-pdf-annotate-type')==='strikeout'){h+=LINE_OFFSET;y-=LINE_OFFSET/2;}break;case'rect':case'svg':h=parseInt(el.getAttribute('height'),10);w=parseInt(el.getAttribute('width'),10);x=parseInt(el.getAttribute('x'),10);y=parseInt(el.getAttribute('y'),10);break;}// Result provides same properties as getBoundingClientRect
	var result={top:y,left:x,width:w,height:h,right:x+w,bottom:y+h};// For the case of nested SVG (point annotations) and grouped
	// lines or rects no adjustment needs to be made for scale.
	// I assume that the scale is already being handled
	// natively by virtue of the `transform` attribute.
	if(!['svg','g'].includes(el.nodeName.toLowerCase())){result=scaleUp(findSVGAtPoint(rect.left,rect.top),result);}return result;}/**
		 * Adjust scale from normalized scale (100%) to rendered scale.
		 *
		 * @param {SVGElement} svg The SVG to gather metadata from
		 * @param {Object} rect A map of numeric values to scale
		 * @return {Object} A copy of `rect` with values scaled up
		 */function scaleUp(svg,rect){var result={};var _getMetadata=getMetadata(svg);var viewport=_getMetadata.viewport;Object.keys(rect).forEach(function(key){result[key]=rect[key]*viewport.scale;});return result;}/**
		 * Adjust scale from rendered scale to a normalized scale (100%).
		 *
		 * @param {SVGElement} svg The SVG to gather metadata from
		 * @param {Object} rect A map of numeric values to scale
		 * @return {Object} A copy of `rect` with values scaled down
		 */function scaleDown(svg,rect){var result={};var _getMetadata2=getMetadata(svg);var viewport=_getMetadata2.viewport;Object.keys(rect).forEach(function(key){result[key]=rect[key]/viewport.scale;});return result;}/**
		 * Get the scroll position of an element, accounting for parent elements
		 *
		 * @param {Element} el The element to get the scroll position for
		 * @return {Object} The scrollTop and scrollLeft position
		 */function getScroll(el){var scrollTop=0;var scrollLeft=0;var parentNode=el;while((parentNode=parentNode.parentNode)&&parentNode!==document){scrollTop+=parentNode.scrollTop;scrollLeft+=parentNode.scrollLeft;}return{scrollTop:scrollTop,scrollLeft:scrollLeft};}/**
		 * Get the offset position of an element, accounting for parent elements
		 *
		 * @param {Element} el The element to get the offset position for
		 * @return {Object} The offsetTop and offsetLeft position
		 */function getOffset(el){var parentNode=el;while((parentNode=parentNode.parentNode)&&parentNode!==document){if(parentNode.nodeName.toUpperCase()==='SVG'){break;}}var rect=parentNode.getBoundingClientRect();return{offsetLeft:rect.left,offsetTop:rect.top};}/**
		 * Disable user ability to select text on page
		 */function disableUserSelect(){if(!userSelectStyleSheet.parentNode){document.head.appendChild(userSelectStyleSheet);}}/**
		 * Enable user ability to select text on page
		 */function enableUserSelect(){if(userSelectStyleSheet.parentNode){userSelectStyleSheet.parentNode.removeChild(userSelectStyleSheet);}}/**
		 * Get the metadata for a SVG container
		 *
		 * @param {SVGElement} svg The SVG container to get metadata for
		 */function getMetadata(svg){return{documentId:svg.getAttribute('data-pdf-annotate-document'),pageNumber:parseInt(svg.getAttribute('data-pdf-annotate-page'),10),viewport:JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'))};}/***/},/* 7 *//***/function(module,exports){module.exports=function createStyleSheet(blocks){var style=document.createElement('style');var text=Object.keys(blocks).map(function(selector){return processRuleSet(selector,blocks[selector]);}).join('\n');style.setAttribute('type','text/css');style.appendChild(document.createTextNode(text));return style;};function processRuleSet(selector,block){return selector+' {\n'+processDeclarationBlock(block)+'\n}';}function processDeclarationBlock(block){return Object.keys(block).map(function(prop){return processDeclaration(prop,block[prop]);}).join('\n');}function processDeclaration(prop,value){if(!isNaN(value)&&value!=0){value=value+'px';}return hyphenate(prop)+': '+value+';';}function hyphenate(prop){return prop.replace(/[A-Z]/g,function(match){return'-'+match.toLowerCase();});}/***/},/* 8 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _uuid=__webpack_require__(9);var _uuid2=_interopRequireDefault(_uuid);var _StoreAdapter2=__webpack_require__(2);var _StoreAdapter3=_interopRequireDefault(_StoreAdapter2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&((typeof call==='undefined'?'undefined':_typeof2(call))==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+(typeof superClass==='undefined'?'undefined':_typeof2(superClass)));}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}// StoreAdapter for working with localStorage
	// This is ideal for testing, examples, and prototyping
	var LocalStoreAdapter=function(_StoreAdapter){_inherits(LocalStoreAdapter,_StoreAdapter);function LocalStoreAdapter(){_classCallCheck(this,LocalStoreAdapter);return _possibleConstructorReturn(this,Object.getPrototypeOf(LocalStoreAdapter).call(this,{getAnnotations:function getAnnotations(documentId,pageNumber){return new Promise(function(resolve,reject){var annotations=_getAnnotations(documentId).filter(function(i){return i.page===pageNumber&&i.class==='Annotation';});resolve({documentId:documentId,pageNumber:pageNumber,annotations:annotations});});},getAnnotation:function getAnnotation(documentId,annotationId){return Promise.resolve(_getAnnotations(documentId)[findAnnotation(documentId,annotationId)]);},addAnnotation:function addAnnotation(documentId,pageNumber,annotation){return new Promise(function(resolve,reject){annotation.class='Annotation';annotation.uuid=(0,_uuid2.default)();annotation.page=pageNumber;var annotations=_getAnnotations(documentId);annotations.push(annotation);updateAnnotations(documentId,annotations);resolve(annotation);});},editAnnotation:function editAnnotation(documentId,annotationId,annotation){return new Promise(function(resolve,reject){var annotations=_getAnnotations(documentId);annotations[findAnnotation(documentId,annotationId)]=annotation;updateAnnotations(documentId,annotations);resolve(annotation);});},deleteAnnotation:function deleteAnnotation(documentId,annotationId){return new Promise(function(resolve,reject){var index=findAnnotation(documentId,annotationId);if(index>-1){var annotations=_getAnnotations(documentId);annotations.splice(index,1);updateAnnotations(documentId,annotations);}resolve(true);});},getComments:function getComments(documentId,annotationId){return new Promise(function(resolve,reject){resolve(_getAnnotations(documentId).filter(function(i){return i.class==='Comment'&&i.annotation===annotationId;}));});},addComment:function addComment(documentId,annotationId,content){return new Promise(function(resolve,reject){var comment={class:'Comment',uuid:(0,_uuid2.default)(),annotation:annotationId,content:content};var annotations=_getAnnotations(documentId);annotations.push(comment);updateAnnotations(documentId,annotations);resolve(comment);});},deleteComment:function deleteComment(documentId,commentId){return new Promise(function(resolve,reject){_getAnnotations(documentId);var index=-1;var annotations=_getAnnotations(documentId);for(var i=0,l=annotations.length;i<l;i++){if(annotations[i].uuid===commentId){index=i;break;}}if(index>-1){annotations.splice(index,1);updateAnnotations(documentId,annotations);}resolve(true);});}}));}return LocalStoreAdapter;}(_StoreAdapter3.default);exports.default=LocalStoreAdapter;function _getAnnotations(documentId){return JSON.parse(localStorage.getItem(documentId+'/annotations'))||[];}function updateAnnotations(documentId,annotations){localStorage.setItem(documentId+'/annotations',JSON.stringify(annotations));}function findAnnotation(documentId,annotationId){var index=-1;var annotations=_getAnnotations(documentId);for(var i=0,l=annotations.length;i<l;i++){if(annotations[i].uuid===annotationId){index=i;break;}}return index;}module.exports=exports['default'];/***/},/* 9 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=uuid;var REGEXP=/[xy]/g;var PATTERN='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';function replacement(c){var r=Math.random()*16|0;var v=c=='x'?r:r&0x3|0x8;return v.toString(16);}/**
		 * Generate a univierally unique identifier
		 *
		 * @return {String}
		 */function uuid(){return PATTERN.replace(REGEXP,replacement);}module.exports=exports['default'];/***/},/* 10 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=render;var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);var _appendChild=__webpack_require__(11);var _appendChild2=_interopRequireDefault(_appendChild);var _renderScreenReaderHints=__webpack_require__(20);var _renderScreenReaderHints2=_interopRequireDefault(_renderScreenReaderHints);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
		 * Render the response from PDFJSAnnotate.getStoreAdapter().getAnnotations to SVG
		 *
		 * @param {SVGElement} svg The SVG element to render the annotations to
		 * @param {Object} viewport The page viewport data
		 * @param {Object} data The response from PDFJSAnnotate.getStoreAdapter().getAnnotations
		 * @return {Promise} Settled once rendering has completed
		 *  A settled Promise will be either:
		 *    - fulfilled: SVGElement
		 *    - rejected: Error
		 */function render(svg,viewport,data){return new Promise(function(resolve,reject){// Reset the content of the SVG
	svg.innerHTML='';svg.setAttribute('data-pdf-annotate-container',true);svg.setAttribute('data-pdf-annotate-viewport',JSON.stringify(viewport));svg.removeAttribute('data-pdf-annotate-document');svg.removeAttribute('data-pdf-annotate-page');// If there's no data nothing can be done
	if(!data){return resolve(svg);}svg.setAttribute('data-pdf-annotate-document',data.documentId);svg.setAttribute('data-pdf-annotate-page',data.pageNumber);// Make sure annotations is an array
	if(!Array.isArray(data.annotations)||data.annotations.length===0){return resolve(svg);}// Append annotation to svg
	data.annotations.forEach(function(a){(0,_appendChild2.default)(svg,a,viewport);});resolve(svg);});}module.exports=exports['default'];/***/},/* 11 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=appendChild;var _objectAssign=__webpack_require__(12);var _objectAssign2=_interopRequireDefault(_objectAssign);var _renderLine=__webpack_require__(13);var _renderLine2=_interopRequireDefault(_renderLine);var _renderPath=__webpack_require__(16);var _renderPath2=_interopRequireDefault(_renderPath);var _renderPoint=__webpack_require__(17);var _renderPoint2=_interopRequireDefault(_renderPoint);var _renderRect=__webpack_require__(18);var _renderRect2=_interopRequireDefault(_renderRect);var _renderText=__webpack_require__(19);var _renderText2=_interopRequireDefault(_renderText);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var isFirefox=/firefox/i.test(navigator.userAgent);/**
		 * Get the x/y translation to be used for transforming the annotations
		 * based on the rotation of the viewport.
		 *
		 * @param {Object} viewport The viewport data from the page
		 * @return {Object}
		 */function getTranslation(viewport){var x=void 0;var y=void 0;// Modulus 360 on the rotation so that we only
	// have to worry about four possible values.
	switch(viewport.rotation%360){case 0:x=y=0;break;case 90:x=0;y=viewport.width/viewport.scale*-1;break;case 180:x=viewport.width/viewport.scale*-1;y=viewport.height/viewport.scale*-1;break;case 270:x=viewport.height/viewport.scale*-1;y=0;break;}return{x:x,y:y};}/**
		 * Transform the rotation and scale of a node using SVG's native transform attribute.
		 *
		 * @param {Node} node The node to be transformed
		 * @param {Object} viewport The page's viewport data
		 * @return {Node}
		 */function transform(node,viewport){var trans=getTranslation(viewport);// Let SVG natively transform the element
	node.setAttribute('transform','scale('+viewport.scale+') rotate('+viewport.rotation+') translate('+trans.x+', '+trans.y+')');// Manually adjust x/y for nested SVG nodes
	if(!isFirefox&&node.nodeName.toLowerCase()==='svg'){node.setAttribute('x',parseInt(node.getAttribute('x'),10)*viewport.scale);node.setAttribute('y',parseInt(node.getAttribute('y'),10)*viewport.scale);var x=parseInt(node.getAttribute('x',10));var y=parseInt(node.getAttribute('y',10));var width=parseInt(node.getAttribute('width'),10);var height=parseInt(node.getAttribute('height'),10);var path=node.querySelector('path');var svg=path.parentNode;// Scale width/height
	[node,svg,path,node.querySelector('rect')].forEach(function(n){n.setAttribute('width',parseInt(n.getAttribute('width'),10)*viewport.scale);n.setAttribute('height',parseInt(n.getAttribute('height'),10)*viewport.scale);});// Transform path but keep scale at 100% since it will be handled natively
	transform(path,(0,_objectAssign2.default)({},viewport,{scale:1}));switch(viewport.rotation%360){case 90:node.setAttribute('x',viewport.width-y-width);node.setAttribute('y',x);svg.setAttribute('x',1);svg.setAttribute('y',0);break;case 180:node.setAttribute('x',viewport.width-x-width);node.setAttribute('y',viewport.height-y-height);svg.setAttribute('y',2);break;case 270:node.setAttribute('x',y);node.setAttribute('y',viewport.height-x-height);svg.setAttribute('x',-1);svg.setAttribute('y',0);break;}}return node;}/**
		 * Append an annotation as a child of an SVG.
		 *
		 * @param {SVGElement} svg The SVG element to append the annotation to
		 * @param {Object} annotation The annotation definition to render and append
		 * @param {Object} viewport The page's viewport data
		 * @return {SVGElement} A node that was created and appended by this function
		 */function appendChild(svg,annotation,viewport){if(!viewport){viewport=JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'));}var child=void 0;switch(annotation.type){case'area':case'highlight':child=(0,_renderRect2.default)(annotation);break;case'strikeout':child=(0,_renderLine2.default)(annotation);break;case'point':child=(0,_renderPoint2.default)(annotation);break;case'textbox':child=(0,_renderText2.default)(annotation);break;case'drawing':child=(0,_renderPath2.default)(annotation);break;}// If no type was provided for an annotation it will result in node being null.
	// Skip appending/transforming if node doesn't exist.
	if(child){// Set attributes
	child.setAttribute('data-pdf-annotate-id',annotation.uuid);child.setAttribute('data-pdf-annotate-type',annotation.type);child.setAttribute('aria-hidden',true);svg.appendChild(transform(child,viewport));}return child;}module.exports=exports['default'];/***/},/* 12 *//***/function(module,exports){/* eslint-disable no-unused-vars */'use strict';var hasOwnProperty=Object.prototype.hasOwnProperty;var propIsEnumerable=Object.prototype.propertyIsEnumerable;function toObject(val){if(val===null||val===undefined){throw new TypeError('Object.assign cannot be called with null or undefined');}return Object(val);}module.exports=Object.assign||function(target,source){var from;var to=toObject(target);var symbols;for(var s=1;s<arguments.length;s++){from=Object(arguments[s]);for(var key in from){if(hasOwnProperty.call(from,key)){to[key]=from[key];}}if(Object.getOwnPropertySymbols){symbols=Object.getOwnPropertySymbols(from);for(var i=0;i<symbols.length;i++){if(propIsEnumerable.call(from,symbols[i])){to[symbols[i]]=from[symbols[i]];}}}}return to;};/***/},/* 13 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=renderLine;var _setAttributes=__webpack_require__(14);var _setAttributes2=_interopRequireDefault(_setAttributes);var _normalizeColor=__webpack_require__(15);var _normalizeColor2=_interopRequireDefault(_normalizeColor);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
		 * Create SVGLineElements from an annotation definition.
		 * This is used for anntations of type `strikeout`.
		 *
		 * @param {Object} a The annotation definition
		 * @return {SVGGElement} A group of all lines to be rendered
		 */function renderLine(a){var group=document.createElementNS('http://www.w3.org/2000/svg','g');(0,_setAttributes2.default)(group,{stroke:(0,_normalizeColor2.default)(a.color||'#f00'),strokeWidth:1});a.rectangles.forEach(function(r){var line=document.createElementNS('http://www.w3.org/2000/svg','line');(0,_setAttributes2.default)(line,{x1:r.x,y1:r.y,x2:r.x+r.width,y2:r.y});group.appendChild(line);});return group;}module.exports=exports['default'];/***/},/* 14 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=setAttributes;var UPPER_REGEX=/[A-Z]/g;// Don't convert these attributes from camelCase to hyphenated-attributes
	var BLACKLIST=['viewBox'];var keyCase=function keyCase(key){if(BLACKLIST.indexOf(key)===-1){key=key.replace(UPPER_REGEX,function(match){return'-'+match.toLowerCase();});}return key;};/**
		 * Set attributes for a node from a map
		 *
		 * @param {Node} node The node to set attributes on
		 * @param {Object} attributes The map of key/value pairs to use for attributes
		 */function setAttributes(node,attributes){Object.keys(attributes).forEach(function(key){node.setAttribute(keyCase(key),attributes[key]);});}module.exports=exports['default'];/***/},/* 15 *//***/function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=normalizeColor;var REGEX_HASHLESS_HEX=/^([a-f0-9]{6}|[a-f0-9]{3})$/i;/**
		 * Normalize a color value
		 *
		 * @param {String} color The color to normalize
		 * @return {String}
		 */function normalizeColor(color){if(REGEX_HASHLESS_HEX.test(color)){color="#"+color;}return color;}module.exports=exports["default"];/***/},/* 16 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=renderPath;var _setAttributes=__webpack_require__(14);var _setAttributes2=_interopRequireDefault(_setAttributes);var _normalizeColor=__webpack_require__(15);var _normalizeColor2=_interopRequireDefault(_normalizeColor);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
		 * Create SVGPathElement from an annotation definition.
		 * This is used for anntations of type `drawing`.
		 *
		 * @param {Object} a The annotation definition
		 * @return {SVGPathElement} The path to be rendered
		 */function renderPath(a){var d=[];var path=document.createElementNS('http://www.w3.org/2000/svg','path');for(var i=0,l=a.lines.length;i<l;i++){var p1=a.lines[i];var p2=a.lines[i+1];if(p2){d.push('M'+p1[0]+' '+p1[1]+' '+p2[0]+' '+p2[1]);}}(0,_setAttributes2.default)(path,{d:d.join(' ')+'Z',stroke:(0,_normalizeColor2.default)(a.color||'#000'),strokeWidth:a.width||1,fill:'none'});return path;}module.exports=exports['default'];/***/},/* 17 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=renderPoint;var _setAttributes=__webpack_require__(14);var _setAttributes2=_interopRequireDefault(_setAttributes);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var SIZE=25;var D='M499.968 214.336q-113.832 0 -212.877 38.781t-157.356 104.625 -58.311 142.29q0 62.496 39.897 119.133t112.437 97.929l48.546 27.9 -15.066 53.568q-13.392 50.778 -39.06 95.976 84.816 -35.154 153.45 -95.418l23.994 -21.204 31.806 3.348q38.502 4.464 72.54 4.464 113.832 0 212.877 -38.781t157.356 -104.625 58.311 -142.29 -58.311 -142.29 -157.356 -104.625 -212.877 -38.781z';/**
		 * Create SVGElement from an annotation definition.
		 * This is used for anntations of type `comment`.
		 *
		 * @param {Object} a The annotation definition
		 * @return {SVGElement} A svg to be rendered
		 */function renderPoint(a){var outerSVG=document.createElementNS('http://www.w3.org/2000/svg','svg');var innerSVG=document.createElementNS('http://www.w3.org/2000/svg','svg');var rect=document.createElementNS('http://www.w3.org/2000/svg','rect');var path=document.createElementNS('http://www.w3.org/2000/svg','path');(0,_setAttributes2.default)(outerSVG,{width:SIZE,height:SIZE,x:a.x,y:a.y});(0,_setAttributes2.default)(innerSVG,{width:SIZE,height:SIZE,x:0,y:SIZE*0.05*-1,viewBox:'0 0 1000 1000'});(0,_setAttributes2.default)(rect,{width:SIZE,height:SIZE,stroke:'#000',fill:'#ff0'});(0,_setAttributes2.default)(path,{d:D,strokeWidth:50,stroke:'#000',fill:'#fff'});innerSVG.appendChild(path);outerSVG.appendChild(rect);outerSVG.appendChild(innerSVG);return outerSVG;}module.exports=exports['default'];/***/},/* 18 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _typeof=typeof Symbol==="function"&&_typeof2(Symbol.iterator)==="symbol"?function(obj){return typeof obj==='undefined'?'undefined':_typeof2(obj);}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj==='undefined'?'undefined':_typeof2(obj);};exports.default=renderRect;var _setAttributes=__webpack_require__(14);var _setAttributes2=_interopRequireDefault(_setAttributes);var _normalizeColor=__webpack_require__(15);var _normalizeColor2=_interopRequireDefault(_normalizeColor);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
		 * Create SVGRectElements from an annotation definition.
		 * This is used for anntations of type `area` and `highlight`.
		 *
		 * @param {Object} a The annotation definition
		 * @return {SVGGElement|SVGRectElement} A group of all rects to be rendered
		 */function renderRect(a){if(a.type==='highlight'){var _ret=function(){var group=document.createElementNS('http://www.w3.org/2000/svg','g');(0,_setAttributes2.default)(group,{fill:(0,_normalizeColor2.default)(a.color||'#ff0'),fillOpacity:0.2});a.rectangles.forEach(function(r){group.appendChild(createRect(r));});return{v:group};}();if((typeof _ret==='undefined'?'undefined':_typeof(_ret))==="object")return _ret.v;}else{var rect=createRect(a);(0,_setAttributes2.default)(rect,{stroke:(0,_normalizeColor2.default)(a.color||'#f00'),fill:'none'});return rect;}}function createRect(r){var rect=document.createElementNS('http://www.w3.org/2000/svg','rect');(0,_setAttributes2.default)(rect,{x:r.x,y:r.y,width:r.width,height:r.height});return rect;}module.exports=exports['default'];/***/},/* 19 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=renderText;var _setAttributes=__webpack_require__(14);var _setAttributes2=_interopRequireDefault(_setAttributes);var _normalizeColor=__webpack_require__(15);var _normalizeColor2=_interopRequireDefault(_normalizeColor);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
		 * Create SVGTextElement from an annotation definition.
		 * This is used for anntations of type `textbox`.
		 *
		 * @param {Object} a The annotation definition
		 * @return {SVGTextElement} A text to be rendered
		 */function renderText(a){var text=document.createElementNS('http://www.w3.org/2000/svg','text');(0,_setAttributes2.default)(text,{x:a.x,y:a.y+parseInt(a.size,10),fill:(0,_normalizeColor2.default)(a.color||'#000'),fontSize:a.size});text.innerHTML=a.content;return text;}module.exports=exports['default'];/***/},/* 20 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=renderScreenReaderHints;var _insertScreenReaderHint=__webpack_require__(21);var _insertScreenReaderHint2=_interopRequireDefault(_insertScreenReaderHint);var _initEventHandlers=__webpack_require__(27);var _initEventHandlers2=_interopRequireDefault(_initEventHandlers);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// TODO This is not the right place for this to live
	(0,_initEventHandlers2.default)();/**
		 * Insert hints into the DOM for screen readers.
		 *
		 * @param {Array} annotations The annotations that hints are inserted for
		 */function renderScreenReaderHints(annotations){annotations=Array.isArray(annotations)?annotations:[];// Insert hints for each type
	Object.keys(SORT_TYPES).forEach(function(type){var sortBy=SORT_TYPES[type];annotations.filter(function(a){return a.type===type;}).sort(sortBy).forEach(function(a,i){return(0,_insertScreenReaderHint2.default)(a,i+1);});});}// Sort annotations first by y, then by x.
	// This allows hints to be injected in the order they appear,
	// which makes numbering them easier.
	function sortByPoint(a,b){if(a.y<b.y){return a.x-b.x;}else{return 1;}}// Sort annotation by it's first rectangle
	function sortByRectPoint(a,b){return sortByPoint(a.rectangles[0],b.rectangles[0]);}// Sort annotation by it's first line
	function sortByLinePoint(a,b){var lineA=a.lines[0];var lineB=b.lines[0];return sortByPoint({x:lineA[0],y:lineA[1]},{x:lineB[0],y:lineB[1]});}// Arrange supported types and associated sort methods
	var SORT_TYPES={'highlight':sortByRectPoint,'strikeout':sortByRectPoint,'drawing':sortByLinePoint,'textbox':sortByPoint,'point':sortByPoint,'area':sortByPoint};module.exports=exports['default'];/***/},/* 21 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=insertScreenReaderHint;var _createScreenReaderOnly=__webpack_require__(22);var _createScreenReaderOnly2=_interopRequireDefault(_createScreenReaderOnly);var _insertElementWithinChildren=__webpack_require__(23);var _insertElementWithinChildren2=_interopRequireDefault(_insertElementWithinChildren);var _insertElementWithinElement=__webpack_require__(24);var _insertElementWithinElement2=_interopRequireDefault(_insertElementWithinElement);var _renderScreenReaderComments=__webpack_require__(25);var _renderScreenReaderComments2=_interopRequireDefault(_renderScreenReaderComments);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// Annotation types that support comments
	var COMMENT_TYPES=['highlight','point','area'];/**
		 * Insert a hint into the DOM for screen readers for a specific annotation.
		 *
		 * @param {Object} annotation The annotation to insert a hint for
		 * @param {Number} num The number of the annotation out of all annotations of the same type
		 */function insertScreenReaderHint(annotation){var num=arguments.length<=1||arguments[1]===undefined?0:arguments[1];switch(annotation.type){case'highlight':case'strikeout':var rects=annotation.rectangles;var first=rects[0];var last=rects[rects.length-1];(0,_insertElementWithinElement2.default)((0,_createScreenReaderOnly2.default)('Begin '+annotation.type+' annotation '+num,annotation.uuid),first.x,first.y,annotation.page,true);(0,_insertElementWithinElement2.default)((0,_createScreenReaderOnly2.default)('End '+annotation.type+' annotation '+num,annotation.uuid+'-end'),last.x+last.width,last.y,annotation.page,false);break;case'textbox':case'point':var text=annotation.type==='textbox'?' (content: '+annotation.content+')':'';(0,_insertElementWithinChildren2.default)((0,_createScreenReaderOnly2.default)(annotation.type+' annotation '+num+text,annotation.uuid),annotation.x,annotation.y,annotation.page);break;case'drawing':case'area':var x=typeof annotation.x!=='undefined'?annotation.x:annotation.lines[0][0];var y=typeof annotation.y!=='undefined'?annotation.y:annotation.lines[0][1];(0,_insertElementWithinChildren2.default)((0,_createScreenReaderOnly2.default)('Unlabeled drawing',annotation.uuid),x,y,annotation.page);break;}// Include comments in screen reader hint
	if(COMMENT_TYPES.includes(annotation.type)){(0,_renderScreenReaderComments2.default)(annotation.documentId,annotation.uuid);}}module.exports=exports['default'];/***/},/* 22 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=createScreenReaderOnly;/**
		 * Create a node that is only visible to screen readers
		 *
		 * @param {String} content The text content that should be read by screen reader
		 * @param {String} [annotationId] The ID of the annotation assocaited
		 * @return {Element} An Element that is only visible to screen readers
		 */function createScreenReaderOnly(content,annotationId){var node=document.createElement('div');var text=document.createTextNode(content);node.appendChild(text);node.setAttribute('id','pdf-annotate-screenreader-'+annotationId);node.style.position='absolute';node.style.left='-10000px';node.style.top='auto';node.style.width='1px';node.style.height='1px';node.style.overflow='hidden';return node;}module.exports=exports['default'];/***/},/* 23 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=insertElementWithinChildren;var _insertElementWithinElement=__webpack_require__(24);var _insertElementWithinElement2=_interopRequireDefault(_insertElementWithinElement);var _utils=__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}/**
		 * Insert an element at a point within the document.
		 * This algorithm will try to insert between elements if possible.
		 * It will however use `insertElementWithinElement` if it is more accurate.
		 *
		 * @param {Element} el The element to be inserted
		 * @param {Number} x The x coordinate of the point
		 * @param {Number} y The y coordinate of the point
		 * @param {Number} pageNumber The page number to limit elements to
		 * @return {Boolean} True if element was able to be inserted, otherwise false
		 */function insertElementWithinChildren(el,x,y,pageNumber){// Try and use most accurate method of inserting within an element
	if((0,_insertElementWithinElement2.default)(el,x,y,pageNumber,true)){return true;}// Fall back to inserting between elements
	var svg=document.querySelector('svg[data-pdf-annotate-page="'+pageNumber+'"]');var rect=svg.getBoundingClientRect();var nodes=[].concat(_toConsumableArray(svg.parentNode.querySelectorAll('.textLayer > div')));y=(0,_utils.scaleUp)(svg,{y:y}).y+rect.top;x=(0,_utils.scaleUp)(svg,{x:x}).x+rect.left;// Find the best node to insert before
	for(var i=0,l=nodes.length;i<l;i++){var n=nodes[i];var r=n.getBoundingClientRect();if(y<=r.top){n.parentNode.insertBefore(el,n);return true;}}// If all else fails try to append to the bottom
	var textLayer=svg.parentNode.querySelector('.textLayer');if(textLayer){var textRect=textLayer.getBoundingClientRect();if((0,_utils.pointIntersectsRect)(x,y,textRect)){textLayer.appendChild(el);return true;}}return false;}module.exports=exports['default'];/***/},/* 24 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=insertElementWithinElement;var _utils=__webpack_require__(6);function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}/**
		 * Insert an element at a point within the document.
		 * This algorithm will only insert within an element amidst it's text content.
		 *
		 * @param {Element} el The element to be inserted
		 * @param {Number} x The x coordinate of the point
		 * @param {Number} y The y coordinate of the point
		 * @param {Number} pageNumber The page number to limit elements to
		 * @param {Boolean} insertBefore Whether the element is to be inserted before or after x
		 * @return {Boolean} True if element was able to be inserted, otherwise false
		 */function insertElementWithinElement(el,x,y,pageNumber,insertBefore){var OFFSET_ADJUST=2;// If inserting before adjust `x` by looking for element a few px to the right
	// Otherwise adjust a few px to the left
	// This is to allow a little tolerance by searching within the box, instead
	// of getting a false negative by testing right on the border.
	x=Math.max(x+OFFSET_ADJUST*(insertBefore?1:-1),0);var node=textLayerElementFromPoint(x,y+OFFSET_ADJUST,pageNumber);if(!node){return false;}// Now that node has been found inverse the adjustment for `x`.
	// This is done to accomodate tolerance by cutting off on the outside of the
	// text boundary, instead of missing a character by cutting off within.
	x=x+OFFSET_ADJUST*(insertBefore?-1:1);var svg=document.querySelector('svg[data-pdf-annotate-page="'+pageNumber+'"]');var left=(0,_utils.scaleDown)(svg,{left:node.getBoundingClientRect().left}).left-svg.getBoundingClientRect().left;var temp=node.cloneNode(true);var head=temp.innerHTML.split('');var tail=[];// Insert temp off screen
	temp.style.position='absolute';temp.style.top='-10000px';temp.style.left='-10000px';document.body.appendChild(temp);while(head.length){// Don't insert within HTML tags
	if(head[head.length-1]==='>'){while(head.length){tail.unshift(head.pop());if(tail[0]==='<'){break;}}}// Check if width of temp based on current head value satisfies x
	temp.innerHTML=head.join('');var width=(0,_utils.scaleDown)(svg,{width:temp.getBoundingClientRect().width}).width;if(left+width<=x){break;}tail.unshift(head.pop());}// Update original node with new markup, including element to be inserted
	node.innerHTML=head.join('')+el.outerHTML+tail.join('');temp.parentNode.removeChild(temp);return true;}/**
		 * Get a text layer element at a given point on a page
		 *
		 * @param {Number} x The x coordinate of the point
		 * @param {Number} y The y coordinate of the point
		 * @param {Number} pageNumber The page to limit elements to
		 * @return {Element} First text layer element found at the point
		 */function textLayerElementFromPoint(x,y,pageNumber){var svg=document.querySelector('svg[data-pdf-annotate-page="'+pageNumber+'"]');var rect=svg.getBoundingClientRect();y=(0,_utils.scaleUp)(svg,{y:y}).y+rect.top;x=(0,_utils.scaleUp)(svg,{x:x}).x+rect.left;return[].concat(_toConsumableArray(svg.parentNode.querySelectorAll('.textLayer [data-canvas-width]'))).filter(function(el){return(0,_utils.pointIntersectsRect)(x,y,el.getBoundingClientRect());})[0];}module.exports=exports['default'];/***/},/* 25 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=renderScreenReaderComments;var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);var _insertScreenReaderComment=__webpack_require__(26);var _insertScreenReaderComment2=_interopRequireDefault(_insertScreenReaderComment);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
		 * Insert the comments into the DOM to be available by screen reader
		 *
		 * Example output:
		 *   <div class="screenReaderOnly">
		 *    <div>Begin highlight 1</div>
		 *    <ol aria-label="Comments">
		 *      <li>Foo</li>
		 *      <li>Bar</li>
		 *      <li>Baz</li>
		 *      <li>Qux</li>
		 *    </ol>
		 *  </div>
		 *  <div>Some highlighted text goes here...</div>
		 *  <div class="screenReaderOnly">End highlight 1</div>
		 *
		 * NOTE: `screenReaderOnly` is not a real class, just used for brevity
		 *
		 * @param {String} documentId The ID of the document
		 * @param {String} annotationId The ID of the annotation
		 * @param {Array} [comments] Optionally preloaded comments to be rendered
		 * @return {Promise}
		 */function renderScreenReaderComments(documentId,annotationId,comments){var promise=void 0;if(Array.isArray(comments)){promise=Promise.resolve(comments);}else{promise=_PDFJSAnnotate2.default.getStoreAdapter().getComments(documentId,annotationId);}return promise.then(function(comments){// Node needs to be found by querying DOM as it may have been inserted as innerHTML
	// leaving `screenReaderNode` as an invalid reference (see `insertElementWithinElement`).
	var node=document.getElementById('pdf-annotate-screenreader-'+annotationId);if(node){var list=document.createElement('ol');list.setAttribute('id','pdf-annotate-screenreader-comment-list-'+annotationId);list.setAttribute('aria-label','Comments');node.appendChild(list);comments.forEach(_insertScreenReaderComment2.default);}});}module.exports=exports['default'];/***/},/* 26 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=insertScreenReaderComment;/**
		 * Insert a comment into the DOM to be available by screen reader
		 *
		 * @param {Object} comment The comment to be inserted
		 */function insertScreenReaderComment(comment){if(!comment){return;}var list=document.querySelector('#pdf-annotate-screenreader-'+comment.annotation+' ol');if(list){var item=document.createElement('li');item.setAttribute('id','pdf-annotate-screenreader-comment-'+comment.uuid);item.appendChild(document.createTextNode(''+comment.content));list.appendChild(item);}}module.exports=exports['default'];/***/},/* 27 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=initEventHandlers;var _insertScreenReaderHint=__webpack_require__(21);var _insertScreenReaderHint2=_interopRequireDefault(_insertScreenReaderHint);var _renderScreenReaderHints=__webpack_require__(20);var _renderScreenReaderHints2=_interopRequireDefault(_renderScreenReaderHints);var _insertScreenReaderComment=__webpack_require__(26);var _insertScreenReaderComment2=_interopRequireDefault(_insertScreenReaderComment);var _renderScreenReaderComments=__webpack_require__(25);var _renderScreenReaderComments2=_interopRequireDefault(_renderScreenReaderComments);var _event=__webpack_require__(4);var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
		 * Initialize the event handlers for keeping screen reader hints synced with data
		 */function initEventHandlers(){(0,_event.addEventListener)('annotation:add',function(documentId,pageNumber,annotation){reorderAnnotationsByType(documentId,pageNumber,annotation.type);});(0,_event.addEventListener)('annotation:edit',function(documentId,annotationId,annotation){reorderAnnotationsByType(documentId,annotation.page,annotation.type);});(0,_event.addEventListener)('annotation:delete',removeAnnotation);(0,_event.addEventListener)('comment:add',insertComment);(0,_event.addEventListener)('comment:delete',removeComment);}/**
		 * Reorder the annotation numbers by annotation type
		 *
		 * @param {String} documentId The ID of the document
		 * @param {Number} pageNumber The page number of the annotations
		 * @param {Strig} type The annotation type
		 */function reorderAnnotationsByType(documentId,pageNumber,type){_PDFJSAnnotate2.default.getStoreAdapter().getAnnotations(documentId,pageNumber).then(function(annotations){return annotations.annotations.filter(function(a){return a.type===type;});}).then(function(annotations){annotations.forEach(function(a){removeAnnotation(documentId,a.uuid);});return annotations;}).then(_renderScreenReaderHints2.default);}/**
		 * Remove the screen reader hint for an annotation
		 *
		 * @param {String} documentId The ID of the document
		 * @param {String} annotationId The Id of the annotation
		 */function removeAnnotation(documentId,annotationId){removeElementById('pdf-annotate-screenreader-'+annotationId);removeElementById('pdf-annotate-screenreader-'+annotationId+'-end');}/**
		 * Insert a screen reader hint for a comment
		 *
		 * @param {String} documentId The ID of the document
		 * @param {String} annotationId The ID of tha assocated annotation
		 * @param {Object} comment The comment to insert a hint for
		 */function insertComment(documentId,annotationId,comment){var list=document.querySelector('pdf-annotate-screenreader-comment-list-'+annotationId);var promise=void 0;if(!list){promise=(0,_renderScreenReaderComments2.default)(documentId,annotationId,[]).then(function(){list=document.querySelector('pdf-annotate-screenreader-comment-list-'+annotationId);return true;});}else{promise=Promise.resolve(true);}promise.then(function(){(0,_insertScreenReaderComment2.default)(comment);});}/**
		 * Remove a screen reader hint for a comment
		 *
		 * @param {String} documentId The ID of the document
		 * @param {String} commentId The ID of the comment
		 */function removeComment(documentId,commentId){removeElementById('pdf-annotate-screenreader-comment-'+commentId);}/**
		 * Remove an element from the DOM by it's ID if it exists
		 *
		 * @param {String} elementID The ID of the element to be removed
		 */function removeElementById(elementId){var el=document.getElementById(elementId);if(el){el.parentNode.removeChild(el);}}module.exports=exports['default'];/***/},/* 28 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _event=__webpack_require__(4);var _edit=__webpack_require__(29);var _pen=__webpack_require__(30);var _point=__webpack_require__(31);var _rect=__webpack_require__(32);var _text=__webpack_require__(33);var _page=__webpack_require__(34);exports.default={addEventListener:_event.addEventListener,removeEventListener:_event.removeEventListener,fireEvent:_event.fireEvent,disableEdit:_edit.disableEdit,enableEdit:_edit.enableEdit,disablePen:_pen.disablePen,enablePen:_pen.enablePen,setPen:_pen.setPen,disablePoint:_point.disablePoint,enablePoint:_point.enablePoint,disableRect:_rect.disableRect,enableRect:_rect.enableRect,disableText:_text.disableText,enableText:_text.enableText,setText:_text.setText,createPage:_page.createPage,renderPage:_page.renderPage};module.exports=exports['default'];/***/},/* 29 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"])_i["return"]();}finally{if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else{throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();exports.enableEdit=enableEdit;exports.disableEdit=disableEdit;var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);var _appendChild=__webpack_require__(11);var _appendChild2=_interopRequireDefault(_appendChild);var _event=__webpack_require__(4);var _utils=__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}var _enabled=false;var isDragging=false,overlay=void 0;var dragOffsetX=void 0,dragOffsetY=void 0,dragStartX=void 0,dragStartY=void 0;var OVERLAY_BORDER_SIZE=3;/**
		 * Create an overlay for editing an annotation.
		 *
		 * @param {Element} target The annotation element to apply overlay for
		 */function createEditOverlay(target){destroyEditOverlay();overlay=document.createElement('div');var anchor=document.createElement('a');var parentNode=(0,_utils.findSVGContainer)(target).parentNode;var id=target.getAttribute('data-pdf-annotate-id');var rect=(0,_utils.getAnnotationRect)(target);var styleLeft=rect.left-OVERLAY_BORDER_SIZE;var styleTop=rect.top-OVERLAY_BORDER_SIZE;overlay.setAttribute('id','pdf-annotate-edit-overlay');overlay.setAttribute('data-target-id',id);overlay.style.boxSizing='content-box';overlay.style.position='absolute';overlay.style.top=styleTop+'px';overlay.style.left=styleLeft+'px';overlay.style.width=rect.width+'px';overlay.style.height=rect.height+'px';overlay.style.border=OVERLAY_BORDER_SIZE+'px solid '+_utils.BORDER_COLOR;overlay.style.borderRadius=OVERLAY_BORDER_SIZE+'px';anchor.innerHTML='×';anchor.setAttribute('href','javascript://');anchor.style.background='#fff';anchor.style.borderRadius='20px';anchor.style.border='1px solid #bbb';anchor.style.color='#bbb';anchor.style.fontSize='16px';anchor.style.padding='2px';anchor.style.textAlign='center';anchor.style.textDecoration='none';anchor.style.position='absolute';anchor.style.top='-13px';anchor.style.right='-13px';anchor.style.width='25px';anchor.style.height='25px';overlay.appendChild(anchor);parentNode.appendChild(overlay);document.addEventListener('click',handleDocumentClick);document.addEventListener('keyup',handleDocumentKeyup);document.addEventListener('mousedown',handleDocumentMousedown);anchor.addEventListener('click',deleteAnnotation);anchor.addEventListener('mouseover',function(){anchor.style.color='#35A4DC';anchor.style.borderColor='#999';anchor.style.boxShadow='0 1px 1px #ccc';});anchor.addEventListener('mouseout',function(){anchor.style.color='#bbb';anchor.style.borderColor='#bbb';anchor.style.boxShadow='';});overlay.addEventListener('mouseover',function(){if(!isDragging){anchor.style.display='';}});overlay.addEventListener('mouseout',function(){anchor.style.display='none';});}/**
		 * Destroy the edit overlay if it exists.
		 */function destroyEditOverlay(){if(overlay){overlay.parentNode.removeChild(overlay);overlay=null;}document.removeEventListener('click',handleDocumentClick);document.removeEventListener('keyup',handleDocumentKeyup);document.removeEventListener('mousedown',handleDocumentMousedown);document.removeEventListener('mousemove',handleDocumentMousemove);document.removeEventListener('mouseup',handleDocumentMouseup);(0,_utils.enableUserSelect)();}/**
		 * Delete currently selected annotation
		 */function deleteAnnotation(){if(!overlay){return;}var annotationId=overlay.getAttribute('data-target-id');var nodes=document.querySelectorAll('[data-pdf-annotate-id="'+annotationId+'"]');var svg=overlay.parentNode.querySelector('svg.annotationLayer');var _getMetadata=(0,_utils.getMetadata)(svg);var documentId=_getMetadata.documentId;[].concat(_toConsumableArray(nodes)).forEach(function(n){n.parentNode.removeChild(n);});_PDFJSAnnotate2.default.getStoreAdapter().deleteAnnotation(documentId,annotationId);destroyEditOverlay();}/**
		 * Handle document.click event
		 *
		 * @param {Event} e The DOM event that needs to be handled
		 */function handleDocumentClick(e){if(!(0,_utils.findSVGAtPoint)(e.clientX,e.clientY)){return;}// Remove current overlay
	var overlay=document.getElementById('pdf-annotate-edit-overlay');if(overlay){if(isDragging||e.target===overlay){return;}destroyEditOverlay();}}/**
		 * Handle document.keyup event
		 *
		 * @param {Event} e The DOM event that needs to be handled
		 */function handleDocumentKeyup(e){if(overlay&&e.keyCode===46&&e.target.nodeName.toLowerCase()!=='textarea'&&e.target.nodeName.toLowerCase()!=='input'){deleteAnnotation();}}/**
		 * Handle document.mousedown event
		 *
		 * @param {Event} e The DOM event that needs to be handled
		 */function handleDocumentMousedown(e){if(e.target!==overlay){return;}// Highlight and strikeout annotations are bound to text within the document.
	// It doesn't make sense to allow repositioning these types of annotations.
	var annotationId=overlay.getAttribute('data-target-id');var target=document.querySelector('[data-pdf-annotate-id="'+annotationId+'"]');var type=target.getAttribute('data-pdf-annotate-type');if(type==='highlight'||type==='strikeout'){return;}isDragging=true;dragOffsetX=e.clientX;dragOffsetY=e.clientY;dragStartX=overlay.offsetLeft;dragStartY=overlay.offsetTop;overlay.style.background='rgba(255, 255, 255, 0.7)';overlay.style.cursor='move';overlay.querySelector('a').style.display='none';document.addEventListener('mousemove',handleDocumentMousemove);document.addEventListener('mouseup',handleDocumentMouseup);(0,_utils.disableUserSelect)();}/**
		 * Handle document.mousemove event
		 *
		 * @param {Event} e The DOM event that needs to be handled
		 */function handleDocumentMousemove(e){var annotationId=overlay.getAttribute('data-target-id');var parentNode=overlay.parentNode;var rect=parentNode.getBoundingClientRect();var y=dragStartY+(e.clientY-dragOffsetY);var x=dragStartX+(e.clientX-dragOffsetX);var minY=0;var maxY=rect.height;var minX=0;var maxX=rect.width;if(y>minY&&y+overlay.offsetHeight<maxY){overlay.style.top=y+'px';}if(x>minX&&x+overlay.offsetWidth<maxX){overlay.style.left=x+'px';}}/**
		 * Handle document.mouseup event
		 *
		 * @param {Event} e The DOM event that needs to be handled
		 */function handleDocumentMouseup(e){var annotationId=overlay.getAttribute('data-target-id');var target=document.querySelectorAll('[data-pdf-annotate-id="'+annotationId+'"]');var type=target[0].getAttribute('data-pdf-annotate-type');var svg=overlay.parentNode.querySelector('svg.annotationLayer');var _getMetadata2=(0,_utils.getMetadata)(svg);var documentId=_getMetadata2.documentId;overlay.querySelector('a').style.display='';function getDelta(propX,propY){return calcDelta(parseInt(target[0].getAttribute(propX),10),parseInt(target[0].getAttribute(propY),10));}function calcDelta(x,y){return{deltaX:OVERLAY_BORDER_SIZE+(0,_utils.scaleDown)(svg,{x:overlay.offsetLeft}).x-x,deltaY:OVERLAY_BORDER_SIZE+(0,_utils.scaleDown)(svg,{y:overlay.offsetTop}).y-y};}_PDFJSAnnotate2.default.getStoreAdapter().getAnnotation(documentId,annotationId).then(function(annotation){if(['area','highlight','point','textbox'].indexOf(type)>-1){(function(){var _getDelta=getDelta('x','y');var deltaX=_getDelta.deltaX;var deltaY=_getDelta.deltaY;[].concat(_toConsumableArray(target)).forEach(function(t,i){if(deltaY!==0){var modelY=parseInt(t.getAttribute('y'),10)+deltaY;var viewY=modelY;if(type==='textbox'){viewY+=annotation.size;}if(type==='point'){viewY=(0,_utils.scaleUp)(svg,{viewY:viewY}).viewY;}t.setAttribute('y',viewY);if(annotation.rectangles){annotation.rectangles[i].y=modelY;}else if(annotation.y){annotation.y=modelY;}}if(deltaX!==0){var modelX=parseInt(t.getAttribute('x'),10)+deltaX;var viewX=modelX;if(type==='point'){viewX=(0,_utils.scaleUp)(svg,{viewX:viewX}).viewX;}t.setAttribute('x',viewX);if(annotation.rectangles){annotation.rectangles[i].x=modelX;}else if(annotation.x){annotation.x=modelX;}}});// } else if (type === 'strikeout') {
	//   let { deltaX, deltaY } = getDelta('x1', 'y1');
	//   [...target].forEach(target, (t, i) => {
	//     if (deltaY !== 0) {
	//       t.setAttribute('y1', parseInt(t.getAttribute('y1'), 10) + deltaY);
	//       t.setAttribute('y2', parseInt(t.getAttribute('y2'), 10) + deltaY);
	//       annotation.rectangles[i].y = parseInt(t.getAttribute('y1'), 10);
	//     }
	//     if (deltaX !== 0) {
	//       t.setAttribute('x1', parseInt(t.getAttribute('x1'), 10) + deltaX);
	//       t.setAttribute('x2', parseInt(t.getAttribute('x2'), 10) + deltaX);
	//       annotation.rectangles[i].x = parseInt(t.getAttribute('x1'), 10);
	//     }
	//   });
	})();}else if(type==='drawing'){(function(){var rect=(0,_utils.scaleDown)(svg,(0,_utils.getAnnotationRect)(target[0]));var _annotation$lines$=_slicedToArray(annotation.lines[0],2);var originX=_annotation$lines$[0];var originY=_annotation$lines$[1];var _calcDelta=calcDelta(originX,originY);var deltaX=_calcDelta.deltaX;var deltaY=_calcDelta.deltaY;// origin isn't necessarily at 0/0 in relation to overlay x/y
	// adjust the difference between overlay and drawing coords
	deltaY+=originY-rect.top;deltaX+=originX-rect.left;annotation.lines.forEach(function(line,i){var _annotation$lines$i=_slicedToArray(annotation.lines[i],2);var x=_annotation$lines$i[0];var y=_annotation$lines$i[1];annotation.lines[i][0]=x+deltaX;annotation.lines[i][1]=y+deltaY;});target[0].parentNode.removeChild(target[0]);(0,_appendChild2.default)(svg,annotation);})();}_PDFJSAnnotate2.default.getStoreAdapter().editAnnotation(documentId,annotationId,annotation);});setTimeout(function(){isDragging=false;},0);overlay.style.background='';overlay.style.cursor='';document.removeEventListener('mousemove',handleDocumentMousemove);document.removeEventListener('mouseup',handleDocumentMouseup);(0,_utils.enableUserSelect)();}/**
		 * Handle annotation.click event
		 *
		 * @param {Element} e The annotation element that was clicked
		 */function handleAnnotationClick(target){createEditOverlay(target);}/**
		 * Enable edit mode behavior.
		 */function enableEdit(){if(_enabled){return;}_enabled=true;(0,_event.addEventListener)('annotation:click',handleAnnotationClick);};/**
		 * Disable edit mode behavior.
		 */function disableEdit(){destroyEditOverlay();if(!_enabled){return;}_enabled=false;(0,_event.removeEventListener)('annotation:click',handleAnnotationClick);};/***/},/* 30 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.setPen=setPen;exports.enablePen=enablePen;exports.disablePen=disablePen;var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);var _appendChild=__webpack_require__(11);var _appendChild2=_interopRequireDefault(_appendChild);var _utils=__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var _enabled=false;var _penSize=void 0;var _penColor=void 0;var path=void 0;var lines=void 0;/**
		 * Handle document.mousedown event
		 */function handleDocumentMousedown(){path=null;lines=[];document.addEventListener('mousemove',handleDocumentMousemove);document.addEventListener('mouseup',handleDocumentMouseup);}/**
		 * Handle document.mouseup event
		 *
		 * @param {Event} e The DOM event to be handled
		 */function handleDocumentMouseup(e){var svg=void 0;if(lines.length>1&&(svg=(0,_utils.findSVGAtPoint)(e.clientX,e.clientY))){var _getMetadata=(0,_utils.getMetadata)(svg);var documentId=_getMetadata.documentId;var pageNumber=_getMetadata.pageNumber;_PDFJSAnnotate2.default.getStoreAdapter().addAnnotation(documentId,pageNumber,{type:'drawing',width:_penSize,color:_penColor,lines:lines}).then(function(annotation){if(path){svg.removeChild(path);}(0,_appendChild2.default)(svg,annotation);});}document.removeEventListener('mousemove',handleDocumentMousemove);document.removeEventListener('mouseup',handleDocumentMouseup);}/**
		 * Handle document.mousemove event
		 *
		 * @param {Event} e The DOM event to be handled
		 */function handleDocumentMousemove(e){savePoint(e.clientX,e.clientY);}/**
		 * Handle document.keyup event
		 *
		 * @param {Event} e The DOM event to be handled
		 */function handleDocumentKeyup(e){// Cancel rect if Esc is pressed
	if(e.keyCode===27){lines=null;path.parentNode.removeChild(path);document.removeEventListener('mousemove',handleDocumentMousemove);document.removeEventListener('mouseup',handleDocumentMouseup);}}/**
		 * Save a point to the line being drawn.
		 *
		 * @param {Number} x The x coordinate of the point
		 * @param {Number} y The y coordinate of the point
		 */function savePoint(x,y){var svg=(0,_utils.findSVGAtPoint)(x,y);if(!svg){return;}var rect=svg.getBoundingClientRect();var point=(0,_utils.scaleDown)(svg,{x:x-rect.left,y:y-rect.top});lines.push([point.x,point.y]);if(lines.length<=1){return;}if(path){svg.removeChild(path);}path=(0,_appendChild2.default)(svg,{type:'drawing',color:_penColor,width:_penSize,lines:lines});}/**
		 * Set the attributes of the pen.
		 *
		 * @param {Number} penSize The size of the lines drawn by the pen
		 * @param {String} penColor The color of the lines drawn by the pen
		 */function setPen(){var penSize=arguments.length<=0||arguments[0]===undefined?1:arguments[0];var penColor=arguments.length<=1||arguments[1]===undefined?'000000':arguments[1];_penSize=parseInt(penSize,10);_penColor=penColor;}/**
		 * Enable the pen behavior
		 */function enablePen(){if(_enabled){return;}_enabled=true;document.addEventListener('mousedown',handleDocumentMousedown);document.addEventListener('keyup',handleDocumentKeyup);(0,_utils.disableUserSelect)();}/**
		 * Disable the pen behavior
		 */function disablePen(){if(!_enabled){return;}_enabled=false;document.removeEventListener('mousedown',handleDocumentMousedown);document.removeEventListener('keyup',handleDocumentKeyup);(0,_utils.enableUserSelect)();}/***/},/* 31 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _typeof=typeof Symbol==="function"&&_typeof2(Symbol.iterator)==="symbol"?function(obj){return typeof obj==='undefined'?'undefined':_typeof2(obj);}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj==='undefined'?'undefined':_typeof2(obj);};exports.enablePoint=enablePoint;exports.disablePoint=disablePoint;var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);var _appendChild=__webpack_require__(11);var _appendChild2=_interopRequireDefault(_appendChild);var _utils=__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var _enabled=false;var input=void 0;/**
		 * Handle document.mouseup event
		 *
		 * @param {Event} The DOM event to be handled
		 */function handleDocumentMouseup(e){if(input||!(0,_utils.findSVGAtPoint)(e.clientX,e.clientY)){return;}input=document.createElement('input');input.setAttribute('id','pdf-annotate-point-input');input.setAttribute('placeholder','Enter comment');input.style.border='3px solid '+_utils.BORDER_COLOR;input.style.borderRadius='3px';input.style.position='absolute';input.style.top=e.clientY+'px';input.style.left=e.clientX+'px';input.addEventListener('blur',handleInputBlur);input.addEventListener('keyup',handleInputKeyup);document.body.appendChild(input);input.focus();}/**
		 * Handle input.blur event
		 */function handleInputBlur(){savePoint();}/**
		 * Handle input.keyup event
		 *
		 * @param {Event} e The DOM event to handle
		 */function handleInputKeyup(e){if(e.keyCode===27){closeInput();}else if(e.keyCode===13){savePoint();}}/**
		 * Save a new point annotation from input
		 */function savePoint(){if(input.value.trim().length>0){var _ret=function(){var clientX=parseInt(input.style.left,10);var clientY=parseInt(input.style.top,10);var content=input.value.trim();var svg=(0,_utils.findSVGAtPoint)(clientX,clientY);if(!svg){return{v:void 0};}var rect=svg.getBoundingClientRect();var _getMetadata=(0,_utils.getMetadata)(svg);var documentId=_getMetadata.documentId;var pageNumber=_getMetadata.pageNumber;var annotation=Object.assign({type:'point'},(0,_utils.scaleDown)(svg,{x:clientX-rect.left,y:clientY-rect.top}));_PDFJSAnnotate2.default.getStoreAdapter().addAnnotation(documentId,pageNumber,annotation).then(function(annotation){_PDFJSAnnotate2.default.getStoreAdapter().addComment(documentId,annotation.uuid,content);(0,_appendChild2.default)(svg,annotation);});}();if((typeof _ret==='undefined'?'undefined':_typeof(_ret))==="object")return _ret.v;}closeInput();}/**
		 * Close the input element
		 */function closeInput(){input.removeEventListener('blur',handleInputBlur);input.removeEventListener('keyup',handleInputKeyup);document.body.removeChild(input);input=null;}/**
		 * Enable point annotation behavior
		 */function enablePoint(){if(_enabled){return;}_enabled=true;document.addEventListener('mouseup',handleDocumentMouseup);}/**
		 * Disable point annotation behavior
		 */function disablePoint(){if(!_enabled){return;}_enabled=false;document.removeEventListener('mouseup',handleDocumentMouseup);}/***/},/* 32 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.enableRect=enableRect;exports.disableRect=disableRect;var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);var _appendChild=__webpack_require__(11);var _appendChild2=_interopRequireDefault(_appendChild);var _utils=__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}var _enabled=false;var _type=void 0;var overlay=void 0;var originY=void 0;var originX=void 0;/**
		 * Get the current window selection as rects
		 *
		 * @return {Array} An Array of rects
		 */function getSelectionRects(){try{var selection=window.getSelection();var range=selection.getRangeAt(0);var rects=range.getClientRects();if(rects.length>0&&rects[0].width>0&&rects[0].height>0){return rects;}}catch(e){}return null;}/**
		 * Handle document.mousedown event
		 *
		 * @param {Event} e The DOM event to handle
		 */function handleDocumentMousedown(e){var svg=void 0;if(_type!=='area'||!(svg=(0,_utils.findSVGAtPoint)(e.clientX,e.clientY))){return;}var rect=svg.getBoundingClientRect();originY=e.clientY;originX=e.clientX;overlay=document.createElement('div');overlay.style.position='absolute';overlay.style.top=originY-rect.top+'px';overlay.style.left=originX-rect.left+'px';overlay.style.border='3px solid '+_utils.BORDER_COLOR;overlay.style.borderRadius='3px';svg.parentNode.appendChild(overlay);document.addEventListener('mousemove',handleDocumentMousemove);(0,_utils.disableUserSelect)();}/**
		 * Handle document.mousemove event
		 *
		 * @param {Event} e The DOM event to handle
		 */function handleDocumentMousemove(e){var svg=overlay.parentNode.querySelector('svg.annotationLayer');var rect=svg.getBoundingClientRect();if(originX+(e.clientX-originX)<rect.right){overlay.style.width=e.clientX-originX+'px';}if(originY+(e.clientY-originY)<rect.bottom){overlay.style.height=e.clientY-originY+'px';}}/**
		 * Handle document.mouseup event
		 *
		 * @param {Event} e The DOM event to handle
		 */function handleDocumentMouseup(e){var rects=void 0;if(_type!=='area'&&(rects=getSelectionRects())){var svg=(0,_utils.findSVGAtPoint)(rects[0].left,rects[0].top);saveRect(_type,[].concat(_toConsumableArray(rects)).map(function(r){return{top:r.top,left:r.left,width:r.width,height:r.height};}));}else if(_type==='area'&&overlay){var _svg=overlay.parentNode.querySelector('svg.annotationLayer');var rect=_svg.getBoundingClientRect();saveRect(_type,[{top:parseInt(overlay.style.top,10)+rect.top,left:parseInt(overlay.style.left,10)+rect.left,width:parseInt(overlay.style.width,10),height:parseInt(overlay.style.height,10)}]);overlay.parentNode.removeChild(overlay);overlay=null;document.removeEventListener('mousemove',handleDocumentMousemove);(0,_utils.enableUserSelect)();}}/**
		 * Handle document.keyup event
		 *
		 * @param {Event} e The DOM event to handle
		 */function handleDocumentKeyup(e){// Cancel rect if Esc is pressed
	if(e.keyCode===27){var selection=window.getSelection();selection.removeAllRanges();if(overlay&&overlay.parentNode){overlay.parentNode.removeChild(overlay);overlay=null;document.removeEventListener('mousemove',handleDocumentMousemove);}}}/**
		 * Save a rect annotation
		 *
		 * @param {String} type The type of rect (area, highlight, strikeout)
		 * @param {Array} rects The rects to use for annotation
		 * @param {String} color The color of the rects
		 */function saveRect(type,rects,color){var svg=(0,_utils.findSVGAtPoint)(rects[0].left,rects[0].top);var node=void 0;var annotation=void 0;if(!svg){return;}var boundingRect=svg.getBoundingClientRect();if(!color){if(type==='highlight'){color='FFFF00';}else if(type==='strikeout'){color='FF0000';}}// Initialize the annotation
	annotation={type:type,color:color,rectangles:[].concat(_toConsumableArray(rects)).map(function(r){var offset=0;if(type==='strikeout'){offset=r.height/2;}return(0,_utils.scaleDown)(svg,{y:r.top+offset-boundingRect.top,x:r.left-boundingRect.left,width:r.width,height:r.height});}).filter(function(r){return r.width>0&&r.height>0&&r.x>-1&&r.y>-1;})};// Short circuit if no rectangles exist
	if(annotation.rectangles.length===0){return;}// Special treatment for area as it only supports a single rect
	if(type==='area'){var rect=annotation.rectangles[0];delete annotation.rectangles;annotation.x=rect.x;annotation.y=rect.y;annotation.width=rect.width;annotation.height=rect.height;}var _getMetadata=(0,_utils.getMetadata)(svg);var documentId=_getMetadata.documentId;var pageNumber=_getMetadata.pageNumber;// Add the annotation
	_PDFJSAnnotate2.default.getStoreAdapter().addAnnotation(documentId,pageNumber,annotation).then(function(annotation){(0,_appendChild2.default)(svg,annotation);});}/**
		 * Enable rect behavior
		 */function enableRect(type){_type=type;if(_enabled){return;}_enabled=true;document.addEventListener('mouseup',handleDocumentMouseup);document.addEventListener('mousedown',handleDocumentMousedown);document.addEventListener('keyup',handleDocumentKeyup);}/**
		 * Disable rect behavior
		 */function disableRect(){if(!_enabled){return;}_enabled=false;document.removeEventListener('mouseup',handleDocumentMouseup);document.removeEventListener('mousedown',handleDocumentMousedown);document.removeEventListener('keyup',handleDocumentKeyup);}/***/},/* 33 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _typeof=typeof Symbol==="function"&&_typeof2(Symbol.iterator)==="symbol"?function(obj){return typeof obj==='undefined'?'undefined':_typeof2(obj);}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj==='undefined'?'undefined':_typeof2(obj);};exports.setText=setText;exports.enableText=enableText;exports.disableText=disableText;var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);var _appendChild=__webpack_require__(11);var _appendChild2=_interopRequireDefault(_appendChild);var _utils=__webpack_require__(6);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var _enabled=false;var input=void 0;var _textSize=void 0;var _textColor=void 0;/**
		 * Handle document.mouseup event
		 *
		 * @param {Event} e The DOM event to handle
		 */function handleDocumentMouseup(e){if(input||!(0,_utils.findSVGAtPoint)(e.clientX,e.clientY)){return;}input=document.createElement('input');input.setAttribute('id','pdf-annotate-text-input');input.setAttribute('placeholder','Enter text');input.style.border='3px solid '+_utils.BORDER_COLOR;input.style.borderRadius='3px';input.style.position='absolute';input.style.top=e.clientY+'px';input.style.left=e.clientX+'px';input.style.fontSize=_textSize+'px';input.addEventListener('blur',handleInputBlur);input.addEventListener('keyup',handleInputKeyup);document.body.appendChild(input);input.focus();}/**
		 * Handle input.blur event
		 */function handleInputBlur(){saveText();}/**
		 * Handle input.keyup event
		 *
		 * @param {Event} e The DOM event to handle
		 */function handleInputKeyup(e){if(e.keyCode===27){closeInput();}else if(e.keyCode===13){saveText();}}/**
		 * Save a text annotation from input
		 */function saveText(){if(input.value.trim().length>0){var _ret=function(){var clientX=parseInt(input.style.left,10);var clientY=parseInt(input.style.top,10);var svg=(0,_utils.findSVGAtPoint)(clientX,clientY);if(!svg){return{v:void 0};}var _getMetadata=(0,_utils.getMetadata)(svg);var documentId=_getMetadata.documentId;var pageNumber=_getMetadata.pageNumber;var rect=svg.getBoundingClientRect();var annotation=Object.assign({type:'textbox',size:_textSize,color:_textColor,content:input.value.trim()},(0,_utils.scaleDown)(svg,{x:clientX-rect.left,y:clientY-rect.top,width:input.offsetWidth,height:input.offsetHeight}));_PDFJSAnnotate2.default.getStoreAdapter().addAnnotation(documentId,pageNumber,annotation).then(function(annotation){(0,_appendChild2.default)(svg,annotation);});}();if((typeof _ret==='undefined'?'undefined':_typeof(_ret))==="object")return _ret.v;}closeInput();}/**
		 * Close the input
		 */function closeInput(){if(input){input.removeEventListener('blur',handleInputBlur);input.removeEventListener('keyup',handleInputKeyup);document.body.removeChild(input);input=null;}}/**
		 * Set the text attributes
		 *
		 * @param {Number} textSize The size of the text
		 * @param {String} textColor The color of the text
		 */function setText(){var textSize=arguments.length<=0||arguments[0]===undefined?12:arguments[0];var textColor=arguments.length<=1||arguments[1]===undefined?'000000':arguments[1];_textSize=parseInt(textSize,10);_textColor=textColor;}/**
		 * Enable text behavior
		 */function enableText(){if(_enabled){return;}_enabled=true;document.addEventListener('mouseup',handleDocumentMouseup);}/**
		 * Disable text behavior
		 */function disableText(){if(!_enabled){return;}_enabled=false;document.removeEventListener('mouseup',handleDocumentMouseup);}/***/},/* 34 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"])_i["return"]();}finally{if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else{throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();exports.createPage=createPage;exports.renderPage=renderPage;var _PDFJSAnnotate=__webpack_require__(1);var _PDFJSAnnotate2=_interopRequireDefault(_PDFJSAnnotate);var _renderScreenReaderHints=__webpack_require__(20);var _renderScreenReaderHints2=_interopRequireDefault(_renderScreenReaderHints);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// Template for creating a new page
	var PAGE_TEMPLATE='\n  <div style="visibility: hidden;" class="page" data-loaded="false">\n    <div class="canvasWrapper">\n      <canvas></canvas>\n    </div>\n    <svg class="annotationLayer"></svg>\n    <div class="textLayer"></div>\n  </div>\n';/**
		 * Create a new page to be appended to the DOM.
		 *
		 * @param {Number} pageNumber The page number that is being created
		 * @return {HTMLElement}
		 */function createPage(pageNumber){var temp=document.createElement('div');temp.innerHTML=PAGE_TEMPLATE;var page=temp.children[0];var canvas=page.querySelector('canvas');page.setAttribute('id','pageContainer'+pageNumber);page.setAttribute('data-page-number',pageNumber);canvas.mozOpaque=true;canvas.setAttribute('id','page'+pageNumber);return page;}/**
		 * Render a page that has already been created.
		 *
		 * @param {Number} pageNumber The page number to be rendered
		 * @param {Object} renderOptions The options for rendering
		 * @return {Promise} Settled once rendering has completed
		 *  A settled Promise will be either:
		 *    - fulfilled: [pdfPage, annotations]
		 *    - rejected: Error
		 */function renderPage(pageNumber,renderOptions){var documentId=renderOptions.documentId;var pdfDocument=renderOptions.pdfDocument;var scale=renderOptions.scale;var rotate=renderOptions.rotate;// Load the page and annotations
	return Promise.all([pdfDocument.getPage(pageNumber),_PDFJSAnnotate2.default.getAnnotations(documentId,pageNumber)]).then(function(_ref){var _ref2=_slicedToArray(_ref,2);var pdfPage=_ref2[0];var annotations=_ref2[1];var page=document.getElementById('pageContainer'+pageNumber);var svg=page.querySelector('.annotationLayer');var canvas=page.querySelector('.canvasWrapper canvas');var canvasContext=canvas.getContext('2d',{alpha:false});var viewport=pdfPage.getViewport(scale,rotate);var transform=scalePage(pageNumber,viewport,canvasContext);// Render the page
	return Promise.all([pdfPage.render({canvasContext:canvasContext,viewport:viewport,transform:transform}),_PDFJSAnnotate2.default.render(svg,viewport,annotations)]).then(function(){// Text content is needed for a11y, but is also necessary for creating
	// highlight and strikeout annotations which require selecting text.
	return pdfPage.getTextContent({normalizeWhitespace:true}).then(function(textContent){return new Promise(function(resolve,reject){// Render text layer for a11y of text content
	var textLayer=page.querySelector('.textLayer');var textLayerFactory=new PDFJS.DefaultTextLayerFactory();var textLayerBuilder=textLayerFactory.createTextLayerBuilder(textLayer,pageNumber-1,viewport);textLayerBuilder.setTextContent(textContent);textLayerBuilder.render();// Enable a11y for annotations
	// Timeout is needed to wait for `textLayerBuilder.render`
	setTimeout(function(){try{(0,_renderScreenReaderHints2.default)(annotations.annotations);resolve();}catch(e){reject(e);}});});});}).then(function(){// Indicate that the page was loaded
	page.setAttribute('data-loaded','true');return[pdfPage,annotations];});});}/**
		 * Scale the elements of a page.
		 *
		 * @param {Number} pageNumber The page number to be scaled
		 * @param {Object} viewport The viewport of the PDF page (see pdfPage.getViewport(scale, rotate))
		 * @param {Object} context The canvas context that the PDF page is rendered to
		 * @return {Array} The transform data for rendering the PDF page
		 */function scalePage(pageNumber,viewport,context){var page=document.getElementById('pageContainer'+pageNumber);var canvas=page.querySelector('.canvasWrapper canvas');var svg=page.querySelector('.annotationLayer');var wrapper=page.querySelector('.canvasWrapper');var textLayer=page.querySelector('.textLayer');var outputScale=getOutputScale(context);var transform=!outputScale.scaled?null:[outputScale.sx,0,0,outputScale.sy,0,0];var sfx=approximateFraction(outputScale.sx);var sfy=approximateFraction(outputScale.sy);// Adjust width/height for scale
	page.style.visibility='';canvas.width=roundToDivide(viewport.width*outputScale.sx,sfx[0]);canvas.height=roundToDivide(viewport.height*outputScale.sy,sfy[0]);canvas.style.width=roundToDivide(viewport.width,sfx[1])+'px';canvas.style.height=roundToDivide(viewport.height,sfx[1])+'px';svg.setAttribute('width',viewport.width);svg.setAttribute('height',viewport.height);svg.style.width=viewport.width+'px';svg.style.height=viewport.height+'px';page.style.width=viewport.width+'px';page.style.height=viewport.height+'px';wrapper.style.width=viewport.width+'px';wrapper.style.height=viewport.height+'px';textLayer.style.width=viewport.width+'px';textLayer.style.height=viewport.height+'px';return transform;}/**
		 * Approximates a float number as a fraction using Farey sequence (max order of 8).
		 *
		 * @param {Number} x Positive float number
		 * @return {Array} Estimated fraction: the first array item is a numerator,
		 *                 the second one is a denominator.
		 */function approximateFraction(x){// Fast path for int numbers or their inversions.
	if(Math.floor(x)===x){return[x,1];}var xinv=1/x;var limit=8;if(xinv>limit){return[1,limit];}else if(Math.floor(xinv)===xinv){return[1,xinv];}var x_=x>1?xinv:x;// a/b and c/d are neighbours in Farey sequence.
	var a=0,b=1,c=1,d=1;// Limit search to order 8.
	while(true){// Generating next term in sequence (order of q).
	var p=a+c,q=b+d;if(q>limit){break;}if(x_<=p/q){c=p;d=q;}else{a=p;b=q;}}// Select closest of neighbours to x.
	if(x_-a/b<c/d-x_){return x_===x?[a,b]:[b,a];}else{return x_===x?[c,d]:[d,c];}}function getOutputScale(ctx){var devicePixelRatio=window.devicePixelRatio||1;var backingStoreRatio=ctx.webkitBackingStorePixelRatio||ctx.mozBackingStorePixelRatio||ctx.msBackingStorePixelRatio||ctx.oBackingStorePixelRatio||ctx.backingStorePixelRatio||1;var pixelRatio=devicePixelRatio/backingStoreRatio;return{sx:pixelRatio,sy:pixelRatio,scaled:pixelRatio!==1};}function roundToDivide(x,div){var r=x%div;return r===0?x:Math.round(x-r+div);}/***/}/******/]));});;//# sourceMappingURL=pdf-annotate.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = initColorPicker;
	// Color picker component
	var COLORS = [{ hex: '#000000', name: 'Black' }, { hex: '#EF4437', name: 'Red' }, { hex: '#E71F63', name: 'Pink' }, { hex: '#8F3E97', name: 'Purple' }, { hex: '#65499D', name: 'Deep Purple' }, { hex: '#4554A4', name: 'Indigo' }, { hex: '#2083C5', name: 'Blue' }, { hex: '#35A4DC', name: 'Light Blue' }, { hex: '#09BCD3', name: 'Cyan' }, { hex: '#009688', name: 'Teal' }, { hex: '#43A047', name: 'Green' }, { hex: '#8BC34A', name: 'Light Green' }, { hex: '#FDC010', name: 'Yellow' }, { hex: '#F8971C', name: 'Orange' }, { hex: '#F0592B', name: 'Deep Orange' }, { hex: '#F06291', name: 'Light Pink' }];

	function initColorPicker(el, value, onChange) {
	  function setColor(value) {
	    var fireOnChange = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	    currentValue = value;
	    a.setAttribute('data-color', value);
	    a.style.background = value;
	    if (fireOnChange && typeof onChange === 'function') {
	      onChange(value);
	    }
	    closePicker();
	  }

	  function togglePicker() {
	    if (isPickerOpen) {
	      closePicker();
	    } else {
	      openPicker();
	    }
	  }

	  function closePicker() {
	    document.removeEventListener('keyup', handleDocumentKeyup);
	    if (picker && picker.parentNode) {
	      picker.parentNode.removeChild(picker);
	    }
	    isPickerOpen = false;
	    a.focus();
	  }

	  function openPicker() {
	    if (!picker) {
	      picker = document.createElement('div');
	      picker.style.background = '#fff';
	      picker.style.border = '1px solid #ccc';
	      picker.style.padding = '2px';
	      picker.style.position = 'absolute';
	      picker.style.width = '122px';
	      el.style.position = 'relative';

	      COLORS.map(createColorOption).forEach(function (c) {
	        c.style.margin = '2px';
	        c.onclick = function () {
	          setColor(c.getAttribute('data-color'));
	        };
	        picker.appendChild(c);
	      });
	    }

	    document.addEventListener('keyup', handleDocumentKeyup);
	    el.appendChild(picker);
	    isPickerOpen = true;
	  }

	  function createColorOption(color) {
	    var e = document.createElement('a');
	    e.className = 'color';
	    e.setAttribute('href', 'javascript://');
	    e.setAttribute('title', color.name);
	    e.setAttribute('data-color', color.hex);
	    e.style.background = color.hex;
	    return e;
	  }

	  function handleDocumentKeyup(e) {
	    if (e.keyCode === 27) {
	      closePicker();
	    }
	  }

	  var picker = void 0;
	  var isPickerOpen = false;
	  var currentValue = void 0;
	  var a = createColorOption({ hex: value });
	  a.onclick = togglePicker;
	  el.appendChild(a);
	  setColor(value, false);
	}

/***/ }
/******/ ]);