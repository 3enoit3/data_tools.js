# data tools
A set of tools to help data visualization
## Lists
A simple tool to browse a read-only inventory:
* plug data as a simple json file
* follow link
* filter on tags
* search on all columns


[Example: Modern C++ features](https://3enoit3.github.io/data_tools.js/lists/)

## Graphs
A simple tool to play with a read-only graph:
* plug data as a simple json file
* click and drag a node to fix its position; click again to release it
* dynamically change properties of nodes and links by injecting javascript code:
```js
if( data.path.indexOf("test") != -1 ) node.enabled = false;
if( data.path.length == 0 ) node.enabled = false;
if( data.path.indexOf("include") != -1 ) node.shape.fill = "yellow";
if( data.path.indexOf("Content") != -1 ) node.shape.fill = "orange";
if( data.text.indexOf("Route") == -1 ) node.shape.fill = "blue";
if( data.text.indexOf("Scheduler") != -1 ) node.shape.fill = "green";
```


[Example](https://3enoit3.github.io/data_tools.js/graphs/)
