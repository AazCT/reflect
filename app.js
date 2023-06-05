const http = require('http');
const url = require('url');
const { parse } = require('querystring');

const fileSystem = require('fs');
const path = require('path');

const reflect = require('./reflect.js');
const qconv = require('./qconv');

http.createServer(async function(request, response){
    response.setHeader("Content-Type", "text/html; charset=utf-8;");
    if (request.method === 'GET') {
        let urlReq = url.parse(request.url, true);
        if (urlReq.query.reflect) {
            if (urlReq.query.reflect == 'vpngate') {
                const ref = await reflect.get('vpngate');
                //console.log('ref = ' + ref);
                if (!ref) {
                    response.setHeader("Content-Length", 5);
                    response.write('Error');
                } else {
                    response.setHeader("Content-Length", ref.length);
                    response.write(ref);
                }
            }
            response.end();
            return;
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
        } else {
            let filePath;
            switch (request.url) {
                case "/scr.js":
                    filePath = path.join(__dirname, 'scr.js');
                    break
                case "/style.css":
                    filePath = path.join(__dirname, 'style.css');
                    break
                case "/favicon.ico":
                    response.setHeader("Content-Type", "image/x-icon");
                    filePath = path.join(__dirname, 'favicon.ico');
                    break
                default:
                    filePath = path.join(__dirname, 'main.html');
            }
            let stat = fileSystem.statSync(filePath);
            response.setHeader("Content-Length", stat.size);
            let readStream = fileSystem.createReadStream(filePath);
            readStream.pipe(response);
        }
    } else response.end("Hello world!");
}).listen(3000, () => {
    console.log("Server is running at port 3000...");
});
