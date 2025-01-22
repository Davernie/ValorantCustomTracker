import React, { useEffect, useState } from 'react';

const Table = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('table.json')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Player Stats</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Kills</th>
                    <th>Deaths</th>
                    <th>Assists</th>
                </tr>
                </thead>
                <tbody>
                {data.map((player, index) => (
                    <tr key={index}>
                        <td>{player.name}</td>
                        <td>{player.score}</td>
                        <td>{player.kills}</td>
                        <td>{player.deaths}</td>
                        <td>{player.assists}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;