
const express = require('express')
var request = require('request');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    getJson('celular', function(data) {
        res.send(data);
    });
})

function getJson(text, callback) {
    request({
        uri: 'https://api.mercadolibre.com/sites/MLA/search',
        qs: {
            q: text
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            callback(body);
        }
        else
            console.log(error);
    })
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

