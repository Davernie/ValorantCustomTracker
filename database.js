const fs = require('fs');
let database = [];

const filePath = 'C:/Code/ValorantCustomTracker/valoratcustomtracker/public/table.json';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        // Handle file not existing or other read errors
        if (err.code === 'ENOENT') {
            console.log('table.json does not exist. Creating a new empty file.');
            // Create an empty table.json
            fs.writeFile(filePath, JSON.stringify([], null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Error creating table.json:', writeErr);
                } else {
                    console.log('Created new empty table.json');
                }
            });
        } else {
            console.error('Error reading file:', err);
        }
    } else {
        database = JSON.parse(data);
    }

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
            if (!found) {
                database.push({
                    name: matchData.data[0].players[i].name,
                    score: matchData.data[0].players[i].stats.score,
                    kills: matchData.data[0].players[i].stats.kills,
                    deaths: matchData.data[0].players[i].stats.deaths,
                    assists: matchData.data[0].players[i].stats.assists
                });
            }
        }

        // Write the updated database array back to the JSON file
        fs.writeFile(filePath, JSON.stringify(database, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Database has been updated');
            }
        });
    });
});