const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const fs = require('fs');

const path = require('path');
var appRoot = path.resolve(__dirname);

app.get('/', (req, res) => {
    res.sendFile(`${appRoot}/html/index.html`);
})

app.post('/submit', (req, res) => {
    // console.dir(req.body);
    let data = req.body;
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