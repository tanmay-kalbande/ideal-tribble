// src/components/CreditGate.tsx
// Fast, mobile-friendly credit purchase modal

import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Mail, QrCode, ArrowRight, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import config from '../config';

interface CreditGateProps {
    isOpen: boolean;
    onClose: () => void;
}

// Pricing tiers
const BASE_PRICE = 12;
const getDiscount = (credits: number): number => {
    if (credits >= 20) return 30;
    if (credits >= 10) return 20;
    if (credits >= 5) return 10;
    return 0;
};

const calculatePrice = (credits: number): number => {
    const discount = getDiscount(credits);
    const pricePerCredit = BASE_PRICE * (1 - discount / 100);
    return Math.round(credits * pricePerCredit);
};

// UPI QR Code
function UPIQRCode({ upiId, amount, note }: { upiId: string; amount: number; note: string }) {
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Kitaab&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiLink)}&bgcolor=ffffff&color=000000`;

    return (
        <div className="flex flex-col items-center py-2">
            <div className="bg-white p-1.5 rounded-lg">
                <img src={qrUrl} alt="UPI QR" className="w-[120px] h-[120px] sm:w-[130px] sm:h-[130px]" />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">Scan with any UPI app</p>
        </div>
    );
}

export function CreditGate({ isOpen, onClose }: CreditGateProps) {
    const { user } = useAuth();
    const [credits, setCredits] = useState(5);
    const [step, setStep] = useState<'select' | 'pay'>('select');
    const [copied, setCopied] = useState(false);

    const { upiId, whatsappNumber, supportEmail } = config.payment;

    const price = calculatePrice(credits);
    const discount = getDiscount(credits);
    const pricePerBook = Math.round(price / credits);
    const originalPrice = credits * BASE_PRICE;
    const savings = originalPrice - price;

    if (!isOpen) return null;

    const adjustCredits = (delta: number) => {
        const newCredits = credits + delta;
        if (newCredits >= 1 && newCredits <= 50) {
            setCredits(newCredits);
        }
    };

    const copyUpi = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openWhatsApp = () => {
        const msg = encodeURIComponent(
            `Hi! Kitaab credits purchase.\n\n📧 ${user?.email}\n📦 ${credits} credits = ₹${price}\n\n[Screenshot attached]`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    };

    const openEmail = () => {
        const subject = encodeURIComponent('Kitaab Credits');
        const body = encodeURIComponent(`${credits} credits for ₹${price}\nEmail: ${user?.email}`);
        window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_blank');
    };

    const presets = [1, 5, 10, 20];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop - no blur */}
            <div className="absolute inset-0 bg-black/95" onClick={onClose} />

            {/* Modal - no animation */}
            <div className="relative w-full max-w-sm sm:max-w-md bg-[#0a0a0a] border border-[#222] rounded-xl shadow-2xl overflow-hidden">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-white z-10"
                >
                    <X size={16} />
                </button>

                {/* Header */}
                <div className="p-4 pb-2">
                    <h2 className="text-base sm:text-lg font-bold text-white">
                        {step === 'select' ? 'Get Credits' : 'Pay'}
                    </h2>
                    <p className="text-xs text-gray-500">
                        {step === 'select' ? 'Choose amount' : `${credits} credits = ₹${price}`}
                    </p>
                </div>

                {step === 'select' ? (
                    <>
                        {/* Credit Selector */}
                        <div className="px-4 pb-3">
                            <div className="bg-[#131313] border border-[#222] rounded-lg p-4">
                                {/* Selector */}
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <button
                                        onClick={() => adjustCredits(-1)}
                                        disabled={credits <= 1}
                                        className="p-2.5 bg-[#222] hover:bg-[#333] disabled:opacity-30 rounded-lg"
                                    >
                                        <Minus size={18} className="text-white" />
                                    </button>

                                    <div className="text-center min-w-[80px]">
                                        <input
                                            type="number"
                                            value={credits}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 1;
                                                setCredits(Math.max(1, Math.min(50, val)));
                                            }}
                                            min={1}
                                            max={50}
                                            className="w-16 text-3xl font-bold text-white text-center bg-transparent outline-none"
                                        />
                                        <p className="text-gray-500 text-xs">credits</p>
                                    </div>

                                    <button
                                        onClick={() => adjustCredits(1)}
                                        disabled={credits >= 50}
                                        className="p-2.5 bg-[#222] hover:bg-[#333] disabled:opacity-30 rounded-lg"
                                    >
                                        <Plus size={18} className="text-white" />
                                    </button>
                                </div>

                                {/* Presets */}
                                <div className="flex justify-center gap-1.5 mb-3">
                                    {presets.map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => setCredits(n)}
                                            className={`px-2.5 py-1 text-xs font-medium rounded ${credits === n
                                                    ? 'bg-white text-black'
                                                    : 'bg-[#222] text-gray-400'
                                                }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>

                                {/* Price */}
                                <div className="text-center pt-2 border-t border-[#222]">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-2xl font-bold text-white">₹{price}</span>
                                        {discount > 0 && (
                                            <span className="text-xs text-gray-500 line-through">₹{originalPrice}</span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-xs">
                                        ₹{pricePerBook}/book
                                        {discount > 0 && (
                                            <span className="ml-1 text-green-400">({discount}% off)</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Discount tiers */}
                        <div className="px-4 pb-3">
                            <div className="flex gap-1.5 text-center text-[10px]">
                                <div className={`flex-1 p-1.5 rounded border ${credits >= 5 && credits < 10 ? 'border-green-500/50' : 'border-[#222]'}`}>
                                    <p className="text-gray-500">5+</p>
                                    <p className="text-green-400 font-bold">10%</p>
                                </div>
                                <div className={`flex-1 p-1.5 rounded border ${credits >= 10 && credits < 20 ? 'border-green-500/50' : 'border-[#222]'}`}>
                                    <p className="text-gray-500">10+</p>
                                    <p className="text-green-400 font-bold">20%</p>
                                </div>
                                <div className={`flex-1 p-1.5 rounded border ${credits >= 20 ? 'border-green-500/50' : 'border-[#222]'}`}>
                                    <p className="text-gray-500">20+</p>
                                    <p className="text-green-400 font-bold">30%</p>
                                </div>
                            </div>
                        </div>

                        {/* Continue */}
                        <div className="px-4 pb-4">
                            <button
                                onClick={() => setStep('pay')}
                                className="w-full py-2.5 bg-white text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2"
                            >
                                <span>Pay ₹{price}</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Back */}
                        <div className="px-4 pb-1">
                            <button
                                onClick={() => setStep('select')}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-white"
                            >
                                <ArrowLeft size={12} />
                                <span>Back</span>
                            </button>
                        </div>

                        {/* QR */}
                        <div className="px-4">
                            <UPIQRCode upiId={upiId} amount={price} note={`Kitaab ${credits} Credits`} />
                        </div>

                        {/* UPI ID */}
                        <div className="px-4 py-2">
                            <div className="flex items-center gap-2 p-2 bg-[#131313] border border-[#222] rounded-lg">
                                <QrCode size={12} className="text-gray-500" />
                                <span className="flex-1 font-mono text-xs text-white truncate">{upiId}</span>
                                <button onClick={copyUpi} className="p-1 rounded">
                                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-gray-500" />}
                                </button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="px-4 pb-2">
                            <div className="p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                <p className="text-[10px] text-yellow-500/80">
                                    After paying, send screenshot with: <span className="font-bold text-yellow-400">{user?.email}</span>
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                            <button
                                onClick={openWhatsApp}
                                className="flex items-center justify-center gap-1.5 py-2 bg-[#131313] border border-[#222] text-white text-xs font-bold rounded-lg"
                            >
                                <MessageCircle size={12} />
                                WhatsApp
                            </button>
                            <button
                                onClick={openEmail}
                                className="flex items-center justify-center gap-1.5 py-2 bg-[#131313] border border-[#222] text-white text-xs font-bold rounded-lg"
                            >
                                <Mail size={12} />
                                Email
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CreditGate;
