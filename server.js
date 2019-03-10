const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const fs = require('fs');
const jwt = require('jsonwebtoken');
const util = require('./util');

const path = require('path');
var appRoot = path.resolve(__dirname);

app.get('/', (req, res) => {
    res.sendFile(`${appRoot}/html/index.html`);
})

const secret = 'secret';
const signOptions = {
    algorithm: 'HS256', // HMAC SHA256
    expiresIn: '1.5h'
};

// Login, give token.
app.post('/login', (req, res) => {
    let data = req.body;

    // Validate login
    if (!util.validateLogin(data.username, data.hashedPassword)) {
        res.end('failed');
        return;
    }
    // else.
    let payload = { username: data.username };
    let token = jwt.sign(payload, secret, signOptions);

    console.log(token)

    res.status(200).send({ token: token });
});

// Download given material.
app.post('/material', (req, res) => {
    let data = req.body;
    
    // Verify token.
    if (data.token && jwt.verify(data.token, secret, signOptions)) {
        res.status(200).end('verified');
    } else {
        res.end('verify failed');
    }
});

// Submit answers.
app.post('/submit', (req, res) => {
    let data = req.body;

    // Verify token.
    if (!data.token || !jwt.verify(data.token, secret, signOptions)) {
        res.end('verify failed');
        return;
    }

    if (data.username && data.answers) {
        let dataDir = `${appRoot}/StudentSolution`;
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        let filePath = `${dataDir}/${data.username}.dat`;
        console.log(filePath)
        fs.writeFile(filePath, data.answers, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log(`Submit successfully by user ${data.username}`);
        });
        res.end('haha');
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));