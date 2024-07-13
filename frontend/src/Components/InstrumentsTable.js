import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const InstrumentTable = () => {
    const [instruments, setInstruments] = useState([]);
    const [previousInstruments, setPreviousInstruments] = useState([]);
    const [graphData, setGraphData] = useState([]);

    const fetchInstruments = async () => {
        console.log('Fetching instruments...');
        try {
            const response = await axios.get('http://localhost:7000/api/instruments');
            console.log('Instruments fetched:', response.data);

            if (instruments.length > 0) {
                setPreviousInstruments(instruments);
            }

            setInstruments(response.data);

           
            const processedData = response.data.map(instrument => ({
                instrument: instrument.instrument,
                time: instrument.time,
                close: (instrument.bid + instrument.ask) / 2 
            }));

            setGraphData(prevGraphData => [...prevGraphData, ...processedData]);
           


        } catch (error) {
            console.error('Error fetching instruments:', error);
        }
    };

    useEffect(() => {
        fetchInstruments(); 
        const interval = setInterval(fetchInstruments, 60000); 
        return () => clearInterval(interval); 
    }, []);

    const getClassName = (current, previous, isBid) => {
        if (previous === undefined) return '';
        if (isBid) {
            if (current > previous) {
                return 'bid-increase';
            } else if (current < previous) {
                return 'bid-decrease';
            }
        } else {
            if (current > previous) {
                return 'ask-increase';
            } else if (current < previous) {
                return 'ask-decrease';
            }
        }
        return '';
    };

    return (
        <div>
            {/* <h1>Instruments Table</h1> */}
            <table>
                <thead>
                    <tr>
                        <th>Instrument</th>
                        <th>Bid</th>
                        <th>Ask</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {instruments.map((instrument, index) => {
                        const previousInstrument = previousInstruments.find(prev => prev.instrument === instrument.instrument) || {};
                        return (
                            <tr key={index}>
                                <td>{instrument.instrument}</td>
                                <td className={getClassName(instrument.bid, previousInstrument.bid, true)}>
                                    {instrument.bid}
                                </td>
                                <td className={getClassName(instrument.ask, previousInstrument.ask, false)}>
                                    {instrument.ask}
                                </td>
                                <td>{instrument.time}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="chart-container">
                <LineChart width={600} height={300} data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Array.from(new Set(graphData.map(data => data.instrument))).map((instrumentName, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey="close"
                            data={graphData.filter(data => data.instrument === instrumentName)}
                            name={instrumentName}
                            stroke={`hsl(${index * 50}, 70%, 50%)`} // Different color for each line
                            dot={false}
                            isAnimationActive={false}
                            className="line"
                        />
                    ))}
                </LineChart>
            </div>
        </div>
    );
};

export default InstrumentTable;


