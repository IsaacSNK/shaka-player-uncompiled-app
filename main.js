const http = require('http');
const fs = require('fs');
const port = 8080;

const requestListener = function (req, res) {
    if (req.url === '/') {
        redirect('/index.html', res);
    } else if (!handledWithRedirect(req, res)) {
        writeFileContent(req, res);
    }
}

const handledWithRedirect = (req, res) => {
    const redirectPrefixes = [
        '/lib', 
        '/ui',
        '/third_part'
    ];
    const shouldRedirect = redirectPrefixes.find((prefix) => req.url.startsWith(prefix))
    if (shouldRedirect) {
        const destination = `http://localhost:${port}/node_modules/shaka-player${req.url}`;
        console.log(`Redirecting ${req.url} to ${destination}`);
        redirect(destination, res);
        return true;
    }
    return false;
};

const redirect = (destination, res) => {
    res.writeHead(302, {
        location: destination,
    });
    res.end();
};

const writeFileContent = (req, res) => {
    fs.readFile(__dirname + req.url, (err,data) => {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
};

const server = http.createServer(requestListener);
server.listen(port);