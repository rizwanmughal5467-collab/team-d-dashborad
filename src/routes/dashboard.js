const express = require('express');
const router = express.Router();

// Mock (Nakli) Data
const mockData = {
  summary: { totalOrders: 145, totalSales: 450000, totalPurchases: 200000, lowStockItems: 3, socialEngagement: 1250 },
  salesTrend: [
    { date: "Mon", sales: 20000 }, { date: "Tue", sales: 35000 }, { date: "Wed", sales: 15000 },
    { date: "Thu", sales: 50000 }, { date: "Fri", sales: 45000 }, { date: "Sat", sales: 60000 }, { date: "Sun", sales: 30000 }
  ],
  socialMetrics: { positiveSentiment: 80, neutralSentiment: 15, negativeSentiment: 5 }
};

// GET API (Bina Token ke, taake test karna asaan ho)
router.get('/', (req, res) => {
  res.json({ message: "Dashboard Data", data: mockData });
});

module.exports = router;