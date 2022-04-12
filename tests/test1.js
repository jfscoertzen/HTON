const HTON = require('./../index.js')();

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    (async () => {
        await HTON.LoadJSON('examples/example1.json');
        //console.log(JSON.stringify(HTON.JSONData));
		//console.log(HTON.Html);
        res.send(HTON.Html);
    })();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
