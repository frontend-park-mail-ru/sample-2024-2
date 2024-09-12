const http = require('http');
const debug = require('debug')('http');

debug('booting best server ever');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer((req, res) => {
        const {url} = req;

        const path = (url === '/')? '/index.html' : url;

        const file = fs.readFile(`./public${path}`, (err, data) => {
            if (err) {
                throw err;
            }
            debug(req.method + ' ' + req.url);
            res.write(data);
            res.end();
          })
    });

console.log(`SERVER LISTENING ON PORT ${PORT}`);
server.listen(PORT);
