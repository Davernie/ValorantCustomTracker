//const database = {name: 'KPISayonara', kills: '0'};
const fs = require('fs');
let database = [];

fs.readFile('table.json', 'utf8', (err, data) => {

    database = JSON.parse(data);

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        const matchData = JSON.parse(data);


        for (let i = 0; i < 10; i++) {
            let found = false;
            for (let j = 0; j < database.length; j++) {
                if (database[j].name === matchData.data[0].players[i].name) {
                    database[j].score += matchData.data[0].players[i].stats.score;
                    database[j].kills += matchData.data[0].players[i].stats.kills;
                    database[j].deaths += matchData.data[0].players[i].stats.deaths;
                    database[j].assists += matchData.data[0].players[i].stats.assists;
                    j = database.length;
                    found = true;
                }
            }
            if(!found){
                database.push({
                    name: matchData.data[0].players[i].name,
                    score: matchData.data[0].players[i].stats.score,
                    kills: matchData.data[0].players[i].stats.kills,
                    deaths: matchData.data[0].players[i].stats.deaths,
                    assists: matchData.data[0].players[i].stats.assists });
            }

        }

        //console.log(database);

        // Write the updated database array back to the JSON file
        fs.writeFile('table.json', JSON.stringify(database, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Database has been updated');
            }
        });
    });
});