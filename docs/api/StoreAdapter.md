### StoreAdapter

`StoreAdapter` is an abstract class that will need to be implemented for fetching annotation data. An unimplemented instance of `StoreAdapter` is used as the default adapter. Any call to an umimplemented adapter will result in an `Error` being thrown.

###### Usage

```js
let MyStoreAdapter = new PDFJSAnnotate.StoreAdapter({
  getAnnotations(documentId, pageNumber) {/* ... */},

  getAnnotation(documentId, annotationId) {/* ... */},

  addAnnotation(documentId, pageNumber, annotation) {/* ... */},

  editAnnotation(documentId, pageNumber, annotation) {/* ... */},

  deleteAnnotation(documentId, annotationId) {/* ... */},
  
  addComment(documentId, annotationId, content) {/* ... */},

  deleteComment(documentId, commentId) {/* ... */}
});
```

#### Methods

##### `getAnnotations(documentId, pageNumber): Promise`
Get all the annotations for a specific page within a document

###### Parameters

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `pageNumber` | The page number within the document |

###### Returns

`Promise`

A settled Promise will be either:

- fulfilled: `Object`
- rejected: `Error`

The fulfilled object will contain the following properties:

| property | description |
|---|---|
| `documentId` | `String` The ID of the document |
| `pageNumer` | `Number` The page number within the document |
| `annotations` | `Array` The annotations for the page |


##### `getAnnotation(documentId, annotationId): Promise`
Get a specific annotation

###### Parameters

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `annotationId` | The ID of the annotation |

###### Returns

`Promise`

A settled Promise will be either:

- fulfilled: `Object` The annotation
- rejected: `Error`


##### `addAnnotation(documentId, pageNumber, annotation): Promise`
Add an annotation to a document

###### Parameters

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `pageNumber` | The page number within the document |
| `annotation` | The JSON definition for the annotation |

###### Returns

`Promise`

A settled Promise will be either:

- fulfilled: `Object` The newly added annotation
- rejected: `Error`


##### `editAnnotation(documentId, pageNumber, annotation): Promise`
Edit an annotation

###### Parameters

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `pageNumber` | The page number within the document |
| `annotation` | The JSON definition for the annotation |

###### Returns

`Promise`

A settled Promise will be either:

- fulfilled: `Object` The updated annotation
- rejected: `Error`


##### `deleteAnnotation(documentId, annotationId): Promise`
Delete an annotation

###### Parameters

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `annotationId` | The ID of the annotation |

###### Returns

`Promise`

A settled Promise will be either:

- fulfilled: `Boolean`
- rejected: `Error`


##### `addComment(documentId, annotationId, content): Promise`
Add a comment to an annotation

###### Parameters

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `annotationId` | The ID of the annotation |
| `content` | The content of the comment |

###### Returns

`Promise`

A settled Promise will be either:

- fulfilled: `Object` The newly added comment
- rejected: `Error`


##### `deleteComment(documentId, commentId): Promise`
Delete a comment

###### Parameters

| parameter | description |
|---|---|
| `documentId` | The ID of the document |
| `commentId` | The ID of the comment |

###### Returns

`Promise`

A settled Promise will be either:

- fulfilled: `Boolean`
- rejected: `Error`


