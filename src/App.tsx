// ============================================================================
// FILE: src/App.tsx - WITH AUTH & CREDIT SYSTEM
// ============================================================================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { InstallPrompt } from './components/InstallPrompt';
import { SettingsModal } from './components/SettingsModal';
import { useGenerationStats } from './components/GenerationProgressPanel';
import { APISettings, ModelProvider } from './types';
import { usePWA } from './hooks/usePWA';
import { WifiOff } from 'lucide-react';
import { storageUtils } from './utils/storage';
import { bookService } from './services/bookService';
import { BookView } from './components/BookView';
import { BookProject, BookSession } from './types/book';
import { generateId } from './utils/helpers';
import { TopHeader } from './components/TopHeader';
import { CustomAlertDialog } from './components/CustomAlertDialog';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { CreditGate } from './components/CreditGate';
import { WelcomeModal } from './components/WelcomeModal';
import LandingPage from './components/LandingPage';
import creditService from './services/creditService';

type AppView = 'list' | 'create' | 'detail';
type Theme = 'light' | 'dark';

interface GenerationStatus {
  currentModule?: { id: string; title: string; attempt: number; progress: number; generatedText?: string; };
  totalProgress: number;
  status: 'idle' | 'generating' | 'completed' | 'error' | 'paused' | 'waiting_retry';
  logMessage?: string;
  totalWordsGenerated?: number;
  retryInfo?: { moduleTitle: string; error: string; retryCount: number; maxRetries: number; waitTime?: number; };
}

