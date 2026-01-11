// src/components/BookView.tsx - COMPLETE FIXED VERSION
import React, { useEffect, ReactNode, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Book,
  Plus,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,


  Brain,
  Sparkles,
  BarChart3,
  ListChecks,
  Play,
  Box,
  ArrowLeft,
  ArrowRight,
  Check,
  BookText,
  RefreshCw,
  Edit,
  Save,
  X,
  FileText,


  List,
  Settings,
  Moon,
  ZoomIn,
  ZoomOut,
  BookOpen,

  BookmarkCheck,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Pause,
  Zap,
  Sun,
  Palette,
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { BookProject, BookSession, ReadingBookmark } from '../types/book';
import { bookService } from '../services/bookService';
import { BookAnalytics } from './BookAnalytics';
import { CustomSelect } from './CustomSelect';
import { pdfService } from '../services/pdfService';
import { readingProgressUtils } from '../utils/readingProgress';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
type AppView = 'list' | 'create' | 'detail';
interface GenerationStatus {
  currentModule?: {
    id: string;
    title: string;
    attempt: number;
    progress: number;
    generatedText?: string;
  };
  totalProgress: number;
  status: 'idle' | 'generating' | 'completed' | 'error' | 'paused' | 'waiting_retry';
  logMessage?: string;
  totalWordsGenerated?: number;
  aiStage?: 'analyzing' | 'writing' | 'examples' | 'polishing' | 'complete';
  retryInfo?: {
    moduleTitle: string;
    error: string;
    retryCount: number;
    maxRetries: number;
    waitTime?: number;
  };
}
interface GenerationStats {
  startTime: Date;
  totalModules: number;
  completedModules: number;
  failedModules: number;
  averageTimePerModule: number;
  estimatedTimeRemaining: number;
  totalWordsGenerated: number;
  wordsPerMinute: number;
}
interface BookViewProps {
  books: BookProject[];
  currentBookId: string | null;
  onCreateBookRoadmap: (session: BookSession) => Promise<void>;
  onGenerateAllModules: (book: BookProject, session: BookSession) => Promise<void>;
  onRetryFailedModules: (book: BookProject, session: BookSession) => Promise<void>;
  onAssembleBook: (book: BookProject, session: BookSession) => Promise<void>;
  onSelectBook: (id: string | null) => void;
  onDeleteBook: (id: string) => void;
  onUpdateBookStatus: (id: string, status: BookProject['status']) => void;
  hasApiKey: boolean;
  view: AppView;
  setView: React.Dispatch<React.SetStateAction<AppView>>;
  onUpdateBookContent: (bookId: string, newContent: string) => void;
  showListInMain: boolean;
  setShowListInMain: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile?: boolean;
  generationStatus?: GenerationStatus;
  generationStats?: GenerationStats;
  onPauseGeneration?: (bookId: string) => void;
  onResumeGeneration?: (book: BookProject, session: BookSession) => void;
  isGenerating?: boolean;
  onRetryDecision?: (decision: 'retry' | 'switch' | 'skip') => void;
  availableModels?: Array<{ provider: string; model: string; name: string }>;
  theme: 'light' | 'dark';
  onOpenSettings: () => void;
  showAlertDialog: (props: {
    type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }) => void;
}
interface ReadingModeProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onContentChange: (content: string) => void;
  onGoBack: () => void;
  theme: 'light' | 'dark';
  bookId: string;
  currentModuleIndex: number;
}
interface ReadingSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: 'serif' | 'sans' | 'mono' | 'anta' | 'inter';
  theme: 'dark' | 'sepia' | 'light';
  maxWidth: 'narrow' | 'medium' | 'wide';
  textAlign: 'left' | 'justify';
}

// ============================================================================
// CONSTANTS
// ============================================================================
const THEMES = {
  dark: {
    bg: '#0F0F0F',
    contentBg: '#1A1A1A',
    text: '#E5E5E5',
    secondary: '#A0A0A0',
    border: '#333333',
    accent: '#6B7280',
  },
  sepia: {
    bg: '#F5F1E8',
    contentBg: '#FAF7F0',
    text: '#3C2A1E',
    secondary: '#8B7355',
    border: '#D4C4A8',
    accent: '#B45309',
  },
  light: {
    bg: '#FFFFFF',
    contentBg: '#F9F9F9',
    text: '#1A1A1A',
    secondary: '#555555',
    border: '#E0E0E0',
    accent: '#3B82F6',
  },
};
const FONT_FAMILIES = {
  serif: 'ui-serif, Georgia, "Times New Roman", serif',
  sans: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: 'ui-monospace, "SF Mono", "Monaco", "Cascadia Code", monospace',
  anta: "'Anta', sans-serif",
  inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};
const MAX_WIDTHS = {
  narrow: '65ch',
  medium: '75ch',
  wide: '85ch',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 1) return '--';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================
const GradientProgressBar = ({ progress = 0, active = true }) => (
  <div className="relative w-full h-2.5 bg-[var(--color-card)] rounded-full overflow-hidden border border-[var(--color-border)]">
    <div
      className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 transition-all duration-700 ease-out"
      style={{
        width: `${progress}%`,
        backgroundSize: '200% 100%',
        animation: active ? 'gradient-flow 3s ease infinite' : 'none',
      }}
    />
  </div>
);

const PixelAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pixels, setPixels] = useState<any[]>([]);

  useEffect(() => {
    const colors = [
      'bg-orange-500', 'bg-yellow-500', 'bg-amber-600',
      'bg-red-500', 'bg-[var(--color-text-secondary)]', 'bg-[var(--color-border)]',
    ];

    const generatePixels = () => {
      if (containerRef.current) {
        const pixelSpace = 12;
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const numCols = Math.floor(containerWidth / pixelSpace);
        const numRows = Math.floor(containerHeight / pixelSpace);
        const totalPixels = numCols * numRows;

        if (totalPixels > 0) {
          const newPixels = Array(totalPixels)
            .fill(0)
            .map((_, i) => ({
              id: i,
              color: colors[Math.floor(Math.random() * colors.length)],
              opacity: Math.random() > 0.5 ? 'opacity-100' : 'opacity-30',
            }));
          setPixels(newPixels);
        }
      }
    };

    const observer = new ResizeObserver(() => {
      generatePixels();
    });

    // Capture the current ref value to avoid stale closure in cleanup
    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    const interval = setInterval(generatePixels, 250);

    return () => {
      clearInterval(interval);
      // Use disconnect() for complete cleanup instead of unobserve()
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-wrap content-start gap-1.5 w-full h-10 md:h-4 overflow-hidden">
      {pixels.map((p) => (
        <div
          key={p.id}
          className={`w-1.5 h-1.5 rounded-sm ${p.color} ${p.opacity} transition-opacity duration-200`}
        />
      ))}
    </div>
  );
};


const RetryDecisionPanel = ({
  retryInfo,
  onRetry,
  onSwitchModel,
  onSkip,
  availableModels,
}: {
  retryInfo: {
    moduleTitle: string;
    error: string;
    retryCount: number;
    maxRetries: number;
    waitTime?: number;
  };
  onRetry: () => void;
  onSwitchModel: () => void;
  onSkip: () => void;
  availableModels: Array<{ provider: string; model: string; name: string }>;
}) => {
  const [countdown, setCountdown] = useState(Math.ceil((retryInfo.waitTime || 0) / 1000));

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const isRateLimit = retryInfo.error.toLowerCase().includes('rate limit') ||
    retryInfo.error.toLowerCase().includes('429');

  const isNetworkError = retryInfo.error.toLowerCase().includes('network') ||
    retryInfo.error.toLowerCase().includes('connection');

  return (
    <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/50 rounded-xl overflow-hidden animate-fade-in-up">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-red-500/20 rounded-lg border border-red-500/30">
              <AlertCircle className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Generation Failed</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Attempt {retryInfo.retryCount} of {retryInfo.maxRetries}
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-xs font-semibold text-red-300">
            Waiting
          </div>
        </div>
        <div className="mb-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg">
          <h4 className="font-medium text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" />
            {retryInfo.moduleTitle}
          </h4>
          <div className="text-sm text-[var(--color-text-secondary)] mb-3">
            <span className="text-red-400 font-medium">Error:</span> {retryInfo.error}
          </div>
          <div className="flex items-center gap-2">
            {isRateLimit && (
              <div className="flex items-center gap-1.5 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md border border-yellow-500/20">
                <Clock className="w-3 h-3" />
                Rate Limit - Wait recommended
              </div>
            )}
            {isNetworkError && (
              <div className="flex items-center gap-1.5 text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-md border border-orange-500/20">
                <AlertTriangle className="w-3 h-3" />
                Network Issue
              </div>
            )}
          </div>
        </div>
        <div className="mb-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-sm text-[var(--color-text-secondary)]">
              <p className="font-medium text-[var(--color-text-primary)] mb-2">Recommended Actions:</p>
              <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                {isRateLimit && (
                  <>
                    <li>✓ Wait {countdown > 0 ? `${countdown}s` : 'a moment'} and retry with same model</li>
                    <li>✓ Or switch to a different AI model immediately</li>
                  </>
                )}
                {isNetworkError && (
                  <>
                    <li>✓ Check your internet connection</li>
                    <li>✓ Retry in a few seconds</li>
                  </>
                )}
                {!isRateLimit && !isNetworkError && (
                  <>
                    <li>✓ Try a different AI model</li>
                    <li>✓ Or retry after a short wait</li>
                  </>
                )}
                <li>⚠️ Skipping will mark this module as failed</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            disabled={countdown > 0}
            className="w-full btn bg-green-600 hover:bg-green-700 disabled:bg-[var(--color-card)] disabled:text-[var(--color-text-secondary)] disabled:cursor-not-allowed rounded-lg text-white font-semibold py-3 transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {countdown > 0 ? `Retry in ${countdown}s` : 'Retry Same Model'}
          </button>
          {availableModels.length > 0 && (
            <button
              onClick={onSwitchModel}
              className="w-full btn bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold py-3 transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Switch AI Model ({availableModels.length} available)
            </button>
          )}
          <button
            onClick={onSkip}
            className="w-full btn border border-[var(--color-border)] hover:bg-[var(--color-card)] rounded-lg text-[var(--color-text-secondary)] font-medium py-3 transition-all hover:border-red-500/50 hover:text-red-400 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Skip This Module
          </button>
        </div>
        <div className="mt-4 text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span>Your progress has been saved. You can also close this tab.</span>
        </div>
      </div>
    </div>
  );
};

const EmbeddedProgressPanel = ({
  generationStatus,
  stats,
  onCancel,
  onPause,
  onResume,
  onRetryDecision,
  availableModels,
}: {
  generationStatus: GenerationStatus;
  stats: GenerationStats;
  onCancel?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onRetryDecision?: (decision: 'retry' | 'switch' | 'skip') => void;
  availableModels?: Array<{ provider: string; model: string; name: string }>;
}) => {
  const streamBoxRef = useRef<HTMLDivElement>(null);

  const isPaused = generationStatus.status === 'paused';
  const isGenerating = generationStatus.status === 'generating';
  const isWaitingRetry = generationStatus.status === 'waiting_retry';

  useEffect(() => {
    if (streamBoxRef.current && generationStatus.currentModule?.generatedText) {
      streamBoxRef.current.scrollTop = streamBoxRef.current.scrollHeight;
    }
  }, [generationStatus.currentModule?.generatedText]);

  const overallProgress = (stats.completedModules / (stats.totalModules || 1)) * 100;

  if (isWaitingRetry && generationStatus.retryInfo && onRetryDecision) {
    return (
      <RetryDecisionPanel
        retryInfo={generationStatus.retryInfo}
        onRetry={() => onRetryDecision('retry')}
        onSwitchModel={() => onRetryDecision('switch')}
        onSkip={() => onRetryDecision('skip')}
        availableModels={availableModels || []}
      />
    );
  }

  return (
    <div className={`bg-[var(--color-card)] backdrop-blur-xl border rounded-xl overflow-hidden animate-fade-in-up ${isPaused ? 'border-yellow-500/50' : 'border-[var(--color-border)]'
      }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isPaused ? (
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <Pause className="w-6 h-6 text-yellow-400" />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-orange-500/20 rounded-lg border border-orange-500/30">
                <Brain className="w-6 h-6 text-orange-400 animate-pulse" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {isPaused ? 'Generation Paused' : 'Generating Chapters...'}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {stats.completedModules} of {stats.totalModules} complete
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 border rounded-full text-xs font-semibold ${isPaused
              ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
              : 'bg-orange-500/20 border-orange-500/30 text-orange-300'
              }`}>
              {Math.round(overallProgress)}%
            </div>
            <div className="text-sm font-mono text-[var(--color-text-secondary)]">
              {stats.totalWordsGenerated.toLocaleString()} words
            </div>
          </div>
        </div>
        <div className="mb-4">
          <GradientProgressBar
            progress={overallProgress}
            active={isGenerating}
          />
        </div>
        {isPaused && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Pause className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-300 mb-1">
                  Generation Paused
                </p>
                <p className="text-xs text-yellow-400/80">
                  Your progress is saved. You can resume anytime or close this tab safely.
                </p>
              </div>
            </div>
          </div>
        )}
        {isGenerating && generationStatus.currentModule && (
          <>
            <div className="mt-5 mb-4">
              <PixelAnimation />
            </div>
            {generationStatus.currentModule.generatedText && (
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    {generationStatus.currentModule.title}
                  </h4>
                  {generationStatus.currentModule.attempt > 1 && (
                    <div className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">
                      <RefreshCw className="w-3 h-3" />
                      <span>Attempt {generationStatus.currentModule.attempt}</span>
                    </div>
                  )}
                </div>
                <div
                  ref={streamBoxRef}
                  className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-h-32 overflow-y-auto font-mono streaming-text-box"
                >
                  {generationStatus.currentModule.generatedText}
                  <span className="inline-block w-2 h-4 bg-orange-400 animate-pulse ml-1" />
                </div>
              </div>
            )}
          </>
        )}
        <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span>
                {isPaused
                  ? `Paused • ${stats.completedModules}/${stats.totalModules} done`
                  : `${formatTime(stats.estimatedTimeRemaining)} remaining`
                }
              </span>
            </div>
            <div className="flex items-center gap-3">
              {(isGenerating || isPaused) && onCancel && (
                <button onClick={onCancel} className="px-4 py-2 border border-[var(--color-border)] hover:bg-[var(--color-card)] rounded-lg text-sm font-medium transition-all hover:border-red-500/50 hover:text-red-400" title="Stop generation and save progress" >
                  <X className="w-4 h-4 inline mr-1.5" /> Cancel
                </button>
              )}
              {isPaused ? (
                onResume && (
                  <button onClick={onResume} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2" title="Resume generation from where you left off" >
                    <Play className="w-4 h-4" /> Resume Generation
                  </button>
                )
              ) : isGenerating && onPause && (
                <button onClick={onPause} className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-yellow-500/30 flex items-center gap-2" title="Pause and save progress" >
                  <Pause className="w-4 h-4" /> Pause
                </button>
              )}
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              {isPaused
                ? 'Progress is saved. You can close this tab safely.'
                : 'You can pause anytime. Progress will be saved automatically.'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CodeBlock = React.memo(({ children, className, theme, readingTheme }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const language = className?.replace(/language-/, '') || 'text';

  const handleCopy = () => {
    if (isCopied) return;

    navigator.clipboard.writeText(String(children)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const themeStyles = {
    dark: {
      containerBg: '#0D1117',
      headerBg: 'rgba(22, 27, 34, 0.7)',
      headerText: '#8B949E',
      buttonHover: 'hover:bg-gray-700',
    },
    sepia: {
      containerBg: '#F0EAD6',
      headerBg: 'rgba(232, 225, 209, 0.7)',
      headerText: '#8B7355',
      buttonHover: 'hover:bg-[#D4C4A8]',
    },
    light: {
      containerBg: '#f8f8f8',
      headerBg: 'rgba(239, 239, 239, 0.7)',
      headerText: '#555555',
      buttonHover: 'hover:bg-gray-200',
    }
  };

  const currentThemeStyles = themeStyles[readingTheme as keyof typeof themeStyles] || themeStyles.dark;

  return (
    <div
      className={`relative rounded-lg my-4 code-block-container overflow-hidden`}
      style={{
        backgroundColor: currentThemeStyles.containerBg,
      }}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 backdrop-blur-sm`}
        style={{
          backgroundColor: currentThemeStyles.headerBg,
          color: currentThemeStyles.headerText
        }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 p-1.5 rounded-md text-xs transition-all ${currentThemeStyles.buttonHover} ${isCopied ? 'text-green-400' : ''}`}
          title="Copy code"
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <SyntaxHighlighter
        style={readingTheme === 'light' || readingTheme === 'sepia' ? prism : vscDarkPlus}
        language={language}
        PreTag="div"
        className={`!m-0 !p-0`}
        customStyle={{
          backgroundColor: 'transparent',
          padding: '1rem 1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'inherit'
          }
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
});

// ✅ FIXED READING MODE WITH WORKING BOOKMARKS
const ReadingMode: React.FC<ReadingModeProps> = ({
  content,
  isEditing,
  editedContent,
  onEdit,
  onSave,
  onCancel,
  onContentChange,
  onGoBack,
  theme,
  bookId,
  currentModuleIndex
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    const saved = localStorage.getItem('pustakam-reading-settings');
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      fontSize: 18,
      lineHeight: 1.8,
      fontFamily: 'inter', // Inter - modern, clean reading font
      theme: theme === 'dark' ? 'dark' : 'light',
      maxWidth: 'medium',
      textAlign: 'left',
      fontWeight: 600, // Semi-bold for better readability
      ...parsed,
    };
  });

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);
  const [bookmark, setBookmark] = useState<ReadingBookmark | null>(null);


  // ✅ FIX: Helper functions to get the correct scrolling element
  const getScrollEventsTarget = (): HTMLElement | Window => {
    return document.getElementById('main-scroll-area') || window;
  };

  const getScrollableElement = (): HTMLElement => {
    // document.documentElement is for window scrolling (reports scrollTop)
    // main-scroll-area is for the main element scrolling
    return document.getElementById('main-scroll-area') || document.documentElement;
  };

  // ✅ FIX: Load bookmark on mount
  useEffect(() => {
    const currentBookmark = readingProgressUtils.getBookmark(bookId);
    setBookmark(currentBookmark);

    if (currentBookmark && currentBookmark.moduleIndex === currentModuleIndex) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [bookId, currentModuleIndex]);

  // ✅ FIX: Show floating buttons after component mounts
  useEffect(() => {
    if (!isEditing) {
      setShowFloatingButtons(true);
    } else {
      setShowFloatingButtons(false);
    }
  }, [isEditing]);

  // ✅ FIX: Auto-save scroll position (debounced) - NOW USES CORRECT SCROLL ELEMENT
  useEffect(() => {
    if (isEditing) return;

    const scrollTarget = getScrollEventsTarget();
    const scrollElement = getScrollableElement();
    let scrollTimeout: any;

    const handleScroll = () => {
      // setIsScrolling(true); // removed
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollPosition = scrollElement.scrollTop; // ✅ Corrected
        if (scrollPosition > 100) {
          readingProgressUtils.saveBookmark(bookId, currentModuleIndex, scrollPosition);
          console.log('✓ Auto-saved bookmark at:', scrollPosition);
        }
        // setIsScrolling(false); // removed
      }, 500);
    };

    scrollTarget.addEventListener('scroll', handleScroll, { passive: true }); // ✅ Corrected

    return () => {
      clearTimeout(scrollTimeout);
      scrollTarget.removeEventListener('scroll', handleScroll); // ✅ Corrected
    };
  }, [bookId, currentModuleIndex, isEditing]);

  useEffect(() => {
    localStorage.setItem('pustakam-reading-settings', JSON.stringify(settings));
  }, [settings]);

  // ✅ FIX: Toggle bookmark with proper feedback - NOW USES CORRECT SCROLL ELEMENT
  const toggleBookmark = () => {
    const scrollPosition = getScrollableElement().scrollTop; // ✅ Corrected

    if (isBookmarked) {
      // Remove bookmark
      readingProgressUtils.deleteBookmark(bookId);
      setIsBookmarked(false);
      setBookmark(null);

      showToast('Bookmark removed', '🔖');

    } else {
      // Add bookmark
      readingProgressUtils.saveBookmark(bookId, currentModuleIndex, scrollPosition);

      const newBookmark = readingProgressUtils.getBookmark(bookId);
      setBookmark(newBookmark);
      setIsBookmarked(true);

      showToast(`Bookmark saved at ${Math.round(scrollPosition)}px`, '✅');
    }
  };

  // ✅ FIX: Go to bookmark with smooth scroll - NOW USES CORRECT SCROLL ELEMENT
  const handleGoToBookmark = () => {
    if (bookmark) {
      console.log('📍 Going to bookmark:', bookmark.scrollPosition);

      getScrollableElement().scrollTo({ // ✅ Corrected
        top: bookmark.scrollPosition,
        behavior: 'smooth'
      });

      showToast('Jumped to last position', '📖', 'bg-orange-500/95');
    }
  };

  // ✅ NEW: Toast notification helper
  const showToast = (message: string, icon: string = '✓', bgColor: string = 'bg-green-500/95') => {
    const toast = document.createElement('div');
    toast.className = 'bookmark-toast';
    toast.style.background = bgColor;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span style="font-size: 16px;">${icon}</span>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  };

  const currentTheme = THEMES[settings.theme];

  if (isEditing) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-[var(--color-bg)] z-30 pt-4 pb-2 border-b border-[var(--color-border)]">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--color-text-primary)]">
            <Edit className="w-5 h-5" />
            Editing Mode
          </h3>
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn btn-secondary">
              <X size={16} /> Cancel
            </button>
            <button onClick={onSave} className="btn btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
        <textarea
          className="w-full h-[70vh] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 text-[var(--color-text-primary)] font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          value={editedContent}
          onChange={(e) => onContentChange(e.target.value)}
          style={{ fontSize: `${settings.fontSize - 2}px` }}
        />
      </div>
    );
  }

  const readingAreaStyles = {
    backgroundColor: currentTheme.bg,
    color: currentTheme.text,
  };

  const contentStyles = {
    fontFamily: FONT_FAMILIES[settings.fontFamily],
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    maxWidth: MAX_WIDTHS[settings.maxWidth],
    textAlign: settings.textAlign as any,
    color: currentTheme.text,
  };

  return (
    <>
      <div
        className={`reading-container theme-${settings.theme} rounded-lg border border-[var(--color-border)] overflow-hidden transition-colors duration-300`}
        style={readingAreaStyles}
      >
        <div
          className="sticky top-0 z-20 flex flex-wrap justify-between items-center p-3 sm:px-4 border-b"
          style={{ borderColor: currentTheme.border, backgroundColor: `${currentTheme.bg}e6` }}
        >
          {/* Left Controls: Theme and Zoom */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0"> {/* Added mb-2 for mobile stacking */}
            <div className="flex items-center gap-0.5 p-0.5 sm:p-1 rounded-lg" style={{ backgroundColor: currentTheme.contentBg }}>
              {(['light', 'sepia', 'dark'] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setSettings(prev => ({ ...prev, theme: themeOption }))}
                  className={`p-1.5 sm:p-2 rounded-md transition-all`}
                  style={{
                    backgroundColor: settings.theme === themeOption ? currentTheme.accent : 'transparent',
                    color: settings.theme === themeOption ? '#FFFFFF' : currentTheme.secondary,
                  }}
                  title={`${themeOption.charAt(0).toUpperCase() + themeOption.slice(1)} theme`}
                >
                  {themeOption === 'light' ? <Sun size={16} /> : themeOption === 'sepia' ? <Palette size={16} /> : <Moon size={16} />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 ml-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 1) }))}
                className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-black/5" style={{ color: currentTheme.secondary }}
                title="Decrease font size"
              >
                <ZoomOut size={16} />
              </button>
              <span className="min-w-[2.5rem] text-center text-sm font-mono" style={{ color: currentTheme.secondary }}>{settings.fontSize}px</span>
              <button
                onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.min(28, prev.fontSize + 1) }))}
                className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-black/5" style={{ color: currentTheme.secondary }}
                title="Increase font size"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Right Controls: Go to Bookmark & Edit */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {bookmark && (
              <button
                onClick={handleGoToBookmark}
                className="btn btn-secondary btn-sm flex items-center gap-1 sm:gap-2"
                style={{ borderColor: currentTheme.border, color: currentTheme.secondary }}
                title={`Go to last read position (${Math.round(bookmark.percentComplete)}% complete)`}
              >
                <Bookmark size={14} />
                <span className="hidden md:flex">Go to Bookmark</span> {/* Hidden on small, shown on medium+ */}
              </button>
            )}

            <button onClick={onEdit} className="btn btn-secondary btn-sm flex items-center gap-1 sm:gap-2" style={{ borderColor: currentTheme.border, color: currentTheme.secondary }} title="Edit Content">
              <Edit size={14} />
              <span className="hidden md:flex">Edit</span> {/* Hidden on small, shown on medium+ */}
            </button>
          </div>
        </div>

        <div ref={contentRef} className="p-4 sm:p-8">
          <article
            className={`prose prose-lg max-w-none transition-all duration-300 mx-auto ${settings.theme === 'dark' || settings.theme === 'sepia' ? 'prose-invert' : ''
              }`}
            style={contentStyles}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Note: react-markdown v9+ removed `inline` prop
                // Block code has className like "language-xxx", inline code doesn't
                code: ({ node, className, children, ...props }) => {
                  // Check if it's a code block (has language class) vs inline code
                  const isCodeBlock = className?.includes('language-');
                  if (!isCodeBlock) {
                    return <code className={className} {...props}>{children}</code>;
                  }
                  return <CodeBlock {...props} theme={theme} readingTheme={settings.theme} className={className}>{children}</CodeBlock>;
                }
              }}
              className="focus:outline-none"
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      {/* ✅ MINIMAL Back Button */}
      <div
        className={`reading-back-btn transition-all duration-300 ${showFloatingButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
      >
        <button
          onClick={onGoBack}
          className="reading-floating-btn"
          title="Back to Library"
          aria-label="Back to Library"
        >
          <ArrowLeft size={18} />
          <span className="tooltip">Back</span>
        </button>
      </div>

      {/* ✅ MINIMAL Floating Controls (Bookmark) */}
      <div
        className={`reading-floating-controls transition-all duration-300 ${showFloatingButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
      >
        <button
          onClick={toggleBookmark}
          className={`reading-floating-btn ${isBookmarked ? 'bookmark-active' : ''}`}
          title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
          aria-label={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
        >
          {isBookmarked ? (
            <BookmarkCheck size={18} className="bookmark-check-icon" />
          ) : (
            <Bookmark size={18} />
          )}
          <span className="tooltip">
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </span>
        </button>
      </div>
    </>
  );
};

const HomeView = ({
  onNewBook,
  onShowList,
  hasApiKey,
  bookCount,
  theme,
  formData,
  setFormData,
  showAdvanced,
  setShowAdvanced,
  handleCreateRoadmap,
  handleEnhanceWithAI,
  isEnhancing,
  localIsGenerating,
  onOpenSettings,
}: {
  onNewBook: () => void;
  onShowList: () => void;
  hasApiKey: boolean;
  bookCount: number;
  theme: 'light' | 'dark';
  formData: any;
  setFormData: (fn: any) => void;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  handleCreateRoadmap: (data: any) => void;
  handleEnhanceWithAI: () => void;
  isEnhancing: boolean;
  localIsGenerating: boolean;
  onOpenSettings: () => void;
}) => (
  <div className="flex-1 flex flex-col items-center justify-start p-6 md:p-8 pt-16 text-center relative overflow-y-auto">
    <div className="relative z-10 w-full max-w-xl mx-auto my-auto animate-fade-in-up">
      {/* Hero with Landing Page Style */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-center">
        Transform Ideas Into
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Complete Books</span>
      </h1>



      {/* Main Input */}
      <div className="text-left mb-5">
        <div className="relative">
          <textarea
            id="goal"
            value={formData.goal}
            onChange={(e) => setFormData((p: any) => ({ ...p, goal: e.target.value }))}
            placeholder="e.g., 'Learn Python programming' or 'History of AI'"
            className="w-full bg-white/70 dark:bg-white/[0.05] border-2 border-gray-300 dark:border-white/10 rounded-2xl p-5 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/15 focus:shadow-lg focus:shadow-orange-500/10 transition-all outline-none resize-none text-base leading-relaxed backdrop-blur-md shadow-sm"
            rows={4}
            required
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleEnhanceWithAI}
              disabled={!formData.goal.trim() || isEnhancing || !hasApiKey}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-orange-500/15 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Use AI to refine your idea"
            >
              {isEnhancing ? (
                <Loader2 className="animate-spin w-3 h-3" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {isEnhancing ? 'Refining...' : 'Enhance with AI'}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      {/* Actions Row - Advanced Options + Generate Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="group flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <div className={`p-1.5 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] group-hover:border-[var(--color-text-secondary)]/40 transition-all ${showAdvanced ? 'bg-[var(--color-text-secondary)]/10' : ''}`}>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
          </div>
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>

        {/* Generate Button */}
        {hasApiKey ? (
          <button
            onClick={() => handleCreateRoadmap(formData)}
            disabled={!formData.goal.trim() || localIsGenerating}
            className="bg-[var(--color-text-primary)] hover:bg-[var(--color-text-secondary)] text-[var(--color-bg)] text-sm font-medium py-2.5 px-6 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {localIsGenerating ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Book</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onOpenSettings}
            className="bg-[var(--color-text-primary)] hover:bg-[var(--color-text-secondary)] text-[var(--color-bg)] text-sm font-medium py-2.5 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Settings size={16} />
            <span>Add API Key</span>
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="mb-6 space-y-6 p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl animate-fade-in-down">
          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="audience" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                Target Audience
              </label>
              <input
                id="audience"
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData((p: any) => ({ ...p, targetAudience: e.target.value }))}
                placeholder="e.g. Beginners, Professionals"
                className="w-full h-11 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-xl px-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 focus:border-[var(--color-text-secondary)]/50 focus:ring-4 focus:ring-[var(--color-text-secondary)]/10 transition-all outline-none"
              />
            </div>
            <div>
              <label htmlFor="complexity" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                Complexity Level
              </label>
              <CustomSelect
                value={formData.complexityLevel || 'intermediate'}
                onChange={(val) => setFormData((p: any) => ({ ...p, complexityLevel: val as any }))}
                options={[
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]}
              />
            </div>
          </div>

          {/* Context & Goals */}
          <div>
            <label htmlFor="reasoning" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
              Context & Goals (Optional)
            </label>
            <textarea
              id="reasoning"
              value={formData.reasoning}
              onChange={(e) => setFormData((p: any) => ({ ...p, reasoning: e.target.value }))}
              placeholder="Why are you writing this book? What should the reader achieve?"
              className="w-full bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-xl p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 focus:border-[var(--color-text-secondary)]/50 focus:ring-4 focus:ring-[var(--color-text-secondary)]/10 transition-all outline-none resize-none text-sm"
              rows={3}
            />
          </div>

          {/* Structure Preferences */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-[var(--color-text-primary)]">
              Structure Preferences
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.preferences?.includeExamples ? 'border-[var(--color-text-secondary)]/50 bg-[var(--color-text-secondary)]/5' : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text-secondary)]/30'}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${formData.preferences?.includeExamples ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-bg)]' : 'border-[var(--color-text-secondary)]/50'}`}>
                  {formData.preferences?.includeExamples && <Check size={12} strokeWidth={3} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.preferences?.includeExamples}
                  onChange={(e) => setFormData((p: any) => ({ ...p, preferences: { ...p.preferences!, includeExamples: e.target.checked } }))}
                />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">Include Examples</span>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.preferences?.includePracticalExercises ? 'border-[var(--color-text-secondary)]/50 bg-[var(--color-text-secondary)]/5' : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text-secondary)]/30'}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${formData.preferences?.includePracticalExercises ? 'border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-bg)]' : 'border-[var(--color-text-secondary)]/50'}`}>
                  {formData.preferences?.includePracticalExercises && <Check size={12} strokeWidth={3} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.preferences?.includePracticalExercises}
                  onChange={(e) => setFormData((p: any) => ({ ...p, preferences: { ...p.preferences!, includePracticalExercises: e.target.checked } }))}
                />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">Practical Exercises</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* View Library Link */}
      {bookCount > 0 && (
        <button
          onClick={onShowList}
          className="mt-6 text-sm font-medium text-[var(--color-text-secondary)] hover:text-orange-500 transition-colors flex items-center gap-2 mx-auto"
        >
          <List size={16} />
          View Library ({bookCount} books)
        </button>
      )}
    </div>
  </div>
);

const BookListGrid = ({
  books,
  onSelectBook,
  onDeleteBook,
  onUpdateBookStatus,
  setView,
  setShowListInMain,
}: {
  books: BookProject[];
  onSelectBook: (id: string) => void;
  onDeleteBook: (id: string) => void;
  onUpdateBookStatus: (id: string, status: BookProject['status']) => void;
  setView: (view: AppView) => void;
  setShowListInMain: (show: boolean) => void;
}) => {
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);
  const availableStatuses: BookProject['status'][] = ['planning', 'roadmap_completed', 'generating_content', 'assembling', 'completed', 'error'];

  const getStatusIcon = (status: BookProject['status']) => {
    const iconMap: Record<BookProject['status'], React.ElementType> = {
      planning: Clock,
      generating_roadmap: Loader2,
      roadmap_completed: ListChecks,
      generating_content: Loader2,
      assembling: Box,
      completed: CheckCircle,
      error: AlertCircle,
    };
    const Icon = iconMap[status] || Loader2;
    const colorClass =
      status === 'completed'
        ? 'text-green-500'
        : status === 'error'
          ? 'text-red-500'
          : 'text-orange-500';
    const animateClass = ['generating_roadmap', 'generating_content', 'assembling'].includes(
      status
    )
      ? 'animate-spin'
      : '';
    return <Icon className={`w-4 h-4 ${colorClass} ${animateClass}`} />;
  };

  const getStatusText = (status: BookProject['status']) =>
  ({
    planning: 'Planning',
    generating_roadmap: 'Creating Roadmap',
    roadmap_completed: 'Ready to Write',
    generating_content: 'Writing Chapters',
    assembling: 'Finalizing Book',
    completed: 'Completed',
    error: 'Error',
  }[status] || 'Unknown');

  const getStatusColor = (status: BookProject['status']) => {
    const colors = {
      completed: 'border-[var(--color-border)]',
      generating_content: 'border-orange-500/30',
      assembling: 'border-orange-500/30',
      roadmap_completed: 'border-yellow-500/30',
      error: 'border-red-500/30',
      planning: 'border-[var(--color-border)]',
      generating_roadmap: 'border-orange-500/30',
    };
    return colors[status] || 'border-[var(--color-border)]';
  };

  const getReadingProgress = (bookId: string) => {
    return readingProgressUtils.getBookmark(bookId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">My Library</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">{books.length} {books.length === 1 ? 'project' : 'projects'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowListInMain(false)} className="btn btn-secondary btn-sm rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => {
              setView('create');
              setShowListInMain(false);
            }}
            className="btn bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all btn-sm"
          >
            <Plus className="w-4 h-4" /> New Book
          </button>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] border-dashed backdrop-blur-sm">
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
            <BookOpen className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">No books yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">Create your first AI-generated book to get started with Pustakam's powerful engine.</p>
          <button
            onClick={() => {
              setView('create');
              setShowListInMain(false);
            }}
            className="btn bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-orange-500/30 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Create Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const progress = book.modules.filter((m) => m.status === 'completed').length;
            const total = book.modules.length;
            const percent = total > 0 ? (progress / total) * 100 : 0;
            const isHovered = hoveredBookId === book.id;

            return (
              <div
                key={book.id}
                onMouseEnter={() => setHoveredBookId(book.id)}
                onMouseLeave={() => {
                  setHoveredBookId(null);
                  setStatusDropdownOpen(null);
                }}
                onClick={() => onSelectBook(book.id)}
                className={`group relative bg-[var(--color-card)] backdrop-blur-md rounded-lg border border-[var(--color-border)] p-3 transition-all duration-300 cursor-pointer ${isHovered ? 'shadow-lg shadow-black/8 border-[var(--color-text-secondary)]/20 -translate-y-0.5' : ''
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-1.5 rounded-md transition-colors ${book.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                    book.status === 'error' ? 'bg-red-500/10 text-red-500' :
                      'bg-[var(--color-text-secondary)]/10 text-[var(--color-text-secondary)]'
                    }`}>
                    <Book className="w-4 h-4" />
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusDropdownOpen(statusDropdownOpen === book.id ? null : book.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${getStatusColor(book.status)} bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-card)]`}
                    >
                      {getStatusIcon(book.status)}
                      <span>{getStatusText(book.status)}</span>
                      <ChevronDown size={12} className="opacity-50" />
                    </button>

                    {/* Status Dropdown */}
                    {statusDropdownOpen === book.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2">
                          <div className="text-xs font-semibold text-[var(--color-text-secondary)] px-2 py-1 mb-1 uppercase tracking-wider">Set Status</div>
                          {availableStatuses.map(status => (
                            <button
                              key={status}
                              onClick={() => {
                                onUpdateBookStatus(book.id, status);
                                setStatusDropdownOpen(null);
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-[var(--color-card)] ${book.status === status ? 'text-orange-500 bg-[var(--color-card)]' : 'text-[var(--color-text-secondary)]'}`}
                            >
                              {getStatusIcon(status)}
                              {getStatusText(status)}
                            </button>
                          ))}
                          <div className="h-px bg-[var(--color-border)] my-1" />
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this book project?')) {
                                onDeleteBook(book.id);
                              }
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 size={12} /> Delete Project
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1.5 line-clamp-1 group-hover:text-orange-400 transition-colors">
                  {book.title}
                </h3>

                <div className="space-y-3 mb-3">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <ListChecks size={13} />
                      {book.modules.length} Modules
                    </span>
                    <span className="font-mono bg-[var(--color-bg)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">{Math.round(percent)}%</span>
                  </div>
                  <div className="w-full bg-[var(--color-bg)] rounded-full h-1.5 overflow-hidden border border-[var(--color-border)]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${book.status === 'completed' ? 'bg-green-500' :
                        book.status === 'error' ? 'bg-red-500' :
                          'bg-gradient-to-r from-orange-500 to-yellow-500'
                        }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {new Date(book.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 text-orange-400 font-medium">
                    Open Project <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};



const DetailTabButton = ({
  label,
  Icon,
  isActive,
  onClick,
}: {
  label: ReactNode;
  Icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-1 py-3 text-sm font-semibold transition-all duration-200 border-b-2 ${isActive
      ? 'border-[var(--color-text-primary)] text-[var(--color-text-primary)]'
      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
      }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export function BookView({
  books,
  currentBookId,
  onCreateBookRoadmap,
  onGenerateAllModules,
  onRetryFailedModules,
  onAssembleBook,
  onSelectBook,
  onDeleteBook,
  onUpdateBookStatus,
  hasApiKey,
  view,
  setView,
  onUpdateBookContent,
  showListInMain,
  setShowListInMain,
  isMobile = false,
  generationStatus,
  generationStats,
  onPauseGeneration,
  onResumeGeneration,
  isGenerating,
  onRetryDecision,
  availableModels,
  theme,
  onOpenSettings, // ✅ Destructure prop
  showAlertDialog,
}: BookViewProps) {
  const [detailTab, setDetailTab] = useState<'overview' | 'analytics' | 'read'>('overview');
  const [localIsGenerating, setLocalIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState<BookSession>({
    goal: '',
    language: 'en',
    targetAudience: '',
    complexityLevel: 'intermediate',
    reasoning: '',
    preferences: {
      includeExamples: true,
      includePracticalExercises: false,
      includeQuizzes: false,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const currentBook = currentBookId ? books.find(b => b.id === currentBookId) : null;
  const [pdfProgress, setPdfProgress] = useState(0);

  const [isEnhancing, setIsEnhancing] = React.useState(false);

  const handleStartGeneration = () => {
    if (!currentBook?.roadmap) {
      showAlertDialog({
        type: 'warning',
        title: 'Missing Roadmap',
        message: 'No roadmap available to generate modules.',
        confirmText: 'Got it'
      });
      return;
    }

    const session: BookSession = {
      goal: currentBook.goal,
      language: 'en',
      targetAudience: '',
      complexityLevel: currentBook.roadmap.difficultyLevel || 'intermediate',
      preferences: {
        includeExamples: true,
        includePracticalExercises: false,
        includeQuizzes: false
      },
      reasoning: currentBook.reasoning
    };

    onGenerateAllModules(currentBook, session);
  };

  const handleStartAssembly = () => {
    if (!currentBook) return;

    const session: BookSession = {
      goal: currentBook.goal,
      language: 'en',
      targetAudience: '',
      complexityLevel: currentBook.roadmap?.difficultyLevel || 'intermediate',
      preferences: {
        includeExamples: true,
        includePracticalExercises: false,
        includeQuizzes: false
      },
      reasoning: currentBook.reasoning
    };

    onAssembleBook(currentBook, session);
  };

  useEffect(() => {
    if (currentBook) {
      const isGen = ['generating_roadmap', 'generating_content', 'assembling'].includes(
        currentBook.status
      );
      setLocalIsGenerating(isGen);
      setIsEditing(false);

      if (currentBook.status === 'completed') {
        const bookmark = readingProgressUtils.getBookmark(currentBook.id);
        setDetailTab(bookmark ? 'read' : 'overview');
      } else {
        setDetailTab('overview');
      }
    } else {
      setDetailTab('overview');
    }
  }, [currentBook]);

  useEffect(() => {
    return () => {
      if (currentBookId) bookService.cancelActiveRequests(currentBookId);
    };
  }, [currentBookId]);

  const handleGoBackToLibrary = () => {
    setView('list');
    onSelectBook(null);
    setShowListInMain(true);
  };

  const handleCreateRoadmap = async (session: BookSession) => {
    if (!session.goal.trim()) {
      showAlertDialog({
        type: 'warning',
        title: 'Input Required',
        message: 'Please enter a learning goal.',
        confirmText: 'Got it'
      });
      return;
    }
    if (!hasApiKey) {
      showAlertDialog({
        type: 'warning',
        title: 'API Key Required',
        message: 'Please configure an API key in Settings first.',
        confirmText: 'Open Settings',
        onConfirm: onOpenSettings
      });
      return;
    }
    await onCreateBookRoadmap(session);
  };

  const handleGenerateAllModules = async (book: BookProject, session: BookSession) => {
    if (!book.roadmap) { alert('No roadmap available.'); return; }
    await onGenerateAllModules(book, session);
  };

  const handlePauseGeneration = () => {
    if (currentBook) {
      onPauseGeneration?.(currentBook.id);
    }
  };

  const handleResumeGeneration = async () => {
    if (!currentBook?.roadmap) { alert('No roadmap available'); return; }

    const session: BookSession = {
      goal: currentBook.goal,
      language: 'en',
      targetAudience: '',
      complexityLevel: currentBook.roadmap.difficultyLevel || 'intermediate',
      preferences: { includeExamples: true, includePracticalExercises: false, includeQuizzes: false },
      reasoning: currentBook.reasoning
    };

    await onResumeGeneration?.(currentBook, session);
  };

  const handleRetryFailedModules = async (book: BookProject, session: BookSession) => {
    const failedModules = book.modules.filter(m => m.status === 'error');
    if (failedModules.length === 0) {
      showAlertDialog({
        type: 'info',
        title: 'No Failed Modules',
        message: 'There are no failed modules to retry.',
        confirmText: 'Got it'
      });
      return;
    }
    await onRetryFailedModules(book, session);
  };

  const handleAssembleBook = async (book: BookProject, session: BookSession) => {
    await onAssembleBook(book, session);
  };

  const handleDeleteBook = (id: string) => {
    showAlertDialog({
      type: 'confirm',
      title: 'Confirm Deletion',
      message: 'Delete this book permanently? This cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => onDeleteBook(id)
    });
  };

  const handleDownloadPdf = async () => {
    if (!currentBook) return;
    setPdfProgress(1);
    await pdfService.generatePdf(currentBook, setPdfProgress);
    setTimeout(() => setPdfProgress(0), 2000);
  };

  const handleStartEditing = () => {
    if (currentBook?.finalBook) {
      setEditedContent(currentBook.finalBook);
      setIsEditing(true);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const handleSaveChanges = () => {
    if (currentBook && editedContent) {
      onUpdateBookContent(currentBook.id, editedContent);
      setIsEditing(false);
      setEditedContent('');
    }
  };

  const getStatusIcon = (status: BookProject['status']) => {
    const iconMap: Record<BookProject['status'], React.ElementType> = {
      planning: Clock,
      generating_roadmap: Loader2,
      roadmap_completed: ListChecks,
      generating_content: Loader2,
      assembling: Box,
      completed: CheckCircle,
      error: AlertCircle,
    };
    const Icon = iconMap[status] || Loader2;
    const colorClass =
      status === 'completed'
        ? 'text-green-500'
        : status === 'error'
          ? 'text-red-500'
          : 'text-orange-500';
    const animateClass = ['generating_roadmap', 'generating_content', 'assembling'].includes(
      status
    )
      ? 'animate-spin'
      : '';
    return <Icon className={`w - 4 h - 4 ${colorClass} ${animateClass} `} />;
  };

  const getStatusText = (status: BookProject['status']) =>
  ({
    planning: 'Planning',
    generating_roadmap: 'Creating Roadmap',
    roadmap_completed: 'Ready to Write',
    generating_content: 'Writing Chapters',
    assembling: 'Finalizing Book',
    completed: 'Completed',
    error: 'Error',
  }[status] || 'Unknown');

  // ============================================================================
  // VIEW RENDERING
  // ============================================================================
  if (view === 'list') {
    if (showListInMain)
      return (
        <BookListGrid
          books={books}
          onSelectBook={onSelectBook}
          onDeleteBook={onDeleteBook}
          onUpdateBookStatus={onUpdateBookStatus}
          setView={setView}
          setShowListInMain={setShowListInMain}
        />
      );

    // handleEnhanceWithAI defined here for HomeView
    const handleEnhanceWithAI = async () => {
      if (!formData.goal.trim()) {
        showAlertDialog({
          type: 'warning',
          title: 'Input Required',
          message: 'Please describe what you want to learn before using the AI refiner.',
          confirmText: 'Got it'
        });
        return;
      }

      if (!hasApiKey) {
        showAlertDialog({
          type: 'warning',
          title: 'API Key Required',
          message: 'Please configure an API key in Settings to use the AI refiner.',
          confirmText: 'Open Settings',
          onConfirm: onOpenSettings
        });
        return;
      }

      setIsEnhancing(true);
      try {
        const enhanced = await bookService.enhanceBookInput(formData.goal);

        setFormData({
          goal: enhanced.goal,
          language: 'en',
          targetAudience: enhanced.targetAudience,
          complexityLevel: enhanced.complexityLevel,
          reasoning: enhanced.reasoning || '',
          preferences: enhanced.preferences
        });

        showAlertDialog({
          type: 'success',
          title: 'Idea Refined! ✨',
          message: `Your idea has been refined and the form below is auto-filled. Review and adjust if needed, then click "Generate Book".`,
          confirmText: 'Great!'
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Refinement failed';
        showAlertDialog({
          type: 'error',
          title: 'Refinement Failed',
          message: errorMessage,
          confirmText: 'Dismiss'
        });
      } finally {
        setIsEnhancing(false);
      }
    };

    return (
      <HomeView
        onNewBook={() => setView('create')}
        onShowList={() => setShowListInMain(true)}
        hasApiKey={hasApiKey}
        bookCount={books.length}
        theme={theme}
        formData={formData}
        setFormData={setFormData}
        showAdvanced={showAdvanced}
        setShowAdvanced={setShowAdvanced}
        handleCreateRoadmap={handleCreateRoadmap}
        handleEnhanceWithAI={handleEnhanceWithAI}
        isEnhancing={isEnhancing}
        localIsGenerating={localIsGenerating}
        onOpenSettings={onOpenSettings}
      />
    );
  }

  if (view === 'create') {
    const handleEnhanceWithAI = async () => {
      if (!formData.goal.trim()) {
        showAlertDialog({
          type: 'warning',
          title: 'Input Required',
          message: 'Please describe what you want to learn before using the AI refiner.',
          confirmText: 'Got it'
        });
        return;
      }

      if (!hasApiKey) {
        showAlertDialog({
          type: 'warning',
          title: 'API Key Required',
          message: 'Please configure an API key in Settings to use the AI refiner.',
          confirmText: 'Open Settings',
          onConfirm: onOpenSettings
        });
        return;
      }

      setIsEnhancing(true);
      try {
        const enhanced = await bookService.enhanceBookInput(formData.goal);

        setFormData({
          goal: enhanced.goal,
          language: 'en',
          targetAudience: enhanced.targetAudience,
          complexityLevel: enhanced.complexityLevel,
          reasoning: enhanced.reasoning || '',
          preferences: enhanced.preferences
        });

        showAlertDialog({
          type: 'success',
          title: 'Idea Refined! ✨',
          message: `Your idea has been refined and the form below is auto - filled.Review and adjust if needed, then click "Generate Book Roadmap".`,
          confirmText: 'Great!'
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Refinement failed';
        showAlertDialog({
          type: 'error',
          title: 'Refinement Failed',
          message: errorMessage,
          confirmText: 'Dismiss'
        });
      } finally {
        setIsEnhancing(false);
      }
    };

    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-10 animate-fade-in-up">
        <button
          onClick={() => {
            setView('list');
            setShowListInMain(false);
          }}
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Library
        </button>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[var(--color-text-primary)] tracking-tight">Create New Book</h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-lg mx-auto leading-relaxed">
            Describe your idea, and our AI will craft a comprehensive, professional book for you.
          </p>
        </div>

        <div className="space-y-8 bg-[var(--color-card)] backdrop-blur-xl border border-[var(--color-border)] p-8 rounded-3xl shadow-2xl">
          {/* Main Input Section */}
          <div>
            <label htmlFor="goal" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              What would you like to write about?
            </label>
            <div className="relative group">
              <textarea
                id="goal"
                value={formData.goal}
                onChange={(e) => setFormData((p) => ({ ...p, goal: e.target.value }))}
                placeholder="e.g., 'A comprehensive guide to organic gardening for beginners', 'The history of artificial intelligence', or 'Mastering personal finance in your 20s'"
                className="w-full bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-xl p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none resize-none text-base leading-relaxed"
                rows={4}
                required
              />
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={handleEnhanceWithAI}
                  disabled={!formData.goal.trim() || isEnhancing}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Use AI to refine your idea into a detailed prompt"
                >
                  {isEnhancing ? (
                    <Loader2 className="animate-spin w-3 h-3" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {isEnhancing ? 'Refining...' : 'Enhance with AI'}
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-2 ml-1">
              Tip: Be specific about your topic and target audience for the best results.
            </p>
          </div>

          {/* SEPARATOR */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--color-card)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Configuration</span>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="audience" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                Target Audience
              </label>
              <input
                id="audience"
                type="text"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, targetAudience: e.target.value }))
                }
                placeholder="e.g. Beginners, Professionals"
                className="w-full h-11 bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-xl px-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
              />
            </div>
            <div>
              <label htmlFor="complexity" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                Complexity Level
              </label>
              <div className="relative">
                <CustomSelect
                  value={formData.complexityLevel || 'intermediate'}
                  onChange={(val) =>
                    setFormData((p) => ({ ...p, complexityLevel: val as any }))
                  }
                  options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="group flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-orange-500 transition-colors"
            >
              <div className={`p-1 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] group-hover:border-orange-500/30 transition-all ${showAdvanced ? 'bg-orange-500/10 text-orange-500' : ''} `}>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''} `} />
              </div>
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>

            {showAdvanced && (
              <div className="mt-6 space-y-6 pt-6 border-t border-[var(--color-border)] animate-fade-in-down">
                <div>
                  <label htmlFor="reasoning" className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Context & Goals (Optional)
                  </label>
                  <textarea
                    id="reasoning"
                    value={formData.reasoning}
                    onChange={(e) => setFormData((p) => ({ ...p, reasoning: e.target.value }))}
                    placeholder="Why are you writing this book? What should the reader achieve?"
                    className="w-full bg-[var(--color-bg)] border-2 border-[var(--color-border)] rounded-xl p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none resize-none text-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-[var(--color-text-primary)]">
                    Structure Preferences
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.preferences?.includeExamples ? 'border-orange-500/50 bg-orange-500/5' : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text-secondary)]/30'} `}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${formData.preferences?.includeExamples ? 'border-orange-500 bg-orange-500 text-white' : 'border-[var(--color-text-secondary)]/50'} `}>
                        {formData.preferences?.includeExamples && <Check size={12} strokeWidth={3} />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.preferences?.includeExamples}
                        onChange={(e) => setFormData((p) => ({ ...p, preferences: { ...p.preferences!, includeExamples: e.target.checked } }))}
                      />
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">Include Examples</span>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.preferences?.includePracticalExercises ? 'border-orange-500/50 bg-orange-500/5' : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-text-secondary)]/30'} `}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${formData.preferences?.includePracticalExercises ? 'border-orange-500 bg-orange-500 text-white' : 'border-[var(--color-text-secondary)]/50'} `}>
                        {formData.preferences?.includePracticalExercises && <Check size={12} strokeWidth={3} />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.preferences?.includePracticalExercises}
                        onChange={(e) => setFormData((p) => ({ ...p, preferences: { ...p.preferences!, includePracticalExercises: e.target.checked } }))}
                      />
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">Practical Exercises</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleCreateRoadmap(formData)}
            disabled={!formData.goal.trim() || !hasApiKey || localIsGenerating}
            className="btn w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg font-bold py-4 rounded-xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {localIsGenerating ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Designing Roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} className="text-white/90" />
                <span>Generate Book Roadmap</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'detail' && currentBook) {
    const areAllModulesDone =
      currentBook.roadmap &&
      currentBook.modules.length === currentBook.roadmap.modules.length &&
      currentBook.modules.every((m) => m.status === 'completed');
    const failedModules = currentBook.modules.filter((m) => m.status === 'error');
    const completedModules = currentBook.modules.filter((m) => m.status === 'completed');
    const isPaused = generationStatus?.status === 'paused';

    return (
      <div className="w-full max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <button
            onClick={() => {
              setView('list');
              onSelectBook(null);
              setShowListInMain(true);
            }}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Books
          </button>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1.5">{currentBook.title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)]">
              {getStatusIcon(currentBook.status)}
              {getStatusText(currentBook.status)}
            </div>
          </div>
        </div>

        {currentBook.status === 'completed' && (
          <div className="border-b border-[var(--color-border)] mb-8">
            <div className="flex items-center gap-6">
              <DetailTabButton
                label="Overview"
                Icon={ListChecks}
                isActive={detailTab === 'overview'}
                onClick={() => setDetailTab('overview')}
              />
              <DetailTabButton
                label="Analytics"
                Icon={BarChart3}
                isActive={detailTab === 'analytics'}
                onClick={() => setDetailTab('analytics')}
              />
              <DetailTabButton
                label="Read Book"
                Icon={BookText}
                isActive={detailTab === 'read'}
                onClick={() => setDetailTab('read')}
              />
            </div>
          </div>
        )}

        <div className="space-y-6">
          {detailTab === 'analytics' && currentBook.status === 'completed' ? (
            <BookAnalytics book={currentBook} />
          ) : detailTab === 'read' && currentBook.status === 'completed' ? (
            <ReadingMode
              content={currentBook.finalBook || ''}
              isEditing={isEditing}
              editedContent={editedContent}
              onEdit={handleStartEditing}
              onSave={handleSaveChanges}
              onCancel={handleCancelEditing}
              onContentChange={setEditedContent}
              onGoBack={handleGoBackToLibrary}
              theme={theme}
              bookId={currentBook.id}
              currentModuleIndex={0}
            />
          ) : (
            <>
              {(isGenerating || isPaused || generationStatus?.status === 'waiting_retry') &&
                generationStatus &&
                generationStats && (
                  <EmbeddedProgressPanel
                    generationStatus={generationStatus}
                    stats={generationStats}
                    onCancel={() => {
                      if (window.confirm('Cancel generation? Progress will be saved.')) {
                        bookService.cancelActiveRequests(currentBook.id);
                      }
                    }}
                    onPause={handlePauseGeneration}
                    onResume={handleResumeGeneration}
                    onRetryDecision={onRetryDecision}
                    availableModels={availableModels}
                  />
                )}

              {currentBook.status === 'roadmap_completed' &&
                !areAllModulesDone &&
                !isGenerating &&
                !isPaused &&
                generationStatus?.status !== 'waiting_retry' && (
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-7">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-10 h-10 flex items-center justify-center bg-orange-500/10 rounded-lg">
                        <Play className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                          Ready to Generate Content
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                          {completedModules.length > 0
                            ? `Resume from ${completedModules.length} completed modules`
                            : 'Start generating all modules'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 mb-5">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          <p className="font-medium text-[var(--color-text-primary)] mb-2">Smart Recovery Enabled</p>
                          <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                            <li>✓ Progress is saved automatically</li>
                            <li>✓ Failed modules will be retried with smart options</li>
                            <li>✓ You can safely close and resume later</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleStartGeneration}
                      disabled={localIsGenerating}
                      className="btn btn-primary w-full py-2.5"
                    >
                      {localIsGenerating ? (
                        <><Loader2 className="animate-spin" /> Generating...</>
                      ) : (
                        <><Play className="w-4 h-4" />
                          {completedModules.length > 0
                            ? 'Resume Generation'
                            : 'Generate All Modules'}
                        </>
                      )}
                    </button>
                  </div>
                )}

              {areAllModulesDone &&
                currentBook.status !== 'completed' &&
                !localIsGenerating &&
                !isGenerating &&
                !isPaused && (
                  <div className="bg-[var(--color-card)] border border-green-500/30 rounded-lg p-7 space-y-5 animate-fade-in-up">
                    <div className="text-center">
                      <div className="w-12 h-12 flex items-center justify-center bg-green-500/10 rounded-full mx-auto mb-3">
                        <CheckCircle className="w-7 h-7 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Generation Complete!</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1.5">
                        All chapters written. Ready to assemble.
                      </p>
                    </div>
                    <button onClick={handleStartAssembly} className="btn btn-primary w-full py-2.5">
                      <Box className="w-5 h-5" />
                      Assemble Final Book
                    </button>
                  </div>
                )}

              {currentBook.status === 'assembling' && (
                <div className="bg-[var(--color-card)] backdrop-blur-xl border-2 border-[var(--color-border)] rounded-lg p-8 space-y-6 animate-assembling-glow text-center">
                  <div className="relative w-14 h-14 mx-auto">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                    <div className="relative w-14 h-14 flex items-center justify-center bg-green-500/10 rounded-full">
                      <Box className="w-7 h-7 text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Assembling Your Book</h3>
                    <p className="text-[var(--color-text-secondary)] mt-1.5 max-w-md mx-auto text-sm">
                      Finalizing chapters and preparing for download...
                    </p>
                  </div>
                  <div className="w-full bg-[var(--color-bg)] rounded-full h-2 overflow-hidden border border-[var(--color-border)]">
                    <div className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-full animate-slide-in-out"></div>
                  </div>
                </div>
              )}

              {currentBook.status === 'completed' && detailTab === 'overview' && (
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-500/10 rounded-lg">
                      <Download className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                        Download Your Book
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                        Export as professional PDF or Markdown format
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={pdfProgress > 0 && pdfProgress < 100}
                      className="flex items-center justify-between p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-orange-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-orange-500/10 rounded-lg">
                          <Download className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold group-hover:text-orange-400 transition-colors text-[var(--color-text-primary)]">
                            Professional PDF
                          </div>
                          <div className="text-sm text-[var(--color-text-secondary)]">
                            {pdfProgress > 0 && pdfProgress < 100
                              ? `Generating... ${pdfProgress}% `
                              : 'Print-ready document'}
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (currentBook.finalBook) {
                          const blob = new Blob([currentBook.finalBook], { type: 'text/markdown;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${currentBook.title.replace(/[^a-z0-9\s-]/gi, '').replace(/\s+/g, '_').toLowerCase()} _book.md`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      }}
                      className="flex items-center justify-between p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-green-500 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-green-500/10 rounded-lg">
                          <Download className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold group-hover:text-green-400 transition-colors text-[var(--color-text-primary)]">
                            Markdown File
                          </div>
                          <div className="text-sm text-[var(--color-text-secondary)]">
                            Easy to edit & version
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {pdfProgress > 0 && pdfProgress < 100 && (
                    <div className="mt-4">
                      <div className="w-full bg-[var(--color-bg)] rounded-full h-2 overflow-hidden border border-[var(--color-border)]">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                          style={{ width: `${pdfProgress}% ` }}
                        />
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-2 text-center">
                        Generating PDF... {pdfProgress}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentBook.roadmap && (
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <ListChecks className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Learning Roadmap</h3>
                  </div>
                  <div className="space-y-3">
                    {currentBook.roadmap.modules.map((module, index) => {
                      const completedModule = currentBook.modules.find(
                        (m) => m.roadmapModuleId === module.id
                      );
                      const isActive =
                        generationStatus?.currentModule?.id === module.id;
                      return (
                        <div
                          key={module.id}
                          className={`flex items - center gap - 3.5 p - 3.5 rounded - lg border transition - all ${isActive
                            ? 'bg-orange-500/10 border-orange-500/40'
                            : completedModule?.status === 'completed'
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : completedModule?.status === 'error'
                                ? 'border-red-500/30 bg-red-500/5'
                                : 'bg-[var(--color-bg)] border-[var(--color-border)]'
                            } `}
                        >
                          <div
                            className={`w - 7 h - 7 rounded - full flex items - center justify - center text - xs font - bold shrink - 0 transition - all ${completedModule?.status === 'completed'
                              ? 'bg-emerald-500 text-white'
                              : completedModule?.status === 'error'
                                ? 'bg-red-500 text-white'
                                : isActive
                                  ? 'bg-orange-500 text-white animate-pulse'
                                  : 'bg-[var(--color-card)] text-[var(--color-text-secondary)]'
                              } `}
                          >
                            {completedModule?.status === 'completed' ? (
                              <Check size={14} />
                            ) : completedModule?.status === 'error' ? (
                              <X size={14} />
                            ) : isActive ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base text-[var(--color-text-primary)]">
                              {module.title}
                            </h4>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{module.estimatedTime}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
}
