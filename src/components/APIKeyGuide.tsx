// src/components/APIKeyGuide.tsx
// Step-by-step guide for getting API keys from each provider

import React from 'react';
import { X, ExternalLink, Copy, Check, Key, Sparkles, Zap, Globe, Cpu, Server } from 'lucide-react';

interface APIKeyGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ProviderGuide {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    url: string;
    freeInfo: string;
    steps: string[];
    tips: string[];
}

const PROVIDER_GUIDES: ProviderGuide[] = [
    {
        id: 'google',
        name: 'Google AI (Gemini)',
        icon: Sparkles,
        color: 'text-blue-400',
        url: 'https://aistudio.google.com/app/apikey',
        freeInfo: 'Free tier: 15 requests/minute, 1500/day',
        steps: [
            'Go to Google AI Studio (link below)',
            'Sign in with your Google account',
            'Click "Get API Key" in the top right',
            'Click "Create API key in new project"',
            'Copy the generated API key',
            'Paste it in Pustakam Settings → API Keys',
        ],
        tips: [
            'Recommended for beginners - easiest to set up',
            'Gemini models are free with generous limits',
            'Best balance of quality and speed',
        ],
    },
    {
        id: 'groq',
        name: 'Groq',
        icon: Zap,
        color: 'text-orange-400',
        url: 'https://console.groq.com/keys',
        freeInfo: 'Free tier: Very fast inference, 14,400 tokens/min',
        steps: [
            'Go to Groq Console (link below)',
            'Sign up with email or Google',
            'Navigate to "API Keys" section',
            'Click "Create API Key"',
            'Give it a name (e.g., "Pustakam")',
            'Copy and save the key immediately',
        ],
        tips: [
            'Extremely fast generation speeds',
            'Great for Llama and Mixtral models',
            'Free tier is very generous',
        ],
    },
    {
        id: 'mistral',
        name: 'Mistral AI',
        icon: Globe,
        color: 'text-purple-400',
        url: 'https://console.mistral.ai/api-keys',
        freeInfo: 'Free tier: Limited requests, requires account verification',
        steps: [
            'Go to Mistral Console (link below)',
            'Create an account and verify email',
            'Navigate to "API Keys" in the sidebar',
            'Click "Create new key"',
            'Name your key and create',
            'Copy the API key (shown only once!)',
        ],
        tips: [
            'European AI provider (GDPR compliant)',
            'Excellent for coding and technical content',
            'Mixtral models are very capable',
        ],
    },
    {
        id: 'cerebras',
        name: 'Cerebras',
        icon: Cpu,
        color: 'text-green-400',
        url: 'https://cloud.cerebras.ai/platform',
        freeInfo: 'Free tier: Fast inference with good limits',
        steps: [
            'Go to Cerebras Cloud (link below)',
            'Sign up for an account',
            'Go to Platform → API Keys',
            'Click "Create API Key"',
            'Copy the generated key',
            'Store it securely - shown only once',
        ],
        tips: [
            'Ultra-fast inference speeds',
            'Great for large models',
            'Good alternative to Groq',
        ],
    },
    {
        id: 'zhipu',
        name: 'ZhipuAI (GLM)',
        icon: Server,
        color: 'text-red-400',
        url: 'https://open.bigmodel.cn/usercenter/apikeys',
        freeInfo: 'Free tier: Requires Chinese phone verification',
        steps: [
            'Go to ZhipuAI (link below)',
            'Create account (Chinese interface)',
            'Navigate to User Center → API Keys',
            'Create a new API key',
            'Copy and save the key',
        ],
        tips: [
            'Chinese AI provider',
            'GLM models are powerful',
            'May require Chinese phone number',
        ],
    },
];

export function APIKeyGuide({ isOpen, onClose }: APIKeyGuideProps) {
    const [selectedProvider, setSelectedProvider] = React.useState<string>('google');
    const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

    const selectedGuide = PROVIDER_GUIDES.find((p) => p.id === selectedProvider)!;

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/50">
                    <div className="flex items-center gap-3">
                        <Key className="text-orange-500" size={20} />
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">How to Get API Keys</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--color-bg)] transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Provider Tabs */}
                <div className="flex gap-1 p-3 border-b border-[var(--color-border)] overflow-x-auto">
                    {PROVIDER_GUIDES.map((provider) => {
                        const Icon = provider.icon;
                        return (
                            <button
                                key={provider.id}
                                onClick={() => setSelectedProvider(provider.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedProvider === provider.id
                                    ? 'bg-orange-500/10 text-orange-500'
                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]'
                                    }`}
                            >
                                <Icon size={16} className={selectedProvider === provider.id ? 'text-orange-500' : 'text-[var(--color-text-secondary)]'} />
                                {provider.name.split(' ')[0]}
                            </button>
                        );
                    })}
                </div>

                {/* Guide Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Provider Header */}
                    <div className="flex items-center gap-3">
                        {React.createElement(selectedGuide.icon, {
                            size: 28,
                            className: 'text-orange-500',
                        })}
                        <div>
                            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{selectedGuide.name}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">{selectedGuide.freeInfo}</p>
                        </div>
                    </div>

                    {/* Link */}
                    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[var(--color-text-secondary)] mb-1">Console URL</p>
                                <p className="text-sm text-orange-500 truncate">{selectedGuide.url}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyUrl(selectedGuide.url)}
                                    className="p-2 rounded-lg bg-[var(--color-bg)] hover:bg-[var(--color-bg)]/80 transition-colors"
                                    title="Copy URL"
                                >
                                    {copiedUrl === selectedGuide.url ? (
                                        <Check size={16} className="text-green-400" />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                                <a
                                    href={selectedGuide.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Steps */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center text-xs">
                                📝
                            </span>
                            Step-by-Step Instructions
                        </h4>
                        <ol className="space-y-2">
                            {selectedGuide.steps.map((step, index) => (
                                <li key={index} className="flex gap-3 text-sm">
                                    <span className="w-6 h-6 rounded-full bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] flex items-center justify-center text-xs font-medium flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="text-[var(--color-text-primary)] pt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Tips */}
                    <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-orange-500 mb-2">💡 Tips</h4>
                        <ul className="space-y-1">
                            {selectedGuide.tips.map((tip, index) => (
                                <li key={index} className="text-sm text-[var(--color-text-secondary)] flex gap-2">
                                    <span className="text-orange-500">•</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]/50">
                    <p className="text-xs text-[var(--color-text-secondary)] text-center">
                        🔒 Your API keys are stored locally in your browser and never sent to our servers.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default APIKeyGuide;
