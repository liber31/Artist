require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.set('port', Number(process.env.port));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (_req, res) => res.render('index.html'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, 'node_modules')));


app.use((_req, res, _next) => res.status(404).render('404.html'));
app.use((_err, _req, res, _next) => res.status(500).render('500.html'));
app.listen(app.get('port'), () => console.log(`simple web server has started on port ${app.get('port')}`));