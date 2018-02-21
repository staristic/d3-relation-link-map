# d3-relation-link-map
Create a relation link map with [d3.js](https://d3js.org/)

## Demo
See [here](https://staristic.github.io/d3-relation-link-map/demo.html).

## How to use
HTML code: 
```HTML
<!--include d3.js-->
<script src="https://d3js.org/d3.v4.min.js"></script>

<script src="./relation-link-map.js"></script>
<div id="demo"></div>
```
js code:
```js
var demo = new RelationLinkMapPainting();
demo.draw(document.getElementById("demo") , yourData)
```

### Data format
```js
{
    // array of columns
	nodes: [{
			title: 'title of column',
			elements: [{ 
					id: 'element id',
					text: 'element text'
				}
			]
		}
	],
    // array of links
	links: [
		[['id_1-a', 'id_2-b'], ['id_1-c', 'id_2-d']], //links between column 1 and column 2
		[['id_2-a', 'id_2-b'], ['id_3-c', 'id_3-d']]  //links between column 2 and column 3
	]
};

```
### Example
```js
var data = {
	nodes: [{
			title: 'Student',
			elements: [{
					id: '1',
					text: 'Tom'
				}, {
					id: '2',
					text: 'Eric'
				}, {
					id: '3',
					text: 'Alex'
				}
			]
		}, {
			title: 'Lesson',
			elements: [{
					id: '4',
					text: 'Math'
				}, {
					id: '5',
					text: 'History'
				}, {
					id: '6',
					text: 'Physics'
				}, {
					id: '7',
					text: 'Chemistry'
				}
			]
		}, {
			title: 'Teacher',
			elements: [{
					id: '8',
					text: 'Paul'
				}, {
					id: '9',
					text: 'Peter'
				}
			]
		},

	],
	links: [
		[['1', '4'], ['1', '5'], ['1', '7'], ['2', '6'], ['2', '7'], ['3', '4'], ['3', '5']],
		[['4', '8'], ['7', '8'], ['6', '9'], ['5', '9']]
	]
};
var demo = new RelationLinkMapPainting();
demo.draw(document.getElementById("demo") , data)
```
