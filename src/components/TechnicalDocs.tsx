import React, { useState } from 'react';
import { X, Book, Sparkles, Layers, Download, Library, Lightbulb, ChevronRight, CheckCircle2, ArrowRight, FileText, FileDown, Palette, Search } from 'lucide-react';

interface TechnicalDocsProps {
    isOpen: boolean;
    onClose: () => void;
}

const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Sparkles },
    { id: 'create-book', title: 'Create Your Book', icon: Book },
    { id: 'modules', title: 'Modules & Chapters', icon: Layers },
    { id: 'reading', title: 'Reading & Exporting', icon: Download },
    { id: 'library', title: 'Your Library', icon: Library },
    { id: 'tips', title: 'Pro Tips', icon: Lightbulb },
];

export const TechnicalDocs: React.FC<TechnicalDocsProps> = ({ isOpen, onClose }) => {
    const [activeSection, setActiveSection] = useState('getting-started');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="flex w-full max-w-5xl h-[85vh] bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/[0.1] shadow-2xl overflow-hidden flex-col md:flex-row">

                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 dark:bg-[#121212] border-r border-gray-200 dark:border-white/[0.08] flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-white/[0.08]">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Book size={20} className="text-orange-500" />
                            Platform Guide
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Learn how to use Pustakam effectively</p>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all font-medium ${activeSection === section.id
                                    ? 'bg-gray-900 text-white dark:bg-white/10 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03]'
                                    }`}
                            >
                                <section.icon size={16} className={activeSection === section.id ? 'text-orange-400' : ''} />
                                <span>{section.title}</span>
                                {activeSection === section.id && <ChevronRight className="ml-auto" size={14} />}
                            </button>
                        ))}
                    </nav>

                    <div className="p-3 border-t border-gray-200 dark:border-white/[0.08]">
                        <button
                            onClick={onClose}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors text-sm font-medium border border-gray-200 dark:border-white/[0.08]"
                        >
                            <X size={16} />
                            <span>Close Guide</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-transparent">
                    <div className="max-w-3xl mx-auto p-8 md:p-10 space-y-8">

                        {/* Getting Started */}
                        {activeSection === 'getting-started' && (
                            <div className="space-y-8 animate-fade-in">
                                <header>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Welcome to Pustakam</h1>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Pustakam transforms your ideas into comprehensive, structured learning materials. Simply describe what you want to learn, and our AI creates a complete book with organized chapters and modules.
                                    </p>
                                </header>

                                <div className="grid gap-4">
                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                                <span className="text-orange-500 font-bold">1</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Describe Your Topic</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Enter what you want to learn about in the input field. Be specific for better results.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                                <span className="text-orange-500 font-bold">2</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Review the Roadmap</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">AI generates a structured outline. Review the modules before starting generation.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                                <span className="text-orange-500 font-bold">3</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Generate & Read</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Click generate to create content. Once complete, read online or export your book.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                    <p className="text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        <span><strong>Tip:</strong> Your books are saved automatically. Access them anytime from your Library.</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Create Your Book */}
                        {activeSection === 'create-book' && (
                            <div className="space-y-8 animate-fade-in">
                                <header>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Creating Your Book</h1>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Follow these steps to create a comprehensive learning guide on any topic.
                                    </p>
                                </header>

                                <section className="space-y-4">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Step-by-Step Process</h2>

                                    <div className="space-y-4">
                                        <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02]">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                <ArrowRight size={16} className="text-orange-500" />
                                                Writing Effective Prompts
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                The quality of your book depends on how you describe your topic. Here are some examples:
                                            </p>
                                            <div className="space-y-2">
                                                <div className="text-sm p-3 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                                                    <span className="text-gray-400">Good:</span> <span className="text-gray-900 dark:text-white">"Complete guide to machine learning for beginners with Python examples"</span>
                                                </div>
                                                <div className="text-sm p-3 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                                                    <span className="text-gray-400">Better:</span> <span className="text-gray-900 dark:text-white">"Comprehensive JavaScript course from basics to advanced concepts including ES6+, async programming, and React fundamentals"</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02]">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                <ArrowRight size={16} className="text-orange-500" />
                                                Reviewing the Roadmap
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                After entering your topic, a roadmap with all planned modules appears. Each module represents a chapter in your book. Review the structure before proceeding to ensure it covers what you need.
                                            </p>
                                        </div>

                                        <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02]">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                <ArrowRight size={16} className="text-orange-500" />
                                                Generation Process
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Click "Generate All Modules" to start content creation. You can pause and resume anytime. Progress is automatically saved, so you won't lose work if you close the browser.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Modules & Chapters */}
                        {activeSection === 'modules' && (
                            <div className="space-y-8 animate-fade-in">
                                <header>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Understanding Modules</h1>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Your book is organized into modules – each representing a self-contained chapter covering a specific topic.
                                    </p>
                                </header>

                                <div className="grid gap-4">
                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Layers size={16} className="text-orange-500" />
                                            Module Structure
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Each module contains:</p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Clear introduction and objectives</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Detailed explanations with examples</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Key takeaways and summaries</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Practical exercises when applicable</li>
                                        </ul>
                                    </div>

                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Palette size={16} className="text-orange-500" />
                                            Module Status
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Track progress with status indicators:</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                <span className="text-gray-600 dark:text-gray-400">Pending – Not yet generated</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                                <span className="text-gray-600 dark:text-gray-400">Generating – Currently being created</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                <span className="text-gray-600 dark:text-gray-400">Completed – Ready to read</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                <span className="text-gray-600 dark:text-gray-400">Error – Can be retried</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reading & Exporting */}
                        {activeSection === 'reading' && (
                            <div className="space-y-8 animate-fade-in">
                                <header>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Reading & Exporting</h1>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Enjoy your book in a beautiful reading interface or export it for offline use.
                                    </p>
                                </header>

                                <section className="space-y-4">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reading Experience</h2>

                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            The reading mode offers a distraction-free experience with customizable settings:
                                        </p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Choose from multiple font options</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Adjust font size for comfort</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Light/Dark mode support</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Track your reading progress</li>
                                        </ul>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Export Options</h2>

                                    <div className="grid gap-3">
                                        <div className="p-4 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                <FileDown size={20} className="text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">PDF Export</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Professional formatted document for printing</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <FileText size={20} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Markdown Export</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Raw markdown for editing or use in other apps</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                                                <FileText size={20} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Plain Text</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Simple text version for maximum compatibility</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Your Library */}
                        {activeSection === 'library' && (
                            <div className="space-y-8 animate-fade-in">
                                <header>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Managing Your Library</h1>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        All your books are stored locally and accessible from the Library view.
                                    </p>
                                </header>

                                <div className="grid gap-4">
                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Search size={16} className="text-orange-500" />
                                            Finding Books
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Use the search bar to quickly find books by title or topic. Books are displayed as cards showing their status and completion progress.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Library size={16} className="text-orange-500" />
                                            Book Status
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            Each book card shows:
                                        </p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <li>• Title and description</li>
                                            <li>• Total modules and completed count</li>
                                            <li>• Generation status indicator</li>
                                            <li>• Last updated timestamp</li>
                                        </ul>
                                    </div>

                                    <div className="p-5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Download size={16} className="text-orange-500" />
                                            Backup & Restore
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Access backup options from Settings → Data Area. Export your entire library as a JSON file and restore it anytime on any device.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pro Tips */}
                        {activeSection === 'tips' && (
                            <div className="space-y-8 animate-fade-in">
                                <header>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Pro Tips</h1>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Get the most out of Pustakam with these expert recommendations.
                                    </p>
                                </header>

                                <div className="space-y-4">
                                    <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Lightbulb size={16} className="text-orange-500" />
                                            Be Specific with Topics
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Instead of "Learn Python", try "Python programming for data science including pandas, numpy, and matplotlib with practical projects". More detail = better content.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Lightbulb size={16} className="text-orange-500" />
                                            Choose the Right Model
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Different AI models have different strengths. Gemini is great for comprehensive content, while Groq offers faster generation. Experiment to find your preference.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Lightbulb size={16} className="text-orange-500" />
                                            Use Multiple API Keys
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Configure multiple API providers in Settings. If one fails during generation, you can quickly switch to another without losing progress.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Lightbulb size={16} className="text-orange-500" />
                                            Regular Backups
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Export your library regularly from Settings → Data Area. This protects your books if you clear browser data or switch devices.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                            Install as App
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Pustakam works as a Progressive Web App. Install it on your device for a native app experience with offline reading capabilities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};
