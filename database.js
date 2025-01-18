const database = {name: 'KPISayonara', kills: '0'};
const fs = require('fs');


fs.readFile('C:/Code/Valorant api/data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    const jsonData = JSON.parse(data);
    console.log(jsonData.data[0].players[0]); // Your parsed JSON data
});