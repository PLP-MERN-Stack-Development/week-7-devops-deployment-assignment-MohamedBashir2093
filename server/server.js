const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const morgan = require('morgan');


// Load env variables
dotenv.config();

// Create app
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));

// Routes
app.get('/', (req, res) => {
  res.send('Neighborhood Service Directory API is running...');
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

// Error handler
app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


// Connect to DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});


