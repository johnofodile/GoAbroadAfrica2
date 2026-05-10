const app      = require('./app');
const connectDB = require('./src/config/db');
require('dotenv').config();
 
const PORT = process.env.PORT || 5000;
 
// Connect to database then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[SERVER] Running on http://localhost:${PORT}`);
    console.log(`[SERVER] Environment: ${process.env.NODE_ENV}`);
  });
});
 
