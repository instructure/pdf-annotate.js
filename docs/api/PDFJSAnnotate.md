## PDFJSAnnotate

`PDFJSAnnotate` is the object that will be imported into your project. It contains all the other functions and objects that you will be working with.

#### render()

This is the main entry point into `PDFJSAnnotate`. It is used to render annotation data to an `SVGElement`.

###### Usage

`PDFJSAnnotate.render(svg, viewport, annotations): Promise`

###### Parameters

| parameter | description |
|---|---|
| `svg` | The SVG node that the annotations should be rendered to |
| `viewport` | The viewport data that is returned from `PDFJS.getDocument(documentId).getPage(pageNumber).getViewPort(scale, rotation)` |
| `annotations` | The annotation data that is returned from `PDFJSAnnotation.getAnnotations(documentId, pageNumber)` |

###### Returns

`Promise`

A settled Promise will be either:

- fulfilled: `SVGElement`
- rejected: `Error`

#### getAnnotations()

This is a helper for fetching annotations.

See [StoreAdapter.getAnnotations()]().

#### setStoreAdapter()

Sets the implementation of the `StoreAdapter` to be used by `PDFJSAnnotate`.

###### Usage

`PDFJSAnnotate.setStoreAdapter(new PDFJSAnnotate.StoreAdapter({/* ... */})): void`

###### Parameters

| parameter | description |
|---|---|
| `adapter` | The StoreAdapter implementation to be used. |

See [StoreAdapter]().

#### getStoreAdapter()

Gets the implementation of `StoreAdapter` being used by `PDFJSAnnotate`.

###### Usage

`let adapter = PDFJSAnnotate.getStoreAdapter()`

###### Returns

`StoreAdapter`

#### StoreAdapter

An abstract class that describes how `PDFJSAnnotate` communicates with your backend.

See [StoreAdapter]().

#### LocalStoreAdapter

An implementation of `StoreAdapter` that uses `localStorage` as the backend. This is useful for prototyping or testing.

###### Usage

`PDFJSAnnotate.setStoreAdapter(new PDFJSAnnotate.LocalStoreAdapter())`

#### UI

This object contains helper functions for managing UI interactions for creating, editing, and deleting annotations.

See [UI]().
