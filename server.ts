import express from 'express';
import path from 'path';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// CORS & Preflight Handling for API routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// JSON and URL-encoded body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Helper to safely get and sanitize Razorpay keys from environment
function getRazorpayConfig(): { keyId: string; keySecret: string } {
  const keyId = (process.env.RAZORPAY_KEY_ID || 'rzp_live_TR5hdiKyXsnfNP')
    .trim()
    .replace(/^["']|["']$/g, '');
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '5uf4sfFi6sKsNBfhsGCZh6a7')
    .trim()
    .replace(/^["']|["']$/g, '');

  return { keyId, keySecret };
}

// Initialize Razorpay client with active environment keys
function getRazorpayClient(): { rzp: Razorpay; keyId: string; keySecret: string } {
  const { keyId, keySecret } = getRazorpayConfig();

  if (!keyId || !keySecret) {
    throw new Error('Razorpay API Key ID and Key Secret must be configured on the server.');
  }

  const rzp = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return { rzp, keyId, keySecret };
}

// Extract human-readable error descriptions from Razorpay errors
function extractRazorpayErrorMessage(error: any): string {
  if (!error) return 'Unknown payment error occurred.';
  if (typeof error === 'string') return error;
  if (error.error && typeof error.error === 'object') {
    if (error.error.description) return String(error.error.description);
    if (error.error.message) return String(error.error.message);
  }
  if (error.description) return String(error.description);
  if (error.message) return String(error.message);
  return 'Payment order creation failed. Please check your credentials and try again.';
}

// 1. Health check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Restyle Text API',
    timestamp: new Date().toISOString(),
  });
});

// 2. Public Payment Config API (Returns public key_id only)
app.get('/api/payment/config', (req, res) => {
  const { keyId } = getRazorpayConfig();
  res.json({
    success: true,
    keyId,
    currency: 'INR',
    merchantName: 'Restyle Text',
  });
});

// 3. Create Razorpay Order API
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

    // Convert INR to Paise (e.g. ₹15 = 1500 paise, ₹50 = 5000 paise, ₹500 = 50000 paise)
    const amountInPaise = Math.round(parsedAmount * 100);

    const { rzp, keyId } = getRazorpayClient();

    // Generate short receipt string (max 40 chars for Razorpay)
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        product: 'Restyle Text Support',
        developer: 'GW IMRAN',
      },
    };

    console.log(`[Payment Order] Creating Razorpay order for ₹${parsedAmount} (${amountInPaise} paise)...`);
    const order = await rzp.orders.create(options);
    console.log(`[Payment Order] Successfully created order ${order.id} for amount ₹${parsedAmount}`);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || 'INR',
      keyId,
    });
  } catch (error: any) {
    const errorMessage = extractRazorpayErrorMessage(error);
    console.error('[Payment Order Error]:', {
      message: errorMessage,
      statusCode: error?.statusCode || error?.status,
      code: error?.error?.code,
    });

    return res.status(error?.statusCode || 500).json({
      success: false,
      error: errorMessage || 'Failed to create payment order. Please try again.',
    });
  }
});

// 4. Verify Razorpay Payment Signature API
app.post('/api/payment/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn('[Payment Verification] Missing required signature parameters in request body');
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Missing payment signature verification parameters.',
      });
    }

    const { keySecret } = getRazorpayConfig();

    if (!keySecret) {
      console.error('[Payment Verification] RAZORPAY_KEY_SECRET is not configured on server');
      return res.status(500).json({
        success: false,
        verified: false,
        error: 'Server payment configuration is incomplete.',
      });
    }

    // Generate expected HMAC SHA256 signature using razorpay_order_id + "|" + razorpay_payment_id
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const actualBuf = Buffer.from(String(razorpay_signature), 'utf8');

    const isAuthentic =
      expectedBuf.length === actualBuf.length &&
      crypto.timingSafeEqual(expectedBuf, actualBuf);

    if (isAuthentic) {
      console.log(`[Payment Verification] Verified authentic payment: ${razorpay_payment_id} for order: ${razorpay_order_id}`);
      return res.status(200).json({
        success: true,
        verified: true,
        message: 'Payment signature verified successfully.',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.error(`[Payment Verification] Signature mismatch for payment: ${razorpay_payment_id}`);
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }
  } catch (error: any) {
    console.error('[Payment Verification Error]:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: error?.message || 'Payment verification failed.',
    });
  }
});

// Catch-all for unhandled /api routes to guarantee JSON response
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route ${req.method} ${req.path} not found.`,
  });
});

// Global Error Handler for API
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Uncaught Error Handler]:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    error: err?.message || 'An internal server error occurred.',
  });
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
