import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Code2, BookOpen, Layers, CheckCircle2, Copy } from 'lucide-react';

const SECTORS = [
  { id: 'internship', name: '🎓 Tracks', desc: 'Curriculum & Certs' },
  { id: 'banking', name: '🏦 Banking', desc: 'KYC, AML, ISO 20022' },
  { id: 'healthcare', name: '🩺 Health', desc: 'FHIR, Triage, HIPAA' },
  { id: 'beauty', name: '💄 Beauty', desc: 'Skin Biome & INCI' },
  { id: 'telecom', name: '📡 Telecom', desc: '5G Slicing & BGP' },
  { id: 'agriculture', name: '🌾 Agri', desc: 'NDVI & NPK Soil' },
  { id: 'government', name: '🏛️ Gov', desc: 'eID & BIM Permits' },
  { id: 'data_science', name: '🧠 GenAI', desc: 'PyTorch & RAG' }
];

const SECTOR_PROMPTS = {
  internship: [
    "Explain the Data Science & AI curriculum and projects.",
    "Explain Java Enterprise Full Stack track requirements.",
    "What Generative AI & LLM tools do we learn?"
  ],
  banking: [
    "Execute Biometric KYC verification and AML screening workflow.",
    "Construct ISO 20022 pacs.008 XML message schema for instant payments.",
    "Calculate Expected Loss (EL) using PD, LGD, and EAD."
  ],
  healthcare: [
    "Construct FHIR R4 JSON resource bundle for Patient and Observation vitals.",
    "Perform Emergency Severity Index (ESI) Triage for acute chest pain.",
    "Check drug-drug contraindications for Warfarin and NSAIDs."
  ],
  beauty: [
    "Design personalized AM/PM routine for Fitzpatrick Type III with mild acne.",
    "Explain ingredient synergy and buffering between Vitamin C and Niacinamide.",
    "Check INCI safety regulations under FDA MoCRA and EU Cosmetics 1223/2009."
  ],
  telecom: [
    "Configure 5G Network Slicing parameters for URLLC sub-1ms robotics.",
    "Design self-healing BGP-4 routing algorithm for fiber packet drop mitigation.",
    "Train Machine Learning churn prediction model from Call Detail Records."
  ],
  agriculture: [
    "Analyze multispectral NDVI indices and generate canopy stress heatmap.",
    "Diagnose Early Blight (Alternaria solani) and provide organic & chemical remedy.",
    "Calculate precision NPK soil dosage for high-yield wheat crop."
  ],
  government: [
    "Automate municipal building permit compliance verification using BIM/CAD data.",
    "Design zero-knowledge sovereign digital identity (eID) authentication workflow.",
    "Configure Computer-Aided Emergency Dispatch (CAD) multi-unit routing."
  ],
  data_science: [
    "Write PyTorch script for Transformer Multi-Head Self-Attention layer.",
    "Build LangChain RAG pipeline with ChromaDB and Reciprocal Rank Fusion.",
    "Fine-tune Llama 3.2 model using QLoRA 4-bit quantization."
  ]
};

export default function RakiAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState('internship');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I am **RAKI MASTER AI**, trained across **Banking, Healthcare, Beauty, Telecom, Agriculture, Government, and Data Science**. How can I assist with your domain or code today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'sectors' | 'code'
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
          site_context: selectedSector,
          temperature: 0.4
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
        { role: 'assistant', content: "⚠️ *Unable to reach RAKI AI OS Engine. Please verify that the container is active.*" }
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
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20"
          title="Open RAKI MASTER AI"
        >
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></div>
          <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="sr-only">Open RAKI AI</span>
        </button>
      )}

      {/* Main Modal Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[440px] h-[620px] max-h-[85vh] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-inner">
                <Sparkles className="w-4 h-4 text-white" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-900"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  RAKI MASTER AI <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono border border-indigo-500/30">Multi-Sector</span>
                </h3>
                <p className="text-[11px] text-slate-400">Autonomous Domain Intelligence</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sectors Horizontal Bar */}
          <div className="px-3 py-2 bg-slate-950/80 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SECTORS.map(sec => (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSector(sec.id);
                  setActiveTab('chat');
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedSector === sec.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-white/5'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>

          {/* Quick Tabs */}
          <div className="px-3 py-1.5 bg-slate-950/40 border-b border-white/5 flex gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chat' ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> Chat
            </button>
            <button
              onClick={() => setActiveTab('sectors')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'sectors' ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Scenarios
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code' ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> Code Review
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
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
                  <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
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
                <span>RAKI MASTER AI is synthesizing domain intelligence...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts For Selected Sector */}
          {activeTab === 'sectors' && (
            <div className="p-3 bg-slate-950/90 border-t border-white/5 space-y-1.5 max-h-36 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1">
                {SECTORS.find(s => s.id === selectedSector)?.name} Scenarios:
              </div>
              {(SECTOR_PROMPTS[selectedSector] || []).map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2 bg-slate-800/70 hover:bg-indigo-900/40 border border-white/5 rounded-xl text-xs text-slate-300 transition-colors"
                >
                  ⚡ {prompt}
                </button>
              ))}
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
                onClick={() => handleSend("Write an ISO 20022 financial pacs.008 payment schema in Java.")}
                className="px-2.5 py-1 bg-purple-900/30 border border-purple-500/30 text-purple-300 rounded-lg whitespace-nowrap hover:bg-purple-900/50"
              >
                🏦 ISO 20022 Java
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
              placeholder={`Ask in ${SECTORS.find(s => s.id === selectedSector)?.name}...`}
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
