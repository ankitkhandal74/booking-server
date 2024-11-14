// routes/AddTheatre.js
const express = require('express');
const router = express.Router();
const dbConnect = require('../lib/db');
const Theatre = require('../models/Theatre'); 

router.post('/addTheatre', async (req, res) => {
    const { name, location, city, state, seatingCapacity } = req.body;

    if (!name || !location || !city || !state || !seatingCapacity) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await dbConnect(); // Connect to the database

        // Create a new theatre
        const theatre = new Theatre({ name, location, city, state, seatingCapacity });
        await theatre.save();

        res.status(201).json(theatre);
    } catch (error) {
        console.error('Error adding theatre:', error);
        res.status(500).json({ error: 'Error adding theatre' });
    }
});

module.exports = router;
