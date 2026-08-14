import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, Heart, ExternalLink, Sparkles, ShieldCheck, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId?: string;
  payeeName?: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  upiId = '9334078582@ybl',
  payeeName = 'GW IMRAN',
}) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

  // Draw high-resolution QR code with PhonePe center logo
  useEffect(() => {
    if (!isOpen) return;

    const generateQR = async () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 320;
      canvas.width = size;
      canvas.height = size;

      // Generate QR code onto the canvas with High Error Correction
      await QRCode.toCanvas(canvas, upiUrl, {
        width: size,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Draw PhonePe Center Icon
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = 38;

      // Outer white ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Inner Dark circle (matching the reference image)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#1e1e1e';
      ctx.fill();

      // Draw Hindi 'पे' text in center
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('पे', centerX, centerY - 2);
    };

    generateQR();
  }, [isOpen, upiUrl]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll
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

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="support-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
    >
      <div
        id="support-modal-card"
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto liquid-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/25 text-white flex flex-col gap-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

        {/* Header with Title & Close Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[1px] shadow-lg shadow-pink-500/30 shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-[15px] bg-slate-950/85 backdrop-blur-md flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400/30 animate-pulse" />
              </div>
            </div>
            <div>
              <h2
                id="support-modal-title"
                className="text-lg sm:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-amber-200"
              >
                Support Developer
              </h2>
              <p className="text-xs text-slate-300/80 font-medium mt-0.5">
                Restyle Text by GW IMRAN
              </p>
            </div>
          </div>

          <button
            id="btn-close-support-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl liquid-glass-pill text-slate-300 hover:text-white hover:bg-white/20 transition shrink-0"
            aria-label="Close support dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center gap-3.5 bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-inner">
          <div className="relative p-2.5 bg-white rounded-2xl shadow-xl border-2 border-white/40">
            <canvas
              ref={canvasRef}
              className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl select-none mx-auto block"
            />
          </div>

          {/* 4 Payment App Logos */}
          <div className="w-full flex flex-col items-center gap-2 pt-1">
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              {/* PhonePe */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold text-purple-200 shadow-sm" title="PhonePe">
                <div className="w-5 h-5 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-bold text-[11px]">
                  पे
                </div>
                <span>PhonePe</span>
              </div>

              {/* Google Pay */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold text-blue-200 shadow-sm" title="Google Pay">
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Google Pay</span>
              </div>

              {/* Paytm */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold text-cyan-200 shadow-sm" title="Paytm">
                <div className="w-5 h-5 rounded-md bg-[#002e6e] flex items-center justify-center text-[#00baf2] font-black text-[9px] tracking-tighter">
                  Pay
                </div>
                <span>Paytm</span>
              </div>

              {/* BHIM UPI */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold text-emerald-200 shadow-sm" title="BHIM UPI">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-[8px] tracking-tight">
                  UPI
                </div>
                <span>BHIM UPI</span>
              </div>
            </div>

            {/* Subtext */}
            <p className="text-[11px] text-slate-300 font-medium text-center tracking-wide mt-0.5">
              PhonePe • Google Pay • Paytm • BHIM UPI
            </p>
          </div>
        </div>

        {/* UPI ID Copy Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-300 font-semibold flex items-center justify-between">
            <span>UPI ID</span>
            <span className="text-[11px] text-pink-300 font-normal">Scan QR or Copy ID</span>
          </label>
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/40 border border-white/15">
            <input
              type="text"
              readOnly
              value={upiId}
              className="w-full bg-transparent text-sm font-mono font-bold text-white px-2 focus:outline-none select-all"
            />
            <button
              id="btn-copy-upi"
              type="button"
              onClick={handleCopyUPI}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'liquid-glass-pill text-white hover:bg-white/25'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Button: Pay via UPI Apps directly */}
        <a
          id="btn-pay-upi-intent"
          href={upiUrl}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-sm text-center shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Pay via UPI App</span>
          <ExternalLink className="w-4 h-4 opacity-80" />
        </a>

        {/* Footer Note */}
        <div className="text-center pt-1 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Thank you for supporting <strong>GW IMRAN</strong>!</span>
        </div>
      </div>
    </div>
  );
};
