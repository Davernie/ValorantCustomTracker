import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';  // Import necessary modules
import fetch from 'node-fetch';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

// Initialize the S3 client
const s3 = new S3Client({ region: 'eu-west-1' }); // Replace with your S3 region

const tableBucket = 'valoranttracker'; // Replace with your S3 bucket name
const tableKey = 'table.json'; // Replace with the S3 key for the table.json file

const apiKey = 'HDEV-569dd88f-0e03-4747-892d-2e8f682b670e';
const url = 'https://beta.api.henrikdev.xyz/valorant/v4/matches/eu/pc/TSclairo/erin';

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

        // Fetch table.json from S3
        const getObjectCommand = new GetObjectCommand({
            Bucket: tableBucket,
            Key: tableKey,
        });
        const tableData = await s3.send(getObjectCommand);

        // Convert the S3 object stream into JSON
        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('error', reject);
                stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
            });

        const tableJson = JSON.parse(await streamToString(tableData.Body));

        // Process match data and update table.json
        for (let i = 0; i < 10; i++) {
            let found = false;
            for (let j = 0; j < tableJson.length; j++) {
                if (tableJson[j].name === data.data[0].players[i].name) {
                    tableJson[j].score = Math.round(
                        (tableJson[j].score * tableJson[j].matches + data.data[0].players[i].stats.score / (data.data[0].teams[0].rounds.won + data.data[0].teams[0].rounds.lost)) /
                        (tableJson[j].matches + 1)
                    );
                    tableJson[j].kills += data.data[0].players[i].stats.kills;
                    tableJson[j].deaths += data.data[0].players[i].stats.deaths;
                    tableJson[j].assists += data.data[0].players[i].stats.assists;
                    tableJson[j].matches++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                tableJson.push({
                    name: data.data[0].players[i].name,
                    score: Math.round(
                        data.data[0].players[i].stats.score / (data.data[0].teams[0].rounds.won + data.data[0].teams[0].rounds.lost)
                    ),
                    kills: data.data[0].players[i].stats.kills,
                    deaths: data.data[0].players[i].stats.deaths,
                    assists: data.data[0].players[i].stats.assists,
                    matches: 1,
                });
            }
        }

        // Upload the updated table.json back to S3
        const putObjectCommand = new PutObjectCommand({
            Bucket: tableBucket,
            Key: tableKey,
            Body: JSON.stringify(tableJson, null, 2),
            ContentType: 'application/json',
        });
        await s3.send(putObjectCommand);

        console.log('table.json has been updated in S3');
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchData();
