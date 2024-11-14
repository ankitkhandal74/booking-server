const express = require('express');
const router = express.Router();
const dbConnect = require('../lib/db');
const Theatre = require('../models/Theatre'); 
const User = require('../models/User.js');

router.get('/getRole', async (req, res) => {
  const { email } = req.query;

  try {
    await dbConnect();  // Make sure the DB connection is established
    
    const user = await User.findOne({ email });

    if (!user) {
      // If no user is found, return an error
      return res.status(404).json({ error: "User not found" });
    }

    // Send the role of the user as the response
    return res.status(200).json({ role: user.role });

  } catch (error) {
    console.error("Error fetching user role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/getTheatres', async (req, res) => {
  try {
    // Establish database connection
    await dbConnect();
    console.log('Connected to MongoDB, fetching ...');

    const theatres = await Theatre.find();
    res.status(200).json(theatres);
  } catch (error) {
    console.error('Error fetching :', error);
    res.status(500).json({ error: 'Failed to fetch ' });
  }
});

router.get('/getTheatres/:theatreId', async (req, res) => {
  const { theatreId } = req.params;

  try {
    await dbConnect();
    const theatre = await Theatre.findById(theatreId); // Fetch the theatre by its ObjectId

    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    res.json(theatre); // Return the theatre details as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/updateTheatre/:theatreId', async (req, res) => {
  const { theatreId } = req.params;
  const { name, location, city, state, seatingCapacity } = req.body;

  try {
    await dbConnect();
    const updatedTheatre = await Theatre.findByIdAndUpdate(
      theatreId,
      {
        name,
        location,
        city,
        state,
        seatingCapacity
      },
      { new: true } // Return the updated document
    );

    if (!updatedTheatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    res.json(updatedTheatre); // Return the updated theatre details
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/deleteTheatre/:theatreId', async (req, res) => {
  const { theatreId } = req.params;

  try {
    await dbConnect();
    // Find and delete the theatre by its ID
    const deletedTheatre = await Theatre.findByIdAndDelete(theatreId);

    // If the theatre is not found
    if (!deletedTheatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    res.status(200).json({ message: 'Theatre deleted successfully', deletedTheatre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
