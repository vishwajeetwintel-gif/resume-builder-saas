const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const axios = require('axios');
const crypto = require('crypto');
const userStore = require('../services/userStore');

// =================== PAYPAL ===================
const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalToken() {
  const res = await axios.post(`${PAYPAL_BASE}/v1/oauth2/token`,
    'grant_type=client_credentials',
    { 
      auth: { username: process.env.PAYPAL_CLIENT_ID, password: process.env.PAYPAL_SECRET },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
  return res.data.access_token;
}

router.post('/paypal/create-order', authenticate, async (req, res) => {
  try {
    const { plan } = req.body;
    const amount = plan === 'premium' ? '9.99' : '19.99';
    const token = await getPayPalToken();
    const order = await axios.post(`${PAYPAL_BASE}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: 'USD', value: amount },
        description: `Resume Builder ${plan} Plan`
      }],
      application_context: {
        return_url: `${process.env.CLIENT_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
      }
    }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    res.json({ orderId: order.data.id, links: order.data.links });
  } catch (err) {
    console.error('PayPal create order error:', err.response?.data || err.message);
    res.status(500).json({ error: 'PayPal order creation failed' });
  }
});

router.post('/paypal/capture-order', authenticate, async (req, res) => {
  try {
    const { orderId, plan } = req.body;
    const token = await getPayPalToken();
    const capture = await axios.post(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {},
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    if (capture.data.status === 'COMPLETED') {
      await userStore.updatePlan(req.user.id, 'premium');
      res.json({ success: true, status: capture.data.status, plan: 'premium' });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('PayPal capture error:', err.response?.data || err.message);
    res.status(500).json({ error: 'PayPal capture failed' });
  }
});

// =================== PAYU ===================
router.post('/payu/initiate', authenticate, (req, res) => {
  try {
    const { plan, name, email, phone } = req.body;
    const amount = plan === 'premium' ? '9.99' : '19.99';
    const txnid = `TXN_${Date.now()}_${req.user.id}`;
    const productinfo = `Resume Builder ${plan} Plan`;
    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    
    // Hash: key|txnid|amount|productinfo|firstname|email|||||||||||salt
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${name}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    res.json({
      key, txnid, amount, productinfo,
      firstname: name, email, phone,
      hash,
      surl: `${process.env.CLIENT_URL}/payment/success`,
      furl: `${process.env.CLIENT_URL}/payment/cancel`,
      action: 'https://test.payu.in/_payment'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payu/verify', authenticate, async (req, res) => {
  try {
    const { txnid, status, hash, amount } = req.body;
    const salt = process.env.PAYU_SALT;
    const key = process.env.PAYU_KEY;
    const reverseHash = crypto.createHash('sha512')
      .update(`${salt}|${status}|||||||||||${req.body.email}|${req.body.firstname}|${req.body.productinfo}|${amount}|${txnid}|${key}`)
      .digest('hex');
    
    if (reverseHash === hash && status === 'success') {
      await userStore.updatePlan(req.user.id, 'premium');
      res.json({ success: true, plan: 'premium' });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/status', authenticate, async (req, res) => {
  const user = await userStore.findByEmail(req.user.email);
  res.json({ plan: user?.plan || 'free', userId: req.user.id });
});

module.exports = router;
