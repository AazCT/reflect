const http = require('http');
const url = require('url');
const { parse } = require('querystring');

const fileSystem = require('fs');
const path = require('path');

const reflect = require('./reflect.js');
const qconv = require('./qconv');

const httpServer = http.createServer(async (request, response) => {
    //console.log('server work');
    response.setHeader("Content-Type", "text/html; charset=utf-8;");

    if (request.method === 'GET') {
        let urlReq = url.parse(request.url, true);
        console.log(urlReq.query.test);
        if (urlReq.query.test) {
            if (urlReq.query.test % 2 === 0) {
                response.write("<h2>even</h2>");
            } else {
                response.write("<h2>odd</h2>");
            }
            response.end();
        } else if (urlReq.query.tenge) {
            if (urlReq.query.tenge) {
                const r = await qconv.getTengeFunc(urlReq.query.tenge);
                if (urlReq.query.silent) {
                    if (r != 0) {
                        response.write(r);
                    } else {
                        response.write('Error');
                    }
                } else {
                    response.write(`<html><head><title>${urlReq.query.tenge} тенге</title></head><body><h2>${r} р.</h2></body></html>`);
                }
                response.end();
                return;
            }
            response.write("<h2>Nothing to convert.</h2>");
            response.end();  
        } else if (urlReq.query.reflect) {
            if (urlReq.query.reflect == 'vpngate') {
                const ref = await reflect.get('vpngate');
                //console.log('ref = ' + ref);
                if (!ref) {
                    response.write('Error');
                } else {
                    response.setHeader("Content-Type", "text/plain; charset=utf-8");
                    response.setHeader("Content-Length", ref.length);
                    response.write(ref);
                }
            }
            response.end();
            return;
        } else {
            let filePath;
            switch (request.url) {
                case "/scr.js":
                    filePath = path.join(__dirname, 'scr.js');
                    break
                case "/style.css":
                    filePath = path.join(__dirname, 'style.css');
                    break
                default:
                    filePath = path.join(__dirname, 'main.html');
            }
            let stat = fileSystem.statSync(filePath);
            response.setHeader("Content-Length", stat.size);
            let readStream = fileSystem.createReadStream(filePath);
            readStream.pipe(response);
        }
    } else if (request.method === 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            console.log(body);
            let params = parse(body);
            console.log(params);
            console.log(params.hi);
            response.end('ok');
        });
    }
});

/*httpServer.listen(3000, () => {
    console.log("Server is running at port 3000...");
});*/
http.createServer(function(request, response){
    console.log('server work');
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    if (request.method === 'GET') {
        let urlReq = url.parse(request.url, true);
        console.log(urlReq.query.test);
        response.end("get ok!");
    } else response.end("Hello world!");
}).listen(3000, () => {
    console.log("Server is running at port 3000...");
});
