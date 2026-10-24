const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Yeh line sab se zaroori hai
const dashboardRoutes = require('./routes/dashboard'); 

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Team D Server is running!' });
});

// Route connect kiya
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`\n✅ Team D Server running on http://localhost:${PORT}`);
});