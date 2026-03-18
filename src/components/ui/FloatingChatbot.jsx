import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, MessageCircle, Send } from 'lucide-react';

export default function FloatingChatbot() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: t('chatbot.greeting'), sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleOptionSelect = (optionText) => {
        setMessages([...messages, { id: Date.now(), text: optionText, sender: 'user' }]);
        // Navigate to disease detection if that option is selected
        if (optionText === t('chatbot.options.detect')) {
            setIsOpen(false);
            navigate('/detect');
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setMessages([...messages, { id: Date.now(), text: inputValue, sender: 'user' }]);
        setInputValue('');
    };

    const chatbotOptions = [
        t('chatbot.options.schemes'),
        t('chatbot.options.prices'),
        t('chatbot.options.weather'),
        t('chatbot.options.insurance'),
        t('chatbot.options.sell'),
        t('chatbot.options.detect'),
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-100 flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-700 to-primary-600 p-4 flex items-center justify-between text-white drop-shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 p-0.5 flex items-center justify-center overflow-hidden border border-white/50">
                                    <img src="/photos/chatbot.jpeg" alt="Chatbot avatar" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{t('chatbot.title')}</h3>
                                    <span className="text-xs text-primary-100 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                                    </span>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                                        ${msg.sender === 'user' 
                                            ? 'bg-primary-600 text-white rounded-tr-sm shadow-md' 
                                            : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'}`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Options Bubbles */}
                            {messages.length === 1 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {chatbotOptions.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleOptionSelect(opt)}
                                            className="bg-white border border-primary-200 text-primary-700 text-xs px-3 py-1.5 rounded-full hover:bg-primary-50 hover:border-primary-300 transition-colors shadow-sm text-left"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                            <input
                                type="text"
                                placeholder={t('chat.placeholder') || "Type a message..."}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white bg-white relative z-50 group hover:shadow-primary-500/30 transition-shadow duration-300"
                aria-label="Open support chat"
            >
                {isOpen ? (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white">
                        <X className="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <img src="/photos/chatbot.jpeg" alt="Chatbot" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-transparent transition-colors"></div>
                    </>
                )}
            </motion.button>
        </div>
    );
}
