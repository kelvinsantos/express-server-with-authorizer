const express = require('express');
const next = require('next');
const helmet = require('helmet');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const useHostAuthorizer = () => {
    return (req, res, next) => {
        if (!['mytrade.com.ph'].includes(req.get('host'))) {
            return res.sendStatus(401);
        }
        next();
    };
};

const useIFrameAncestors = () => {
    // NOTE: `ALLOW-FROM` is not supported in most browsers.
    return (req, res, next) => {
        res.setHeader(
            'Content-Security-Policy',
            'frame-ancestors mytrade.com.ph'
        );
        next();
    };
};

app.prepare().then(() => {
    const server = express();

    server.get('/test-page', (req, res) => {
        return app.render(req, res, '/test-page', req.query);
    });

    server.get(
        '/content-a-with-authorizer',
        useHostAuthorizer(),
        useIFrameAncestors(),
        (req, res) => {
            return app.render(
                req,
                res,
                '/content-a-with-authorizer',
                req.query
            );
        }
    );

    server.get('/content-b-without-authorizer', (req, res) => {
        return app.render(req, res, '/content-b-without-authorizer', req.query);
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
