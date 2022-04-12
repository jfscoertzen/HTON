const fs = require('fs');
const refParser = require("@apidevtools/json-schema-ref-parser");
const pretty = require('pretty');

/**
 * Hyper-Text Object Notation
 * @namespace HTON
 */
const HTON = () => {
    /**
     * The main return object
     * @memberof HTON
     */
    let $this = {
        /**
         * Transpile loaded JSON to Html
         * @returns Html Code
         * @memberof HTON
         */
        get Html() {
            let htmlCode = '';
            htmlCode += $this.EvaluateJSONDataProperty($this.JSONData);
            htmlCode = htmlCode.split('</html>').join('<script>Web.Initialize()</script></html>').split('</HTML>').join('<script>Web.Initialize()</script></HTML>');
            return pretty(htmlCode);
        }
    }

    /**
     * The JSON Data loaded with LoadJSON
     * @memberof HTON
     */
    $this.JSONData = {};

    /**
     * Function to load the JSON file
     * @param {String} jsonFile The JSON File to Load
     * @returns Promise
     * @memberof HTON
     */
    $this.LoadJSON = (jsonFile) => {
        return new Promise((resolve, reject) => {
            (async () => {
                $this.JSONData = await refParser.dereference(jsonFile);
                resolve();
            })();
        });
    };

    /**
     * Evaluate a JSON Object for Transpilation
     * @param {Object} jsonObj The JSON Object to Transpile
     * @returns HTML Code
     * @memberof HTON
     */
    $this.EvaluateJSONDataProperty = (jsonObj, currentView = '') => {
        let htmlCode = '';

        for (let prop in jsonObj) {
            if (prop.indexOf('$style') !== -1) {
                let styleObjStr = JSON.stringify(jsonObj[prop]);
                htmlCode += `<style>${styleObjStr.substring(1, styleObjStr.length - 1).split(
                    '",').join('";').split(
                        '},').join('}\n').split(
                            '": {').join('" {').split(
                                '":{').join('"{').split(
                                    '"').join('')}
                </style>`;
            }
            else if (prop.indexOf('$attr.') === -1) {
                let splitHash = prop.split('#');
                let isView = false;
                let propAttr = '';

                if (splitHash[0].indexOf('$view') !== -1) {
                    let splitView = splitHash[0].split(':');

                    if (splitView.length > 1) {
                        let splitController = splitView[1].split('@');
                        if (splitController.length > 1) {
                            propAttr += ` data-controller="${splitController[0]}" `;
                            currentView = splitController[0];
                        }
                    }

                    splitHash[0] = 'div';
                    isView = true;
                }

                propAttr += $this.GetPropHtmlAttributes(jsonObj[prop], currentView);
                let insidePropCode = (typeof jsonObj[prop] === 'object') ? $this.EvaluateJSONDataProperty(jsonObj[prop], currentView) : jsonObj[prop].toString();

                let splitProp = splitHash[0].split('$');
                let idVal = '';

                if (splitProp[0].toLowerCase() === 'head') {
                    let readIncludeMVC = /*html*/`
                        <script>\n${fs.readFileSync('include.js', 'utf8')}\n</script>\n`;
                    insidePropCode += readIncludeMVC + $this.GetControllerScripts(jsonObj);
                }

                if (splitHash.length > 1) idVal = ` id="${splitHash[1]}" `;
                if (splitProp.length === 1) splitProp.push('')

                htmlCode += `${((splitProp[1].indexOf('no-open') === -1) ?
                    `<${splitProp[0]}${idVal}${propAttr}>` : '')}${insidePropCode}${((splitProp[1].indexOf('no-close') === -1) ? 
                    `</${splitProp[0]}>` : '')}`;
                
                if (isView) {
                    currentView = '';
                }
            }
        }

        return htmlCode;
    };

    /**
     * Get Header scripts to include in the HTML Header
     * @param {Object} jsonObj The JSON Object to inspect for header scripts
     * @returns HTML Code
     * @memberof HTON
     */
    $this.GetControllerScripts = (jsonObj) => {
        let htmlCode = '';

        for (let prop in jsonObj) {
            if (prop.indexOf('$view') !== -1) {
                let splitView = prop.split(':');

                if (splitView.length > 1) {
                    let splitController = splitView[1].split('@');

                    if (splitController.length > 1) {
                        htmlCode += `<script src="${splitController[1]}"></script>`;
                    }
                }
            }

            if (typeof jsonObj[prop] === 'object') {
                htmlCode += $this.GetControllerScripts(jsonObj[prop]);
            }
        }

        return htmlCode;
    };

    /**
     * Get the attributes of a specific element
     * @param {Object} htmlObj The Object being transpiled for attributes
     * @param {String} currentView The current view being inspected
     * @returns The Attribute Values for the HTML Element
     * @memberof HTON
     */
    $this.GetPropHtmlAttributes = (htmlObj, currentView) => {
        let returnAttr = '';

        for (let prop in htmlObj) {
            if (prop.indexOf('$attr.') !== -1) {
                if ((htmlObj[prop].indexOf('$.') !== -1) && (currentView !== '')) {
                    htmlObj[prop] = htmlObj[prop].split('$.').join('Web.Controllers.' + currentView + '.');
                }

                returnAttr += ` ${prop.split('$attr.').join('')}="${htmlObj[prop]}"`;
            }
        }

        return returnAttr;
    };

    return $this;
}

module.exports = HTON;
