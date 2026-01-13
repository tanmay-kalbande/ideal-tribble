// src/config.ts
// Clean configuration - centralized environment variables

export const config = {
    // Supabase
    supabase: {
        url: import.meta.env.K_SUPABASE_URL || '',
        anonKey: import.meta.env.K_SUPABASE_ANON_KEY || '',
        // NOTE: The anon key is safe to expose in the browser IF AND ONLY IF 
        // Row Level Security (RLS) is properly configured on the Supabase dashboard.
    },

    // Payment/Contact
    payment: {
        upiId: import.meta.env.K_UPI_ID || 'kitaab@upi',
        whatsappNumber: import.meta.env.K_WHATSAPP_NUMBER || '919876543210',
        supportEmail: import.meta.env.K_SUPPORT_EMAIL || 'support@kitaab.ai',
        creditPrice: parseInt(import.meta.env.K_CREDIT_PRICE || '50'),
        creditsPerPack: parseInt(import.meta.env.K_CREDITS_PER_PACK || '5'),
    },

    // Computed
    get pricePerBook() {
        return Math.round(this.payment.creditPrice / this.payment.creditsPerPack);
    },

    get isSupabaseConfigured() {
        return !!(this.supabase.url && this.supabase.anonKey);
    },
};

export default config;
