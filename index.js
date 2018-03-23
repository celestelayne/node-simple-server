'use strict'

const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 4000;

const dictStorage = {};

const server = http.createServer(function(req, res){

	const parseURL = url.parse(req.url, true)
	const pathName = parseURL.pathname;
	const queryObj = parseURL.query;

	let key, keys, value

	if(pathName == '/set'){
		// store the queryObj key and value in memory
		// http://localhost:4000/set?somekey=somevalue&apples=oranges
		keys = getSingleKey(queryObj);
		for (let i=0; i<keys.length; i++){
			key = keys[i]
			console.log('line 20: ' + key) // somekey
			dictStorage[key] = queryObj[key]; // somevalue
		}
		
		fs.writeFile('storage.js', JSON.stringify(dictStorage), function(err){
			if(err) console.log(err);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('key-value pair of (' + keys[0] + ':' + dictStorage[key] + ' ' + keys[1] + ':' + dictStorage[key] + ') stored to file.')
		})
		
	} else if(pathName == '/get') {
		// return the value stored at somekey
		// http://localhost:4000/get?key=somekey
		fs.readFile('storage.js', 'utf8', function(err, data){
			if (err) throw err;
			key = getSingleKey(queryObj);
			value = queryObj[key] // somekey
			const parsedData = JSON.parse(data);
			console.log('line 33: ' + key) // key
			console.log(parsedData[value]) // somevalue
			if (parsedData[value]){
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('key-value pair of (' + key + ':' + parsedData[value] + ') received from file.')
			} 
		});
	}
});

server.listen(port, 'localhost');

function getSingleKey(obj){
		const arr = [];
    for (const key in obj) {
        arr.push(key);
    }
    return arr;
}