const { parse } = require('url');
const next = require('next');
const express = require('express');
const path = require('path');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'data2011.online';
const app = next({ dev, hostname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();


  const allowedOrigins = ['https://data2011.online', 'https://www.data2011.online'];
  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  };

  server.use(cors(corsOptions));

  server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  server.all('*', async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/a') {
        await app.render(req, res, '/a', query);
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server
    .listen(() => {
      console.log(`> Ready on http://${hostname}`);
    })
    .on('error', (err) => {
      console.error(err);
      process.exit(1);
    });
});
