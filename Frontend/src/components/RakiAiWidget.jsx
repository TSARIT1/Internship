import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Code2, BookOpen, Minimize2, CheckCircle2, Copy } from 'lucide-react';

export default function RakiAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I am **RAKI AI**, your Autonomous Technical Architect & Mentor for TSAR IT Internship. How can I assist with your code, technical track, or projects today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'code' | 'tracks'
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const apiEndpoint = window.location.hostname === 'localhost' && window.location.port === '5173'
    ? 'http://72.62.228.102:8000/api'
    : '/raki-ai/api';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    const userMsg = { role: 'user', content: prompt };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${apiEndpoint}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          site_context: 'internship',
          temperature: 0.7
        })
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.response || "No response received." }
      ]);
    } catch (err) {
      console.error("RAKI AI Widget Error:", err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "⚠️ *Unable to reach RAKI AI OS. Please verify that the engine container is online.*" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20"
          title="Open RAKI AI Assistant"
        >
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></div>
          <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="sr-only">Open RAKI AI</span>
        </button>
      )}

      {/* Main AI Modal Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] max-h-[82vh] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-inner">
                <Sparkles className="w-4 h-4 text-white" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-900"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  RAKI AI OS <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono border border-indigo-500/30">v2.0</span>
                </h3>
                <p className="text-[11px] text-slate-400">Autonomous Intelligence & Mentor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Minimize"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Tabs */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-white/5 flex gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> Tutor Chat
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tracks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Tracks
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> Code Review
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800/90 text-slate-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
                    {msg.content}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="mt-2 pt-1 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/20 w-fit">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                <span>RAKI AI is thinking and synthesizing code...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          {activeTab === 'tracks' && (
            <div className="p-3 bg-slate-950/80 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSend("Explain the Data Science & AI curriculum and projects.")}
                className="p-2 bg-slate-800/80 hover:bg-indigo-900/40 border border-white/5 rounded-lg text-left text-slate-300 transition-colors"
              >
                📊 Data Science Track
              </button>
              <button
                onClick={() => handleSend("Explain Java Enterprise Full Stack track requirements.")}
                className="p-2 bg-slate-800/80 hover:bg-indigo-900/40 border border-white/5 rounded-lg text-left text-slate-300 transition-colors"
              >
                ☕ Java Full Stack
              </button>
              <button
                onClick={() => handleSend("What Generative AI & LLM tools do we learn?")}
                className="p-2 bg-slate-800/80 hover:bg-indigo-900/40 border border-white/5 rounded-lg text-left text-slate-300 transition-colors"
              >
                🤖 Generative AI Track
              </button>
              <button
                onClick={() => handleSend("Tell me about Cloud DevOps and Kubernetes.")}
                className="p-2 bg-slate-800/80 hover:bg-indigo-900/40 border border-white/5 rounded-lg text-left text-slate-300 transition-colors"
              >
                ☁️ Cloud & DevOps
              </button>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="p-2.5 bg-slate-950/80 border-t border-white/5 flex gap-2 text-xs overflow-x-auto">
              <button
                onClick={() => handleSend("Review this code for security vulnerabilities and optimize it:\n\n```js\n// Paste code here\n```")}
                className="px-2.5 py-1 bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 rounded-lg whitespace-nowrap hover:bg-indigo-900/50"
              >
                🔍 Security Audit
              </button>
              <button
                onClick={() => handleSend("Write a production-ready Python script to connect to Ollama and stream LLM tokens.")}
                className="px-2.5 py-1 bg-purple-900/30 border border-purple-500/30 text-purple-300 rounded-lg whitespace-nowrap hover:bg-purple-900/50"
              >
                ⚡ Generate Ollama Client
              </button>
            </div>
          )}

          {/* Footer Input Area */}
          <div className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask RAKI AI anything..."
              disabled={loading}
              className="flex-1 bg-slate-800 border border-white/10 focus:border-indigo-500 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-indigo-600/30"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
