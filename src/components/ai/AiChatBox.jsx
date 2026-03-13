import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

/**
 * Suggested questions for the user to quickly ask the AI
 */
const SUGGESTED_QUESTIONS = [
  "Tại sao chi tiêu tháng này của tôi tăng?",
  "Tôi có thể tiết kiệm thêm ở hạng mục nào?",
  "Dự báo chi tiêu tháng sau của tôi thế nào?"
];

/**
 * AI Chat Component
 * Allows users to ask follow-up questions to the AI
 * @param {Object} props
 * @param {Function} props.onSendMessage - Callback triggered when user sends a message
 * @param {boolean} props.isLoading - Whether AI is currently responding
 */
const AiChatBox = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      role: 'ai',
      content: 'Do you have any specific questions about this month\'s report or your general financial habits? I\'m here to help!',
      timestamp: new Date().toISOString()
    }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e, textOverride = null) => {
    if (e) e.preventDefault();
    
    const messageText = textOverride || input.trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Call parent handler which will interact with API
    onSendMessage(messageText, (aiResponseText) => {
      // Callback to add AI response to the chat
      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: aiResponseText,
          timestamp: new Date().toISOString()
        }
      ]);
    });
  };

  const handleSuggestedClick = (question) => {
    handleSend(null, question);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col h-[550px] overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-gray-900 font-bold">Ask AI Assistant</h2>
          <p className="text-xs text-indigo-600 font-medium">Ask for deeper analysis</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isFirstMessage = index === 0;

          return (
            <div key={msg.id} className="flex flex-col gap-3">
              <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm
                  ${isUser ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'}`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm
                  ${isUser 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <article className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-indigo-900">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </article>
                  )}
                </div>
              </div>

              {/* Show suggestions only after the first AI welcome message, if user hasn't typed anything yet */}
              {isFirstMessage && messages.length === 1 && (
                <div className="pl-12 pt-2 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedClick(q)}
                      disabled={isLoading}
                      className="inline-flex items-center text-left text-xs font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-100 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 mr-1.5 text-indigo-500" />
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              <span className="text-sm text-gray-500 font-medium animate-pulse">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={(e) => handleSend(e)} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your question..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-indigo-500 focus:border-indigo-500 block pl-5 pr-14 py-3.5 outline-none transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChatBox;
