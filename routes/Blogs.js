const express = require('express');
const router = express.Router();
const dbConnect = require('../lib/db');
const Blog = require('../models/Blog'); 

// GET route to fetch all blogs
router.get('/getBlogs', async (req, res) => {
  try {
    // Establish database connection
    await dbConnect();
    console.log('Connected to MongoDB, fetching blogs...');

    // Fetch all blogs
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

module.exports = router;
