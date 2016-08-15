## UI

`UI` is the object that enables user interactions for management of annotations in the browser

__Table of Contents__

- [addEventListener()](#addeventlistener)
- [removeEventListener()](#removeeventlistener)
- [disableEdit()](#disableedit)
- [enableEdit()](#enableedit)
- [disablePen()](#disablepen)
- [enablePen()](#enablepen)
- [setPen()](#setpen)
- [disablePoint()](#disablepoint)
- [enablePoint()](#enablepoint)
- [disableRect()](#disablerect)
- [enableRect()](#enablerect)
- [disableText()](#disabletext)
- [enableText()](#enabletext)
- [setText()](#settext)
- [createPage()](#createpage)
- [renderPage()](#renderpage)

---

### `addEventListener()`
Adds an event handler to handle a specific type of event

__Syntax__

```js
UI.addEventListener(type, handler)
```

__Parameters__

| parameter | description |
|---|---|
| `type` | The type of event that will be subscribed to |
| `handler` | The function that will handle the event |

Types of events:

- annotation:blur
- annotation:click
- annotation:add
- annotation:edit
- annotation:delete
- comment:add
- comment:delete


### `removeEventListener()`
Removes an event handler from handling a specific type of event

__Syntax__

```js
UI.removeEventListener(type, handler)
```

__Parameters__

| parameter | description |
|---|---|
| `type` | The type of event that will be unsubscribed from  |
| `handler` | The function that handled the event |


### `disableEdit()`
Disables the ability to edit annotations from the UI

__Syntax__

```js
UI.disableEdit()
```


### `enableEdit()`
Enables the ability to edit annoations from the UI

__Syntax__

```js
UI.enableEdit()
```


### `disablePen()`
Disables the ability to draw with the pen in the UI

__Syntax__

```js
UI.disablePen()
```


### `enablePen()`
Enables the ability to draw with the pen in the UI

__Syntax__

```js
UI.enablePen()
```


### `setPen()`
Sets the size and color of the pen

__Syntax__

```js
UI.setPen([size[, color]])
```

__Parameters__

| parameter | description |
|---|---|
| `size` | The size of the pen (defaults to 12) |
| `color` | The color of the pen (defaults to "000000") |


### `disablePoint()`
Disables the ability to create a point annotation from the UI

__Syntax__

```js
UI.disablePoint()
```


### `enablePoint()`
Enables the ability to create a point annotation from the UI

__Syntax__

```js
UI.enablePoint()
```


### `disableRect()`
Disables the ability to create a rectangular annotation from the UI

__Syntax__

```js
UI.disableRect()
```


### `enableRect()`
Enables the ability to create a rectangular annotation from the UI

__Syntax__

```js
UI.enableRect(type)
```

__Parameters__

| parameter | description |
|---|---|
| `type` | The type of rectangle (one of area, highlight, or strikeout) |


### `disableText()`
Disables the ability to enter free form text from the UI

__Syntax__

```js
UI.disableText()
```


### `enableText()`
Enables the ability to enter free form text from the UI

__Syntax__

```js
UI.enableText()
```


### `setText()`
Sets the size and color of the text

__Syntax__

```js
UI.setText([size[, color]])
```

__Parameters__

| parameter | description |
|---|---|
| `size` | The size of the text (defaults to 12) |
| `color` | The color of the text (defaults to "000000") |


### `createPage()`
Creates a new page to be appended to the DOM

__Syntax__

```js
UI.createPage(pageNumber)
```

__Parameters__

| parameter | description |
|---|---|
| `pageNumber` | The page number that is being created |

__Returns__

`HTMLElement`

An element that can be appended to the DOM.

__Usage__

```js
let page = UI.createPage(1);
document.getElementById('viewer').appendChild(page);
```

### `renderPage()`
Render a page that has already been created

__Syntax__

```js
UI.renderPage(pageNumber, renderOptions)
```

__Parameters__

| parameter | description |
|---|---|
| `pageNumber` | The page number to be rendered |
| `renderOptions` | The options for rendering |

__Returns__

`Promise`

A settled Promise will be either:

- fulfilled: `Array [pdfPage, annotations]`
- rejected: `Error`

__Usage__

```js
const { UI } = PDFJSAnnotate;
const RENDER_OPTIONS = {
  documentId: 'Example.pdf',
  pdfDocument: null,
  scale: 1,
  rotate: 0
};

PDFJS.getDocument(RENDER_OPTIONS.documentId).then(pdf => {
  RENDER_OPTIONS.pdfDocument = pdf;

  // Create a page in the DOM for every page in the PDF
  let viewer = document.getElementById('viewer');
  viewer.innerHTML = '';
  let numPages = pdf.pdfInfo.numPages;
  for (let i=0; i<numPages; i++) {
    let page = UI.createPage(i+1);
    viewer.appendChild(page);
  }

  // Automatically render the first page
  // This assumes that page has already been created and appended
  UI.renderPage(1, RENDER_OPTIONS).then([pdfPage, annotations] => {
    // Useful if you need access to annotations or pdfPage.getViewport, etc.
  });
});

// Scroll event to render pages as they come into view
document.body.addEventListener('scroll', e => {
  /* ... */
});
```
