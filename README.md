# pdf-annotate.js

[![build status](https://img.shields.io/travis/mzabriskie/pdf-annotate.js.svg?style=flat-square)](https://travis-ci.org/mzabriskie/pdf-annotate.js)
[![code coverage](https://img.shields.io/coveralls/mzabriskie/pdf-annotate.js.svg?style=flat-square)](https://coveralls.io/r/mzabriskie/pdf-annotate.js)

Annotation layer for [pdf.js](https://github.com/mozilla/pdf.js)

## Developing

```bash
# clone the repo
$ git clone https://github.com/mzabriskie/pdf-annotate.js.git
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
- Prescribe annotation format.

## Example

```js
import __pdfjs from 'pdfjs-dist/build/pdf';
import PDFJSAnnotate from 'pdfjs-annotate';
import MyStoreAdapter from './myStoreAdapter';

const { UI } = PDFJSAnnotate;
const VIEWER = document.getElementById('viewer');
const RENDER_OPTIONS = {
  documentId: 'MyPDF.pdf',
  pdfDocument: null,
  scale: 1,
  rotate: 0
};

PDFJS.workerSrc = 'pdf.worker.js';
PDFJSAnnotate.StoreAdapter = MyStoreAdapter;

PDFJS.getDocument(RENDER_OPTIONS.documentId).then((pdf) => {
  RENDER_OPTIONS.pdfDocument = pdf;
  VIEWER.appendChild(UI.createPage(1));
  UI.renderPage(1, RENDER_OPTIONS);
});
```

See more [examples](https://github.com/mzabriskie/pdf-annotate.js/tree/master/examples).

## API

There are three main objects that you will work with `PDFJSAnnotate`, `StoreAdapter`, and `UI`.

### PDFJSAnnotate

`PDFJSAnnotate` is the top level object that you will be working with.

##### `UI`
Provides a high level UI helper for managing annotations

##### `StoreAdapter`
Abstract object that needs to be implemented in order to perform CRUD operations on annotations

##### `getAnnotations(documentId, pageNumber): Promise`
Get all the annotations for a specific page within a document

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `pageNumber` | The page number within the document |

##### `render(svg, viewport, annotations): Promise`
Render the annotations

| parameter | description |
|---|---|
| `svg` | The SVG node that the annotations should be rendered to |
| `viewport` | The viewport data that is returned from `PDFJS.getDocument(documentId).getPage(pageNumber).getViewPort(scale, rotation)` |
| `annotations` | The annotation data that is returned from `PDFJSAnnotation.getAnnotations(documentId, pageNumber)` |

### UI

`UI` is the object that enables user management of annotations in the browser

##### `addEventListener(type, handler)`
Adds an event handler to handle a specific type of event

| parameter | description |
|---|---|
| `type` | The type of event that will be subscribed to |
| `handler` | The function that will handle the event |

Types of events:

- annotation:blur
- annotation:click


##### `removeEventListener(type, handler)`
Removes an event handler from handling a specific type of event

| parameter | description |
|---|---|
| `type` | The type of event that will be unsubscribed from  |
| `handler` | The function that handled the event |


##### `disableEdit()`
Disables the ability to edit annotations from the UI


##### `enableEdit()`
Enables the ability to edit annoations from the UI


##### `disablePen()`
Disables the ability to draw with the pen in the UI


##### `enablePen()`
Enables the ability to draw with the pen in the UI


##### `setPen(size = 1, color = '000000')`
Sets the size and color of the pen

| parameter | description |
|---|---|
| `size` | The size of the pen |
| `color` | The color of the pen |


##### `disablePoint()`
Disables the ability to create a point annotation from the UI


##### `enablePoint()`
Enables the ability to create a point annotation from the UI


##### `disableRect()`
Disables the ability to create a rectangular annotation from the UI


##### `enableRect(type)`
Enables the ability to create a rectangular annotation from the UI

| parameter | description |
|---|---|
| `type` | The type of rectangle (one of area, highlight, or strikeout) |


##### `disableText()`
Disables the ability to enter free form text from the UI


##### `enableText()`
Enables the ability to enter free form text from the UI


##### `setText(size = 12, color = '000000')`
Sets the size and color of the text

| parameter | description |
|:-:|:-:|
| `size` | The size of the text |
| `color` | The color of the text |


### StoreAdapter

`StoreAdapter` is an abstract object that will need to be implemented for fetching annotation data.

##### `getAnnotations(documentId, pageNumber): Promise`
Get all the annotations for a specific page within a document

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `pageNumber` | The page number within the document |


##### `getAnnotation(documentId, annotationId): Promise`
Get a specific annotation

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `annotationId` | The ID of the annotation |


##### `addAnnotation(documentId, pageNumber, annotation): Promise`
Add an annotation to a document

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `pageNumber` | The page number within the document |
| `annotation` | The JSON definition for the annotation |


##### `editAnnotation(documentId, pageNumber, annotation): Promise`
Edit an annotation

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `pageNumber` | The page number within the document |
| `annotation` | The JSON definition for the annotation |


##### `deleteAnnotation(documentId, annotationId): Promise`
Delete an annotation

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `annotationId` | The ID of the annotation |


##### `addComment(documentId, annotationId, content): Promise`
Add a comment to an annotation

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `annotationId` | The ID of the annotation |
| `content` | The content of the comment |


##### `deleteComment(documentId, commentId): Promise`
Delete a comment

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `commentId` | The ID of the comment |

## Annotation Schema

This is a definition of what annotation types are supported and how they should be represented in JSON.

### Area

An `area` annotation is a free hand rectangle.

```js
{
  "class": "Annotation",
  "type": "area",
  "page": 1,
  "uuid": "839f4817-c82d-4620-a59b-6408b1dc0855",
  "color": "FF0000",
  "rectangles": [
    {
      "height": 75,
      "width": 150,
      "x": 19,
      "y": 37
    }
  ]
}
```

### Highlight

A `highlight` annotation is used to highlight text.

```js
{
  "class": "Annotation",
  "type": "highlight",
  "page": 1,
  "uuid": "99c84974-b899-4de9-8c6c-28e541c03db8",
  "color": "FFFF00",
  "rectangles": [
    {
      "height": 12,
      "width": 335,
      "x": 188,
      "y": 189
    },
    {
      "height": 12,
      "width": 431,
      "x": 72,
      "y": 205
    }
  ]
}
```

### Strikeout

A `strikeout` annotation is used to draw a line through text.

```js
{
  "class": "Annotation",
  "type": "strikeout"
  "page": 1,
  "uuid": "ad9fe5b8-699d-4711-a94e-4b0eb02e551f",
  "color": "FF0000",
  "rectangles": [
    {
      "height": 12,
      "width": 457,
      "x": 72,
      "y": 147
    },
    {
      "height": 12,
      "width": 427,
      "x": 72,
      "y": 163
    }
  ]
}
```

### Textbox

A `textbox` annotation is used to render free form text.

```js
{
  "class": "Annotation",
  "type": "textbox",
  "page": 1,
  "uuid": "efd4ded2-c5cb-4064-8fe8-4217a0565e97",
  "content": "Hello World!",
  "color": "000000",
  "size": 24,
  "width": 259,
  "height": 36,
  "x": 126,
  "y": 82
}
```

### Point

A `point` annotation is used for placing a comment.

```js
{
  "class": "Annotation",
  "type": "point",
  "page": 1,
  "uuid": "e101a5aa-0a85-4b60-86ff-bcf411a1f7f3",
  "x": 150,
  "y": 135
},
{
  "class": "Comment",
  "uuid": "a9501784-b7a8-4c5b-8243-d7c93ce9dc79",
  "annotation": "e101a5aa-0a85-4b60-86ff-bcf411a1f7f3",
  "content": "This is a comment"
}
```

### Drawing

A `drawing` annotation is used to render free form drawing.

```js
{
  "class": "Annotation",
  "type": "drawing",
  "page": 1,
  "uuid": "2748a2d6-4089-4f63-b3b8-a61910487bdb",
  "color": "000000",
  "width": 1,
  "lines": [
    [113, 81],
    [115, 80],
    [119, 79],
    [123, 77],
    [126, 75]
  ]
}
```
