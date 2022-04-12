# HTON
A JSON to HTML Interpreter and MVC framework

## Description
An interpreter to handle JSON files to HTML transpilation. Html is used as a standard way of defining website look, layout and definition. HTON is an abbreviation for Hyper-Text Object Notation. It's a subset of JSON that's aimed at making a project 100% pure JavaScript and yet can be viewed in a web browser.

## Usage
Currently the transpilation works as a node package. It's planned to be used with or without NodeJS later. The transpilation is designed to be on demand, thus when the user requests the site the service transpiles the JSON straight from the file to the requesting buffer.

```js
const HTON = require('HTON')();
(async () => {
    await HTON.LoadJSON('examples/example1.json');
    console.log(HTON.Html);
})();
```

## JSON Definition
```js
{
	"HTML": {
		"head": {
			"$ref": "head1.json"
		},
		"$style": {
			"$ref": "style1.json"
		},
		"body": {
			"h1": "Hello World!",
			"br$no-open": "",
			"table": {
				"$attr.class": "table table-striped table-bordered",
				"tr#1": {
					"td#1": {
						"b": "Name"
					},
					"td#2": {
						"b": "Surname"
					}
				},
				"tr#2": {
					"td#1": "Stephan",
					"td#2": "Coertzen"
				}
			},
			"$view:Controller1@controller1.js": {
				"button": {
					"$attr.class": "btn btn-default",
					"$attr.onclick": "$.AddUser",
					"span":"Add"
				}
			}
		}
	}
}
```

#### $ref
Use `$ref` in property names to define another JSON file that you want to link to the attribute. Use the JSON schema referencing to construct the related schema that you want to parse into the attribute. 

https://json-schema.org/understanding-json-schema/structuring.html

### #1, #2 ...
Use a `#` followed by a identification to define an id for the HTML element.

### `$no-close` or `$no-open`
Use `$no-close` after the attribute name to define that the element should not have a closing tag.
Use `$no-open` after the attribute name to define that the element should not have an opening tag and only a closing tag.

### `$view`
Use `$view` to define a 'View' section that will be bound to a Controller with JavaScript functionality.

## Library Documentation
### HTON : <code>object</code>
Hyper-Text Object Notation

**Kind**: global namespace

<a name="HTON.$this"></a>

#### HTON.$this
The main return object

**Kind**: static property of [<code>HTON</code>](#HTON)
<a name="HTON.Html"></a>

#### HTON.Html ⇒
Transpile loaded JSON to Html

**Kind**: static property of [<code>HTON</code>](#HTON)
**Returns**: Html Code
<a name="HTON.$this.JSONData"></a>

#### HTON.$this.JSONData
The JSON Data loaded with LoadJSON

**Kind**: static property of [<code>HTON</code>](#HTON)
<a name="HTON.$this.LoadJSON"></a>

#### HTON.$this.LoadJSON(jsonFile) ⇒
Function to load the JSON file

**Kind**: static method of [<code>HTON</code>](#HTON)
**Returns**: Promise

| Param | Type | Description |
| --- | --- | --- |
| jsonFile | <code>String</code> | The JSON File to Load |

<a name="HTON.$this.EvaluateJSONDataProperty"></a>

#### HTON.$this.EvaluateJSONDataProperty(jsonObj) ⇒
Evaluate a JSON Object for Transpilation

**Kind**: static method of [<code>HTON</code>](#HTON)
**Returns**: HTML Code

| Param | Type | Description |
| --- | --- | --- |
| jsonObj | <code>Object</code> | The JSON Object to Transpile |

<a name="HTON.$this.GetControllerScripts"></a>

#### HTON.$this.GetControllerScripts(jsonObj) ⇒
Get Header scripts to include in the HTML Header

**Kind**: static method of [<code>HTON</code>](#HTON)
**Returns**: HTML Code

| Param | Type | Description |
| --- | --- | --- |
| jsonObj | <code>Object</code> | The JSON Object to inspect for header scripts |

<a name="HTON.$this.GetPropHtmlAttributes"></a>

#### HTON.$this.GetPropHtmlAttributes(htmlObj, currentView) ⇒
Get the attributes of a specific element

**Kind**: static method of [<code>HTON</code>](#HTON)
**Returns**: The Attribute Values for the HTML Element

| Param | Type | Description |
| --- | --- | --- |
| htmlObj | <code>Object</code> | The Object being transpiled for attributes |
| currentView | <code>String</code> | The current view being inspected |