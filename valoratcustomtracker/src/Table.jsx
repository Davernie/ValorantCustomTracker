import React, { useEffect, useState } from 'react';
import './Table.css';

const Table = () => {
    const [data, setData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    useEffect(() => {
        fetch('table.json')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const sortedData = React.useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="table-container">
            <h1>Player Stats</h1>
            <table>
                <thead>
                <tr>
                    <th onClick={() => requestSort('name')}>Name</th>
                    <th onClick={() => requestSort('score')}>Score</th>
                    <th onClick={() => requestSort('kills')}>Kills</th>
                    <th onClick={() => requestSort('deaths')}>Deaths</th>
                    <th onClick={() => requestSort('assists')}>Assists</th>
                </tr>
                </thead>
                <tbody>
                {sortedData.map((player, index) => (
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