const express = require('express');
const connectDB = require('./config/db'); // Database connection
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const Perfume = require('./models/Perfumes'); // Verify path is correct
const womenRoutes = require('./routes/women');
const menRoutes = require('./routes/men');
const generalRoutes = require('./routes/general');
const preductionRoutes = require('./routes/predictions');

const app = express();
const port = process.env.PORT || 5000;


// Connect to MongoDB
connectDB();

// Enable CORS for cross-origin requests
app.use(cors());

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static images
app.use(express.static(path.join(__dirname, 'dist'))); // Serve static frontend files



// Routes
app.use('/', authRoutes);
app.use('/auth', authRoutes);
app.use('/', userRoutes);


/**
 * General Women's men's and preduction  perfumes statistics endpoint
 */
app.use('/api/general', generalRoutes); 
app.use('/api/women', womenRoutes); 
app.use('/api/men', menRoutes); 
app.use('/api/predictions', preductionRoutes); 




// Serve React App - catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});



// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});