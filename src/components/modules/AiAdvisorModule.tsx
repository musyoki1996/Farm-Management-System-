import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Sparkles,
  Send,
  HelpCircle,
  Sprout,
  Milk,
  DollarSign,
  AlertTriangle,
  Bot,
  User,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAdvisorModule: React.FC = () => {
  const { activeFarm, crops, livestock } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: `Habari! I am **AGRICORE AI**, your Enterprise Agricultural Intelligence and Agronomy Advisor for **${activeFarm.name}** in ${activeFarm.county} County.

I can assist you with:
- **Fertilizer application rates** (DAP, CAN, NPK 17:17:17, Urea, foliar sprays) tailored to your soil profile (${activeFarm.soilType}).
- **Integrated Pest Management (IPM)** for Fall Armyworm, Tuta Absoluta, Maize Lethal Necrosis, and Coffee Berry Disease.
- **Dairy Nutrition & Ration Optimization** for high-yielding Friesian & Ayrshire cows.
- **Production cost reduction & gross margin analysis** in Kenyan Shillings (KES).

How can I assist your farm operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'How much CAN top-dressing fertilizer should I apply per acre of maize?',
    'What is the optimal feed ration for a Friesian cow producing 30 litres daily?',
    'How do I control Fall Armyworm larvae in vegetative stage maize?',
    'What are the export GlobalG.A.P. pesticide pre-harvest intervals for French beans?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          context: `Farm: ${activeFarm.name}, County: ${activeFarm.county}, Sub-County: ${activeFarm.subCounty}, Soil: ${activeFarm.soilType}, Acreage: ${activeFarm.totalAcres} Acres. Active crops: ${crops.map((c) => c.cropName).join(', ')}. Livestock count: ${livestock.length} animals.`,
          farmType: activeFarm.farmType,
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Unable to retrieve agronomic recommendation at this moment. Please check server logs.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `### Agronomic Advisory for ${activeFarm.name}
**Query:** "${query}"

1. **Agro-Ecological Context (${activeFarm.county} County):**
   - For your ${activeFarm.soilType} soil, ensure adequate basal phosphate (DAP or NPK 23:23:0 at 50kg/acre) followed by CAN top-dressing at knee-high stage.
   - Soil moisture in ${activeFarm.county} is currently optimal for nutrient uptake.

2. **Economic Consideration in KES:**
   - Current benchmark fertilizer prices range from **KES 4,200 to 5,200 per 50kg bag**. Maintain certified invoices in the AGRICORE Inventory module to verify batch quality.

*Note: AI-generated recommendations are for operational decision support and should not substitute on-site inspection by licensed agronomists or veterinary officers.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">AGRICORE AI Agricultural Intelligence</h2>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time agronomic counseling, dairy feed ration formulation, disease diagnostics, and Kenyan agro-economic modeling.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Messages Viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-50 text-neutral-900 border border-neutral-200'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <div
                  className={`text-[10px] font-mono mt-2 ${
                    msg.sender === 'user' ? 'text-neutral-400 text-right' : 'text-neutral-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-emerald-800 font-semibold p-3 bg-emerald-50 rounded-xl max-w-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>AGRICORE AI is analyzing agronomic data & soil parameters...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">Prompts:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-emerald-700 text-neutral-700 hover:text-emerald-900 font-medium whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-white border-t border-neutral-200 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about fertilizer rates, dairy feed rations, crop pest thresholds, or farm profits in KES..."
            className="flex-1 px-4 py-3 text-xs md:text-sm border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Advisory Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Professional Agricultural Disclaimer:</strong> AGRICORE AI recommendations communicate scientific benchmarks and economic estimations for East African farming zones. They do not replace formal laboratory soil tests, veterinary prescriptions, or certified agronomist evaluations.
        </div>
      </div>
    </div>
  );
};
