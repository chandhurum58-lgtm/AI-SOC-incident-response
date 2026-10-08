import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Maximize2 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const CopilotDrawer: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, queryCopilot, selectedIncident, setActiveTab } = useSoc();
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Hello Analyst. I have active context on ${selectedIncident?.id || 'INC-8402'}. Ask me to explain the alert, inspect attack paths, evaluate false positive likelihood, or simulate defenses.`,
      time: 'Now'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isCopilotOpen) return null;

  const handleSend = async () => {
    if (!inputPrompt.trim() || isLoading) return;
    const text = inputPrompt.trim();
    setInputPrompt('');
    setMessages(prev => [...prev, { role: 'user', text, time: 'Now' }]);
    setIsLoading(true);

    try {
      const answer = await queryCopilot(text);
      setMessages(prev => [...prev, { role: 'assistant', text: answer, time: 'Now' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error processing prompt.', time: 'Now' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 max-w-full bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-100">AI Security Copilot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsCopilotOpen(false);
              setActiveTab('copilot');
            }}
            title="Expand to full screen"
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] font-mono text-slate-500 mb-0.5">
              {m.role === 'user' ? 'You' : 'AegisCopilot'}
            </span>
            <div className={`p-2.5 rounded text-xs leading-relaxed max-w-[90%] ${
              m.role === 'user' 
                ? 'bg-sky-600/20 border border-sky-500/40 text-slate-100' 
                : 'bg-slate-900 border border-slate-800 text-slate-200'
            }`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-[11px] font-mono text-sky-400 flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2 border-t border-slate-800 flex gap-1.5 bg-slate-900/90">
        <input
          type="text"
          placeholder="Ask Copilot..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white rounded text-xs font-medium"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
