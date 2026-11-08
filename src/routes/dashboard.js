const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const orgId = 'org_123';

    // 1. Sales, Orders aur Net Profit
    const salesSnapshot = await db.collection('ledgerSales').where('orgId', '==', orgId).get();
    let totalOrders = 0;
    let totalSales = 0;
    let outstandingPayments = 0;
    let netProfit = 0;

    salesSnapshot.forEach(doc => {
      const sale = doc.data();
      totalOrders++; 
      
      if (sale.paymentStatus === 'paid') {
        totalSales += sale.totalAmount || 0;
        
        // Net Profit Calculate: (Selling Price - Cost Price) * Quantity
        if (sale.items && sale.items.length > 0) {
          sale.items.forEach(item => {
            const cost = item.costAtSale || 0;
            const selling = item.priceAtSale || 0;
            netProfit += (selling - cost) * item.qty;
          });
        }
      } else {
        outstandingPayments += sale.totalAmount || 0;
      }
    });

    // 2. Low Stock
    const productsSnapshot = await db.collection('ledgerProducts').where('orgId', '==', orgId).get();
    let lowStockItems = 0;
    productsSnapshot.forEach(doc => {
      if (doc.data().stock <= 10) lowStockItems++;
    });

    // 3. Social Engagement
    const draftsSnapshot = await db.collection('aiContentDrafts').where('orgId', '==', orgId).get();
    let socialEngagement = draftsSnapshot.size * 150;

    // 4. Mock Sales Trend
    const salesTrend = [
      { date: "Mon", sales: totalSales * 0.1 }, { date: "Tue", sales: totalSales * 0.15 },
      { date: "Wed", sales: totalSales * 0.1 }, { date: "Thu", sales: totalSales * 0.2 },
      { date: "Fri", sales: totalSales * 0.15 }, { date: "Sat", sales: totalSales * 0.2 },
      { date: "Sun", sales: totalSales * 0.1 }
    ];

    res.json({
      data: {
        summary: {
          totalOrders: totalOrders,
          totalSales: totalSales,
          lowStockItems: lowStockItems,
          socialEngagement: socialEngagement,
          netProfit: netProfit // <-- Naya Field
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