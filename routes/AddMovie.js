const express = require('express');
const router = express.Router();
const Theatre = require('../models/Theatre'); // Adjust the path as needed
const dbConnect = require('../lib/db');

// Route to add a movie to a specific theatre by ID
router.post('/addMovie/:id', async (req, res) => {
    const { id } = req.params; // Extract theatreId from the URL
    const { name, showTiming, tecketPrice, availableSeats } = req.body; // Movie details from the request body

     // Check if the required fields are provided
     if (!name || !showTiming || !tecketPrice || !availableSeats) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        await dbConnect(); // Connect to the database


        // Find the theatre by ID and add the movie to the movies array
        const updatedTheatre = await Theatre.findByIdAndUpdate(
            id,
            {
                $push: {
                    movies: {
                        name,
                        showTiming,
                        tecketPrice,
                        availableSeats: parseInt(availableSeats, 10) // Ensure availableSeats is a number
                    }
                }
            },
            { new: true } // Return the updated document
        );

        // Check if the theatre was found
        if (!updatedTheatre) {
            return res.status(404).json({ success: false, message: 'Theatre not found.' });
        }

        // Return success response with the updated theatre data
        res.status(200).json({
            success: true,
            message: 'Movie added successfully.',
            theatre: updatedTheatre
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Error adding movie:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message
        });
    }
});

module.exports = router;
