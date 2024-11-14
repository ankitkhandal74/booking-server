const express = require('express');
const app = express();
const Blogs = require('./routes/Blogs');  // Import Blogs route
const Search = require('./routes/search'); // Import Search route
const theatre = require('./routes/AddTheatre'); // Import AddTheatre route
const Theatres = require('./routes/getTheatre.js')
const movies = require('./routes/AddMovie.js')
const movieDetails = require('./routes/getMovieDetails.js')

const cors = require('cors');

app.use(cors());
app.use(express.json());

const port = 5000;

// Use routes for Blogs and Search under `/api`
app.use('/api', Blogs);
app.use('/api', Search);
app.use('/api', theatre);
app.use('/api', Theatres);
app.use('/api', movies);
app.use('/api', movieDetails);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
