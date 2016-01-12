# pdf-annotate.js

[![build status](https://img.shields.io/travis/mzabriskie/pdf-annotate.js.svg?style=flat-square)](https://travis-ci.org/mzabriskie/pdf-annotate.js)
[![code coverage](https://img.shields.io/coveralls/mzabriskie/pdf-annotate.svg?style=flat-square)](https://coveralls.io/r/mzabriskie/pdf-annotate.js)

Annotation layer for [pdf.js](https://github.com/mozilla/pdf.js)

## Developing

```bash
# clone the repo
$ git clone git@github.com:mzabriskie/pdf-annotate.js.git
$ cd pdf-annotate.js

# intall dependencies
$ npm install

# start example server
$ npm start
$ open http://127.0.0.1:8080

# run tests
$ npm test
```

## Objectives

- Provide a low level annotation layer for [pdf.js](https://github.com/mozilla/pdf.js).
- Optional high level UI for managing annotations.
- Agnostic of backend, just supply your own `StoreAdapter` to load/store data.
- Prescribe annotation format (example forth coming).

## Example

```js
import __pdfjs from 'pdfjs-dist/build/pdf';
import PDFJSAnnotate from 'pdfjs-annotate';
import MyStoreAdapter from './myStoreAdapter';

const DOCUMENT_ID = 'MyPDF.pdf';
const PAGE_NUMBER = 1;
const SCALE = 1;
const ROTATE = 0;

PDFJS.workerSrc = 'pdf.worker.js';
PDFJSAnnotate.StoreAdapter = MyStoreAdapter;

PDFJS.getDocument(DOCUMENT_ID).then((pdf) => {
  Promise.all([
    pdf.getPage(PAGE_NUMBER),
    PDFJSAnnotate.getAnnotations(DOCUMENT_ID, PAGE_NUMBER)
  ])
  .then(([page, annotations]) => {
    let canvas = document.getElementById('canvas');
    let svg = document.getElementById('svg');
    let viewport = page.getViewport(SCALE, ROTATE);
    let context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    svg.setAttribute('height', viewport.height);
    svg.setAttribute('width', viewport.width);

    page.render({context, viewport});
    PDFJSAnnotate.render(svg, viewport, annotations);
  });
});
```

See more [examples](https://github.com/mzabriskie/pdf-annotate.js/examples).
