const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');
const { createPayment, updateSubscription } = require('../services/db');

const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment';

const generateHash = (hashStr) => {
  return crypto.createHash('sha512').update(hashStr).digest('hex');
};

const PLANS = {
  premium_monthly: { amount: '749.00', description: 'Resume Builder Premium Monthly', months: 1 },
  premium_yearly: { amount: '4499.00', description: 'Resume Builder Premium Yearly', months: 12 }
};

// Initiate PayU payment
router.post('/initiate', authMiddleware, (req, res) => {
  try {
    const { planId, name, email, phone } = req.body;
    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const productInfo = plan.description;
    const amount = plan.amount;
    const firstName = name || 'User';
    const surl = `${req.protocol}://${req.get('host')}/api/payu/success`;
    const furl = `${req.protocol}://${req.get('host')}/api/payu/failure`;

    // Hash: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
    const hashStr = `${PAYU_KEY}|${txnId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${PAYU_SALT}`;
    const hash = generateHash(hashStr);

    createPayment({
      userId: req.user.id,
      orderId: txnId,
      planId,
      amount,
      currency: 'INR',
      status: 'pending',
      provider: 'payu'
    });

    res.json({
      key: PAYU_KEY,
      txnid: txnId,
      amount,
      productinfo: productInfo,
      firstname: firstName,
      email,
      phone: phone || '',
      surl,
      furl,
      hash,
      payuBaseUrl: PAYU_BASE_URL
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PayU success callback
router.post('/success', (req, res) => {
  try {
    const { txnid, status, mihpayid, hash } = req.body;
    // Verify hash
    const reverseHash = generateHash(
      `${PAYU_SALT}|${status}|||||||||||${req.body.email}|${req.body.firstname}|${req.body.productinfo}|${req.body.amount}|${txnid}|${PAYU_KEY}`
    );
    if (reverseHash !== hash) {
      return res.redirect(`${process.env.CLIENT_URL}/payment/failed?reason=hash_mismatch`);
    }
    if (status === 'success') {
      // Find payment and update subscription
      const { findPaymentByOrderId } = require('../services/db');
      const payment = findPaymentByOrderId(txnid);
      if (payment) {
        const plan = PLANS[payment.planId];
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (plan?.months || 1));
        updateSubscription(payment.userId, 'premium', expiresAt);
      }
      res.redirect(`${process.env.CLIENT_URL}/payment/success?txnid=${txnid}`);
    } else {
      res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
    }
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
  }
});

// PayU failure callback
router.post('/failure', (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
});

module.exports = router;
