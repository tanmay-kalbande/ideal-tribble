// src/components/SettingsModal.tsx
import React from 'react';
import { X, Shield, Database, Download, Upload, Trash2, HelpCircle, Key, Settings, ExternalLink, Eye, EyeOff, User, Zap, Globe, Cpu, BookOpen, AlertTriangle, Plus, BookMarked, ChevronRight } from 'lucide-react';
import { APISettings } from '../types';
import { storageUtils } from '../utils/storage';
import { DisclaimerPage } from './DisclaimerPage';
import { APIKeyGuide } from './APIKeyGuide';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: APISettings;
  onSaveSettings: (settings: APISettings) => void;
  showAlertDialog: (props: {
    type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }) => void;
}

type ActiveTab = 'keys' | 'data' | 'about';

interface ImportPreview {
  books: any[];
  settings: APISettings;
  conflicts: {
    duplicateBooks: number;
    settingsConflict: boolean;
  };
}

export function SettingsModal({ isOpen, onClose, settings, onSaveSettings, showAlertDialog }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = React.useState<APISettings>(settings);
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('keys');
  const [visibleApis, setVisibleApis] = React.useState<Record<string, boolean>>({});
  const [importPreview, setImportPreview] = React.useState<ImportPreview | null>(null);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [showDisclaimer, setShowDisclaimer] = React.useState(false);
  const [showAPIGuide, setShowAPIGuide] = React.useState(false);
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
      className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors rounded-lg ${activeTab === id
        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
        }`}
    >
      <Icon size={16} />
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
        <div className="relative w-full max-w-lg">
          {/* Neon Glow Backdrop */}
          <div className="absolute -inset-4 bg-orange-500/20 blur-2xl rounded-[2.5rem] opacity-50" />

          <div
            className="relative bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center shadow-inner">
                  <Settings size={20} className="text-orange-500 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Settings</h2>
                  <p className="text-xs text-gray-500 dark:text-white/40 font-medium">Configure your experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-400 hover:text-gray-900 dark:hover:text-white group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Tabs */}
            <div className="p-2 grid grid-cols-3 gap-1.5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent">
              <TabButton id="keys" label="API Keys" Icon={Shield} />
              <TabButton id="data" label="Data Area" Icon={Database} />
              <TabButton id="about" label="Platform" Icon={HelpCircle} />
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto min-h-[25rem] scroll-smooth">
              {/* API Keys Tab */}
              {activeTab === 'keys' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">External Connections</h3>
                      <button
                        onClick={() => setShowAPIGuide(true)}
                        className="text-xs font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 flex items-center gap-1.5 transition-colors"
                      >
                        <BookMarked size={14} />
                        Setup Guide
                      </button>
                    </div>

                    <div className="bg-orange-500/[0.03] dark:bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 shadow-sm">
                      <div className="flex gap-3">
                        <div className="mt-1"><Shield size={16} className="text-orange-500" /></div>
                        <div>
                          <p className="text-sm font-semibold text-orange-600 dark:text-orange-300 mb-1">
                            Enterprise Grade Privacy
                          </p>
                          <p className="text-xs text-gray-600 dark:text-white/60 leading-relaxed">
                            Your keys are encrypted and stored in your browser's private storage. We never transmit them to our servers.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* API Key Inputs */}
                    <div className="space-y-4">
                      {apiConfigs.map(api => {
                        const hasKey = !!localSettings[api.id];
                        return (
                          <div key={api.id} className="group transition-all duration-300">
                            <div className="flex items-center justify-between mb-1.5">
                              <label htmlFor={api.id} className="text-sm font-bold text-gray-700 dark:text-white/80 flex items-center gap-2">
                                {api.name}
                                <a href={api.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors" title="Get API Key">
                                  <ExternalLink size={12} />
                                </a>
                              </label>
                              {hasKey && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                  <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Active</span>
                                </div>
                              )}
                            </div>

                            <div className="relative group/input">
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover/input:text-orange-500 transition-colors">
                                <Key size={16} />
                              </div>
                              <input
                                id={api.id}
                                type={visibleApis[api.id] ? 'text' : 'password'}
                                value={localSettings[api.id] as string}
                                onChange={e => setLocalSettings(p => ({ ...p, [api.id]: e.target.value }))}
                                placeholder={`Paste ${api.name} Key here...`}
                                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => setVisibleApis(p => ({ ...p, [api.id]: !p[api.id] }))}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                                title="Toggle visibility"
                              >
                                {visibleApis[api.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            <p className="mt-1.5 text-[11px] text-gray-500 dark:text-white/40 ml-1 font-medium italic">{api.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">Knowledge Backup</h3>
                      <p className="text-xs text-gray-500 dark:text-white/40 font-medium mb-4">Secure your generated books and customized configurations.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={handleExportData}
                          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:scale-95 text-white text-sm font-black rounded-xl shadow-lg shadow-orange-500/25 transition-all"
                        >
                          <Download size={16} />
                          Secure Export
                        </button>

                        <label className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:scale-95 text-white text-sm font-black rounded-xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer">
                          <Upload size={16} />
                          Restore Archive
                          <input type="file" ref={fileInputRef} onChange={handleImportPreview} accept=".json" className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-inner">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-primary">
                        <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                        Storage Integrity
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                          <p className="text-[10px] text-gray-400 dark:text-white/30 uppercase font-bold tracking-wider mb-0.5">Library Content</p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">{storageUtils.getBooks().length} <span className="text-xs font-bold text-gray-400">Items</span></p>
                        </div>
                        <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                          <p className="text-[10px] text-gray-400 dark:text-white/30 uppercase font-bold tracking-wider mb-0.5">Storage Protocol</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                            LocalDB
                            <span className="flex h-2 w-2 rounded-full bg-orange-500" />
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                      <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">Danger Territory</h3>
                      <div className="p-4 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-xl">
                        <p className="text-xs text-red-700 dark:text-red-300/70 leading-relaxed mb-4 font-medium">
                          Initiating a data wipe will permanently eliminate all knowledge bases and custom configurations. This process is irreversible.
                        </p>
                        <button
                          onClick={handleClearData}
                          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/40 active:scale-95 text-sm font-black rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                          Factory Reset System
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-8 animate-fade-in py-2 text-center">
                  {/* Branding Center */}
                  <div className="space-y-4">
                    <div className="relative inline-block group">
                      <div className="absolute -inset-2 bg-orange-500/25 blur-lg rounded-2xl opacity-25 group-hover:opacity-40 transition-opacity" />
                      <img
                        src="/white-logo.png"
                        alt="Pustakam"
                        className="relative w-20 h-20 mx-auto drop-shadow-2xl transition-transform group-hover:scale-110 duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
                        PUSTAKAM
                        <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter align-top mt-1">v1.2</span>
                      </h4>
                      <p className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-400 dark:from-white/60 dark:to-white/40 max-w-xs mx-auto mt-1">
                        Professional Knowledge Synthesis Engine
                      </p>
                    </div>
                  </div>

                  {/* Performance Grid */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
                    {[
                      { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', title: 'Neural Engine', desc: 'Adv. Inference' },
                      { icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10', title: 'Full Synthesis', desc: 'Struct. Content' },
                      { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Global Access', desc: 'Cloud Hybrid' },
                      { icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Local Core', desc: 'Privacy Safe' }
                    ].map((feat, i) => (
                      <div key={i} className="group p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm hover:border-orange-500/20 transition-all text-left">
                        <div className={`w-8 h-8 rounded-lg ${feat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <feat.icon size={18} className={feat.color} />
                        </div>
                        <h5 className="font-bold text-xs text-gray-900 dark:text-white mb-0.5">{feat.title}</h5>
                        <p className="text-[10px] text-gray-400 dark:text-white/30 font-bold uppercase tracking-widest leading-none">{feat.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setShowDisclaimer(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-red-900/20 border border-red-500/30 text-red-300 hover:bg-red-900/40 active:scale-95 text-sm font-black rounded-xl transition-all"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">System Regulatory Compliance</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Footer Info */}
                  <div className="text-center space-y-4 py-2 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex flex-col items-center">
                        <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] mb-1">Architecture</p>
                        <div className="flex items-center gap-2 grayscale opacity-60">
                          <img src="https://img.icons8.com/color/48/react-native.png" className="w-5 h-5" alt="React" />
                          <img src="https://img.icons8.com/color/48/tailwindcss.png" className="w-5 h-5" alt="Tailwind" />
                        </div>
                      </div>
                      <div className="w-px h-10 bg-gray-100 dark:bg-white/10" />
                      <div className="flex flex-col items-center">
                        <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] mb-1">Developer</p>
                        <a
                          href="https://linkedin.com/in/tanmay-kalbande"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-black text-gray-700 dark:text-white/80 hover:text-orange-500 transition-colors"
                        >
                          T. KALBANDE
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
              <p className="text-[10px] text-gray-400 dark:text-white/30 font-black uppercase tracking-widest hidden sm:block">
                Auto-Saving System
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-10 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 active:scale-95 text-white text-sm font-black rounded-xl shadow-lg shadow-gray-700/25 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-10 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:scale-95 text-white text-sm font-black rounded-xl shadow-lg shadow-orange-500/25 transition-all"
                >
                  Commit Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Preview Modal */}
      {showImportModal && importPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Import Preview</h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Import Contains:</h4>
                <div className="text-sm text-gray-500 dark:text-gray-300 space-y-1">
                  <div>📚 Books: <span className="font-medium">{importPreview.books.length}</span></div>
                  <div>⚙️ Settings: <span className="font-medium">{importPreview.settings ? 'Yes' : 'No'}</span></div>
                </div>
              </div>

              {(importPreview.conflicts.duplicateBooks > 0 || importPreview.conflicts.settingsConflict) && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Conflicts Detected:
                  </h4>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {importPreview.conflicts.duplicateBooks > 0 && (
                      <div>• {importPreview.conflicts.duplicateBooks} duplicate book(s)</div>
                    )}
                    {importPreview.conflicts.settingsConflict && (
                      <div>• Settings will be updated</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => executeImport('merge')}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:scale-95 text-white text-sm font-black rounded-xl shadow-lg shadow-orange-500/25 transition-all"
              >
                <Plus size={16} />
                Smart Merge
              </button>
              <button
                onClick={() => executeImport('replace')}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-600/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-600/30 active:scale-95 text-sm font-black rounded-xl transition-all"
              >
                <Download size={16} />
                Replace All Data
              </button>
              <button
                onClick={() => { setShowImportModal(false); setImportPreview(null); }}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 active:scale-95 text-white text-sm font-black rounded-xl shadow-lg shadow-gray-700/25 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <DisclaimerPage
          isOpen={showDisclaimer}
          onClose={() => setShowDisclaimer(false)}
        />
      )}

      {/* API Key Guide Modal */}
      {showAPIGuide && (
        <APIKeyGuide
          isOpen={showAPIGuide}
          onClose={() => setShowAPIGuide(false)}
        />
      )}
    </>
  );
}
