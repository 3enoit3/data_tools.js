# data tools
A set of tools to help data visualization
## Lists : [*live example*](https://3enoit3.github.io/data_tools.js/lists/)
A simple tool to browse a read-only inventory:
* plug data as a simple json file
* follow link
* filter on tags
* search on all columns


[Example: Modern C++ features](https://3enoit3.github.io/data_tools.js/lists/)

## Graphs : [*live example*](https://3enoit3.github.io/data_tools.js/graphs/)
A simple tool to play with a read-only graph:
* plug data as a simple json file
* click and drag a node to fix its position; click again to release it
* dynamically change properties of nodes and links by injecting javascript code


[Example: Dependencies between C source files of the Quake III game](https://3enoit3.github.io/data_tools.js/graphs/)
* Dynamically change nodes:
```js
// Copy these snippets into the top right hand corner input box and hit "Redraw":

// Change color of AI related nodes
if( data.text.indexOf("ai_") != -1 ) node.shape.fill = "red";

// See only dependencies between headers
if( data.text.indexOf(".h") == -1 ) node.enabled = false;

// Change color and shape of nodes
node.shape.symbol.type = "circle";
node.shape.symbol.size = "100";
```
* Dynamically change links:
```js
// Copy this snippet into the middle input box and hit "Redraw":

// Change links opacity
link.opacity = 0.20;
```
