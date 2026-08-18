import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Wallet,
  Heart,
  QrCode,
  Copy,
  Check,
  Smartphone,
  Info,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'cancelled' | 'failed';
type PaymentMethod = 'razorpay' | 'upi_qr';

const PRESET_AMOUNTS = [15, 50, 500];
const DEFAULT_UPI_ID = 'KulsumKhatun933@ybl';
const RAZORPAY_ME_URL = 'https://razorpay.me/@kulsumkhatun1';

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDomainRestrictionError, setIsDomainRestrictionError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<PaymentMethod>('razorpay');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<{ paymentId?: string; amount?: number; method?: string }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setIsDomainRestrictionError(false);
      setSelectedAmount(50);
      setCustomAmount('');
      setIsCustom(false);
      setCopiedUpi(false);
      setCopiedDomain(false);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && status !== 'processing') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, status]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Trigger celebration confetti on payment success
  const triggerSuccessCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981', '#6366f1'],
      });
    } catch {
      // Confetti fallback
    }
  };

  // Preset Selection
  const handlePresetSelect = (amt: number) => {
    if (status === 'processing') return;
    setSelectedAmount(amt);
    setIsCustom(false);
    setCustomAmount('');
  };

  // Custom Amount Input Handler
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'processing') return;
    const val = e.target.value;
    setCustomAmount(val);
    setIsCustom(true);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedAmount(parsed);
    }
  };

  const currentAmountDisplay = isCustom
    ? parseFloat(customAmount) || 0
    : selectedAmount;

  // Copy UPI ID helper
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(DEFAULT_UPI_ID).then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    });
  };

  // Copy Domain helper
  const handleCopyDomain = () => {
    const domain = typeof window !== 'undefined' ? window.location.origin : '';
    navigator.clipboard.writeText(domain).then(() => {
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    });
  };

  // Ensure Razorpay Checkout script is loaded
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initiate Razorpay Checkout Flow
  const handleContinueToPay = async () => {
    const finalAmount = isCustom ? parseFloat(customAmount) : selectedAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount < 1 || finalAmount > 50000) {
      setErrorMessage('Please enter a valid amount between ₹1 and ₹50,000');
      return;
    }

    setErrorMessage('');
    setIsDomainRestrictionError(false);
    setStatus('processing');

    try {
      // 1. Ensure Razorpay client script is present
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay SDK could not be loaded. Please check your internet connection.');
      }

      // 2. Request backend order creation
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });

      let orderData: any = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        orderData = await res.json();
      } else {
        const rawText = await res.text();
        throw new Error(
          res.status === 502 || res.status === 503 || rawText.includes('starting')
            ? 'Server is warming up. Please try again in 5 seconds.'
            : 'Unable to reach payment service. Please try again.'
        );
      }

      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      // 3. Configure official Razorpay Checkout options
      const logoUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/src/assets/images/restyle_text_logo_1786683673519.jpg`
        : '';

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Restyle Text',
        description: `Support Restyle Text (₹${finalAmount})`,
        image: logoUrl,
        order_id: orderData.orderId,
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify payment signature on backend
            const verifyRes = await fetch('/api/payment/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });

            let verifyData: any = {};
            const verifyContentType = verifyRes.headers.get('content-type') || '';
            if (verifyContentType.includes('application/json')) {
              verifyData = await verifyRes.json();
            } else {
              throw new Error('Payment verification server returned unexpected response.');
            }

            if (verifyRes.ok && verifyData.verified) {
              setPaymentDetails({
                paymentId: response.razorpay_payment_id,
                amount: finalAmount,
                method: 'Razorpay Gateway',
              });
              setStatus('success');
              triggerSuccessCelebration();
            } else {
              setStatus('failed');
              setErrorMessage(verifyData.error || 'Signature verification failed.');
            }
          } catch (err: any) {
            setStatus('failed');
            setErrorMessage(err?.message || 'Payment verification encountered an issue.');
          }
        },
        modal: {
          ondismiss: () => {
            setStatus((prev) => (prev === 'processing' ? 'cancelled' : prev));
          },
          escape: true,
          backdropclose: false,
        },
        theme: {
          color: '#e11d48',
        },
      };

      // 4. Open Razorpay Checkout Dialog
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('Razorpay payment.failed event:', response);
        setStatus('failed');
        const errObj = response?.error || {};
        const description = errObj.description || '';
        const reason = errObj.reason || '';

        // Check specifically for Razorpay registered domain restriction
        if (
          description.toLowerCase().includes('website does not match') ||
          reason === 'payment_risk_check_failed' ||
          description.toLowerCase().includes('registered website')
        ) {
          setIsDomainRestrictionError(true);
          setErrorMessage(
            'Razorpay Live Mode requires registering this website domain in your Razorpay Dashboard (Settings > Website and App Settings), or you can use Direct QR/UPI below.'
          );
        } else {
          setErrorMessage(
            description ||
            reason ||
            errObj.message ||
            'Payment was declined or cancelled. Please try again or use direct QR/UPI.'
          );
        }
      });

      rzp.open();
    } catch (err: any) {
      console.error('Payment Error:', err);
      setStatus('failed');
      setErrorMessage(err?.message || 'Unable to connect to payment gateway. Please try again.');
    }
  };

  // Direct UPI App Link / QR generator URL
  const effectiveAmount = currentAmountDisplay > 0 ? currentAmountDisplay : 50;
  const upiDeepLink = `upi://pay?pa=${DEFAULT_UPI_ID}&pn=Restyle%20Text&am=${effectiveAmount}&cu=INR&tn=Support%20Restyle%20Text`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    upiDeepLink
  )}`;

  const handleManualUpiSuccess = () => {
    setPaymentDetails({
      amount: effectiveAmount,
      method: 'Direct QR/UPI',
    });
    setStatus('success');
    triggerSuccessCelebration();
  };

  const handleTryAgain = () => {
    setStatus('idle');
    setErrorMessage('');
    setIsDomainRestrictionError(false);
  };

  if (!isOpen) return null;

  return (
    <div
      id="support-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (status !== 'processing') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
    >
      {/* Mini iOS-Inspired Card */}
      <div
        id="support-payment-card"
        className="relative w-full max-w-[360px] sm:max-w-[380px] bg-slate-900/95 text-white rounded-[26px] p-5 sm:p-6 shadow-2xl border border-white/15 backdrop-blur-2xl transition-all duration-200 select-none animate-in zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Ambient Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60 rounded-full" />

        {/* 1. IDLE & PROCESSING STATES */}
        {(status === 'idle' || status === 'processing') && (
          <div className="flex flex-col gap-3.5">
            {/* Header */}
            <div className="relative flex flex-col items-center text-center gap-2 pt-1">
              {/* Top-Left Wallet Icon */}
              <div
                className="absolute -top-1 -left-1 p-1.5 rounded-full text-pink-400 bg-pink-500/10 border border-pink-400/20 shadow-sm flex items-center justify-center"
                title="Contribution Wallet"
                aria-label="Wallet icon"
              >
                <Wallet className="w-3.5 h-3.5" />
              </div>

              {/* Top-Right Close Button */}
              <button
                id="btn-close-payment-modal"
                type="button"
                onClick={onClose}
                disabled={status === 'processing'}
                className="absolute -top-1 -right-1 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition active:scale-95 disabled:opacity-30"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-9 h-9 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-400 shadow-md shadow-pink-500/10">
                <Heart className="w-4 h-4 fill-pink-400/40 animate-pulse" />
              </div>

              <div className="flex flex-col items-center space-y-0.5">
                <h2
                  id="support-modal-title"
                  className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center justify-center gap-1.5 leading-snug"
                >
                  <span>♥️ Support Restyle Text ♥️</span>
                </h2>
                <p className="text-[11px] text-slate-300/90 font-medium leading-relaxed max-w-[280px]">
                  ♥️ Thank you for supporting Restyle Text ♥️
                </p>
              </div>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="flex items-center p-1 bg-black/50 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                id="tab-razorpay"
                onClick={() => setActiveTab('razorpay')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'razorpay'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Razorpay Gateway</span>
              </button>
              <button
                type="button"
                id="tab-upi-qr"
                onClick={() => setActiveTab('upi_qr')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'upi_qr'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3 h-3" />
                <span>Scan QR/UPI</span>
              </button>
            </div>

            {/* iOS Segmented Preset Pills: [₹15] [₹50] [₹500] */}
            <div className="flex items-center justify-between gap-2 p-1 bg-black/40 rounded-2xl border border-white/10">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = !isCustom && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    id={`btn-preset-amt-${amt}`}
                    onClick={() => handlePresetSelect(amt)}
                    disabled={status === 'processing'}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-150 active:scale-[0.96] flex items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-md shadow-pink-500/30 ring-1 ring-white/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    ₹{amt}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Section */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="custom-amount-input"
                className="text-[11px] font-semibold text-slate-300/90 tracking-wide flex items-center justify-between"
              >
                <span>Custom amount</span>
                {isCustom && customAmount && (
                  <span className="text-[10px] text-pink-300 font-medium">
                    Selected: ₹{currentAmountDisplay}
                  </span>
                )}
              </label>

              <div
                className={`relative flex items-center bg-black/40 border rounded-2xl px-3 py-2 transition-all duration-150 ${
                  isCustom && customAmount
                    ? 'border-pink-400/60 ring-2 ring-pink-500/20 bg-black/60'
                    : 'border-white/15 hover:border-white/25 focus-within:border-pink-400/60 focus-within:ring-2 focus-within:ring-pink-500/20'
                }`}
              >
                <span className="text-sm font-bold text-slate-400 mr-2 select-none">
                  ₹
                </span>
                <input
                  id="custom-amount-input"
                  ref={inputRef}
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="50000"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={handleCustomChange}
                  disabled={status === 'processing'}
                  aria-label="Custom payment amount"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {customAmount && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAmount('');
                      setIsCustom(false);
                      setSelectedAmount(50);
                    }}
                    className="p-1 text-slate-400 hover:text-white text-xs"
                    aria-label="Clear custom amount"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: RAZORPAY GATEWAY */}
            {activeTab === 'razorpay' && (
              <>
                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="leading-tight">{errorMessage}</span>
                  </div>
                )}

                <button
                  id="btn-continue-to-pay"
                  type="button"
                  onClick={handleContinueToPay}
                  disabled={status === 'processing' || currentAmountDisplay < 1}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {status === 'processing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing…</span>
                    </>
                  ) : (
                    <span>
                      Pay Online with Razorpay {currentAmountDisplay > 0 ? `• ₹${currentAmountDisplay}` : ''}
                    </span>
                  )}
                </button>

                {/* Direct Razorpay.me page link (Zero errors, official Razorpay hosted page) */}
                <a
                  id="btn-razorpay-me-page"
                  href={RAZORPAY_ME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span>Pay directly via razorpay.me/@kulsumkhatun1</span>
                  <ExternalLink className="w-3 h-3 text-blue-400 shrink-0" />
                </a>

                <div className="flex flex-col items-center justify-center gap-1 text-[10px] text-slate-400/90">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Cards, NetBanking, Wallets & UPI</span>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: DIRECT SCAN UPI / QR CODE */}
            {activeTab === 'upi_qr' && (
              <div className="flex flex-col items-center gap-2.5 pt-1">
                {/* QR Code Container */}
                <div className="relative p-2.5 bg-white rounded-2xl shadow-lg border-2 border-pink-400/40 flex flex-col items-center">
                  <img
                    src={qrCodeUrl}
                    alt={`UPI QR code for ₹${effectiveAmount}`}
                    className="w-36 h-36 object-contain rounded-xl select-none"
                  />
                  <span className="text-[10px] text-slate-700 font-bold mt-1">
                    Scan with any UPI App • ₹{effectiveAmount}
                  </span>
                </div>

                {/* Copy UPI ID */}
                <div className="w-full flex items-center justify-between px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-slate-400 text-[10px]">UPI ID:</span>
                    <span className="font-mono font-bold text-pink-300 text-xs">{DEFAULT_UPI_ID}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1 text-slate-300 hover:text-white flex items-center gap-1 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-lg transition active:scale-95"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Mobile Intent Button */}
                <a
                  href={upiDeepLink}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 text-center active:scale-95 sm:hidden"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open in PhonePe / GPay / Paytm</span>
                </a>

                {/* Mark as paid button */}
                <button
                  type="button"
                  onClick={handleManualUpiSuccess}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>I have completed this payment</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. SUCCESS STATE */}
        {status === 'success' && (
          <div className="flex flex-col items-center text-center gap-3.5 py-2 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold text-xs">
                ✓ Payment Successful
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                You’re awesome!
              </h3>
              <p className="text-xs font-extrabold text-pink-300">
                Thanks for supporting Restyle Text ♥️
              </p>
            </div>

            {paymentDetails.amount && (
              <div className="w-full bg-black/30 border border-white/10 rounded-2xl p-3 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Contribution Amount:</span>
                  <strong className="text-white font-bold">₹{paymentDetails.amount}</strong>
                </div>
                {paymentDetails.method && (
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Method:</span>
                    <span className="text-slate-300">{paymentDetails.method}</span>
                  </div>
                )}
                {paymentDetails.paymentId && (
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Payment ID:</span>
                    <span className="font-mono text-slate-300">{paymentDetails.paymentId}</span>
                  </div>
                )}
              </div>
            )}

            <button
              id="btn-payment-success-close"
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition active:scale-95"
            >
              Done
            </button>
          </div>
        )}

        {/* 3. CANCELLED STATE */}
        {status === 'cancelled' && (
          <div className="flex flex-col items-center text-center gap-3 py-2 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white">Payment cancelled</h3>
              <p className="text-xs text-slate-300/80 max-w-[240px]">
                No amount was charged. You can try again whenever you are ready.
              </p>
            </div>

            <div className="w-full flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition active:scale-95"
              >
                Close
              </button>
              <button
                id="btn-payment-cancelled-retry"
                type="button"
                onClick={handleTryAgain}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white text-xs font-bold shadow-md transition active:scale-95"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* 4. FAILED STATE / DOMAIN RESTRICTION GUIDANCE */}
        {status === 'failed' && (
          <div className="flex flex-col items-center text-center gap-3 py-2 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {isDomainRestrictionError ? 'Razorpay Domain Whitelist' : 'Payment failed'}
              </h3>
              <p className="text-xs text-slate-300/90 leading-relaxed max-w-[290px]">
                {errorMessage || 'Something went wrong with the transaction. Please try again.'}
              </p>
            </div>

            {/* If domain restriction, show domain copy & direct UPI alternative */}
            {isDomainRestrictionError && (
              <div className="w-full p-2.5 bg-black/40 border border-amber-400/30 rounded-xl text-left space-y-2 text-[11px]">
                <div className="flex items-start gap-1.5 text-amber-300 font-semibold">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span>How to resolve with Razorpay Live:</span>
                </div>
                <p className="text-slate-300 text-[10px] leading-tight">
                  Add this domain to your <strong>Razorpay Dashboard &gt; Settings &gt; Website Settings</strong>:
                </p>
                <div className="flex items-center justify-between p-1.5 bg-black/60 rounded-lg border border-white/10 text-[10px]">
                  <span className="font-mono text-pink-300 truncate max-w-[180px]">
                    {typeof window !== 'undefined' ? window.location.origin : ''}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDomain}
                    className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded font-medium text-[10px] transition active:scale-95"
                  >
                    {copiedDomain ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            <div className="w-full flex flex-col gap-2 pt-1">
              {/* Option 1: Direct link to Razorpay.me page which bypasses all domain checks */}
              <a
                id="btn-failed-razorpay-me"
                href={RAZORPAY_ME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Pay via razorpay.me/@kulsumkhatun1</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Option 2: Direct QR/UPI */}
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setErrorMessage('');
                  setIsDomainRestrictionError(false);
                  setActiveTab('upi_qr');
                }}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white text-xs font-bold shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pay via Direct QR/UPI Instead</span>
              </button>

              <div className="w-full flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition active:scale-95"
                >
                  Close
                </button>
                <button
                  id="btn-payment-failed-retry"
                  type="button"
                  onClick={handleTryAgain}
                  className="flex-1 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition active:scale-95"
                >
                  Retry Razorpay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
