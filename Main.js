const apiKey = 'HDEV-569dd88f-0e03-4747-892d-2e8f682b670e';
const url = 'https://beta.api.henrikdev.xyz/valorant/v4/matches/eu/pc/TSclairo/erin';
//const url = 'https://beta.api.henrikdev.xyz/valorant/v4/matches/eu/pc/KPISayonara/gud?mode=custom';
const fs = require('fs');

const headers = {
    Authorization: apiKey,
};

async function fetchData() {
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        //console.log(JSON.stringify(data, null, 2)); // This will display the JSON data in a readable format on the console
        fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('JSON data has been saved to data.json');
            }
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchData();