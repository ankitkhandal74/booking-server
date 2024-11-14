const mongoose = require('mongoose');

// Function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, ''); // Remove all non-word characters except hyphens
};

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  categories: { type: [String] },
  authors: { type: [String] },
  tags: { type: [String] },
  draft: { type: Boolean, default: false },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },  // Ensure slug is unique
});

// Pre-save hook to generate the slug if it doesn't already exist
BlogSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Export the model
module.exports = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
