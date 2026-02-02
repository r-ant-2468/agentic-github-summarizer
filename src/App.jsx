import { useState } from 'react';
import { Terminal, Cpu, AlertCircle } from 'lucide-react';
import { getProjectOverview } from './services/huggingFaceService';
import TokenVault from './components/TokenVault';
import Markdown from "react-markdown";

import './App.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState(localStorage.getItem('hf_token_vault') || '');
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleTokenChange = (val) => {
    setToken(val);
    localStorage.setItem('hf_token_vault', val);
  };

  const addStep = (type, content, icon, loadingStep = false) => {
    setSteps(prev => {
      const finalizedPrev = prev.map(s => ({ ...s, isLoading: false }));
      return [...finalizedPrev, { id: Date.now(), type, content, icon, isLoading: loadingStep }];
    });
  };

const runAgenticWorkflow = async () => {
    // Guard clauses
    if (!url || !token) return;

    // Initial UI State
    setIsRunning(true);
    setSteps([]);
    addStep('thought', 'Scanning repository architecture...', <Cpu size={18} />, true);

    try {
      // The actual API call
      const overviewMarkdown = await getProjectOverview(token, url);
      // Update steps with the result
      addStep('answer', overviewMarkdown, <Terminal size={18} />);
    } catch (error) {
      addStep('error', error.message, <AlertCircle size={18} />);
    } finally {
      // Reset loading state
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Agentic Github Analyser
          </h1>
          <p className="text-slate-400 text-lg">Get summarised github repository overview</p>
        </header>

        <TokenVault token={token} onTokenChange={handleTokenChange} />

        {/* Main Input */}
        <div className="flex gap-3 mb-5">
          <input
            className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-xl px-6 py-4 text-xl outline-none"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Repo URL..."
          />
          <button
            onClick={runAgenticWorkflow}
            className="bg-blue-600 px-8 rounded-xl font-bold"
            disabled={isRunning}
          >
            {isRunning ? '...' : 'Run'}
          </button>
        </div>
        {/* Example Pills */}
        <div className="flex items-center gap-3 flex-wrap px-2 mb-10">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Try these:
          </span>
          {[
            { label: 'React/Keycloak', url: 'https://github.com/r-ant-2468/keycloak-frontend-react-simple' },
            { label: 'React', url: 'https://github.com/facebook/react' },
            { label: 'Shadcn UI', url: 'https://github.com/shadcn-ui/ui' }
          ].map((ex) => (
            <button
              key={ex.label}
              onClick={() => setUrl(ex.url)}
              className="text-xs bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-full transition-all"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {/* --- STEPS --- */}
          {steps.map((step) => (
              <div key={step.id} className={`border-l-4 p-4 ${step.type === 'thought' ? 'border-amber-500 bg-slate-800/50' : step.type === 'error' ? 'border-red-500 bg-red-900/20' : 'border-emerald-500 bg-slate-800'}`}>
                <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-widest text-slate-500">
                  {step.icon} <span>{step.type}</span>
                </div>
                <div className={step.isLoading ? "is-loading" : ""}>
                  {step.type === 'answer' ? <Markdown>{step.content}</Markdown> : step.content}
                </div>
              </div>
          ))}

          {/* Empty State */}
          {steps.length === 0 && !isRunning && (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-600 font-medium">Ready for orchestration. Enter a URL to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}