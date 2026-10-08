import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  HelpCircle 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const CopilotView: React.FC = () => {
  const { queryCopilot, selectedIncident, stats } = useSoc();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Hello Analyst. I am the AegisSOC AI Copilot. I have analyzed current telemetry for ${selectedIncident ? selectedIncident.id : 'INC-8402'} (Security Score: ${stats.securityScore}/100, Active Threats: ${stats.activeThreats}). How can I assist your investigation?`,
      time: 'Just now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "What happened with this incident?",
    "Why was this alert generated?",
    "Show me the attack path sequence.",
    "Which server is affected?",
    "Is this likely a false positive?",
    "What should I investigate next?",
    "How can I contain this incident?",
    "Which users are currently high risk?",
    "Compare this month's attacks with last month."
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      role: 'user' as const,
      text: text.trim(),
      time: new Date().toISOString().substring(11, 19) + ' UTC'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await queryCopilot(text.trim());
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: response,
          time: new Date().toISOString().substring(11, 19) + ' UTC'
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I encountered an issue processing your query against live telemetry. Please retry.",
          time: new Date().toISOString().substring(11, 19) + ' UTC'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="p-4 space-y-4 max-w-[1400px] mx-auto h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              AI Security Copilot & Investigation Assistant
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded forensic reasoning powered by Gemini AI, correlated with active SIEM logs and NIST containment playbooks.
          </p>
        </div>
        <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-400 flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Responses cite verified telemetry & indicate confidence uncertainty.</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs no-scrollbar">
        <span className="text-[11px] font-mono text-slate-400 shrink-0">Quick Queries:</span>
        {sampleQuestions.slice(0, 6).map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3.5 font-sans">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-400">
              {msg.role === 'assistant' ? (
                <span className="flex items-center gap-1 text-sky-400 font-semibold">
                  <Bot className="w-3.5 h-3.5" />
                  <span>AegisCopilot AI</span>
                </span>
              ) : (
                <span className="text-slate-300">You (SOC Analyst)</span>
              )}
              <span>• {msg.time}</span>
            </div>
            <div
              className={`p-3.5 rounded max-w-3xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-600/20 border border-sky-500/40 text-slate-100'
                  : 'bg-slate-950 border border-slate-800/80 text-slate-200 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-mono text-sky-400 flex items-center gap-1 mb-1">
              <Bot className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing live SOC telemetry...</span>
            </span>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-400 text-xs">
              Correlating with active logs, MITRE techniques, and NIST containment playbooks...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask Copilot (e.g. 'How can I contain this incident?', 'What should I investigate next?')..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 font-sans focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask Copilot</span>
        </button>
      </form>
    </div>
  );
};
