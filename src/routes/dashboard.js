const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Firebase connect kiya

router.get('/', async (req, res) => {
  try {
    const orgId = 'org_123'; // Abhi ke liye test orgId (Baad mein token se aayega)

    // 1. Total Orders aur Total Sales nikaalo (Team B ke data se)
    const salesSnapshot = await db.collection('ledgerSales').where('orgId', '==', orgId).get();
    let totalOrders = 0;
    let totalSales = 0;
    salesSnapshot.forEach(doc => {
      totalOrders++;
      totalSales += doc.data().totalAmount || 0;
    });

    // 2. Low Stock Items nikaalo (Team B ke products se)
    const productsSnapshot = await db.collection('ledgerProducts').where('orgId', '==', orgId).get();
    let lowStockItems = 0;
    productsSnapshot.forEach(doc => {
      if (doc.data().stock <= 10) lowStockItems++;
    });

    // 3. Social Engagement nikaalo (Team C ke drafts se - nakli hisaab)
    const draftsSnapshot = await db.collection('aiContentDrafts').where('orgId', '==', orgId).get();
    let socialEngagement = draftsSnapshot.size * 150; // Har draft par 150 engagement

    // 4. Mock Charts (Inko baad mein asli data se update kar sakte hain)
    const salesTrend = [
      { date: "Mon", sales: totalSales * 0.1 },
      { date: "Tue", sales: totalSales * 0.15 },
      { date: "Wed", sales: totalSales * 0.1 },
      { date: "Thu", sales: totalSales * 0.2 },
      { date: "Fri", sales: totalSales * 0.15 },
      { date: "Sat", sales: totalSales * 0.2 },
      { date: "Sun", sales: totalSales * 0.1 }
    ];

    // Response bhejo
    res.json({
      data: {
        summary: {
          totalOrders: totalOrders,
          totalSales: totalSales,
          lowStockItems: lowStockItems,
          socialEngagement: socialEngagement
        },
        salesTrend: salesTrend,
        socialMetrics: { positiveSentiment: 80, neutralSentiment: 15, negativeSentiment: 5 }
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;