const mongoose = require('mongoose');

// Movie Schema
const MovieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    showTiming: { type: String, required: true },
    tecketPrice: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
});

// Theatre Schema
const TheatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    movies: [MovieSchema] // Store movies as an array of MovieSchema
});

module.exports = mongoose.model('Theatre', TheatreSchema);
