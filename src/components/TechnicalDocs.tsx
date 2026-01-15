import React, { useState } from 'react';
import { X, Book, Database, Layers, Code, Server, CreditCard, ChevronRight, Terminal } from 'lucide-react';

interface TechnicalDocsProps {
    isOpen: boolean;
    onClose: () => void;
}

const sections = [
    { id: 'intro', title: 'Introduction', icon: Book },
    { id: 'architecture', title: 'Architecture', icon: Layers },
    { id: 'data-models', title: 'Data Models', icon: Database },
    { id: 'services', title: 'Service Layer', icon: Server },
    { id: 'api-integration', title: 'AI Integration', icon: Terminal },
];

export const TechnicalDocs: React.FC<TechnicalDocsProps> = ({ isOpen, onClose }) => {
    const [activeSection, setActiveSection] = useState('intro');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="flex w-full max-w-6xl h-[85vh] bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] shadow-2xl overflow-hidden flex-col md:flex-row">

                {/* Sidebar */}
                <div className="w-full md:w-64 bg-[var(--color-card)] border-r border-[var(--color-border)] flex flex-col">
                    <div className="p-6 border-b border-[var(--color-border)]">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-text-secondary)] bg-clip-text text-transparent">
                            Platform Docs
                        </h2>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">v2.4.0 Technical Specification</p>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeSection === section.id
                                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium border border-[var(--color-accent)]/20'
                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]'
                                    }`}
                            >
                                <section.icon size={18} />
                                <span>{section.title}</span>
                                {activeSection === section.id && <ChevronRight className="ml-auto" size={14} />}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-[var(--color-border)]">
                        <button
                            onClick={onClose}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors text-sm font-medium border border-[var(--color-border)]"
                        >
                            <X size={16} />
                            <span>Close Documentation</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-[var(--color-bg)]">
                    <div className="max-w-4xl mx-auto p-8 md:p-12 space-y-12">

                        {/* Introduction */}
                        {activeSection === 'intro' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">Pustakam-AI Platform</h1>
                                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                                        Pustakam-AI is an advanced agentic book generation platform that leverages large language models (LLMs) to transform user intents into comprehensive, structured learning materials. Code-named "Kitaab", the system employs a multi-stage generation pipeline to ensure high-quality, coherent content.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
                                        <h3 className="text-[var(--color-text-primary)] font-semibold mb-2 flex items-center gap-2">
                                            <Terminal className="text-[var(--color-accent)]" size={20} />
                                            Agentic Workflow
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            The system replaces standard linear generation with recursive agentic planning, breaking down goals into chapters, modules, and sections autonomously.
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
                                        <h3 className="text-[var(--color-text-primary)] font-semibold mb-2 flex items-center gap-2">
                                            <Code className="text-green-500" size={20} />
                                            Polyglot AI
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            Seamlessly integrates with Groq, Gemini, and Mistral models to optimize for speed (inference) and quality (reasoning) depending on the task.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Architecture */}
                        {activeSection === 'architecture' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">System Architecture</h2>

                                    <div className="space-y-6">
                                        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                                            <div className="bg-[var(--color-card)] p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                                                <span className="font-mono text-xs text-[var(--color-text-secondary)]">client-side-stack.json</span>
                                            </div>
                                            <div className="p-6 bg-[#0d1117] overflow-x-auto">
                                                <pre className="text-sm font-mono text-gray-300">
                                                    {`{
  "frontend": {
    "framework": "React 18",
    "buildTool": "Vite",
    "styling": "Tailwind CSS + CSS Variables",
    "icons": "Lucide React",
    "animations": "Custom CSS + RAF"
  },
  "backend": {
    "auth": "Supabase Auth",
    "database": "PostgreSQL (Supabase)",
    "storage": "Supabase Storage",
    "edge_functions": "Deno (Supabase Edge)"
  }
}`}
                                                </pre>
                                            </div>
                                        </div>

                                        <div className="prose prose-invert max-w-none">
                                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Key Architectural Decisions</h3>
                                            <ul className="list-disc pl-5 space-y-2 text-[var(--color-text-secondary)] mt-4">
                                                <li><strong className="text-[var(--color-text-primary)]">Client-Side Orchestration:</strong> The initial version heavily relies on client-side logic for managing the LLM streaming and state to reduce server costs and improve latency.</li>
                                                <li><strong className="text-[var(--color-text-primary)]">Hybrid State Strategies:</strong> Uses local storage for work-in-progress drafts and Supabase for persistent, purchased hooks.</li>
                                                <li><strong className="text-[var(--color-text-primary)]">Token-Agnostic Design:</strong> The `BookGenerationService` is designed to swap providers (Groq/Google) without changing the core business logic.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Data Models */}
                        {activeSection === 'data-models' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Core Data Models</h2>
                                    <p className="text-[var(--color-text-secondary)] mb-8">
                                        TypeScript interfaces defining the structure of knowledge artifacts.
                                    </p>

                                    <div className="space-y-8">
                                        {/* BookProject */}
                                        <div>
                                            <h3 className="text-lg font-mono text-[var(--color-accent)] mb-3">interface BookProject</h3>
                                            <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[#0d1117]">
                                                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                                                    {`interface BookProject {
  id: string;              // UUID
  title: string;           // Derived from user intent
  goal: string;            // Original user prompt
  status: 'planning' | 'generating' | 'completed';
  
  // The structure of the book
  roadmap?: {
    modules: RoadmapModule[];
    difficultyLevel: 'beginner' | 'intermediate';
  };
  
  // Generated Content
  modules: BookModule[];   // recursively generated chapters
  finalBook?: string;      // Compiled Markdown
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  category: BookCategory;
}`}
                                                </pre>
                                            </div>
                                        </div>

                                        {/* BookModule */}
                                        <div>
                                            <h3 className="text-lg font-mono text-[var(--color-accent)] mb-3">interface BookModule</h3>
                                            <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[#0d1117]">
                                                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                                                    {`interface BookModule {
  id: string;
  roadmapModuleId: string; // Link to parent requirement
  title: string;
  
  // Content Payload
  content: string;         // MDX/Markdown content
  wordCount: number;
  
  // State Tracking
  status: 'pending' | 'generating' | 'completed' | 'error';
  generatedAt?: Date;
}`}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Services */}
                        {activeSection === 'services' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Service Layer</h2>

                                    <div className="grid gap-6">
                                        {/* BookService */}
                                        <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)]/50 transition-colors group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">BookGenerationService</h3>
                                                    <code className="text-xs px-2 py-1 rounded bg-[var(--color-bg)] text-[var(--color-text-secondary)] mt-1 inline-block">src/services/bookService.ts</code>
                                                </div>
                                                <Server className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]" />
                                            </div>
                                            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                                The singleton service responsible for orchestrating the AI generation lifecycle. It manages:
                                            </p>
                                            <ul className="text-sm text-[var(--color-text-secondary)] space-y-2 list-disc pl-4">
                                                <li>Prompt engineering and context window management</li>
                                                <li>Retry logic for LLM hallucinations or network failures</li>
                                                <li>Checkpoint saving to prevent data loss during long generations</li>
                                            </ul>
                                        </div>

                                        {/* CreditService */}
                                        <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)]/50 transition-colors group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">CreditService</h3>
                                                    <code className="text-xs px-2 py-1 rounded bg-[var(--color-bg)] text-[var(--color-text-secondary)] mt-1 inline-block">src/services/creditService.ts</code>
                                                </div>
                                                <CreditCard className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]" />
                                            </div>
                                            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                                Handles the monetization and usage quotas securely.
                                            </p>
                                            <div className="bg-[var(--color-bg)] p-3 rounded-lg border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)]">
                                                rpc('start_book_generation', &#123; <br />
                                                &nbsp;&nbsp;p_book_id: string,<br />
                                                &nbsp;&nbsp;p_title: string,<br />
                                                &nbsp;&nbsp;p_goal: string<br />
                                                &#125;)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* API Integration */}
                        {activeSection === 'api-integration' && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">AI Model Integration</h2>
                                    <p className="text-[var(--color-text-secondary)] mb-6">
                                        Pustakam-AI uses a provider-agnostic interface to communicate with state-of-the-art LLMs.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold">G</div>
                                                <div>
                                                    <h4 className="font-medium text-[var(--color-text-primary)]">Groq (Llama 3)</h4>
                                                    <p className="text-xs text-[var(--color-text-secondary)]">Primary inference engine for speed</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">Active</div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">M</div>
                                                <div>
                                                    <h4 className="font-medium text-[var(--color-text-primary)]">Mistral Large</h4>
                                                    <p className="text-xs text-[var(--color-text-secondary)]">Fallback for complex reasoning tasks</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-[var(--color-bg)] text-[var(--color-text-secondary)] text-xs font-medium">Standby</div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-4 border-l-2 border-[var(--color-accent)] bg-[var(--color-accent)]/5">
                                        <h4 className="text-sm font-bold text-[var(--color-accent)] mb-1">Prompt Engineering Strategy</h4>
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            We utilize "Chain of Thought" prompting for roadmap generation, enforcing a strict JSON schema output to ensure reliable parsing by the frontend service.
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
