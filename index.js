require('dotenv').config();

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
// create simple web server
// to use express module.
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.set('port', Number(process.env.port));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.engine('html', require('ejs').renderFile);

app.get('/', function (_req, res) {
    res.render('index.html');
});

app.use(function (_req, res, _next) {
    res.status(404).render('404.html');
});

app.use(function (err, _req, res, _next) {
    console.error(err.stack);
    res.status(500).render('500.html');
});

app.listen(app.get('port'), function () {
    console.log(`Server started on port ${Number(process.env.port)}`);
});
