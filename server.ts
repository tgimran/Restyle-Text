import express from 'express';
import path from 'path';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Razorpay credentials (server-side only)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TR5hdiKyXsnfNP';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '5uf4sfFi6sKsNBfhsGCZh6a7';

// Initialize Razorpay instance lazily / safely
let razorpayInstance: Razorpay | null = null;
function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Public Payment Config (Returns public key_id only)
app.get('/api/payment/config', (req, res) => {
  res.json({
    keyId: RAZORPAY_KEY_ID,
    currency: 'INR',
    merchantName: 'Restyle Text',
  });
});

// 3. Create Razorpay Order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 1 || parsedAmount > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount. Support amount must be between ₹1 and ₹50,000.',
      });
    }

    // Amount in Paise (e.g. ₹15 = 1500 paise)
    const amountInPaise = Math.round(parsedAmount * 100);

    const rzp = getRazorpay();
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        product: 'Restyle Text Support',
        developer: 'GW IMRAN',
      },
    };

    const order = await rzp.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to create payment order. Please try again.',
    });
  }
});

// 4. Verify Razorpay Payment Signature
app.post('/api/payment/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Missing payment signature verification parameters.',
      });
    }

    // Generate expected HMAC SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const actualBuf = Buffer.from(String(razorpay_signature), 'utf8');

    const isAuthentic =
      expectedBuf.length === actualBuf.length &&
      crypto.timingSafeEqual(expectedBuf, actualBuf);

    if (isAuthentic) {
      return res.status(200).json({
        success: true,
        verified: true,
        message: 'Payment signature verified successfully.',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: error?.message || 'Payment verification failed.',
    });
  }
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Restyle Text Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
