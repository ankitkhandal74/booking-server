const express = require('express');
const router = express.Router();
const dbConnect = require('../lib/db');
const Blog = require('../models/Blog');
const Theatre = require('../models/Theatre');

router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    await dbConnect(); // Connect to the database

    // Perform a case-insensitive search in title, content, or category
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});



router.get('/searchTheatres', async (req, res) => {
  const { query } = req.query; // 'query' is the search query

  try {
    await dbConnect(); // Connect to the database

    // Find theatres where the name, location, or movie name matches the search query (case-insensitive)
    const theatres = await Theatre.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Search within theatre name
        { location: { $regex: query, $options: 'i' } }, // Search within theatre location
        { city: { $regex: query, $options: 'i' } }, // Search within city
        { state: { $regex: query, $options: 'i' } }, // Search within state
        { movies: { $elemMatch: { name: { $regex: query, $options: 'i' } } } }, // Search within movie names
      ],
    });

    res.json(theatres); // Return the theatres that match the query
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while searching theatres and movies' });
  }
});

module.exports = router;
