### UI

`UI` is the object that enables user interactions for management of annotations in the browser

##### `addEventListener(type, handler)`
Adds an event handler to handle a specific type of event

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
|---|---|
| `size` | The size of the text |
| `color` | The color of the text |

