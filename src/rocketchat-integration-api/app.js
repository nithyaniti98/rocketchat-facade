const express = require('express');
const bodyParser = require('body-parser');

const { login, sendDirectMessage, subscribeToMessages, disconnect } = require("./controller")

const app = express();
const port = 5000;

app.set('port', port)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', login)
app.post('/sendDirectMessage', sendDirectMessage)
app.post('/subscribeToMessages', subscribeToMessages)
app.post('/disconnect', disconnect)

app.listen(port, () => {
    console.log(`App running on port ${port}`)}
);

module.exports = app;