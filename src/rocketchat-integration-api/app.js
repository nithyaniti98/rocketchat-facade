const express = require('express');
const bodyParser = require('body-parser');

const Routes = require('./routes');
const { openTaskNotification } = require("./controller")

const app = express();
const port = 5000;

app.set('port', port)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/openTask', openTaskNotification)

app.listen(port, () => {
    console.log(`App running on port ${port}`)}
);

module.exports = app;