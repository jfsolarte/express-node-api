
const express = require('express')
var request = require('request');
var cors = require('cors')
const app = express()
const port = 3001

app.use(cors())

app.get('/api/items/:id', (req, res) => {
    getJsonItem(req.params.id, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
})


function getJsonItem(id, callback) {
    
    var jsonItem = {
        "author": "Jairo Fernando",
        "lastname": "Solarte Palacios",
        "categories": [],
        "item": {}
    }
    let url = encodeURI('https://api.mercadolibre.com/items/'+id); 
    let urlDescription = encodeURI('https://api.mercadolibre.com/items/'+id+"/description"); 
    request({
        uri:url
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            let jsonBody = JSON.parse(body);
            jsonItem.item = getItemJson(jsonBody);

            if(jsonBody.pictures[0].url){
                jsonItem.item.picture = jsonBody.pictures[0].url; 
            }
            
            request({
                uri:urlDescription
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    jsonBody = JSON.parse(body);
                    jsonItem.item['description'] = jsonBody.plain_text;
                    callback(jsonItem);
                }
                else
                    console.log(error);
            })
            //callback(jsonItem);
        }
        else
            console.log(error);
    })
}

app.get('/api/items', (req, res) => {
    getJsonSearch(req.query.q, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
})

function getJsonSearch(text, callback) {

    var jsonSearch = {
        "author": "Jairo Fernando",
        "lastname": "Solarte Palacios",
        "categories": [],
        "items": []
    }
    request({
        uri: 'https://api.mercadolibre.com/sites/MLA/search',
        qs: {
            q: text,
            limit:4
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            let jsonBody = JSON.parse(body);
            jsonBody.results.forEach(element => {
                let jsonItem = getItemJson(element);
                jsonSearch.items.push(jsonItem)
            });
            //callback(body);
            callback(jsonSearch);
        }
        else
            console.log(error);
    })
}

function getItemJson(jsonOrigItem) {
    //console.info(jsonOrigItem); 
    var jsonItem = {
        "id": jsonOrigItem.id,
        "title": jsonOrigItem.title,
        "price": {
            "currency": jsonOrigItem.currency_id,
            "amount": jsonOrigItem.price,
            "decimals": 0
        },
        "picture": jsonOrigItem.thumbnail,
        "condition": jsonOrigItem.condition,
        "free_shipping": jsonOrigItem.shipping.free_shipping,
        "sold_quantity": jsonOrigItem.sold_quantity
    }
    return jsonItem;
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

