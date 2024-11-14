const express = require('express');
const router = express.Router();
const dbConnect = require('../lib/db');
const Theatre = require('../models/Theatre'); 

router.get('/getMovieDetails/:theatreId/:movieId', async (req, res) => {
    const { theatreId, movieId } = req.params;

    try {
        await dbConnect();
        // Find the theatre by its ID
        const theatre = await Theatre.findById(theatreId);

        if (!theatre) {
            return res.status(404).json({ error: 'Theatre not found' });
        }

        // Find the movie by its ID within the theatre's movies array
        const movie = theatre.movies.id(movieId); // `id()` is a Mongoose method that searches by _id

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Return the movie details
        res.json(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

router.put('/updateMovieDetails/:theatreId/:movieId', async (req, res) => {
    const { theatreId, movieId } = req.params;
    const { name, showTiming, category, availableSeats } = req.body;

    try {
        await dbConnect();
        // Find the theatre by its ID
        const theatre = await Theatre.findById(theatreId);

        if (!theatre) {
            return res.status(404).json({ error: 'Theatre not found' });
        }

        // Find the movie by its ID within the theatre's movies array
        const movie = theatre.movies.id(movieId);

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Update the movie details with the new data
        if (name) movie.name = name;
        if (showTiming) movie.showTiming = showTiming;
        if (category) movie.category = category;
        if (availableSeats !== undefined) movie.availableSeats = availableSeats;

        // Save the updated theatre document
        await theatre.save();

        // Return the updated movie details
        res.json(movie);
    } catch (error) {
        console.error('Error updating movie details:', error);
        res.status(500).json({ error: 'Failed to update movie details' });
    }
});

router.put('/updateavailableSeats/:theatreId/:movieId', async (req, res) => {
    const { theatreId, movieId } = req.params;
    let { availableSeats } = req.body; // Destructure availableSeats from req.body

    try {
        await dbConnect();
        
        // Find the theatre by its ID
        const theatre = await Theatre.findById(theatreId);
        if (!theatre) {
            return res.status(404).json({ error: 'Theatre not found' });
        }

        // Find the movie by its ID within the theatre's movies array
        const movie = theatre.movies.id(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Update the movie's availableSeats if availableSeats is provided in the request
        if (availableSeats !== undefined) {
            movie.availableSeats = availableSeats;
        } else {
            return res.status(400).json({ error: 'Available seats value is missing' });
        }

        // Save the updated theatre document
        await theatre.save();

        // Return the updated movie details
        res.json({ success: true, movie });
    } catch (error) {
        console.error('Error updating movie details:', error);
        res.status(500).json({ error: 'Failed to update movie details' });
    }
});


router.delete('/api/deleteMovie/:theatreId/:movieId', async (req, res) => {
    try {
        const { theatreId, movieId } = req.params;

        // Ensure both theatreId and movieId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(theatreId) || !mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ error: 'Invalid ObjectId' });
        }

        // Delete the movie from the theatre's movies array
        const theatre = await Theatre.findById(theatreId);
        if (!theatre) {
            return res.status(404).json({ error: 'Theatre not found' });
        }

        const movieIndex = theatre.movies.findIndex(movie => movie._id.toString() === movieId);
        if (movieIndex === -1) {
            return res.status(404).json({ error: 'Movie not found in this theatre' });
        }

        theatre.movies.splice(movieIndex, 1); // Remove the movie from the array
        await theatre.save();

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Server error' });
    }
});




module.exports = router;
