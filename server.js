const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// 
const fs = require('fs');
const jwt = require('jsonwebtoken');
const util = require('./util');

/* Exam Info */
const time = 80; // minutes
const questionNumber = 10;

// Paths
const path = require('path');
var appRoot = path.resolve(__dirname);
const materialDir = `${appRoot}/ToStudent`;
const materialFilename = 'script.sql';

// Serve css, js
app.use(express.static(appRoot + '/html')); // dut them

// JWT
const secret = 'secret';
const signOptions = {
    // algorithm: 'HS256', // HMAC SHA256
    algorithm: 'RS256',
    expiresIn: `${time}m`
};

const keyPair = util.getRsaKeyPair(); // RSA privateKey & publicKey

/* ======================================================== */

// Default root.
app.get('/', (req, res) => {
    res.sendFile(`${appRoot}/html/index.html`);
});

// Login, give token.
app.post('/login', (req, res) => {
    let data = req.body;

    // Validate login
    if (!util.validateLogin(data.username, data.hashedPassword)) {
        res.end('Login failed');
        return;
    }
    // else.
    let payload = { username: data.username };
    let token = jwt.sign(payload, keyPair.private, signOptions);
    let expireTime = jwt.decode(token).exp;

    let responseData = {
        exp: expireTime,
        questionNumber: questionNumber,
        token: token
    };
    res.status(200).send(responseData);
});

// Get question pictures.
app.post('/questions', (req, res) => {
    let data = req.body;

    if (!data.token || !data.examCode || !data.paperNo
        || !jwt.verify(data.token, keyPair.public, signOptions)) {
        res.end('Not enough info');
        return;
    }

    // var exam;
    // if (data.paperNo <= 0 || data.paperNo > exam.papers) {
    //     res.end('Invalid paper no');
    //     return;
    // }

    let filePath = `${materialDir}/${data.paperNo}.zip`;
    res.status(200).download(filePath, `${data.paperNo}.zip`, err => {
        res.status(500).end('Cannot get questions');
    });
    console.log('downloaded questions');
});

// Download given material.
app.post('/material', (req, res) => {
    let data = req.body;

    // Verify token.
    if (data.token && jwt.verify(data.token, keyPair.public, signOptions)) {
        // res.status(200).end('Verified');
        let filePath = `${materialDir}/${materialFilename}`;
        res.status(200).download(filePath, data.filename);
    } else {
        res.end('Verification failed');
    }
});

// Submit answers.
app.post('/submit', (req, res) => {
    let data = req.body;

    // Verify token.
    if (!data.token || !jwt.verify(data.token, keyPair.public, signOptions) || !data.examCode) {
        res.end('Verification failed');
        return;
    }

    if (data.username && data.answers) {
        let dataDir = `${appRoot}/StudentSolution/${data.examCode}`;
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
            res.status(200).end('Submitted successfully.');
        });
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));