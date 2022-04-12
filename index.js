const fs = require('fs');
const refParser = require("@apidevtools/json-schema-ref-parser");
const pretty = require('pretty');

const HTON = () => {
    let $this = {
        get Html() {
            let htmlCode = '';
            htmlCode += $this.EvaluateJSONDataProperty($this.JSONData);
            return pretty(htmlCode);
        }
    }

    $this.JSONData = {};

    $this.LoadJSON = (jsonFile) => {
        return new Promise((resolve, reject) => {
            (async () => {
                $this.JSONData = await refParser.dereference(jsonFile);
                resolve();
            })();
        });
    };

    $this.EvaluateJSONDataProperty = (jsonObj) => {
        let htmlCode = '';

        for (let prop in jsonObj) {
			if (prop.indexOf('$style') !== -1) {
				var styleObjStr = JSON.stringify(jsonObj[prop]);
				htmlCode += `<style>${styleObjStr.substring(1, styleObjStr.length - 1).split('",').join('";').split('},').join('}\n').split('": {').join('" {').split('":{').join('"{').split('"').join('')}</style>`;
			}
            else if (prop.indexOf('$attr.') === -1) {
                let propAttr = $this.GetPropHtmlAttributes(jsonObj[prop]);
                let insidePropCode = (typeof jsonObj[prop] === 'object') ? $this.EvaluateJSONDataProperty(jsonObj[prop]) : jsonObj[prop].toString();
				let splitHash = prop.split('#');
				let splitProp = splitHash[0].split('$');
				let idVal = '';

				if (splitHash.length > 1) idVal = ` id="${splitHash[1]}" `;
				if (splitProp.length === 1) splitProp.push('')

				htmlCode += `${((splitProp[1].indexOf('no-open') === -1) ? `<${splitProp[0]}${idVal}${propAttr}>`: '')}${insidePropCode}${((splitProp[1].indexOf('no-close') === -1) ? `</${splitProp[0]}>`: '')}`;
            }
        }

        return htmlCode;
    };

    $this.GetPropHtmlAttributes = (htmlObj) => {
        let returnAttr = '';

        for (var prop in htmlObj) {
            if (prop.indexOf('$attr.') !== -1) {
                returnAttr += ` ${prop.split('$attr.').join('')}="${htmlObj[prop]}"`;
            }
		}

        return returnAttr;
    };

    return $this;
}

module.exports = HTON;
