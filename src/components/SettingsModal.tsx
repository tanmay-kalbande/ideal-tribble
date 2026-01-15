// src/components/SettingsModal.tsx
import React from 'react';
import { X, Shield, Database, Download, Upload, Trash2, HelpCircle, Key, Settings, ExternalLink, Eye, EyeOff, User, Zap, Globe, Cpu, BookOpen, AlertTriangle, Plus, BookMarked, ChevronRight, CreditCard, Crown, Sparkles, Calendar, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { APISettings } from '../types';
import { storageUtils } from '../utils/storage';
import { DisclaimerPage } from './DisclaimerPage';
import { APIKeyGuide } from './APIKeyGuide';
import { TechnicalDocs } from './TechnicalDocs';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: APISettings;
  onSaveSettings: (settings: APISettings) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  showAlertDialog: (props: {
    type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }) => void;
}

type ActiveTab = 'appearance' | 'keys' | 'data' | 'about' | 'subscription';

interface ImportPreview {
  books: any[];
  settings: APISettings;
  conflicts: {
    duplicateBooks: number;
    settingsConflict: boolean;
  };
}

export function SettingsModal({ isOpen, onClose, settings, onSaveSettings, theme, onToggleTheme, showAlertDialog }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = React.useState<APISettings>(settings);
  const { profile, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('keys');
  const [visibleApis, setVisibleApis] = React.useState<Record<string, boolean>>({});
  const [importPreview, setImportPreview] = React.useState<ImportPreview | null>(null);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [showDisclaimer, setShowDisclaimer] = React.useState(false);
  const [showAPIGuide, setShowAPIGuide] = React.useState(false);
  const [showTechnicalDocs, setShowTechnicalDocs] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => setLocalSettings(settings), [settings, isOpen]);

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const handleExportData = () => {
    const data = {
      books: storageUtils.getBooks(),
      settings: storageUtils.getSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pustakam-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        const existingBooks = storageUtils.getBooks();
        const existingSettings = storageUtils.getSettings();

        const duplicateBooks = importData.books ?
          importData.books.filter((importBook: any) =>
            existingBooks.some(existingBook => existingBook.id === importBook.id)
          ).length : 0;

        const settingsConflict = importData.settings &&
          JSON.stringify(existingSettings) !== JSON.stringify(importData.settings);

        setImportPreview({
          books: importData.books || [],
          settings: importData.settings || existingSettings,
          conflicts: {
            duplicateBooks,
            settingsConflict
          }
        });
        setShowImportModal(true);
      } catch (error) {
        showAlertDialog({
          type: 'error',
          title: 'Invalid File',
          message: 'Failed to read import file. Please check the file format.',
          confirmText: 'OK'
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const executeImport = (mode: 'merge' | 'replace') => {
    if (!importPreview) return;

    try {
      if (mode === 'replace') {
        storageUtils.saveBooks(importPreview.books);
        if (importPreview.settings) {
          setLocalSettings(importPreview.settings);
          storageUtils.saveSettings(importPreview.settings);
        }
      } else {
        const existingBooks = storageUtils.getBooks();
        const existingSettings = storageUtils.getSettings();

        const mergedBooks = [...existingBooks];
        importPreview.books.forEach(importBook => {
          const exists = mergedBooks.some(existing => existing.id === importBook.id);
          if (!exists) {
            mergedBooks.push(importBook);
          }
        });
        storageUtils.saveBooks(mergedBooks);

        const mergedSettings = { ...importPreview.settings };
        Object.keys(existingSettings).forEach(key => {
          if (existingSettings[key as keyof APISettings] &&
            key.includes('ApiKey') &&
            existingSettings[key as keyof APISettings] !== '') {
            mergedSettings[key as keyof APISettings] = existingSettings[key as keyof APISettings];
          }
        });
        setLocalSettings(mergedSettings);
        storageUtils.saveSettings(mergedSettings);
      }

      setShowImportModal(false);
      setImportPreview(null);
      showAlertDialog({
        type: 'success',
        title: 'Import Successful',
        message: `Data imported successfully using ${mode} mode! The app will now reload.`,
        confirmText: 'OK',
        onConfirm: () => window.location.reload()
      });
    } catch (error) {
      console.error('Import failed:', error);
      let message = 'Failed to import data. Please check the file and try again.';
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        message = 'Import failed: Your browser storage is full. Please clear some space and try again.';
      }
      showAlertDialog({
        type: 'error',
        title: 'Import Failed',
        message,
        confirmText: 'Dismiss'
      });
    }
  };

  const handleClearData = () => {
    showAlertDialog({
      type: 'confirm',
      title: 'Confirm Data Deletion',
      message: 'This will permanently delete all books and settings. This action cannot be undone. Are you sure?',
      confirmText: 'Yes, Delete All',
      cancelText: 'Cancel',
      onConfirm: () => {
        storageUtils.clearAllData();
        showAlertDialog({
          type: 'success',
          title: 'Data Cleared',
          message: 'All data has been cleared. The app will now reload.',
          confirmText: 'OK',
          onConfirm: () => window.location.reload()
        });
      }
    });
  };

  if (!isOpen) return null;

  const TabButton = ({ id, label, Icon }: { id: ActiveTab; label: string; Icon: React.ElementType; }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all rounded-lg w-full ${activeTab === id
        ? 'bg-gray-900 text-white dark:bg-white/10 dark:text-white shadow-sm'
        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03]'
        }`}
    >
      <Icon size={18} className={`transition-colors ${activeTab === id ? 'text-white' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
      {label}
    </button>
  );

  const apiConfigs = [
    {
      id: 'googleApiKey' as keyof APISettings,
      name: 'Google AI',
      url: 'https://aistudio.google.com/app/apikey',
      description: 'For Gemini models (recommended for most users)'
    },
    {
      id: 'mistralApiKey' as keyof APISettings,
      name: 'Mistral AI',
      url: 'https://console.mistral.ai/api-keys',
      description: 'For Mistral models'
    },
    {
      id: 'groqApiKey' as keyof APISettings,
      name: 'Groq',
      url: 'https://console.groq.com/keys',
      description: 'For Llama and Kimi models'
    },
    {
      id: 'cerebrasApiKey' as keyof APISettings,
      name: 'Cerebras',
      url: 'https://cloud.cerebras.ai/platform',
      description: 'Ultra-fast inference for large models'
    }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm" onClick={onClose}>
        <div
          className="relative w-full max-w-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-gray-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">System Preferences</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-52 border-r border-gray-100 dark:border-white/[0.08] p-3 space-y-1 bg-gray-50/50 dark:bg-[#121212]">
              <TabButton id="appearance" label="Appearance" Icon={Sun} />
              <TabButton id="keys" label="API Keys" Icon={Shield} />
              <TabButton id="subscription" label="Subscription" Icon={CreditCard} />
              <TabButton id="data" label="Data Area" Icon={Database} />
              <TabButton id="about" label="Platform" Icon={HelpCircle} />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-transparent p-8 scroll-smooth text-[var(--color-text-primary)]">
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="max-w-md animate-fade-in space-y-8">
                  <header>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Appearance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customize how Pustakam looks for you.</p>
                  </header>

                  <section className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Theme Preference</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                        <button
                          onClick={() => theme === 'dark' && onToggleTheme()}
                          className={`flex items-center justify-center gap-2.5 py-3 rounded-lg transition-all duration-200 ${theme === 'light'
                            ? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                          <Sun size={18} className={theme === 'light' ? 'text-orange-500' : ''} />
                          <span className="font-bold text-sm">Light Mode</span>
                        </button>
                        <button
                          onClick={() => theme === 'light' && onToggleTheme()}
                          className={`flex items-center justify-center gap-2.5 py-3 rounded-lg transition-all duration-200 ${theme === 'dark'
                            ? 'bg-[#1a1a1a] dark:bg-zinc-800 text-white shadow-md ring-1 ring-white/10'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                          <Moon size={18} className={theme === 'dark' ? 'text-orange-500' : ''} />
                          <span className="font-bold text-sm">Dark Mode</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">Adjusts the overall interface colors for better visibility.</p>
                    </div>
                  </section>
                </div>
              )}
              {/* API Keys Tab */}
              {activeTab === 'keys' && (
                <div className="max-w-md animate-fade-in space-y-8">
                  <header>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">External Connections</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Configure your LLM provider credentials.</p>
                  </header>

                  <div className="space-y-6">
                    {apiConfigs.map(api => {
                      const hasKey = !!localSettings[api.id];
                      return (
                        <div key={api.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label htmlFor={api.id} className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              {api.name}
                              {hasKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Key Configured" />}
                            </label>
                            <a href={api.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline flex items-center gap-1">
                              Get Key <ExternalLink size={10} />
                            </a>
                          </div>

                          <div className="relative group">
                            <input
                              id={api.id}
                              type={visibleApis[api.id] ? 'text' : 'password'}
                              value={localSettings[api.id] as string}
                              onChange={e => setLocalSettings(p => ({ ...p, [api.id]: e.target.value }))}
                              placeholder={`Enter ${api.name} API Key`}
                              className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-lg py-2 pl-3 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setVisibleApis(p => ({ ...p, [api.id]: !p[api.id] }))}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              {visibleApis[api.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{api.description}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                    <button
                      onClick={() => setShowAPIGuide(true)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <BookMarked size={14} />
                      View API Setup Documentation
                    </button>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="max-w-md animate-fade-in space-y-8">
                  <header>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Subscription & Credits</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your plan and view credit balance.</p>
                  </header>

                  {!isAuthenticated ? (
                    <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-xl p-6 text-center">
                      <User size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sign in to view your subscription details.</p>
                    </div>
                  ) : (
                    <>
                      {/* Current Plan Card */}
                      <section className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Crown size={20} className="text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Current Plan</p>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                              {profile?.plan === 'monthly' ? 'Monthly PRO' : profile?.plan === 'yearly' ? 'Yearly PRO' : 'Free Tier'}
                            </h4>
                          </div>
                        </div>

                        {(profile?.plan === 'monthly' || profile?.plan === 'yearly') ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Sparkles size={16} className="text-emerald-500" />
                              <span>Unlimited book generation</span>
                            </div>
                            {profile?.plan_expires_at && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar size={16} />
                                <span>Renews: {new Date(profile.plan_expires_at).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Credits Remaining</span>
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.credits ?? 0}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(((profile?.credits ?? 0) / 10) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </section>

                      {/* Upgrade Section - Only for free users */}
                      {profile?.plan === 'free' && (
                        <section className="space-y-4">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Upgrade Your Plan</h4>

                          <div className="grid gap-3">
                            <a
                              href="https://wa.me/919730416498?text=Hi%2C%20I%20want%20to%20subscribe%20to%20Pustakam%20Monthly%20Plan"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-xl hover:border-indigo-500/20 transition-all group"
                            >
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Monthly Plan</p>
                                <p className="text-sm text-gray-500">₹149/month • Unlimited books</p>
                              </div>
                              <ChevronRight size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </a>

                            <a
                              href="https://wa.me/919730416498?text=Hi%2C%20I%20want%20to%20subscribe%20to%20Pustakam%20Yearly%20Plan"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-xl hover:border-indigo-500/20 transition-all group"
                            >
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Yearly Plan</p>
                                <p className="text-sm text-gray-500">₹1,499/year • Save 16%</p>
                              </div>
                              <ChevronRight size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </a>
                          </div>
                        </section>
                      )}

                      {/* Books Created */}
                      <section className="pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <BookOpen size={16} />
                            <span>Books Created</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{profile?.books_created ?? 0}</span>
                        </div>
                      </section>
                    </>
                  )}
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="max-w-md animate-fade-in space-y-8">
                  <header>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Knowledge Management</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Control your local library and archives.</p>
                  </header>

                  <section className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Backup Operations</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleExportData}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                      >
                        <Download size={14} />
                        Export Archive
                      </button>
                      <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-white text-xs font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer whitespace-nowrap">
                        <Upload size={14} />
                        Restore Library
                        <input type="file" ref={fileInputRef} onChange={handleImportPreview} accept=".json" className="hidden" />
                      </label>
                    </div>
                  </section>

                  <section className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/[0.05]">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">System Integrity</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold tracking-wider">LOCAL DATABASE</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{storageUtils.getBooks().length} Entires Recorded</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold tracking-wider">STORAGE TYPE</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white italic">IndexedDB Engine</p>
                      </div>
                    </div>
                  </section>

                  <section className="pt-8 space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500">Danger Zone</h4>
                    <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.02]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                        Resetting the engine will purge all knowledge bases, session history, and provider configurations.
                      </p>
                      <button
                        onClick={handleClearData}
                        className="text-xs font-black text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 size={14} />
                        Purge All System Data
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {/* Platform Tab */}
              {activeTab === 'about' && (
                <div className="max-w-md animate-fade-in space-y-10">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0">
                      <img src="/white-logo.png" alt="Logo" className="w-10 h-10 drop-shadow-sm dark:invert-0 invert" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">PUSTAKAM</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Knowledge Synthesis v1.2</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        Professional-grade orchestration engine for modular knowledge generation and structured learning assets.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {[
                      { icon: Zap, label: 'Neural Core', val: 'Low-latency' },
                      { icon: BookOpen, label: 'Export Engine', val: 'PDF / MD / TXT' },
                      { icon: Globe, label: 'Architecture', val: 'Hybrid PWA' },
                      { icon: Shield, label: 'Security', val: 'Client-side Enc.' }
                    ].map((idx, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                          <idx.icon size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{idx.label}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white ml-5">{idx.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-10 border-t border-gray-100 dark:border-white/[0.05]">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Developer Liaison</p>
                      <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-gray-900 dark:text-white hover:text-gray-300 transition-colors">
                        T. KALBANDE
                      </a>
                    </div>
                    <button
                      onClick={() => setShowDisclaimer(true)}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] hover:border-indigo-500/20 transition-all text-xs font-bold group"
                    >
                      <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors tracking-tight">System Regulatory Compliance</span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </button>
                    <button
                      onClick={() => setShowTechnicalDocs(true)}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] hover:border-indigo-500/20 transition-all text-xs font-bold group"
                    >
                      <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors tracking-tight">Platform Technical Docs</span>
                      <ChevronRight size={14} className="text-gray-300" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50/80 dark:bg-black/40 border-t border-gray-100 dark:border-white/[0.05] flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/20" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Synchronized</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-4 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black px-8 py-2.5 rounded-lg shadow-lg shadow-orange-500/10 active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Preview Modal */}
      {showImportModal && importPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-2xl w-full max-w-md p-8">
            <header className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={20} />
                Confirm Data Import
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Review the details below before proceeding.</p>
            </header>

            <div className="space-y-6 mb-8 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Items Included</p>
                  <p className="font-bold text-gray-900 dark:text-white">{importPreview.books.length} Books</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Configuration</p>
                  <p className="font-bold text-gray-900 dark:text-white">{importPreview.settings ? 'Encrypted' : 'None'}</p>
                </div>
              </div>

              {(importPreview.conflicts.duplicateBooks > 0 || importPreview.conflicts.settingsConflict) && (
                <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/[0.02]">
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2">Detected Overwrites</p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc pl-4">
                    {importPreview.conflicts.duplicateBooks > 0 && <li>{importPreview.conflicts.duplicateBooks} existing records will be updated</li>}
                    {importPreview.conflicts.settingsConflict && <li>Provider configurations will be adjusted</li>}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => executeImport('merge')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-black py-3 rounded-lg shadow-lg shadow-orange-500/10 transition-all"
              >
                Merge with Current Library
              </button>
              <button
                onClick={() => executeImport('replace')}
                className="w-full border border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-white text-xs font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all"
              >
                Replace Entire Library
              </button>
              <button
                onClick={() => { setShowImportModal(false); setImportPreview(null); }}
                className="w-full text-xs font-bold text-gray-400 hover:text-gray-600 py-3 transition-colors"
              >
                Cancel Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlays */}
      {showDisclaimer && <DisclaimerPage isOpen={showDisclaimer} onClose={() => setShowDisclaimer(false)} />}
      {showAPIGuide && <APIKeyGuide isOpen={showAPIGuide} onClose={() => setShowAPIGuide(false)} />}
      {showTechnicalDocs && <TechnicalDocs isOpen={showTechnicalDocs} onClose={() => setShowTechnicalDocs(false)} />}
    </>
  );
}
