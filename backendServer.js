const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/', (req, res) => {

    fs.readFile('table.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).json(JSON.parse(data));
        }
    });
});

app.use((req, res) => {
    res.status(404).send('URL not found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});