function App() {
  const [books, setBooks] = useState<BookProject[]>(() => storageUtils.getBooks());
  const [settings, setSettings] = useState<APISettings>(() => storageUtils.getSettings());
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('list');
  const [showListInMain, setShowListInMain] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({ status: 'idle', totalProgress: 0, totalWordsGenerated: 0 });
  const [generationStartTime, setGenerationStartTime] = useState<Date>(new Date());
  const [showModelSwitch, setShowModelSwitch] = useState(false);
  const [modelSwitchOptions, setModelSwitchOptions] = useState<Array<{ provider: ModelProvider; model: string; name: string }>>([]);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('pustakam-theme') as Theme) || 'dark');

  // Auth & Credit Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'subscribe'>('signin');
  const [showCreditGate, setShowCreditGate] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isAuthTransitioning, setIsAuthTransitioning] = useState(false);

  // Get auth state for credit checks
  const { credits, isAuthenticated, isSupabaseEnabled, refreshCredits, isLoading, user, profile, signOut } = useAuth();

  // Custom Alert Dialog State
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState<{
    type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({ type: 'info', title: '', message: '' });

  // Helper to show custom alert dialog
  const showAlertDialog = useCallback((props: {
    type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }) => {
    setAlertDialogProps(props);
    setIsAlertDialogOpen(true);
  }, []);

  const handleAlertDialogClose = useCallback(() => {
    setIsAlertDialogOpen(false);
    // Reset props to avoid stale data in subsequent dialogs
    setAlertDialogProps({ type: 'info', title: '', message: '' });
  }, []);

  const { isInstallable, isInstalled, installApp, dismissInstallPrompt } = usePWA();

  // ✅ ENHANCED: useEffect to handle the loading screen without dissolve effect
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      // Set a minimum display time of 3 seconds
      setTimeout(() => {
        // Simply hide it without fade animation
        loader.classList.add('fade-out');
      }, 3000); // Minimum 3 seconds delay
    }
  }, []); // Empty dependency array ensures this runs only once when the App mounts

  const currentBook = useMemo(() => currentBookId ? books.find(b => b.id === currentBookId) : null, [currentBookId, books]);

  const isGenerating = useMemo(() => {
    if (!currentBook) return false;
    return currentBook.status === 'generating_content' || generationStatus.status === 'generating';
  }, [currentBook?.status, generationStatus.status]);

  const totalWordsGenerated = currentBook?.modules.reduce((sum, m) => sum + (m.status === 'completed' ? m.wordCount : 0), 0) || 0;

  const generationStats = useGenerationStats(
    currentBook?.roadmap?.totalModules || 0,
    currentBook?.modules.filter(m => m.status === 'completed').length || 0,
    currentBook?.modules.filter(m => m.status === 'error').length || 0,
    generationStartTime,
    generationStatus.totalWordsGenerated || totalWordsGenerated
  );

  useEffect(() => {
    localStorage.setItem('pustakam-theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    books.forEach(book => {
      if (book.status === 'completed') {
        try { localStorage.removeItem(`pause_flag_${book.id}`); }
        catch (e) { console.warn('Failed to clear pause flag:', e); }
      }
    });
  }, []);

  useEffect(() => {
    bookService.updateSettings(settings);
    bookService.setProgressCallback(handleBookProgressUpdate);
    bookService.setGenerationStatusCallback((bookId, status) => {
      setGenerationStatus(prev => ({ ...prev, ...status, totalWordsGenerated: status.totalWordsGenerated || prev.totalWordsGenerated }));
    });
  }, [settings]);

  useEffect(() => { storageUtils.saveBooks(books); }, [books]);

  useEffect(() => { if (!currentBookId) setView('list'); }, [currentBookId]);

  // Reset auth transitioning state when user signs out
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setIsAuthTransitioning(false);
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); setShowOfflineMessage(false); };
    const handleOffline = () => { setIsOnline(false); setShowOfflineMessage(true); setTimeout(() => setShowOfflineMessage(false), 5000); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  useEffect(() => {
    if (!currentBook) return;

    const areAllModulesDone =
      currentBook.roadmap &&
      currentBook.modules.length === currentBook.roadmap.modules.length &&
      currentBook.modules.every(m => m.status === 'completed');

    if (areAllModulesDone &&
      currentBook.status === 'generating_content' &&
      generationStatus.status !== 'generating' &&
      generationStatus.status !== 'paused' &&
      generationStatus.status !== 'waiting_retry') {

      console.log('✓ All modules completed - updating to roadmap_completed');

      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === currentBook.id
            ? { ...book, status: 'roadmap_completed', progress: 90, updatedAt: new Date() }
            : book
        )
      );

      setGenerationStatus({
        status: 'completed',
        totalProgress: 100,
        logMessage: '✅ All modules completed!',
        totalWordsGenerated: currentBook.modules.reduce((s, m) => s + m.wordCount, 0)
      });
    }
  }, [currentBook, generationStatus.status]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const hasApiKey = !!(
    settings.googleApiKey ||
    settings.mistralApiKey ||
    settings.zhipuApiKey ||
    settings.groqApiKey ||
    settings.cerebrasApiKey
  );

  const getAlternativeModels = () => {
    const alternatives: Array<{ provider: ModelProvider; model: string; name: string }> = [];

    if (settings.googleApiKey && settings.selectedProvider !== 'google')
      alternatives.push({ provider: 'google', model: 'gemini-2.5-flash', name: 'Google Gemini 2.5 Flash' });

    if (settings.mistralApiKey && settings.selectedProvider !== 'mistral')
      alternatives.push({ provider: 'mistral', model: 'mistral-small-latest', name: 'Mistral Small' });

    if (settings.groqApiKey && settings.selectedProvider !== 'groq')
      alternatives.push({ provider: 'groq', model: 'llama-3.3-70b-versatile', name: 'Groq Llama 3.3 70B' });

    if (settings.cerebrasApiKey && settings.selectedProvider !== 'cerebras')
      alternatives.push({ provider: 'cerebras', model: 'gpt-oss-120b', name: 'Cerebras GPT-OSS 120B' });

    return alternatives;
  };

  const showModelSwitchModal = (alternatives: any) => { setModelSwitchOptions(alternatives); setShowModelSwitch(true); };

  const handleModelSwitch = async (provider: ModelProvider, model: string) => {
    const newSettings = { ...settings, selectedProvider: provider, selectedModel: model };
    setSettings(newSettings);
    storageUtils.saveSettings(newSettings);
    setShowModelSwitch(false);
    setTimeout(() => {
      if (currentBook) {
        const modelName = modelSwitchOptions.find(m => m.provider === provider)?.name;
        showAlertDialog({
          type: 'success',
          title: 'Model Switched',
          message: `Successfully switched to ${modelName}. Click Resume to continue generation.`,
          confirmText: 'Got it',
        });
        setGenerationStatus(prev => ({ ...prev, status: 'paused', logMessage: '⚙️ Model switched' }));
      }
    }, 100);
  };

  const handleRetryDecision = async (decision: 'retry' | 'switch' | 'skip') => {
    if (!currentBook) return;
    if (decision === 'retry') {
      bookService.setRetryDecision(currentBook.id, 'retry');
    }
    else if (decision === 'switch') {
      bookService.setRetryDecision(currentBook.id, 'switch');
      const alternatives = getAlternativeModels();
      if (alternatives.length === 0) {
        showAlertDialog({
          type: 'warning',
          title: 'No Alternatives',
          message: 'No alternative models available. Please configure API keys in Settings.',
          confirmText: 'Open Settings',
          onConfirm: () => setSettingsOpen(true)
        });
        return;
      }
      showModelSwitchModal(alternatives);
    }
    else if (decision === 'skip') {
      showAlertDialog({
        type: 'confirm',
        title: 'Confirm Skip Module',
        message: '⚠️ Skip this module? It will be marked as failed and will not be included in the final book.',
        confirmText: 'Yes, Skip',
        cancelText: 'No, Wait',
        onConfirm: () => bookService.setRetryDecision(currentBook.id, 'skip'),
      });
    }
  };

  const handleSelectBook = (id: string | null) => {
    setCurrentBookId(id);
    if (id) {
      setView('detail');
      const book = books.find(b => b.id === id);
      if (book?.status === 'completed') {
        try { localStorage.removeItem(`pause_flag_${id}`); } catch (e) { console.warn(e); }
        setGenerationStatus({ status: 'idle', totalProgress: 0, totalWordsGenerated: book.modules.reduce((s, m) => s + m.wordCount, 0) });
      }
    }
  };

  const handleBookProgressUpdate = (bookId: string, updates: Partial<BookProject>) => {
    setBooks(prev => prev.map(book => book.id === bookId ? { ...book, ...updates, updatedAt: new Date() } : book));
  };

  const handleUpdateBookStatus = (bookId: string, newStatus: BookProject['status']) => {
    if (!bookId || !newStatus) return;
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId
          ? { ...book, status: newStatus, updatedAt: new Date() }
          : book
      )
    );
  };

  const handleCreateBookRoadmap = async (session: BookSession) => {
    if (!session.goal.trim()) {
      showAlertDialog({
        type: 'warning',
        title: 'Input Required',
        message: 'Please enter a learning goal.',
        confirmText: 'Got it',
      });
      return;
    }
    if (!hasApiKey) {
      showAlertDialog({
        type: 'warning',
        title: 'API Key Required',
        message: 'Please configure an API key in Settings first to start generating books.',
        confirmText: 'Open Settings',
        onConfirm: () => setSettingsOpen(true),
      });
      return;
    }

    const bookId = generateId();

    try {
      localStorage.removeItem(`pause_flag_${bookId}`);
      localStorage.removeItem(`checkpoint_${bookId}`);
    } catch (e) {
      console.warn('Failed to clear flags:', e);
    }

    const newBook: BookProject = {
      id: bookId,
      title: session.goal.length > 100 ? session.goal.substring(0, 100) + '...' : session.goal,
      goal: session.goal,
      language: 'en',
      status: 'planning',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      modules: [],
      category: 'general',
      reasoning: session.reasoning
    };

    setBooks(prev => [...prev, newBook]);
    setCurrentBookId(bookId);
    setView('detail');

    try {
      const roadmap = await bookService.generateRoadmap(session, bookId);
      setBooks(prev => prev.map(book =>
        book.id === bookId
          ? {
            ...book,
            roadmap,
            status: 'roadmap_completed',
            progress: 10,
            title: roadmap.modules[0]?.title.includes('Module')
              ? session.goal
              : roadmap.modules[0]?.title || session.goal
          }
          : book
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate roadmap';
      setBooks(prev => prev.map(book =>
        book.id === bookId
          ? { ...book, status: 'error', error: errorMessage }
          : book
      ));
      showAlertDialog({
        type: 'error',
        title: 'Roadmap Generation Failed',
        message: `Failed to generate roadmap: ${errorMessage}. Please check your API key and internet connection.`,
        confirmText: 'Dismiss',
      });
    }
  };

  const handleGenerateAllModules = async (book: BookProject, session: BookSession) => {
    // =========================================================================
    // CREDIT CHECK: Require authentication and credits before generation
    // =========================================================================
    if (isSupabaseEnabled) {
      // Check if user is authenticated
      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }

      // Check if user has a paid plan (unlimited books) OR has credits
      const isPaidPlan = profile?.plan === 'monthly' || profile?.plan === 'yearly';
      if (!isPaidPlan && credits < 1) {
        setShowCreditGate(true);
        return;
      }

      // Deduct credit before starting generation
      try {
        const result = await creditService.useCredit(book.id, book.title || 'Untitled', session.goal);
        if (!result.success) {
          showAlertDialog({
            type: 'warning',
            title: 'Insufficient Credits',
            message: result.error || 'You need at least 1 credit to generate a book. Please purchase credits to continue.',
            confirmText: 'Buy Credits',
            onConfirm: () => setShowCreditGate(true),
          });
          return;
        }
        // Refresh credits display after deduction
        await refreshCredits();
      } catch (error) {
        console.error('Credit deduction failed:', error);
        showAlertDialog({
          type: 'error',
          title: 'Credit Error',
          message: 'Failed to process credits. Please try again.',
          confirmText: 'Dismiss',
        });
        return;
      }
    }
    // =========================================================================

    if (!book.roadmap) {
      showAlertDialog({
        type: 'warning',
        title: 'Missing Roadmap',
        message: 'No roadmap available to generate modules. Please generate a roadmap first.',
        confirmText: 'Got it',
      });
      return;
    }

    if (!session || !session.goal || !session.goal.trim()) {
      console.error('Invalid session:', session);
      showAlertDialog({
        type: 'error',
        title: 'Invalid Book Session',
        message: 'The book session data is incomplete or corrupted. Please try creating a new book.',
        confirmText: 'Dismiss',
      });
      return;
    }

    setGenerationStartTime(new Date());
    setGenerationStatus({ status: 'generating', totalProgress: 0, logMessage: 'Starting generation...', totalWordsGenerated: 0 });
    try {
      await bookService.generateAllModulesWithRecovery(book, session);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Module generation failed';
      if (!errorMessage.includes('GENERATION_PAUSED')) {
        setGenerationStatus({ status: 'error', totalProgress: 0, logMessage: `Generation failed: ${errorMessage}` });
        showAlertDialog({
          type: 'error',
          title: 'Module Generation Failed',
          message: `Generation process encountered an error: ${errorMessage}.`,
          confirmText: 'Dismiss',
        });
      }
    }
  };

  const handlePauseGeneration = (bookId: string) => {
    showAlertDialog({
      type: 'confirm',
      title: 'Confirm Cancellation',
      message: 'Are you sure you want to cancel the generation process? Your progress will be saved, and you can resume later.',
      confirmText: 'Yes, Cancel',
      cancelText: 'No, Continue',
      onConfirm: () => {
        bookService.cancelActiveRequests(bookId);
        bookService.pauseGeneration(bookId);
        setGenerationStatus(prev => ({ ...prev, status: 'paused', logMessage: '⏸ Generation paused' }));
      }
    });
  };

  const handleResumeGeneration = async (book: BookProject, session: BookSession) => {
    if (!book.roadmap) {
      showAlertDialog({
        type: 'warning',
        title: 'Missing Roadmap',
        message: 'No roadmap available to resume generation. This book might be corrupted.',
        confirmText: 'Got it',
      });
      return;
    }
    bookService.resumeGeneration(book.id);
    setGenerationStartTime(new Date());
    setGenerationStatus({
      status: 'generating', totalProgress: 0, logMessage: 'Resuming generation...',
      totalWordsGenerated: book.modules.reduce((sum, m) => sum + (m.status === 'completed' ? m.wordCount : 0), 0)
    });
    try {
      await bookService.generateAllModulesWithRecovery(book, session);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Resume failed';
      if (!errorMessage.includes('GENERATION_PAUSED')) {
        setGenerationStatus({ status: 'error', totalProgress: 0, logMessage: `Resume failed: ${errorMessage}` });
        showAlertDialog({
          type: 'error',
          title: 'Resume Failed',
          message: `Failed to resume generation: ${errorMessage}.`,
          confirmText: 'Dismiss',
        });
      }
    }
  };

  const handleRetryFailedModules = async (book: BookProject, session: BookSession) => {
    const failedModules = book.modules.filter(m => m.status === 'error');
    if (failedModules.length === 0) {
      showAlertDialog({
        type: 'info',
        title: 'No Failed Modules',
        message: 'There are no failed modules to retry.',
        confirmText: 'Got it',
      });
      return;
    }
    setGenerationStartTime(new Date());
    setGenerationStatus({
      status: 'generating', totalProgress: 0, logMessage: `Retrying ${failedModules.length} failed modules...`,
      totalWordsGenerated: book.modules.reduce((sum, m) => sum + (m.status === 'completed' ? m.wordCount : 0), 0)
    });
    try {
      await bookService.retryFailedModules(book, session);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Retry failed';
      setGenerationStatus({ status: 'error', totalProgress: 0, logMessage: `Retry failed: ${errorMessage}` });
      showAlertDialog({
        type: 'error',
        title: 'Retry Failed',
        message: `Failed to retry modules: ${errorMessage}.`,
        confirmText: 'Dismiss',
      });
    }
  };

  const handleAssembleBook = async (book: BookProject, session: BookSession) => {
    try {
      await bookService.assembleFinalBook(book, session);
      setGenerationStatus({ status: 'completed', totalProgress: 100, logMessage: '✅ Book completed!' });
      showAlertDialog({
        type: 'success',
        title: 'Book Assembled!',
        message: 'Your book has been successfully assembled and is ready for reading or download!',
        confirmText: 'Awesome!',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Assembly failed';
      showAlertDialog({
        type: 'error',
        title: 'Book Assembly Failed',
        message: `Failed to assemble the book: ${errorMessage}.`,
        confirmText: 'Dismiss',
      });
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: 'error', error: errorMessage } : b));
    }
  };

  const handleDeleteBook = (id: string) => {
    showAlertDialog({
      type: 'confirm',
      title: 'Confirm Deletion',
      message: 'Delete this book permanently? This cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        setBooks(prev => prev.filter(b => b.id !== id));
        if (currentBookId === id) {
          setCurrentBookId(null);
          setView('list');
        }
        try {
          localStorage.removeItem(`checkpoint_${id}`);
          localStorage.removeItem(`pause_flag_${id}`);
        } catch (e) { console.warn('Failed to clear storage:', e); }
      }
    });
  };

  const handleSaveSettings = (newSettings: APISettings) => {
    try {
      setSettings(newSettings);
      storageUtils.saveSettings(newSettings);
      setSettingsOpen(false);
      showAlertDialog({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your API settings have been successfully saved.',
        confirmText: 'OK',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings.';
      showAlertDialog({
        type: 'error',
        title: 'Settings Save Failed',
        message: `There was an error saving your settings: ${errorMessage}.`,
        confirmText: 'Dismiss',
      });
    }
  };

  const handleModelChange = (model: string, provider: ModelProvider) => {
    const newSettings = { ...settings, selectedModel: model, selectedProvider: provider };
    setSettings(newSettings);
    storageUtils.saveSettings(newSettings);
  };

  const handleInstallApp = async () => { await installApp(); };

  const handleUpdateBookContent = (bookId: string, newContent: string) => {
    setBooks(prev => prev.map(book =>
      book.id === bookId
        ? { ...book, finalBook: newContent, updatedAt: new Date() }
        : book
    ));
  };

  // =========================================================================
  // LANDING PAGE: Show for unauthenticated users when Supabase is enabled
  // =========================================================================
  // Show landing page for unauthenticated users
  // Use isAuthTransitioning to prevent flash during login transition
  if (isSupabaseEnabled && !isAuthenticated && !isLoading && !isAuthTransitioning) {
    return (
      <>
        <LandingPage
          onLogin={() => { setAuthMode('signin'); setShowAuthModal(true); }}
          onGetStarted={() => { setAuthMode('signup'); setShowAuthModal(true); }}
          onSubscribe={() => { setAuthMode('subscribe'); setShowAuthModal(true); }}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
          onSuccess={() => {
            // Set transitioning state BEFORE closing modal to prevent flash
            setIsAuthTransitioning(true);
            setShowAuthModal(false);
            setShowWelcomeModal(true);
          }}
        />
        <Analytics />
      </>
    );
  }

  return (
    <div className="app-container">
      {theme === 'dark' ? (
        <div className="starfield-background">
          <div className="starfield-layer1" />
          <div className="starfield-layer2" />
        </div>
      ) : (
        <div className="sun-background" />
      )}

      <TopHeader
        settings={settings}
        books={books}
        currentBookId={currentBookId}
        onModelChange={handleModelChange}
        onOpenSettings={() => setSettingsOpen(true)}
        onSelectBook={handleSelectBook}
        onDeleteBook={handleDeleteBook}
        onNewBook={() => {
          setView('create');
          setCurrentBookId(null);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenCreditGate={() => setShowCreditGate(true)}
        isAuthenticated={isAuthenticated}
        user={user}
        userProfile={profile}
        onSignOut={signOut}
      />

      <main id="main-scroll-area" className="main-content">
        {showOfflineMessage && (
          <div className="fixed top-20 right-4 z-50 content-card p-3 animate-fade-in-up">
            <div className="flex items-center gap-2 text-yellow-400">
              <WifiOff size={16} />
              <span className="text-sm">You're offline. Some features may be unavailable.</span>
            </div>
          </div>
        )}

        <BookView
          books={books}
          currentBookId={currentBookId}
          onCreateBookRoadmap={handleCreateBookRoadmap}
          onGenerateAllModules={handleGenerateAllModules}
          onRetryFailedModules={handleRetryFailedModules}
          onAssembleBook={handleAssembleBook}
          onSelectBook={handleSelectBook}
          onDeleteBook={handleDeleteBook}
          onUpdateBookStatus={handleUpdateBookStatus}
          hasApiKey={hasApiKey}
          view={view}
          setView={setView}
          onUpdateBookContent={handleUpdateBookContent}
          showListInMain={showListInMain}
          setShowListInMain={setShowListInMain}
          isMobile={isMobile}
          generationStatus={generationStatus}
          generationStats={generationStats}
          onPauseGeneration={handlePauseGeneration}
          onResumeGeneration={handleResumeGeneration}
          isGenerating={isGenerating}
          onRetryDecision={handleRetryDecision}
          availableModels={getAlternativeModels()}
          theme={theme}
          onOpenSettings={() => setSettingsOpen(true)}
          showAlertDialog={showAlertDialog}
        />
      </main>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        showAlertDialog={showAlertDialog}
      />

      {showModelSwitch && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--color-sidebar)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4">Switch AI Model</h3>
            <p className="text-sm text-gray-400 mb-6">Select an alternative model to continue generation:</p>
            <div className="space-y-3 mb-6">
              {modelSwitchOptions.map((option) => (
                <button
                  key={`${option.provider}-${option.model}`}
                  onClick={() => handleModelSwitch(option.provider, option.model)}
                  className="w-full p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg hover:border-blue-500 transition-all text-left"
                >
                  <div className="font-semibold text-[var(--color-text-primary)]">{option.name}</div>
                  <div className="text-sm text-gray-400 mt-1">{option.provider} • {option.model}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowModelSwitch(false)} className="w-full btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {isInstallable && !isInstalled && (
        <InstallPrompt onInstall={handleInstallApp} onDismiss={dismissInstallPrompt} />
      )}

      <CustomAlertDialog
        isOpen={isAlertDialogOpen}
        onClose={handleAlertDialogClose}
        {...alertDialogProps}
      />

      {/* Auth & Credit Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsAuthTransitioning(true);
          setShowAuthModal(false);
          setShowWelcomeModal(true); // Show welcome after login/signup
        }}
      />

      <CreditGate
        isOpen={showCreditGate}
        onClose={() => setShowCreditGate(false)}
      />

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onBuyCredits={() => {
          setShowWelcomeModal(false);
          setShowCreditGate(true);
        }}
      />

      <Analytics />

    </div>
  );
}

// Wrap App with AuthProvider
function AppWithProviders() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithProviders;
