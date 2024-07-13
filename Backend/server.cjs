const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/trading', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const instrumentSchema = new mongoose.Schema({
    instrument: String,
    bid: Number,
    ask: Number,
    close:Number,
    time: String,
});

const Instrument = mongoose.model('Instrument', instrumentSchema);

const getRandomPrice = () => Math.floor(Math.random() * (500 - 100 + 1)) + 100;

app.get('/api/instruments', async (req, res) => {
    try {
        const instruments = await Instrument.find();
        res.json(instruments);
    } catch (error) {
        console.error('Error fetching instruments:', error);
        res.status(500).json({ error: 'Failed to fetch instruments' });
    }
});

const updatePrices = async () => {
    try {
        const instruments = await Instrument.find();
        instruments.forEach(async (instrument) => {
            const bid = getRandomPrice();
            let ask;
            do {
                ask = getRandomPrice();
            } while (ask === bid);
            const close = getRandomPrice();
            instrument.bid = bid;
            instrument.ask = ask;
            instrument.close=close;
            instrument.time = new Date().toLocaleTimeString();
            await Instrument.findByIdAndUpdate(instrument._id, {
                bid: bid,
                ask: ask,
                time: new Date().toLocaleTimeString(),
            });
        });
        console.log('Prices updated successfully.');
    } catch (error) {
        console.error('Error updating prices:', error);
    }
};

const initialInstruments = async () => {
    try {
        await Instrument.deleteMany({});
        const initialData = [
            { instrument: 'Apple', bid: getRandomPrice(), ask: getRandomPrice(), time: new Date().toLocaleTimeString() },
            { instrument: 'Samsung', bid: getRandomPrice(), ask: getRandomPrice(), time: new Date().toLocaleTimeString() },
            { instrument: 'Vivo', bid: getRandomPrice(), ask: getRandomPrice(), time: new Date().toLocaleTimeString() },
        ];
        await Instrument.insertMany(initialData);
    } catch (error) {
        console.error('Error initializing instruments:', error);
    }
};

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await initialInstruments();
    setInterval(updatePrices, 60000);
});


