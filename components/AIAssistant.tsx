
import React, { useState, useRef, useEffect } from 'react';
import { Medicine, Sale } from '../types';
import { askPharmacistAI } from '../services/geminiService';

interface AIAssistantProps {
  inventory: Medicine[];
  sales: Sale[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ inventory, sales }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hello! I'm your AI Pharmacist assistant. How can I help you today? You can ask me to analyze your stock, suggest restock items, or provide information about a drug in your inventory." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const aiResponse = await askPharmacistAI(userText, inventory, sales);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  const suggestions = [
    "Analyze low stock items",
    "Identify expired medications",
    "How is my business doing?",
    "Explain Paracetamol uses"
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="p-4 bg-blue-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
        <div>
          <h3 className="font-bold">AI Pharmacist</h3>
          <p className="text-xs text-blue-100">Powered by Gemini 3.0</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${
              m.role === 'user' 
                ? 'bg-blue-500 text-white border-blue-400' 
                : 'bg-slate-50 text-slate-800 border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map(s => (
            <button 
              key={s} 
              onClick={() => { setInput(s); }}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Ask anything about your pharmacy..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
